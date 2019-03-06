import React, {PropTypes} from 'react';
import {Row, Col, Tag, Spin, message} from 'antd';
import '../style.less';
import ajax from 'Utility/ajax';
import Qrcode from './Qrcode';
import {statusMap, statusColorMap} from '../../../common/ShopStatusSelect';
import {format} from '../../../common/dateUtils';


const MallDetailBase = React.createClass({
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

  getShopLabelNames() {
    let names = [];
    const {data} = this.state;
    if (!data) return names;
    if (data.shop && data.shop.saleLabel) {
      names = names.concat(data.shop.saleLabel);
    }
    if (data.merchantKALabel) {
      const kaLabelMap = {
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

  fetch(pageParams = {}) {
    const params = {
      shopId: this.props.id,
      ...pageParams,
    };
    this.setState({
      loading: true,
    });
    const url = window.APP.crmhomeUrl + '/shop/koubei/shopDetail.json';
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
    const {shop, serviceMerchant, merchant} = data;
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
    const shopLabelNames = this.getShopLabelNames();
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
                    <a href={shop.logo && shop.logo.resourceUrl && shop.logo.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.logo && shop.logo.resourceUrl}>
                      <img src={shop.logo && shop.logo.resourceUrl && shop.logo.resourceUrl.replace(/&amp;/g, '&')} width="130" height="100" alt="" />
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
                    {shopLabelNames.length > 0 ? (<div>标签：{shopLabelNames.map((p, index) => {
                      if (shopLabelNames.length === index + 1) {
                        return (<span style={{color: '#f90'}}>{p}</span>);
                      }
                      return (<span><span style={{color: '#f90'}}>{p}</span><span className="ant-divider"></span></span>);
                    })}</div>) : ''}
                  </div>
                </Col>
                <Col span="8">
                  <div style={{display: 'inline-block', border: '1px solid #f0f0f0', marginLeft: '32px', padding: '0 20px', textAlign: 'center', width: '102px', height: '99px'}} >
                    <div style={{fontSize: 45}}><Qrcode id={shop.shopId} showText shopType={shop.shopType}/></div>
                  </div>
                  <div style={{display: 'inline-block', border: '1px solid #f0f0f0', padding: '0 20px', textAlign: 'center', float: 'left'}}>
                    <div style={{color: '#6C9', fontSize: '28px', marginTop: '20px', fontWeight: '400'}}>{shop.relationShopsCount}</div>
                    <div style={{color: '#666', marginTop: '5px'}}>入驻门店数</div>
                  </div>
                </Col>
              </Row>
              <div className="mallShopNum">
                <div className="mallShopNum-list">餐饮门店数：<span style={{color: '#666'}}>{managementInfo.restaurantShopCnt}</span></div>
                <div className="mallShopNum-list">快消类门店：<span style={{color: '#666'}}>{managementInfo.fastConsumeShopCnt}</span></div>
                <div className="mallShopNum-list">泛行业类门店：<span style={{color: '#666'}}>{managementInfo.universalShopCnt}</span></div>
                <div className="mallShopNum-list" style={{border: 0}}>支付类门店：<span style={{color: '#666'}}>{managementInfo.payShopCnt}</span></div>
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
                    <td className="kb-detail-table-label">品类</td>
                    <td>{shop.categoryLabel ? (<span style={{color: '#FF6600'}}>[{shop.categoryLabel}]</span>) : ''} {shop.category || ''}</td>
                    <td className="kb-detail-table-label">品牌</td>
                    <td>
                      {shop.brandLevel && (shop.brandLevel === 'K1' || shop.brandLevel === 'K2') ? (<span style={{color: '#FF6600'}}>[{shop.brandLevel}]</span>) : ''}
                      {shop.brandName || ''}
                    </td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">营业电话</td>
                    <td>{shop.mobileNo && shop.mobileNo[0]}{shop.mobileNo && shop.mobileNo[1] ? (<span>/{shop.mobileNo[1]}</span>) : ''}</td>
                    <td className="kb-detail-table-label">营业时间</td>
                    <td>{shop.businessTime || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">创建时间</td>
                    <td>{shop.createTime ? format(new Date(shop.createTime)) : ''}</td>
                    <td className="kb-detail-table-label">营业执照编号</td>
                    <td>{shop.licenseSeq || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">城市编号</td>
                    <td>{shop.cityId}</td>
                    <td className="kb-detail-table-label">主要联系人</td>
                      <td>{kpInfo.kpName}{kpInfo.kpJob ? <span>({kpJob[kpInfo.kpJob]})</span> : ''}{kpInfo.kpTelNo}</td>
                    <td className="kb-detail-table-label"></td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">营业执照有效期</td>
                    <td>{shop.businessLicenseValidTime || ''} </td>
                    <td className="kb-detail-table-label">营业执照名称</td>
                    <td>{shop.licenseName || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">营业执照</td>
                    <td colSpan="5">
                      {shop.licensePicture && (<a href={shop.licensePicture && shop.licensePicture.resourceUrl && shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.licensePicture.resourceUrl}>
                        <img src={shop.licensePicture && shop.licensePicture.resourceUrl && shop.licensePicture.resourceUrl.replace(/&amp;/g, '&')}/>
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
                    <td className="kb-detail-table-label">品牌LOGO</td>
                    <td colSpan="5">
                      {shop.logo && (<a href={shop.logo && shop.logo.resourceUrl && shop.logo.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={shop.logo.resourceUrl}>
                        <img src={shop.logo && shop.logo.resourceUrl && shop.logo.resourceUrl.replace(/&amp;/g, '&')}/>
                      </a>)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3 className="kb-page-sub-title">{shop.ctuGreyList ? '服务商信息和风控信息' : '服务商信息'}</h3>
              <table className="kb-detail-table-4">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">服务商小二</td>
                    <td>{serviceMerchant ? serviceMerchant.staffName : ''}</td>
                    <td className="kb-detail-table-label">服务商名称</td>
                    <td>{serviceMerchant ? serviceMerchant.telephone : ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">联系方式</td>
                    <td>{serviceMerchant ? serviceMerchant.alipayCard : ''}</td>
                    <td className="kb-detail-table-label">服务商账户</td>
                    <td>{serviceMerchant ? serviceMerchant.alipayCard : ''}</td>
                  </tr>
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
            </div>
          )
        }
      </div>
    );
  },

});

export default MallDetailBase;
