import React, {PropTypes} from 'react';
import {Row, Tag} from 'antd';
import ajax from 'Utility/ajax';
import {statusMap} from '../common/GoodsConfig';
import ShopListLabel from './ShopListLabel';
import {formatIntroduction} from '../common/utils';

const StoredValueCardInfo = React.createClass({
  propTypes: {
    goodsId: PropTypes.string,
    result: PropTypes.func,
  },

  getInitialState() {
    return {
      storedvaluecardInfo: {},
    };
  },

  componentDidMount() {
    this.fetch();
  },

  refresh() {
    this.fetch();
  },

  fetch() {
    ajax({
      url: window.APP.crmhomeUrl + '/goods/koubei/itemDetail.json',
      method: 'get',
      type: 'json',
      data: {
        itemId: this.props.goodsId,
      },
      success: (result) => {
        this.setState({
          storedvaluecardInfo: result.data,
        });
        this.props.result(result.kbItemVO);
      },
    });
  },

  render() {
    const {storedvaluecardInfo} = this.state;
    const coverUrl = storedvaluecardInfo.logo && storedvaluecardInfo.logo || 'https://img.alicdn.com/tps/TB17wzxLFXXXXXtXpXXXXXXXXXX-128-105.png';
    return (<div className="kb-discount-detail">
      <Row className = "kb-discount-header" >
        <div style={{float: 'left', marginRight: 15}}>
          <img src={coverUrl} width="130" height="100" alt=""/>
        </div>
        <div className = "kb-discount-count" style={{ marginTop: 15}}>
          <p className = "kb-bottom-line">已领：<span className="kb-discount-amount">{storedvaluecardInfo.cardNum}</span></p>
          <p>库存：<span className="kb-discount-amount">999999999</span></p>
        </div>
        <div className = "kb-discount-baseinfo" style={{ marginTop: 18}}>
            {storedvaluecardInfo.cardName}
            <span style={{marginLeft: '5px'}}>
               {storedvaluecardInfo.itemStatus ? <Tag color={storedvaluecardInfo.itemStatus === 'INIT' ? 'yellow' : 'green'} style={{ marginBottom: 4}} >{statusMap[storedvaluecardInfo.itemStatus]}</Tag> : null }
            </span>
          <p>商品ID：{storedvaluecardInfo.itemId}</p>
        </div>
      </Row>
      <table className="kb-detail-table-4">
        <tbody>
          <tr>
            <td className="kb-detail-table-label">商家名称</td>
            <td>{storedvaluecardInfo.partnerName}</td>
            <td className="kb-detail-table-label">累计发卡面额</td>
            <td>{storedvaluecardInfo.totalDenomination}元</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">商户PID</td>
            <td>{storedvaluecardInfo.partnerId}</td>
            <td className="kb-detail-table-label">未消费发卡面额</td>
            <td>{storedvaluecardInfo.totalBalance}元</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">储值账号</td>
            <td>{storedvaluecardInfo.account}</td>
            <td className="kb-detail-table-label">优惠共享</td>
            <td>{storedvaluecardInfo.mutexRule}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">服务电话</td>
            <td>{storedvaluecardInfo.phone}</td>
            <td className="kb-detail-table-label"></td>
            <td></td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">品牌介绍</td>
            <td colSpan="3"><pre style={{width: '600px'}}>{storedvaluecardInfo.description}</pre></td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">卡使用说明</td>
            <td colSpan="3">
              <p style={{ marginBottom: 4}}>有效期自充值之日起3年内有效</p>
              <p style={{ marginBottom: 4}}>储值卡使用方法：出示支付宝付款码，扫一扫即可付款</p>
              <p style={{ marginBottom: 4}}>到期后，每次自动延续一个月，商家每次按照余额的{formatIntroduction(storedvaluecardInfo.introduction_delayFeeRate && storedvaluecardInfo.introduction_delayFeeRate || '0')}%收取手续费(最低1元，扣完为止)</p>
              <p style={{ marginBottom: 4}}>退卡商家将按余额的{formatIntroduction(storedvaluecardInfo.introduction_returnFeeRate && storedvaluecardInfo.introduction_returnFeeRate || '0')}%收取手续费</p>
              <pre style={{width: '600px'}} >{storedvaluecardInfo.introduction_others}</pre>
            </td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">适合门店</td>
            <td colSpan="3">
              {(storedvaluecardInfo.cityShop && storedvaluecardInfo.shopCount > 0 ) ? <ShopListLabel shopList={storedvaluecardInfo.cityShop} shopLen={storedvaluecardInfo.shopCount}/> : ''}
            </td>
          </tr>
          <tr>
            <td rowSpan={(storedvaluecardInfo.benefits && storedvaluecardInfo.benefits.length > 0) ? storedvaluecardInfo.benefits.length : ''} className="kb-detail-table-label">会员权益</td>
            <td colSpan="3">
              {
                (storedvaluecardInfo.benefits || []).map((p, index) => {
                  if (index === 0) {
                    return p.benefitTitle + '：' + p.benefitDetailDesc;
                  }
                })
              }
            </td>
          </tr>
          {
              (storedvaluecardInfo.benefits || []).map((p, index) => {
                if (index > 0) {
                  return <tr key={index}><td colSpan="3">{p.benefitTitle + '：' + p.benefitDetailDesc}</td></tr>;
                }
              })
          }
        </tbody>
      </table>
    </div>);
  },
});

export default StoredValueCardInfo;
