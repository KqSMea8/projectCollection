import React, {PropTypes} from 'react';
import {Row, Col, Tag, Spin, message} from 'antd';
import ajax from '../../../common/ajax';
import '../style.less';
import Qrcode from '../../shop/common/Qrcode';
import {statusMap, statusColorMap} from '../../shop/common/ShopStatusSelect';
import {format} from '../../../common/dateUtils';

const ShopDetailBase = React.createClass({
  propTypes: {
    id: PropTypes.string,
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
    const {shop, serviceMerchant} = data;
    let kpInfo = {};
    let managementInfo = {};
    if (shop && shop.keyPerson && shop.managementInfo) {
      kpInfo = shop.keyPerson;
      managementInfo = shop.managementInfo;
    }
    const kpJob = {
      SHOP_KEEPER: '店长',
      SHOP_BOSS: '老板',
      SHOP_OTHER: '其他',
    };
    return (
      <div>
        {
          loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
        }
        {
          !loading && (
            <div>
              <Row>
                <Col span="16">
                  <div style={{float: 'left', marginRight: 15}}>
                    <a href={shop.logo && shop.logo.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.logo && shop.logo.resourceUrl}>
                      <img src={shop.logo && shop.logo.resourceUrl.replace(/&amp;/g, '&')} width="130" height="100" alt="" />
                    </a>
                  </div>
                  <div>
                    <div style={{margin: '10px 0', fontSize: 14}}>{shop.shopName || ''}
                      <div style={{marginLeft: '15px', display: 'inline-block'}}>
                        <Tag color={shop.statusCode ? statusColorMap[shop.statusCode] : ''}>{shop.statusCode ? (statusMap[shop.statusCode] || shop.statusCode) : ''}</Tag>
                      </div>
                    </div>
                    <div style={{margin: '10px 0'}}>
                      {shop.provinceName || ''}-
                      {shop.cityName || ''}-
                      {shop.districtName || ''}&nbsp;
                      {shop.address || ''}
                      {shop.addressDesc ? '(' + shop.addressDesc + ')' : ''}
                    </div>
                    <div style={{margin: '10px 0'}}>
                      {shop.mallName}
                    </div>
                    {shop.saleLabel && shop.saleLabel.length > 0 ? (<div>标签：{shop.saleLabel.map((p, index) => {
                      if (shop.saleLabel.length === index + 1) {
                        return (<span style={{color: '#f90'}}>{p}</span>);
                      }
                      return (<span><span style={{color: '#f90'}}>{p}</span><span className="ant-divider"></span></span>);
                    })}</div>) : ''}
                  </div>
                </Col>
                <Col span="8" style={{textAlign: 'right'}}>
                  <a href="/shop.htm#/shop" style={{display: 'inline-block', border: '1px solid #f0f0f0', marginRight: '32px', padding: '0 20px', textAlign: 'center', width: '102px', height: '99px'}}>
                    <div style={{color: '#f60', fontSize: '28px', marginTop: '20px', fontWeight: '400'}}>{shop.relationShopsCount}</div>
                    <div style={{color: '#666', marginTop: '5px'}}>入驻门店数</div>
                  </a>
                  <div style={{display: 'inline-block', border: '1px solid #f0f0f0', padding: '0 20px', textAlign: 'center'}}>
                    <div style={{fontSize: 45}}><Qrcode id={shop.shopId} shopName={shop.mallName} shopType={shop.shopType} showText/></div>
                  </div>
                </Col>
              </Row>

              <div className="mallShopNum">
                <div className="mallShopNum-list">餐饮门店数：<span style={{color: 'red'}}>{managementInfo.restaurantShopCnt}</span></div>
                <div className="mallShopNum-list">快消类门店：<span style={{color: 'red'}}>{managementInfo.fastConsumeShopCnt}</span></div>
                <div className="mallShopNum-list">泛行业类门店：<span style={{color: 'red'}}>{managementInfo.universalShopCnt}</span></div>
                <div className="mallShopNum-list" style={{border: 0}}>支付类门店：<span style={{color: 'red'}}>{managementInfo.payShopCnt}</span></div>
              </div>


              <h3 className="kb-page-sub-title">基本信息</h3>
              <table className="kb-detail-table-4">
                <tbody>
                  <tr>
                  <td className="kb-detail-table-label">总营业面积(万平方米)</td>
                  <td>{managementInfo.businessArea}</td>
                  <td className="kb-detail-table-label">年营业总额（亿元）</td>
                  <td>{managementInfo.annualTurnover}</td>
               </tr>
                <tr>
                  <td className="kb-detail-table-label">经营品类</td>
                  <td>{shop.category || ''}</td>
                  <td className="kb-detail-table-label">品牌名称</td>
                  <td>{shop.brandName || ''}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">创建时间</td>
                  <td>{shop.createTime ? format(new Date(shop.createTime)) : ''}</td>
                  <td className="kb-detail-table-label">营业时间</td>
                  <td>{shop.businessTime || ''}</td>
                  </tr>
                <tr>
                  <td className="kb-detail-table-label">营业电话</td>
                  <td>{shop.mobileNo && shop.mobileNo[0]}{shop.mobileNo && shop.mobileNo[1] ? (<span>/{shop.mobileNo[1]}</span>) : ''}</td>
                  <td className="kb-detail-table-label">主要联系人</td>
                  <td>{kpInfo.kpName}{kpInfo.kpJob ? <span>({kpJob[kpInfo.kpJob]})</span> : ''}{kpInfo.kpTelNo}</td>
                </tr>
                 <td className="kb-detail-table-label">城市编号</td>
                  <td>{shop.cityId || ''}</td>
                <tr>
                  <td className="kb-detail-table-label">营业执照编号</td>
                  <td>{shop.licenseSeq || ''}</td>
                  <td className="kb-detail-table-label">营业执照名称</td>
                  <td>{shop.licenseName || ''}</td>
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
                  <td className="kb-detail-table-label">品牌LOGO</td>
                    <td colSpan="5">
                      {shop.logo && (<a href={shop.logo.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.logo.resourceUrl}>
                        <img src={shop.logo.resourceUrl.replace(/&amp;/g, '&')}/>
                      </a>)}
                    </td>
                  </tr>
                </tbody>
              </table>


              <h3 className="kb-page-sub-title">服务商信息</h3>
              <table className="kb-detail-table-4">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">服务商地推小二</td>
                    <td>{serviceMerchant && (serviceMerchant.staffName || '')}</td>
                    <td className="kb-detail-table-label">服务商名称</td>
                    <td>{serviceMerchant && (serviceMerchant.name || '')}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">联系方式</td>
                    <td>{serviceMerchant && (serviceMerchant.telephone || '')}</td>
                    <td className="kb-detail-table-label">服务商账户</td>
                    <td>{serviceMerchant && (serviceMerchant.alipayCard || '')}</td>
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

export default ShopDetailBase;
