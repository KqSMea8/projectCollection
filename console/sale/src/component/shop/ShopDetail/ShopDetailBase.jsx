import React, {PropTypes} from 'react';
import {Row, Col, Tag, Spin, Popover, message, Modal, Form, Input, Alert} from 'antd';
import ajax from 'Utility/ajax';
import Qrcode from '../common/Qrcode';
import PayTypeMap from '../common/PayTypeMap';
import {statusMap, statusColorMap} from '../../../common/ShopStatusSelect';
import {format} from '../../../common/dateUtils';
import {array2StringJoinByComma, times, hasSignPermisson} from '../../../common/utils';
import Immutable from 'immutable';
import ShopInfoErrorTip from '../common/ShopInfoErrorTip';
import permission from '@alipay/kb-framework/framework/permission';
import {camelCase} from 'lodash';
import RateListModal from '../common/RateListModal';
import '../common/ShopDetailBase.less';
const FormItem = Form.Item;
const mapFactory = Immutable.Map;
const ERROR_TIPS = mapFactory({
  ADDRESS_ERROR: '地址格式有误！',
  SHOP_NAME_ERROR: '名称格式有误！',
  PHONE_NUMBER_ERROR: '号码格式有误！',
});
const RelationTypeMap = {
  AGENT_OPERATION: '代运营关系',
  DATA_VIEW: '数据查看关系',
};

