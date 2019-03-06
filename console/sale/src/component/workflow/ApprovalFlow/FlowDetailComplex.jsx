import React, {PropTypes} from 'react';
import {Alert, Row, Col, Tag, Spin, message, Breadcrumb, Button} from 'antd';
import ajax from 'Utility/ajax';
import {format} from '../../../common/dateUtils';
import {logResultMap} from '../../../common/OperationLogMap';

const FlowDetailComplex = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.object,
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
      id: this.props.params.id,
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
    window.open(`#/mall/create/${this.state.data.shop.orderId}`);
  },
/*eslint-disable */
  render() {
    /*eslint-enable */
    const {data, loading} = this.state;
    data.shop = data.order;
    const {shop} = data;
    let resultColor = '';
    if (shop) {
      if ( /WAIT_CERTIFY/.test(shop.status) || /LICENSE_AUDITING/.test(shop.status) || /RISK_AUDITING/.test(shop.status) || /WAIT_SIGN/.test(shop.status)) {
        resultColor = 'blue';
      } else if ( /FAIL/.test(shop.status) ) {
        resultColor = 'red';
      } else {
        resultColor = 'green';
      }
    }
    const items = [];
    if (this.props.location.query.isOpen) {
      items.push(<Breadcrumb.Item key="1">流水详情(综合体)</Breadcrumb.Item>);
    } else {
      items.push(
        <Breadcrumb.Item key="2" href="#/shop/backlog">待开门店</Breadcrumb.Item>,
        <Breadcrumb.Item key="1">流水详情(综合体)</Breadcrumb.Item>);
    }
    return (<div>
      <div className="app-detail-content-padding, app-detail-header">
        <Breadcrumb separator=">">
          {items}
        </Breadcrumb>
        {
          !this.props.location.query.isOpen
          && this.props.location.query.svr === 'false'
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
              {shop.resultTitle &&
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
                      <Tag color={resultColor}>{logResultMap[shop.status] || shop.status}</Tag>
                    </div>
                  </div>
                </Col>
              </Row>
              <h3 className="kb-page-sub-title">基本信息</h3>
              <table className="kb-detail-table-6">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">营业电话</td>
                    <td>{shop.mobileNo && shop.mobileNo[0]}{(shop.mobileNo && shop.mobileNo[1]) ? (<span>/{shop.mobileNo[1]}</span>) : ''}</td>
                    <td className="kb-detail-table-label">创建时间</td>
                    <td>{shop.createTime ? format(new Date(shop.createTime)) : ''}</td>
                    <td className="kb-detail-table-label">营业时间</td>
                    <td>{shop.businessTime || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">营业执照编号</td>
                    <td>{shop.licenseSeq || ''}</td>
                    { shop.opName ? <td className="kb-detail-table-label">创建人</td> : <td className="kb-detail-table-label"></td>}
                    { shop.opName ? <td>{shop.opName}{shop.opNickName && ('(' + shop.opNickName + ')')}</td> : <td></td>}
                    <td className="kb-detail-table-label">城市编号</td>
                    <td>{shop.cityId || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">营业执照</td>
                    <td>
                      {shop.licensePicture && (<a href={shop.licensePicture && shop.licensePicture.resourceUrl && shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank">
                        <img src={shop.licensePicture && shop.licensePicture.resourceUrl && shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')}/>
                      </a>)}
                    </td>
                    <td className="kb-detail-table-label">营业执照有效期</td>
                    <td>{shop.businessLicenseValidTime || ''} </td>
                    <td className="kb-detail-table-label">营业执照名称</td>
                    <td>{shop.licenseName || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">LOGO图</td>
                    <td colSpan="5">
                      {shop.logo && (<a href={shop.logo && shop.logo.resourceUrl && shop.logo.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.logo.resourceUrl}>
                        <img src={shop.logo && shop.logo.resourceUrl && shop.logo.resourceUrl.replace(/&amp;/g, '&')}/>
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
      </div>
    </div>
    );
  },
});

export default FlowDetailComplex;
