import React, {PropTypes} from 'react';
import {Row, Col, Tag, Spin, Popover, message, Modal, Form, Input, Alert} from 'antd';
import ajax from '../../../common/ajax';
import Qrcode from '../common/Qrcode';
import PayTypeMap from '../common/PayTypeMap';
import {statusMap, statusColorMap} from '../common/ShopStatusSelect';
import {format, formatTime} from '../../../common/dateUtils';
import {array2StringJoinByComma, accMul} from '../../../common/utils';
import ShopInfoErrorTip from '../common/ShopInfoErrorTip';
import Immutable from 'immutable';
import RatePopover from '../common/RatePopover';

const FormItem = Form.Item;
const mapFactory = Immutable.Map;

const ERROR_TIPS = mapFactory({
  ADDRESS_ERROR: '地址格式有误！',
  SHOP_NAME_ERROR: '名称格式有误！',
  PHONE_NUMBER_ERROR: '号码格式有误！',
});

const latestModifyStatusMap = {
  'PROCESS': '修改审核中',
  'SUCCESS': '修改成功',
  'FAIL': '修改失败',
};

const ShopDetailBase = React.createClass({
  propTypes: {
    id: PropTypes.string,
    pageConfig: PropTypes.object,
  },

  getInitialState() {
    return {
      data: [],
      loading: true,
      showQualityScore: false,
      score: 0,
      cancelModalVisible: false,
      cancelEnable: this.props.pageConfig && this.props.pageConfig.shopProblemLabelRemove,
      textAreaHelp: '限制50字',
      problemLabelType: null,
      errors: new Immutable.List(),
    };
  },

  componentDidMount() {
    this.fetch();
  },

  fetch(pageParams = {}) {
    const params = {
      shopId: this.props.id,
      ...pageParams,
    };
    this.setState({
      loading: true,
    });
    const url = '/shop/crm/shopDetail.json';
    ajax({
      url: url,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.setState({
            loading: false,
            data: result,
            errors: Immutable.fromJS(result.shop.problemLabels || []),
          });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
    const showQualityScoreUrl = '/shop/showQualityScore.json';
    const qualityScoreParam = {shopId: this.props.id};
    ajax({
      url: showQualityScoreUrl,
      method: 'get',
      data: qualityScoreParam,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          if (result.showQualityScore === true) {
            this.setState({
              showQualityScore: true,
            });
          }
        }
      },
    });
    const qualityScoreUrl = '/shop/queryQualityScore.json';
    ajax({
      url: qualityScoreUrl,
      method: 'get',
      data: qualityScoreParam,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.setState({
            score: result.qualityScore.shopScoreItem,
          });
        }
      },
    });
  },

  showCancelModal(e) {
    e.preventDefault();
    this.setState({ cancelModalVisible: true,
      problemLabelType: e.target.getAttribute('data-err-type') });
  },
  hideCancelModal() {
    this.setState({ cancelModalVisible: false });
  },

  confirmCancel() {
    const {getFieldValue, setFieldsValue} = this.props.form;
    const v = getFieldValue('memo');
    if (!v || v.length > 50) return message.warn('请检查输入内容');
    this.setState({confirmLoading: true});
    ajax({
      url: '/shop/koubei/shopProblemLabelRemove.json',
      method: 'post',
      type: 'json',
      data: {
        shopId: this.props.id,
        memo: getFieldValue('memo'),
        problemLabelType: this.state.problemLabelType,
      },
      success: (res) => {
        let { cancelModalVisible, errors, problemLabelType } = this.state;
        if (res.status === 'succeed') {
          cancelModalVisible = false;
          message.success('已取消报错。');
          const errIdx = errors.indexOf(problemLabelType);
          if (errIdx >= 0) {
            errors = errors.remove(errIdx);
          }
          problemLabelType = null;
          setFieldsValue({
            memo: null,
          });
        }
        this.setState({
          cancelModalVisible,
          confirmLoading: false,
          errors,
          problemLabelType,
        });
      },
      error: (res) => {
        message.error(res.resultMsg || '海底光缆断了...');
        this.setState({
          confirmLoading: false,
        });
      },
    });
  },

  renderGoodRate() {
    const { shop } = this.state.data;
    if (!shop || !shop.categoryFeeInfo || !shop.categoryFeeInfo.saleFee) return null;
    return (
      <tr>
        <td className="kb-rate-table-label">商品费率</td>
        <td>{accMul(shop.categoryFeeInfo.saleFee, 100)}%</td>
      </tr>
    );
  },

  /*eslint-disable */
  render() {
    /*eslint-enable */
    const {data, loading, showQualityScore, score, cancelEnable, errors, cancelModalVisible} = this.state;
    const {pageConfig} = this.props;
    if (loading) {
      return (<Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>);
    }
    const { getFieldProps } = this.props.form;
    const certifyStatusMap = {
      apply: {
        color: 'yellow',
        text: '证照办理中',
      },
      auditing: {
        color: 'yellow',
        text: '证照审核中',
      },
      reject: {
        color: 'red',
        text: '证照审核驳回',
      },
    };
    let cancelModal = null;
    if (errors.size > 0) {
      const memoProps = getFieldProps('memo', {
        initialValue: '',
        rules: [
          { require: true },
          { validator: this.checkLength },
        ],
      });
      cancelModal = (
      <Modal title="取消报错" confirmLoading={this.state.confirmLoading}
        onOk={this.confirmCancel} onCancel={this.hideCancelModal} visible={cancelModalVisible}>
        <Form horizontal form={this.props.form}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ offset: 1, span: 18}} label="原因"
            help={this.state.textAreaHelp}>
            <Input type="textarea" placeholder="请输入"
              {...memoProps} />
          </FormItem>
        </Form>
      </Modal>
      );
    }
    const {shop} = data;
    const shopLogoImgSrc = shop && shop.logo && shop.logo.resourceUrl.replace(/&amp;/g, '&');
    const shopMainImgSrc = shop && shop.mainImage && shop.mainImage.resourceUrl.replace(/&amp;/g, '&');
    const shopMainImg = (
      <div style={{float: 'left', marginRight: 15}}>
        <a href={shopMainImgSrc} target="_blank" key={shopMainImgSrc}>
          <img src={shopMainImgSrc} width="130" height="100" alt="" />
        </a>
      </div>);
    const shopName = (
      <div style={{margin: '10px 0 0 0', fontSize: 14}}>
        <ShopInfoErrorTip errType="SHOP_NAME_ERROR"
          message={errors.indexOf('SHOP_NAME_ERROR') > -1 && ERROR_TIPS.get('SHOP_NAME_ERROR')}
          shopId={shop.shopId} cancelEnable={cancelEnable} cancelError={this.showCancelModal}
        >
        {shop.shopName}
        </ShopInfoErrorTip>
        <div style={{marginLeft: '15px', display: 'inline-block'}}>
          <Tag color={shop.statusCode ? statusColorMap[shop.statusCode] : ''}>
            {shop.statusCode ? (statusMap[shop.statusCode] || shop.statusCode) : ''}
          </Tag>
        </div>
        {shop.display === '隐藏' && <div style={{marginLeft: '15px', display: 'inline-block'}}>
          <Tag color="grey">隐藏</Tag>
        </div>}
        {shop.forbidCreditCard ? <Tag style={{background: '#666', color: '#f3f3f3'}}>信用卡渠道关闭</Tag> : null}
        {shop.shopCertifyStatus && certifyStatusMap[shop.shopCertifyStatus] ?
          <Tag color={certifyStatusMap[shop.shopCertifyStatus].color}>{certifyStatusMap[shop.shopCertifyStatus].text}</Tag>
        : null}
      </div>);
    const shopAddress = (
      <div style={{margin: '10px 0'}}>
        <ShopInfoErrorTip top="20px" errType="ADDRESS_ERROR" dir="bottom"
          message={errors.indexOf('ADDRESS_ERROR') > -1 && ERROR_TIPS.get('ADDRESS_ERROR')}
          shopId={shop.shopId} cancelEnable={cancelEnable} cancelError={this.showCancelModal}
        >
          {shop.provinceName || ''}-
          {shop.cityName || ''}-
          {shop.districtName || ''}&nbsp;
          {shop.address || ''}
          {shop.addressDesc ? '(' + shop.addressDesc + ')' : ''}
        </ShopInfoErrorTip>
      </div>);
    const shopQrcode = (
      <div style={{display: 'inline-block', border: '1px solid #f0f0f0', padding: '0 20px', textAlign: 'center', float: 'right'}}>
        <div style={{fontSize: 45}}><Qrcode id={shop.shopId} shopName={shop.shopName} partnerId={shop.partnerId} showText/></div>
      </div>);
    const shopPunichScore = (
      <div style={{display: 'inline-block', border: '1px solid #f0f0f0', marginLeft: '20px', padding: '0 20px', textAlign: 'center', width: '102px', height: '99px', float: 'right'}}>
        <div style={{color: '#6C9', fontSize: '28px', marginTop: '20px', fontWeight: '400'}}>{shop.punishScore || '0'}</div>
        <div style={{color: '#666', marginTop: '5px'}}>累计罚分</div>
      </div>);
    const latestModifyStatus = latestModifyStatusMap[shop.latestModifyStatus] || shop.latestModifyStatus;
    const shopLastModified = shop.latestModifyStatus && (
      <div>
        {format(new Date(shop.latestModifyTime)) + ' ' + formatTime(new Date(shop.latestModifyTime))}&nbsp;
        {shop.latestModifyOrderId ?
        (<a href={'#/shop/diary/' + shop.latestModifyOrderId + '/MODIFY_SHOP'}>[{latestModifyStatus}]</a>) :
        (<span>[{latestModifyStatus}]</span>)}
      </div>);
    const QualityScore = showQualityScore && score && (score.fullScore !== 0 ) && (
      <div style={{display: 'inline-block', border: '1px solid #f0f0f0', marginLeft: '20px', padding: '0 20px', textAlign: 'center', width: '112px', height: '99px', float: 'right'}}>
        <a href={'#/shop/quality-score/' + this.props.id} target="_blank" style={{display: 'block', width: '100%', height: '100%'}}>
          <div style={{color: '#ff5800', fontSize: '28px', marginTop: '20px', fontWeight: '400'}}>{score.scoreValue}</div>
          <div style={{color: '#666', marginTop: '5px'}}>门店质量分</div>
        </a>
      </div>);
    let operationInfoDom = '';
    if (shop.operationInfo) {
      if (shop.operationInfo.length !== 0) {
        operationInfoDom = (<div>
        <h3 className="kb-page-sub-title">门店运营人员信息</h3>
        <table className="kb-detail-table-6">
          <tbody>
            {
              shop.operationInfo.map((info, idx)=> {
                return (
                    <tr key={idx}>
                      <td className="kb-detail-table-label">角色</td>
                      <td>{info.role}</td>
                      <td className="kb-detail-table-label">姓名</td>
                      <td>{info.name || '\\'}</td>
                      <td className="kb-detail-table-label">联系方式</td>
                      <td>{info.tel || '\\'}</td>
                    </tr>
                  );
              })
              }
          </tbody>
      </table></div>);
      }
    }
    return (
      <div>
        {shop.needCompleteLicense ? <Alert
          message="请补全门店证照"
          description={<span>
            为保障您的活动报名和正常营业，请尽快补全开店时未上传的证照。
            <a href="https://help.koubei.com/takeaway/knowledgeDetail.htm?knowledgeId=201602080043">查看证照要求</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href={`?mode=modify#/shop/edit/${shop.shopId}`}>立即补全</a>
          </span>}
          type="warning"
          showIcon /> : null}
        <Row>
          <Col span="15">
            {shopMainImg}
            <div>
              {shopName}
              <span style={{color: '#999'}}>ID: {shop.shopId}</span>
              {shopAddress}
            </div>
          </Col>
          <Col span="9">
            {QualityScore}
            {pageConfig.punishScoreEnable && shopPunichScore}
            {shopQrcode}
          </Col>
        </Row>
        <h3 className="kb-page-sub-title">基本信息</h3>
        <table className="kb-detail-table-6">
          <tbody>
            <tr>
              <td className="kb-detail-table-label">品牌</td>
              <td>{shop.brandName || ''}</td>
              <td className="kb-detail-table-label">创建时间</td>
              <td>{shop.createTime ? format(new Date(shop.createTime)) : ''}</td>
              <td className="kb-detail-table-label">默认收款方式</td>
              <td>{PayTypeMap[shop.payType] || ''}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">品类</td>
              <td>{shop.category || ''}</td>
              <td className="kb-detail-table-label">最后一次修改</td>
              <td>{shopLastModified}</td>
              <td className="kb-detail-table-label">收款账户</td>
              <td>{shop.receiveLogonId || ''}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">人均价格</td>
              <td>{shop.perPay ? shop.perPay + '元' : ''}</td>
              <td className="kb-detail-table-label">营业时间</td>
              <td>{shop.businessTime || ''}</td>
              {pageConfig.showBankCardNo && (<td className="kb-detail-table-label">银行卡编号</td>)}
              {pageConfig.showBankCardNo && (<td>{shop.bankCardNo}</td>)}
            </tr>
            <tr>
              <td className="kb-detail-table-label">机具编号</td>
              <td>
                {!!shop.posIds.length && <Popover content={array2StringJoinByComma(shop.posIds)} title="机具编号">
                  <a style={{width: '180px', display: 'inline-block', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                    {shop.posIds[0]}等{shop.posIds.length}个编号
                  </a>
                </Popover>}
              </td>
              <td className="kb-detail-table-label">外部门店编号</td>
              <td>{shop.outShopId || ''}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">门店联系方式</td>
              <td>
                <ShopInfoErrorTip top="0" left="190px" errType="PHONE_NUMBER_ERROR" dir="right"
                  message={errors.indexOf('PHONE_NUMBER_ERROR') > -1 && ERROR_TIPS.get('PHONE_NUMBER_ERROR')}
                  shopId={shop.shopId} cancelEnable={cancelEnable} cancelError={this.showCancelModal}
                >{shop.mobileNo && shop.mobileNo[0]}{shop.mobileNo && shop.mobileNo[1] ? (<span>/{shop.mobileNo[1]}</span>) : ''}
                </ShopInfoErrorTip>
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">提供服务</td>
              <td>
                {shop.provideServs ? shop.provideServs.join(',') : ''}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">更多服务</td>
              <td>{shop.otherService || ''}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">品牌LOGO</td>
              <td colSpan="5">
                {shopLogoImgSrc && (<a href={shopLogoImgSrc} target="_blank" key={shopLogoImgSrc}>
                  <img src={shopLogoImgSrc}/>
                </a>)}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">门店内景</td>
              <td colSpan="5">
                {
                  (shop.imageList || []).map((p)=> {
                    return (
                      <a href={p.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={p.resourceUrl}>
                        <img src={p.resourceUrl.replace(/&amp;/g, '&')}/>
                      </a>
                    );
                  })
                }
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">营业执照</td>
              <td>
                {shop.licensePicture && (<a href={shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.licensePicture.resourceUrl}>
                  <img src={shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')}/>
                </a>)}
              </td>
              <td className="kb-detail-table-label">营业执照有效期</td>
              <td>{shop.businessLicenseValidTime || ''} </td>
              <td className="kb-detail-table-label">营业执照名称</td>
              <td>{shop.licenseName || ''}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">行业许可证</td>
              <td>
                {shop.certificatePicture && (<a href={shop.certificatePicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.certificatePicture.resourceUrl}>
                  <img src={shop.certificatePicture.resourceUrl.replace(/&amp;/g, '&')}/>
                </a>)}
              </td>
              <td className="kb-detail-table-label">行业许可证有效期</td>
              <td>{shop.businessCertificateValidTime || ''}</td>
              <td className="kb-detail-table-label">营业执照编号</td>
              <td>{shop.licenseSeq || ''}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">授权函</td>
              <td>
                {shop.authorizationLetterPicture && (<a href={shop.authorizationLetterPicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.authorizationLetterPicture.resourceUrl}>
                  <img src={shop.authorizationLetterPicture.resourceUrl.replace(/&amp;/g, '&')}/>
                </a>)}
              </td>
              <td className="kb-detail-table-label">其他资质证明</td>
              <td>
                {
                  shop.otherAuthResources && !!shop.otherAuthResources.length ?
                  shop.otherAuthResources.map((p)=> {
                    return (
                      <a href={p.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={p.resourceUrl}>
                        <img src={p.resourceUrl.replace(/&amp;/g, '&')}/>
                      </a>
                    );
                  }) :
                  '无'
                }
              </td>
              <td className="kb-detail-table-label">当前费率</td>
              <td><RatePopover rateInfo ={shop.rateInfo} shopId ={this.props.id} /></td>
            </tr>
          </tbody>
        </table>
        <table className="kb-rate-table">
          <tbody>
            <tr>
              <td className="kb-rate-table-label">当面付费率</td>
              <td><RatePopover rateInfo={shop.rateInfo} shopId={this.props.id} /></td>
            </tr>
            {this.renderGoodRate()}
          </tbody>
        </table>
        {operationInfoDom}
        {cancelModal }
      </div>
    );
  },

});

export default Form.create()(ShopDetailBase);
