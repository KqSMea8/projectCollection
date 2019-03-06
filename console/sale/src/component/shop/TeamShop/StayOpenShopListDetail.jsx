import React, {PropTypes} from 'react';
import {Alert, Row, Col, Tag, Spin, Popover, message, Breadcrumb, Button} from 'antd';
import ajax from 'Utility/ajax';
import PayTypeMap from '../common/PayTypeMap';
import {format} from '../../../common/dateUtils';
import {logResultMap} from '../../../common/OperationLogMap';
import {array2StringJoinByComma, times} from '../../../common/utils';

const StayOpenShopListDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      data: [],
      loading: true,
    };
  },

  componentDidMount() {
    this.fetch();
  },
  fetch() {
    const params = {
      id: this.props.params.shopId,
      action: this.props.params.action,
    };
    this.setState({
      loading: true,
    });
    const url = window.APP.crmhomeUrl + '/shop/koubei/shopOrderDetail.json';
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

  goReopen() {
    window.open(`?mode=create#/shop/create/${this.state.data.shop.orderId}`);
  },

/* eslint-disable */
  render() {
    /* eslint-enable */
    const {data, loading} = this.state;
    data.shop = data.order;
    const {shop} = data;
    let resultColor = '';
    if (shop) {
      if ( /WAIT_CERTIFY/.test(shop.status) || /LICENSE_AUDITING/.test(shop.status) || /RISK_AUDITING/.test(shop.status) || /WAIT_SIGN/.test(shop.status) || /WAIT_MERCHANT_CONFIRM/.test(shop.status)) {
        resultColor = 'blue';
      } else if ( /FAIL/.test(shop.status) ) {
        resultColor = 'red';
      } else {
        resultColor = 'green';
      }
    }

    return (<div>
        <div className="app-detail-content-padding, app-detail-header">
          <Breadcrumb separator=">" style={{ display: 'inline-block' }}>
            <Breadcrumb.Item key="1" href="#/shop/backlog">待开门店</Breadcrumb.Item>
            <Breadcrumb.Item key="2">流水详情(普通门店)</Breadcrumb.Item>
          </Breadcrumb>
          {
            this.props.location && this.props.location.query && this.props.location.query.svr === 'false'
            && shop && (shop.canReOpenShop !== undefined ? shop.canReOpenShop :
              shop.action === 'CREATE_SHOP' && shop.status === 'FAIL')
            && (<Button
            type="primary"
            style={{ position: 'absolute', right: 10, top: 22 }}
            onClick={this.goReopen}>
              重新开店
            </Button>)
          }
        </div>
        <div className="kb-detail-main" style={{minHeight: 500}}>
          <div>
            {
              loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
            }
            {
              !loading && (
                <div>
                  {
                    shop.resultTitle &&
                    <Alert
                    message={shop.resultTitle}
                    description={<div>{shop.resultDesc}<p><a href={`https://cschannel.alipay.com/newPortal.htm?scene=${shop.resultCode === 'SHOP_JUDGE_FAIL' ? 'kb_0009' : 'kb_0019'}`} target="_blank">在线咨询驳回原因和解决方法</a></p></div>}
                    type="warning"
                    showIcon />
                  }
                  <Row>
                    <Col span="24">
                      <div style={{float: 'left', marginRight: 15}}>
                        <a href={shop.logo && shop.logo.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.logo && shop.logo.resourceUrl}>
                          <img src={shop.logo && shop.logo.resourceUrl.replace(/&amp;/g, '&')} width="130" height="100" alt="" />
                        </a>
                      </div>
                      <div>
                        <div style={{margin: '10px 0', fontSize: 14}}>{(shop.headShopName || '') + (shop.shopName ? ('(' + shop.shopName + ')') : '')}</div>
                        <div style={{margin: '10px 0'}}>
                          {shop.provinceName || ''}-
                          {shop.cityName || ''}-
                          {shop.districtName || ''}&nbsp;
                          {shop.address || ''}
                          {shop.addressDesc ? '(' + shop.addressDesc + ')' : ''}
                        </div>
                        <div style={{margin: '15px 0'}}>
                          <Tag color={resultColor}>{logResultMap[shop.status] || shop.status}</Tag>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <h3 className="kb-page-sub-title">基本信息</h3>
                  <table className="kb-detail-table-6">
                    <tbody>
                      <tr>
                        <td className="kb-detail-table-label">品类</td>
                        <td>{shop.categoryLabel ? (<span style={{color: '#FF6600'}}>[{shop.categoryLabel}]</span>) : ''} {shop.category || ''}</td>
                        <td className="kb-detail-table-label">品牌</td>
                        <td>
                          {shop.brandLevel && (shop.brandLevel === 'K1' || shop.brandLevel === 'K2') ? (<span style={{color: '#FF6600'}}>[{shop.brandLevel}]</span>) : ''}
                          {shop.brandName || ''}
                        </td>
                        <td className="kb-detail-table-label">默认收款方式</td>
                        <td>{PayTypeMap[shop.payType] || ''}</td>
                      </tr>
                      <tr>
                        <td className="kb-detail-table-label">创建时间</td>
                        <td>{shop.createTime ? format(new Date(shop.createTime)) : ''}</td>
                        <td className="kb-detail-table-label">营业时间</td>
                        <td>{shop.businessTime || ''}</td>
                        <td className="kb-detail-table-label"></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td className="kb-detail-table-label">门店联系方式</td>
                        <td>{shop.mobileNo && shop.mobileNo[0]}{(shop.mobileNo && shop.mobileNo[1]) ? (<span>/{shop.mobileNo[1]}</span>) : ''}</td>
                        { shop.opName ? <td className="kb-detail-table-label">创建人</td> : <td className="kb-detail-table-label"></td>}
                        { shop.opName ? <td>{shop.opName}{shop.opNickName && ('(' + shop.opNickName + ')')}</td> : <td></td>}
                        <td className="kb-detail-table-label">提供服务</td>
                        <td>{shop.provideServs ? shop.provideServs.join(',') : ''}</td>
                      </tr>
                      <tr>
                        <td className="kb-detail-table-label">机具编号</td>
                        <td>
                          <Popover content={array2StringJoinByComma(shop.posIds)} title="机具编号">
                            <a href="#" style={{width: '180px', display: 'inline-block', textOverflow: 'ellipsis', overflow: 'hidden'}}>
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
                        <td className="kb-detail-table-label">人均价格(元)</td>
                        <td>{shop.perPay || ''}</td>
                        <td className="kb-detail-table-label">更多服务</td>
                        <td>{shop.otherService || ''}</td>
                        <td className="kb-detail-table-label"></td>
                        <td></td>
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
                            (shop.otherAuthResources || []).map((p)=> {
                              return (
                                <a href={p.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={p.resourceUrl}>
                                  <img src={p.resourceUrl.replace(/&amp;/g, '&')}/>
                                </a>
                              );
                            })
                          }
                        </td>
                        <td className="kb-detail-table-label">当前费率</td>
                        <td>{shop.rate && <p>{times(shop.rate, 100) + '%'}</p>}</td>
                      </tr>
                      <tr>
                        <td className="kb-detail-table-label">门店首图</td>
                        <td colSpan="5">
                          {shop.mainImage && (<a href={shop.mainImage.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.mainImage.resourceUrl}>
                            <img src={shop.mainImage.resourceUrl.replace(/&amp;/g, '&')}/>
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
                    </tbody>
                  </table>
                  <h3 className="kb-page-sub-title">商户信息</h3>
                  <table className="kb-detail-table-6">
                    <tbody>
                      <tr>
                        <td className="kb-detail-table-label">商户名称</td>
                        <td>{shop.merchantName || ''}</td>
                        <td className="kb-detail-table-label">商户收款账号</td>
                        <td>{shop.merchantAccount || ''}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  },
});

export default StayOpenShopListDetail;
