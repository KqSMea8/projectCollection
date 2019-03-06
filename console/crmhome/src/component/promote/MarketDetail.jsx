import React, {Component} from 'react';
import {Breadcrumb, Button, Tag} from 'antd';
import ajax from '../../common/ajax';

class MarketDetail extends Component {
  componentDidMount() {
    ajax({
      url: '/market/detail.json',
      success: () => {

      },
    });
  }

  handleSubmit() {
    ajax({
      url: '/configDetail.json',
      success: () => {

      },
    });
  }

  render() {
    return (<div><div className="app-detail-header promote-detail-header">
        首页
        <Breadcrumb separator=">">
          <Breadcrumb.Item>管理</Breadcrumb.Item>
          <Breadcrumb.Item>查看营销活动</Breadcrumb.Item>
        </Breadcrumb>
    </div>
    <div className="kb-detail-main" >
      <div className="promote-market-banner">
        <img src="" width="130" height="100" alt="" />
        <div className="market-img-detail">
          <div className="market-title">精准营销0928-代金<Tag color="blue" style={{marginLeft: 5}}>活动开始</Tag></div>
          <div>优惠券</div>
          <div>2016-09-28 18:59 - 2016-09-28 23:59</div>
        </div>
      </div>
      <h3 className="kb-page-sub-title">优惠券设置</h3>
      <table className="kb-detail-table-6">
        <tbody>
          <tr>
            <td>代金券</td>
            <td>单品代金券</td>
            <td>商品名称</td>
            <td>商品名称</td>
            <td>品牌名称</td>
            <td>品牌名称</td>
          </tr>
           <tr>
            <td>优惠方式</td>
            <td>立减12元</td>
            <td>品牌logo</td>
            <td><img src="" /></td>
            <td>商品详情图片</td>
            <td><img src="" /></td>
          </tr>
          <tr>
            <td>商品编码</td>
            <td><a>查看</a></td>
            <td>商品详情文案</td>
            <td>商品详情</td>
            <td>更多商品详情</td>
            <td></td>
          </tr>
          <tr>
            <td>使用条件</td>
            <td>不限制</td>
            <td>券有效期</td>
            <td>领取后7日内有效</td>
            <td>使用说明</td>
            <td>使用说明</td>
          </tr>
        </tbody>
      </table>
      <h3 className="kb-page-sub-title">优惠券设置</h3>
      <table className="kb-detail-table-6">
        <tbody>
          <tr>
            <td>发放总量</td>
            <td>不限制</td>
            <td>参与限制</td>
            <td>不限制</td>
            <td>每日参与限制</td>
            <td>不限制</td>
          </tr>
        </tbody>
      </table>
      <h3 className="kb-page-sub-title">商家设置</h3>
      <table className="kb-detail-table-6">
        <tbody>
          <tr>
            <td>适用门店</td>
            <td colSpan="6"> d</td>
          </tr>
          <tr>
            <td>商家确认截止时间</td>
            <td colSpan="6">2016-09-28 18:40</td>
          </tr>
        </tbody>
      </table>
      <div style={{textAlign: 'center', marginTop: 15}}>
        <Button type="primary" size="large" onClick={() => { this.handleSubmit(); }}>确认活动</Button>
      </div>
    </div>
    </div>);
  }
}

export default MarketDetail;
