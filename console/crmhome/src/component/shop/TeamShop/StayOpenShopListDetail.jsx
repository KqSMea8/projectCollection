import React, {PropTypes} from 'react';
import {Alert, Row, Col, Tag, Spin, Popover, message, Button, Checkbox, Breadcrumb} from 'antd';
import ajax from '../../../common/ajax';
import PayTypeMap from '../common/PayTypeMap';
import {format} from '../../../common/dateUtils';
import {logResultMap} from '../../../common/OperationLogMap';
import RejectModal from './RejectModal';
import {array2StringJoinByComma, accMul} from '../../../common/utils';

const blueStatuses = [
  'WAIT_CERTIFY',
  'LICENSE_AUDITING',
  'RISK_AUDITING',
  'WAIT_SIGN',
  'WAIT_MERCHANT_CONFIRM',
  'PROCESS',
];

const redStatuses = [
  'FAIL',
];

const StayOpenShopListDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      data: null,
      loading: true,
      rejectModalVisible: false,
      approveModalVisible: false,
      termsChecked: false,
    };
  },

  componentDidMount() {
    this.fetch();
  },

  onTermsChecked(e) {
    this.setState({ termsChecked: e.target.checked });
  },

  onSignChangeChecked(e) {
    this.setState({ signChangeChecked: e.target.checked });
  },

  fetch() {
    const params = {
      id: this.props.params.shopId,
      action: this.props.params.action,
    };
    this.setState({
      loading: true,
    });
    const url = '/shop/crm/shopOrderDetail.json';
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

  reply(action, reason) {
    if (!(this.state.data && this.state.data.order)) {
      return;
    }
    ajax({
      url: '/shop/confirmRelationMerchant.json',
      method: 'post',
      data: {
        orderId: this.state.data.order.orderId,
        confirmAction: action,
        reason,
      },
    }).then((response) => {
      if (response.status === 'success' || response.status === true) {
        message.success('操作成功');
        window.location.reload();
      } else {
        throw new Error(response);
      }
    }).catch((_reason) => {
      message.error('操作失败：' + _reason.resultMsg || '未知错误');
    });
  },

  approve() {
    this.reply('PASS');
  },

  reject(reasons) {
    this.hideRejectModal();
    this.reply('REJECT', reasons.join(';'));
  },

  showRejectModal() {
    this.setState({ rejectModalVisible: true });
  },

  hideRejectModal() {
    this.setState({ rejectModalVisible: false });
  },

  showApproveModal() {
    this.setState({ approveModalVisible: true });
  },

  hideApproveModal() {
    this.setState({ approveModalVisible: false });
  },

  /*eslint-disable */
  render() {
    /*eslint-enable */
    const {data, loading} = this.state;
    if (loading || !data || !data.order) {
      return <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>;
    }
    const shop = data.order;
    const shopSignData = shop.shopSignData || {};
    let resultColor;
    if (blueStatuses.indexOf(shop.status.toUpperCase()) > -1) {
      resultColor = 'blue';
    } else if (redStatuses.indexOf(shop.status.toUpperCase()) > -1) {
      resultColor = 'red';
    } else {
      resultColor = 'green';
    }
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
        {(shop.headShopName || '') + (shop.shopName ? ('(' + shop.shopName + ')') : '')}
        <div style={{marginLeft: '15px', display: 'inline-block'}}>
          <Tag color={resultColor}>{logResultMap[shop.status] || shop.status}</Tag>
        </div>
      </div>);
    const shopAddress = (
      <div style={{margin: '10px 0'}}>
        {shop.provinceName || ''}-
        {shop.cityName || ''}-
        {shop.districtName || ''}&nbsp;
        {shop.address || ''}
        {shop.addressDesc ? '(' + shop.addressDesc + ')' : ''}
      </div>);
    return (<div>
      <div className="kb-detail-main" style={{minHeight: 500}}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>待开门店</Breadcrumb.Item>
          <Breadcrumb.Item>流水详情</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{marginTop: 20}}>
          {
            shop.resultTitle &&
            <Alert
            message={shop.resultTitle}
            description={shop.resultDesc}
            type="warning"
            showIcon />
          }
          <Row>
            <Col span="24">
              {shopMainImg}
              <div>
                {shopName}
                <span style={{color: '#999'}}>ID: {shop.orderId}</span>
                {shopAddress}
              </div>
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
                <td>{shop.categoryLabel ? (<span style={{color: '#FF6600'}}>[{shop.categoryLabel}]</span>) : ''} {shop.category || ''}</td>
                <td className="kb-detail-table-label">营业时间</td>
                <td>{shop.businessTime || ''}</td>
                <td className="kb-detail-table-label">收款账户</td>
                <td>{shop.receiveLogonId || ''}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">人均价格</td>
                <td>{shop.perPay ? shop.perPay + '元' : ''}</td>
                <td className="kb-detail-table-label">外部门店编号</td>
                <td>{shop.outShopId || ''}</td>
                {shop.bankCardNo !== '-' && (<td className="kb-detail-table-label">银行卡编号</td>)}
                {shop.bankCardNo !== '-' && (<td>{shop.bankCardNo}</td>)}
                <td className="kb-detail-table-label"></td>
                <td></td>
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
                <td className="kb-detail-table-label"></td>
                <td></td>
                <td className="kb-detail-table-label"></td>
                <td></td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">门店联系方式</td>
                <td colSpan="5">{shop.mobileNo ? shop.mobileNo.join('、') : ''}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">提供服务</td>
                <td colSpan="5">{shop.provideServs ? shop.provideServs.join(',') : ''}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">更多服务</td>
                <td colSpan="5">{shop.otherService || ''}</td>
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
                  {shop.licensePicture && (<a href={shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank">
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
                  {shop.certificatePicture && (<a href={shop.certificatePicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank">
                    <img src={shop.certificatePicture.resourceUrl.replace(/&amp;/g, '&') }/>
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
                <td>{shop.rate && <p>{accMul(shop.rate, 100) + '%'}</p>}</td>
              </tr>
            </tbody>
          </table>
          <h3 className="kb-page-sub-title">流水操作人员信息</h3>
          <table className="kb-detail-table-6">
            <tbody>
              <tr>
                <td className="kb-detail-table-label">角色</td>
                <td>{shop.operationVO.role}</td>
                <td className="kb-detail-table-label">姓名</td>
                <td>{shop.operationVO.name || '\\'}</td>
                <td className="kb-detail-table-label">联系方式</td>
                <td>{shop.operationVO.tel || '\\'}</td>
              </tr>
            </tbody>
          </table>
          {/WAIT_MERCHANT_CONFIRM/.test(shop.subStatus) && (<div style={{marginTop: 30}}>
            <div>
              {shopSignData.signType === 'SIGN_MODIFY_TO_KOUBEI' ? (<p>
                <Checkbox onChange={this.onSignChangeChecked}>
                  <p style={{ marginLeft: 22, marginTop: -18 }}>
                    <span>
                      我同意终止与支付宝（中国）网络技术有限公司或口碑（上海）网络技术有限公司已经签署的关于当面付服务的《支付宝商家服务协议》（或《口碑商户服务协议》）
                      { shopSignData.orderNum ? `（合同编号为：${shopSignData.orderNum}）` : null }
                      且同意口碑和支付宝为我名下支付宝账户
                      { shopSignData.alipayAccount ? `（账户：${shopSignData.alipayAccount}）` : null }
                      开通口碑和新当面付服务。
                    </span>
                  </p>
                </Checkbox>
              </p>) : (<div>
                <p>申请成功后，口碑在每笔收款的收取费率如下：</p>
                <p>超市便利店：每笔收取0.38%；</p>
                <p>非超市便利店：每笔交易的0.6%<span style={{ color: '#F90' }}>（改签之日起至2018年12月31日，口碑仅收取每笔交易的0.55%）</span></p>
              </div>)}
              {shop.rate ? <p style={{marginTop: 10}}>
                {'申请成功后，口碑将按照如下费率收取服务费：每笔交易金额的' + accMul(shop.rate, 100) + '，如有优惠费率，则优惠期内按优惠费率收费'}
              </p> : null}
              {shop.showAgreement && <p style={{marginTop: 10}}><Checkbox onChange={this.onTermsChecked}>已阅读并同意<a href="https://render.alipay.com/p/f/fd-j1g41yxx/index.html#支付宝商家服务协议" target="_blank">《支付宝商家服务协议》</a>和<a href="https://render.alipay.com/p/f/fd-j1g41yxx/index.html" target="_blank">《口碑商户服务协议》</a></Checkbox></p>}
            </div>
            <div style={{marginTop: 30, marginBottom: 20, height: 1, background: '#ddd'}} />
            <Button
              type="primary" style={{marginLeft: 12}} onClick={this.approve}
              disabled={(shopSignData.signType === 'SIGN_MODIFY_TO_KOUBEI' && !this.state.signChangeChecked) || (shop.showAgreement && !this.state.termsChecked)}
            >同意入驻口碑</Button>
            <Button type="ghost" style={{marginLeft: 12}} onClick={this.showRejectModal}>驳回</Button>
          </div>)}
        </div>
      </div>
      <RejectModal
        visible={this.state.rejectModalVisible}
        onOk={this.reject}
        onCancel={this.hideRejectModal}/>
    </div>);
  },
});

export default StayOpenShopListDetail;
