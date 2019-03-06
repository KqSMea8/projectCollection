import React, {Component} from 'react';
import {Breadcrumb, Button} from 'antd';
import ajax from '../../common/ajax';

class ConfigPromote extends Component {
  constructor(opts) {
    super(opts);
    this.state = {

    };
  }

  componentDidComponent() {
    ajax({
      url: '/configDetail.json',
      success: () => {

      },
    });
  }

  confirmPromote() {
    ajax({
      url: '/market/detail.json',
      success: () => {

      },
    });
  }

  rejectPromote() {
    ajax({
      url: '/configDetail.json',
      success: () => {

      },
    });
  }

  render() {
    return (<div><div className="app-detail-header promote-detail-header">
        口碑客
        <Breadcrumb separator=">" >
          <Breadcrumb.Item>待设置分佣推广</Breadcrumb.Item>
          <Breadcrumb.Item>确认分佣推广</Breadcrumb.Item>
        </Breadcrumb>
    </div>
    <div className="kb-detail-main">
      <h3 className="kb-page-sub-title">活动信息</h3>
      <table className="promote-market-table">
        <tbody>
          <tr className="promote-market-title">
            <td>券信息</td>
            <td>适用城市</td>
            <td>活动状态</td>
            <td></td>
          </tr>
          <tr className="promote-market-info">
            <td style={{padding: 15}}>
              <img src="https://zos.alipayobjects.com/rmsportal/oRSHMuPpXltUvRc.png" width="130" height="100" alt="" />
              <div className="market-img-detail">
                <div className="market-title">外婆家全场折扣券</div>
                <div>8.8折</div>
                <div>外婆家（万塘路店）</div>
                <div>外婆家品牌</div>
                <div>2016-09-28 18:59 - 2016-09-28 23:59</div>
              </div>
            </td>
            <td>
              杭州市
            </td>
            <td>
              已确认
            </td>
            <td>
               <a>查看详情</a>
            </td>
          </tr>
        </tbody>
      </table>


      <h3 className="kb-page-sub-title">分佣设置</h3>
      <table className="kb-detail-table-6">
        <tbody>
          <td>分佣金额</td>
          <td colSpan="5">每核销一张券，分佣 <span style={{color: 'red'}}>5</span> 元</td>
        </tbody>
      </table>
      <div style={{textAlign: 'center', marginTop: 15}}>
        <Button type="primary" style={{marginRight: 15}} size="large" onClick={() => { this.confirmPromote(); }}>确认分佣</Button>
        <Button size="large" onClick={() => { this.rejectPromote(); }}>拒绝分佣</Button>
      </div>
    </div>
    </div>);
  }
}

export default ConfigPromote;