const ShopDetailBase = React.createClass({
  propTypes: {
    id: PropTypes.string,
    form: PropTypes.any,
    isPosSale: PropTypes.bool,
  },

  getInitialState() {
    return {
      data: [],
      loading: true,
      errors: new Immutable.Map(),
      cancelEnable: permission('SHOP_PROBLEM_LABEL_REMOVE'),
      cancelModalVisible: false,
      confirmLoading: false,
      textAreaHelp: '限制50字',
      problemLabelType: null,
    };
  },

  componentDidMount() {
    this.fetch();
    if (!this.props.isPosSale) {
      this.showQualityScore();
      this.queryQualityScore();
    }
  },
  // getRateHistoryList() {
  //   ajax({
  //     url: window.APP.crmhomeUrl + '/shop/koubei/queryRateOrder.json',
  //     method: 'get',
  //     data: {shopId: this.props.id},
  //     type: 'json',
  //     success: (result) => {
  //       if (result.status && result.status === 'succeed') {
  //         this.setState({
  //           RateList: result.data.data,
  //         });
  //       }
  //     },
  //   });
  // },
  getShopLabelNames() {
    let names = [];
    const data = this.state.data;
    if (!data) return names;
    if (data.shop && data.shop.saleLabel) {
      names = names.concat(data.shop.saleLabel);
    }
    if (data.merchantKALabel) {
      const kaLabelMap = {
        // is_TKA_KX: '快消TKA',
        // is_RKA_KX: '快消RKA',
        // is_TKA_FOOD: '餐饮TKA',
        // is_RKA_FOOD: '餐饮RKA',
        // is_TKA_FHY: '泛行业TKA',
        // is_RKA_FHY: '泛行业RKA',
        is_TKA_KX: 'TKA',
        is_TKA_FOOD: 'TKA',
        is_TKA_FHY: 'TKA',
        is_RKA_KX: 'RKA',
        is_RKA_FOOD: 'RKA',
        is_RKA_FHY: 'RKA',
      };
      const tkaRkaNames = {};
      data.merchantKALabel.forEach(label => {
        if (kaLabelMap[label]) tkaRkaNames[kaLabelMap[label]] = true;
      });
      names.push(...Object.keys(tkaRkaNames));
    }
    return names;
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
      url: window.APP.crmhomeUrl + '/shop/koubei/shopProblemLabelRemove.json',
      // url: 'http://local.alipay.net:8982/canceltag?type=1', //mock
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

          const type = camelCase(problemLabelType);
          if (errors.has(type)) {
            errors = errors.remove(type);
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
        message.error(res.resultMsg);
        this.setState({
          confirmLoading: false,
        });
      },
    });
  },

  checkLength(rule, value, callback) {
    if (value.length > 50) {
      callback('输入的字符数不能大于50');
    }
    if (value.length > 0) {
      this.setState({textAreaHelp: '限制50字'});
    } else {
      this.setState({textAreaHelp: '请输入'});
      callback('请输入');
    }
  },

  fetch(pageParams = {}) {
    const params = {
      shopId: this.props.id,
      ...pageParams,
    };
    this.setState({
      loading: true,
    });
    let url = window.APP.crmhomeUrl + '/shop/koubei/shopDetail.json';
    if (this.props.isPosSale) {
      url = `${window.APP.crmhomeUrl}/shop/koubei/posSaleShopDetail.json`;
    }
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
            errors: Immutable.fromJS(result.shop.shopProblemLabels || {}),
          });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  showQualityScore() {
    const showQualityScoreUrl = window.APP.crmhomeUrl + '/shop/showQualityScore.json.kb';
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
  },

  queryQualityScore() {
    const qualityScoreParam = {shopId: this.props.id};
    const qualityScoreUrl = window.APP.crmhomeUrl + '/shop/queryQualityScore.json.kb';
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

  renderGoodRate() {
    const { shop } = this.state.data;
    if (!shop || !shop.categoryFeeInfo || !shop.categoryFeeInfo.saleFee) return null;
    return (
      <tr>
        <td className="kb-rate-table-label">商品费率</td>
        <td>{times(shop.categoryFeeInfo.saleFee, 100)}%</td>
      </tr>
    );
  },

  renderGoodRateNote() {
    const { shop } = this.state.data;
    if (!hasSignPermisson() || !shop || !shop.categoryFeeInfo || !shop.categoryFeeInfo.saleFee) return null;
    return (
      <span style={{ marginLeft: '5px', fontSize: '12px' }}>
        如需了解费率详情，可在 <a href="/p/contract-center/index.htm#/list">签约订单管理</a> 中查看
      </span>
    );
  },

/* eslint-disable */
  render() {
/* eslint-enable */
    const { isPosSale } = this.props;
    const {data, loading, errors, cancelEnable, cancelModalVisible, showQualityScore, score} = this.state;
    const {shop, serviceMerchant, merchant, posSaleUser, zeroRate, competitorsShopInfo} = data;
    let kpInfo = {};
    let cmpInfo = {};
    if (shop && shop.keyPerson) {
      kpInfo = shop.keyPerson;
    }
    if (competitorsShopInfo && competitorsShopInfo.competitors) {
      cmpInfo = competitorsShopInfo.competitors;
    }
    const { getFieldProps } = this.props.form;
    const kpJob = {
      SHOP_KEEPER: '店长',
      SHOP_BOSS: '老板',
      SHOP_OTHER: '其他',
    };
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
    const shopLabelNames = this.getShopLabelNames();
    const pid = merchant && (merchant.pid);
    const qualityScore = showQualityScore && score && (score.fullScore !== 0 ) && (
      <div style={{display: 'inline-block', border: '1px solid #f0f0f0', marginLeft: '24px', padding: '0 20px', textAlign: 'center', width: '112px', height: '99px', float: 'left'}}>
        <a href={'#/shop/quality-score/' + this.props.id + '/' + pid} target="_blank" style={{display: 'block', width: '100%', height: '100%'}}>
          <div style={{color: '#ff5800', fontSize: '28px', marginTop: '20px', fontWeight: '400'}}>{score.scoreValue}</div>
          <div style={{color: '#666', marginTop: '5px'}}>门店质量分</div>
        </a>
      </div>);
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
      <Modal title="取消报错" confirmLoading={this.state.confirmLoading} onOk={this.confirmCancel} onCancel={this.hideCancelModal} visible={cancelModalVisible}>
        <Form horizontal>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ offset: 1, span: 18}} label="原因" help={this.state.textAreaHelp}>
            <Input type="textarea" placeholder="请输入"
              {...memoProps} />
          </FormItem>
        </Form>
      </Modal>
      );
    }
    return (
      <div>
        {
          loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
        }
        {
          !loading && (
            <div>
              {shop.needCompleteLicense ? <Alert
                message="请补全门店证照"
                description={<span>
                  为保障您的活动报名和正常营业，请尽快补全开店时未上传的证照。
                  <a href="https://csmobile.alipay.com/detailSolution.htm?questionId=201602048082&token=koubeizhushou-201602048082&knowledgeType=1&scene=koubeizhushou">查看证照要求</a>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <a href={`?mode=modify#/shop/edit/${shop.shopId}`}>立即补全</a>
                </span>}
                type="warning"
                showIcon /> : null}
              <Row>
                <Col span="15">
                  <div style={{float: 'left', marginRight: 15}}>
                    <a href={shop.logo && shop.logo.resourceUrl && shop.logo.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.logo && shop.logo.resourceUrl}>
                      <img src={shop.logo && shop.logo.resourceUrl && shop.logo.resourceUrl.replace(/&amp;/g, '&')} width="130" height="100" alt="" />
                    </a>
                  </div>
                  <div>
                    <div style={{margin: '10px 0', fontSize: 14 }}>
                      <ShopInfoErrorTip errType="SHOP_NAME_ERROR"
                        message={errors.get('shopNameError') && ERROR_TIPS.get('SHOP_NAME_ERROR')}
                        shopId={shop.shopId} cancelEnable={cancelEnable} cancelError={this.showCancelModal}
                      >
                        {shop.shopName || ''}
                      </ShopInfoErrorTip>
                      <div style={{marginLeft: '15px', display: 'inline-block'}}>
                        <Tag color={shop.statusCode ? statusColorMap[shop.statusCode] : ''}>{shop.statusCode ? (statusMap[shop.statusCode] || shop.statusCode) : ''}</Tag>
                        {zeroRate ? <Tag style={{background: '#666', color: '#f3f3f3'}}>0费率</Tag> : null}
                        {shop.forbidCreditCard ? <Tag style={{background: '#666', color: '#f3f3f3'}}>信用卡渠道关闭</Tag> : null}
                        {shop.shopCertifyStatus && certifyStatusMap[shop.shopCertifyStatus] ?
                          <Tag color={certifyStatusMap[shop.shopCertifyStatus].color}>{certifyStatusMap[shop.shopCertifyStatus].text}</Tag>
                        : null}
                      </div>
                    </div>
                    <div style={{margin: '10px 0'}}>
                        <span style={{margin: '0 5px'}}>
                          <span style={{color: '#FF6600'}}>{shop.mallName ? (<span>[{shop.mallName}]</span>) : null}</span>
                        </span>
                        <ShopInfoErrorTip errType="ADDRESS_ERROR" dir="right" top={-5} left={null}
                          message={errors.get('addressError') && ERROR_TIPS.get('ADDRESS_ERROR')}
                          shopId={shop.shopId} cancelEnable={cancelEnable} cancelError={this.showCancelModal}
                        ><span>
                          {shop.provinceName || ''}-
                          {shop.cityName || ''}-
                          {shop.districtName || ''}&nbsp;
                          {shop.address || ''}
                          {shop.addressDesc ? '(' + shop.addressDesc + ')' : ''}
                          </span>
                        </ShopInfoErrorTip>
                    </div>
                    {shopLabelNames.length > 0 ? (<div>标签：{shopLabelNames.map((p, index) => {
                      if (shopLabelNames.length === index + 1) {
                        return (<span style={{color: '#f90'}}>{p}</span>);
                      }
                      return (<span><span style={{color: '#f90'}}>{p}</span><span className="ant-divider"></span></span>);
                    })}</div>) : ''}
                  </div>
                </Col>
                <Col span="9">
                  <div style={{display: 'inline-block', border: '1px solid #f0f0f0', padding: '0 20px', textAlign: 'center', float: 'left'}}>
                    <div style={{fontSize: 45}}><Qrcode id={shop.shopId} shopName={shop.shopName} showText partnerId={pid}/></div>
                  </div>
                  <div style={{display: 'inline-block', border: '1px solid #f0f0f0', marginLeft: '24px', padding: '0 20px', textAlign: 'center', width: '102px', height: '99px', float: 'left'}}>
                    <div style={{color: '#6C9', fontSize: '28px', marginTop: '20px', fontWeight: '400'}}>{shop.punishScore}</div>
                    <div style={{color: '#666', marginTop: '5px'}}>累计罚分</div>
                  </div>
                  {qualityScore}
                </Col>
              </Row>
              <h3 className="kb-page-sub-title">基本信息</h3>
              <table className="kb-detail-table-6">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">展示状态</td>
                    <td>{shop.display || '' }</td>
                    <td className="kb-detail-table-label">创建时间</td>
                    <td>{shop.createTime ? format(new Date(shop.createTime)) : ''}</td>
                    <td className="kb-detail-table-label">{isPosSale ? 'POS销售归属人' : '归属BD'}</td>
                    <td>{isPosSale ? (posSaleUser && posSaleUser.staffName || '') : (shop.relationUserName || '')}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">门店ID</td>
                    <td>{shop.shopId || ''}</td>
                    {!isPosSale && <td className="kb-detail-table-label">收款ID</td>}
                    {!isPosSale && <td>{shop.receiveUserId || ''}</td>}
                    <td className="kb-detail-table-label">品类</td>
                    <td>{shop.categoryLabel ? (<span style={{color: '#FF6600'}}>[{shop.categoryLabel}]</span>) : ''} {shop.category || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">品牌</td>
                    <td>
                      {shop.brandLevel && (shop.brandLevel === 'K1' || shop.brandLevel === 'K2') ? (<span style={{color: '#FF6600'}}>[{shop.brandLevel}]</span>) : ''}
                      {shop.brandName || ''}
                    </td>
                    {!isPosSale && <td className="kb-detail-table-label">收款账户</td>}
                    {!isPosSale && <td>{shop.receiveLogonId || ''}</td>}
                    <td className="kb-detail-table-label">营业时间</td>
                    <td>{shop.businessTime || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">来源</td>
                    <td>{[shop.dataSource, shop.dataChannel].filter(r => r).join('-')}</td>
                    <td className="kb-detail-table-label">默认收款方式</td>
                    <td>{PayTypeMap[shop.payType] || ''}</td>
                    <td className="kb-detail-table-label">门店联系方式</td>
                    <td>
                      <ShopInfoErrorTip top="22px" errType="PHONE_NUMBER_ERROR"
                        message={errors.get('phoneNumberError') && ERROR_TIPS.get('PHONE_NUMBER_ERROR')}
                        shopId={shop.shopId} cancelEnable={cancelEnable} cancelError={this.showCancelModal} dir="bottom"
                      >
                        {shop.mobileNo && shop.mobileNo.join('、')}
                      </ShopInfoErrorTip>
                    </td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">门店标签</td>
                    <td>{shop.labels ? shop.labels.join('、') : ''}</td>
                      <td className="kb-detail-table-label">主要联系人</td>
                      <td>{kpInfo.kpName}{kpInfo.kpJob ? <span>({kpJob[kpInfo.kpJob]})</span> : ''}{kpInfo.kpTelNo}</td>
                    <td className="kb-detail-table-label">城市网格化</td>
                    <td>{shop.territoryName}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">共管BD</td>
                    <td colSpan="5">
                      {Object.keys(shop.shopAuthorizationStaffVOs || {}).map(k => (
                        shop.shopAuthorizationStaffVOs[k] && shop.shopAuthorizationStaffVOs[k].map(vo => {
                          if (vo.opType === 'ALIPAY') {
                            return vo ? `${vo.realName}(${vo.providerLoginName || ''},${RelationTypeMap[vo.relationType] || ''})` : '';
                          }
                          return vo ? `${vo.realName}(${vo.nickName || ''},${RelationTypeMap[vo.relationType] || ''})` : '';
                        }).join('、')
                      )).join('、')}
                    </td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">门店首图</td>
                    <td colSpan="5">
                      {shop.mainImage && (<a href={shop.mainImage.resourceUrl && shop.mainImage.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.mainImage.resourceUrl}>
                        <img src={shop.mainImage.resourceUrl && shop.mainImage.resourceUrl.replace(/&amp;/g, '&')}/>
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
                    <td className="kb-detail-table-label">机具编号</td>
                    <td>
                      <Popover content={array2StringJoinByComma(shop.posIds)} title="机具编号">
                        <a style={{width: '180px', display: 'inline-block', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                          {shop.posIds.join(',')}
                        </a>
                      </Popover>
                    </td>
                    <td className="kb-detail-table-label">门店编号</td>
                    <td>{shop.outShopId || ''}</td>
                    <td className="kb-detail-table-label">城市编号</td>
                    <td>{shop.cityId || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">提供服务</td>
                    <td>
                      {shop.provideServs ? shop.provideServs.join(',') : ''}
                    </td>
                    <td className="kb-detail-table-label">更多服务</td>
                    <td>{shop.otherService || ''}</td>
                    <td className="kb-detail-table-label">人均价格(元)</td>
                    <td>{shop.perPay || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">营业执照</td>
                    <td>
                      {shop.licensePicture && (<a href={shop.licensePicture && shop.licensePicture.resourceUrl && shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.licensePicture.resourceUrl}>
                        <img src={shop.licensePicture && shop.licensePicture.resourceUrl && shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')}/>
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
                      {shop.certificatePicture && (<a href={shop.certificatePicture && shop.certificatePicture.resourceUrl && shop.certificatePicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.certificatePicture.resourceUrl}>
                        <img src={shop.certificatePicture && shop.certificatePicture.resourceUrl && shop.certificatePicture.resourceUrl.replace(/&amp;/g, '&')}/>
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
                      {shop.authorizationLetterPicture && (<a href={shop.authorizationLetterPicture.resourceUrl && shop.authorizationLetterPicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.authorizationLetterPicture.resourceUrl}>
                        <img src={shop.authorizationLetterPicture.resourceUrl && shop.authorizationLetterPicture.resourceUrl.replace(/&amp;/g, '&')}/>
                      </a>)}
                    </td>
                    <td className="kb-detail-table-label">其他资质证明</td>
                    <td>
                      {
                        (shop.otherAuthResources || []).map((p)=> {
                          return (
                            <a href={p.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={p.resourceUrl}>
                              <img src={p.resourceUrl.replace(/&amp;/g, '&')}/>
                            </a>
                          );
                        })
                      }
                    </td>
                    <td className="kb-detail-table-label">点单开通状态</td>
                    <td>
                      {[
                        shop && shop.orderInfo && shop.orderInfo.orderStatus === 'OPEN' ? '到店点单' : '',
                        shop && shop.orderInfo && shop.orderInfo.preOrderStatus === 'OPEN' ? '预点单' : '',
                      ].filter(v => v).join('、') || '无'}
                    </td>
                  </tr>
                </tbody>
              </table>
              {shop && shop.deviceInfo && shop.deviceInfo.length > 0 ? <div>
                <h3 className="kb-page-sub-title">
                  POS一体机信息板块
                </h3>
                <table className="kb-detail-table-6">
                  <tbody>
                  {shop.deviceInfo.map(info => (<tr>
                    <td className="kb-detail-table-label">一体机SN编号</td>
                    <td>{info.deviceSn}</td>
                    <td className="kb-detail-table-label">一体机型号</td>
                    <td>{info.deviceModel}</td>
                    <td className="kb-detail-table-label">一体机类型</td>
                    <td>{info.deviceType}</td>
                  </tr>))}
                  </tbody>
                </table>
              </div> : null}
              {!isPosSale && <h3 className="kb-page-sub-title">
                费率信息
                {this.renderGoodRateNote()}
              </h3>}
              {!isPosSale && <table className="kb-rate-table">
                <tbody>
                  <tr>
                    <td className="kb-rate-table-label">当面付费率</td>
                    <td><RateListModal rateInfo={shop.rateInfo} shopId={this.props.id} /></td>
                  </tr>
                  {this.renderGoodRate()}
                </tbody>
              </table>}
              <h3 className="kb-page-sub-title">竞对信息</h3>
              <table className="kb-competition-table-3">
                <tbody>
                  <tr>
                    <td className="kb-competition-table-label">竞对名称</td>
                    <td>日交易占比</td>
                    <td className="kb-competition-table-label3">活动图片</td>
                  </tr>
                  {cmpInfo.xinmeida &&
                    <tr>
                      <td className="kb-competition-table-label">来自美团/大众</td>
                      <td>{cmpInfo.xinmeida.tradeRate && `${cmpInfo.xinmeida.tradeRate}%` || ''}</td>
                      <td className="kb-competition-table-label3">
                        {
                          (cmpInfo.xinmeida.pictures && cmpInfo.xinmeida.pictures.split(',') || []).map((p)=> {
                            return (
                              <a href={p.replace(/&amp;/g, '&')} target="_blank" key={p}>
                                <img src={p.replace(/&amp;/g, '&')}/>
                              </a>
                            );
                          })
                        }
                      </td>
                    </tr>
                  }
                  {cmpInfo.weixin &&
                    <tr>
                      <td className="kb-competition-table-label">来自微信</td>
                      <td>{cmpInfo.weixin.tradeRate && `${cmpInfo.weixin.tradeRate}%` || ''}</td>
                      <td className="kb-competition-table-label3">
                        {
                          (cmpInfo.weixin.pictures && cmpInfo.weixin.pictures.split(',') || []).map((p)=> {
                            return (
                              <a href={p.replace(/&amp;/g, '&')} target="_blank" key={p}>
                                <img src={p.replace(/&amp;/g, '&')}/>
                              </a>
                            );
                          })
                        }
                      </td>
                    </tr>
                  }
                  {cmpInfo.juhezhifu &&
                    <tr>
                      <td className="kb-competition-table-label">来自聚合支付</td>
                      <td>{cmpInfo.juhezhifu.tradeRate && `${cmpInfo.juhezhifu.tradeRate}%` || ''}</td>
                      <td className="kb-competition-table-label3">
                        {
                          (cmpInfo.juhezhifu.pictures && cmpInfo.juhezhifu.pictures.split(',') || []).map((p)=> {
                            return (
                              <a href={p.replace(/&amp;/g, '&')} target="_blank" key={p}>
                                <img src={p.replace(/&amp;/g, '&')}/>
                              </a>
                            );
                          })
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              <h3 className="kb-page-sub-title">{shop.ctuGreyList ? '服务商信息和风控信息' : '服务商信息'}</h3>
              <table className="kb-detail-table-6">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">服务商小二</td>
                    <td>{serviceMerchant ? serviceMerchant.staffName : ''}</td>
                    <td className="kb-detail-table-label">服务商名称</td>
                    <td>{serviceMerchant ? serviceMerchant.name : ''}</td>
                    <td className="kb-detail-table-label">服务商账户</td>
                    <td>{serviceMerchant ? serviceMerchant.alipayCard : ''}</td>
                  </tr>
                  {
                    shop.ctuGreyList && (
                      <tr>
                        <td className="kb-detail-table-label">风控信息</td>
                        <td colSpan="5">
                          <span style={{color: '#f60'}}>
                            {(shop.ctuGreyList) === 'T' ? '已列入作弊、风险名单中' : ''}
                          </span>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              {merchant && (<h3 className="kb-page-sub-title">商户信息</h3>)}
              {merchant && (<table className="kb-detail-table-4">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">商户PID</td>
                    <td>{merchant.pid}</td>
                    <td className="kb-detail-table-label">商户名称</td>
                    <td>{merchant.name}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">商户ID</td>
                    <td>{merchant.mid}</td>
                    <td className="kb-detail-table-label">商家联系方式</td>
                    <td>{merchant.mobileNo && merchant.mobileNo[0]} {merchant.mobileNo && merchant.mobileNo[1]}</td>
                  </tr>
                </tbody>
              </table>)}
              { cancelModal }
            </div>
          )
        }
      </div>
    );
  },
});

export default Form.create()(ShopDetailBase);
