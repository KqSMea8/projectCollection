import React, {PropTypes} from 'react';
import {Alert, Row, Col, Tag, Spin, message, Breadcrumb} from 'antd';
import ajax from 'Utility/ajax';
import {format} from '../../../common/dateUtils';
import {logResultMap, logShopActionMap} from '../../../common/OperationLogMap';

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
      error: () => {
        this.setState({
          loading: false,
        });
      },
    });
  },
/*eslint-disable */
  render() {
    /*eslint-enable */
    const {data, loading} = this.state;
    data.shop = data.order;
    const shop = data.shop || {};
    let resultColor = '';
    if (shop) {
      if ( /WAIT_CERTIFY/.test(shop.statusCode) || /LICENSE_AUDITING/.test(shop.statusCode) || /RISK_AUDITING/.test(shop.statusCodeCode) || /WAIT_SIGN/.test(shop.statusCode)) {
        resultColor = 'blue';
      } else if ( /FAIL/.test(shop.statusCode) ) {
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
        <Breadcrumb.Item key="2" href="#/shop/backlog">已开门店</Breadcrumb.Item>,
        <Breadcrumb.Item key="1">门店详情(综合体)</Breadcrumb.Item>,
        <Breadcrumb.Item key="1">流水详情</Breadcrumb.Item>);
    }
    let errorMasage = '';
    let errorMasageLen = '';
    if (shop.rejectReason) {
      try {
        errorMasageLen = JSON.parse(shop.rejectReason).length;
        errorMasage = JSON.parse(shop.rejectReason).join(',');
      } catch (err) {
        errorMasageLen = shop.rejectReason.length;
        errorMasage = shop.rejectReason;
      }
    }
    return (<div>
      <div className="app-detail-content-padding, app-detail-header">
        <Breadcrumb separator=">">
          {items}
        </Breadcrumb>
      </div>
      <div className="kb-detail-main" style={{minHeight: 500}}>
        <div>
        {
        loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
        }
        {
          !loading && (
            <div>
              {errorMasageLen && <Alert
              message={errorMasage}
              type="warning"
              showIcon />}
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
                      <Tag color={resultColor}>{logResultMap[shop.statusCode] || shop.statusCode}</Tag>
                    </div>
                  </div>
                </Col>
              </Row>
              <h3 className="kb-page-sub-title">基本信息</h3>
              <table className="kb-detail-table-4">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">品类</td>
                    <td>{shop.categoryLabel ? (<span style={{color: '#FF6600'}}>[{shop.categoryLabel}]</span>) : ''} {shop.category || ''}</td>
                    <td className="kb-detail-table-label">操作类型</td>
                    <td>{logShopActionMap[shop.action]}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">品牌</td>
                    <td>
                      {shop.brandLevel && (shop.brandLevel === 'K1' || shop.brandLevel === 'K2') ? (<span style={{color: '#FF6600'}}>[{shop.brandLevel}]</span>) : ''}
                      {shop.brandName || ''}
                    </td>
                    <td className="kb-detail-table-label">操作时间</td>
                    <td>{format(new Date(shop.createTime))}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">门店联系方式</td>
                    <td>{shop.mobileNo && shop.mobileNo[0]}{(shop.mobileNo && shop.mobileNo[1]) ? (<span>/{shop.mobileNo[1]}</span>) : ''}</td>
                      <td className="kb-detail-table-label">操作人</td>
                      <td>{shop.opName || ''}{shop.opNickName && ('(' + shop.opNickName + ')')}</td>
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
