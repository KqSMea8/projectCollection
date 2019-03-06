import React, {PropTypes} from 'react';
import {Alert, Row, Col, Tag, Spin, Popover, message} from 'antd';
import ajax from 'Utility/ajax';
import {format} from '../../../common/dateUtils';
import {logResultMap} from '../../../common/OperationLogMap';
import {array2StringJoinByComma} from '../../../common/utils';
import {openProgressStatusMap} from '../../shop/common/ShopConfig';


const ShopCreateOrModify = React.createClass({
  propTypes: {
    id: PropTypes.string,
    action: PropTypes.string,
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
      orderId: this.props.id,
      action: this.props.action,
    };
    this.setState({
      loading: true,
    });
    const url = window.APP.crmhomeUrl + '/shop/koubei/historyShopDetail.json';
    ajax({
      url: url,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            loading: false,
            data: result.data,
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
/*eslint-disable */
  render() {
    /*eslint-enable */
    const {data, loading} = this.state;
    const action = this.props.action;
    data.shop = data.order;
    const shop = data;
    let resultColor = '';
    let code = logResultMap[shop.status];
    if (action) {
      if (action === 'HISTORY_SHOP') {
        code = openProgressStatusMap[shop.status];
        /*eslint-disable */
        if (shop) {
          if ( /WAIT_CERTIFY/.test(shop.status) || /LICENSE_AUDITING/.test(shop.status) || /RISK_AUDITING/.test(shop.status) || /WAIT_SIGN/.test(shop.status) || /MERCHANT_CONFIRMING/.test(shop.status)) {
            resultColor = 'blue';
          } else if ( /FAIL/.test(shop.status) || /MERCHANT_REJECT/.test(shop.status) || /RISK_REJECT/.test(shop.status) ) {
            resultColor = 'red';
          } else {
            resultColor = '';
          }
        }
        /*eslint-enable */
      } else {
        code = logResultMap[shop.status];
        if ( /PROCESS/.test(shop.status) ) {
          resultColor = 'blue';
        } else {
          resultColor = '';
        }
      }
    }
    return (
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
                    <a href={shop.logo && shop.logo.resourceUrl && shop.logo.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.logo && shop.logo.resourceUrl}>
                      <img src={shop.logo && shop.logo.resourceUrl && shop.logo.resourceUrl.replace(/&amp;/g, '&')} width="130" height="100" alt="" />
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
                      <Tag color={resultColor}>{code}</Tag>
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
                    <td>{shop.acquiringMethod || ''}</td>
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
                    {shop.opName ? <td className="kb-detail-table-label">创建人</td> : <td className="kb-detail-table-label"></td>}
                    {shop.opName ? <td>{shop.opName}{shop.opNickName && ('(' + shop.opNickName + ')')}</td> : <td></td>}
                    <td className="kb-detail-table-label">提供服务</td>
                    <td>{shop.provideServs ? shop.provideServs.join(',') : ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">机具编号</td>
                    <td>
                      <Popover content={array2StringJoinByComma(shop.posIds)} title="机具编号">
                        <a href="#" style={{width: '180px', display: 'inline-block', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                          {shop.posIds ? shop.posIds.join(',') : ''}
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
                    <td className="kb-detail-table-label">收款账户</td>
                    <td>{shop.receiveLogonId || ''}</td>
                    <td className="kb-detail-table-label">结算银行卡</td>
                    <td>{shop.bankCardNo || ''}</td>
                    <td className="kb-detail-table-label"></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">营业执照</td>
                    <td>
                      {shop.licensePicture && (<a href={shop.licensePicture.resourceUrl && shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank">
                        <img src={shop.licensePicture.resourceUrl && shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')}/>
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
                      {shop.certificatePicture && (<a href={shop.certificatePicture.resourceUrl && shop.certificatePicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank">
                        <img src={shop.certificatePicture.resourceUrl && shop.certificatePicture.resourceUrl.replace(/&amp;/g, '&') }/>
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
                      { shop.otherAuthResources ?
                        (shop.otherAuthResources || []).map((p)=> {
                          return (
                            <a href={p.resourceUrl ? p.resourceUrl.replace(/&amp;/g, '&') : ''} target="_blank" key={p.resourceUrl}>
                              <img src={p.resourceUrl ? p.resourceUrl.replace(/&amp;/g, '&') : ''}/>
                            </a>
                          );
                        }) : '无'
                      }
                    </td>
                    <td className="kb-detail-table-label"></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">门店logo</td>
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
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    );
  },

});

export default ShopCreateOrModify;
