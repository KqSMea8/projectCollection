import React from 'react';
import CommonIconPanel from './common/CommonIconPanel';
import ajax from 'Utility/ajax';
import Util from './common/indexUtil';
import { Row, Col, Spin, Icon, message } from 'antd';

const MyMerchantModule = React.createClass({
  getInitialState() {
    return {
      loading: false,
      timeout: false,
      data: {
        'onlineMerchantCnt': 0, // 总在线商户数
        'onlineMerchantCntWr': 0, // 总在线商户数周同比
        'terminateMerchantCnt': 0, // 当面付解约商户数
        'terminateMerchantCntWr': 0, // 当面付解约商户数周同比
        'newMerchantCnt': 0, // 新签约商户数
        'newMerchantCntWr': 0, // 新签约商户数周同比
        'rejectContractCnt': 0, // 驳回合同数
        'expired30dContractCnt': 0, // 合同30天内过期数
        'checkingShopCnt': 0, // 审核中合同数
        'checkSuccessContractCnt': 0, // 审核通过数
        'dataDate': '',
      },
    };
  },

  componentDidMount() {
    ajax({
      'url': '/sale/queryMerchantBizInfo.json',
      'success': (res) => {
        if ( res.status !== 'succeed') {
          this.setState({loading: false});
          return message.error('系统错误，请重试');
        }
        if (res.data) {
          const stateInfo = {};
          Util.loop(res.data, (key, value) => {
            stateInfo[Util.camelCase(key)] = value;
          });
          this.setState({
            dataDate: Util.formateDate(res.data.data_date),
            loading: false,
            data: stateInfo,
          });
        }
      },
    });
    setTimeout(() => {
      if (this.state.loading) {
        this.setState({timeout: true});
      }
    }, 10000);
  },

  render() {
    const {loading, timeout} = this.state;
    if (loading) {
      return <div style={{marginBottom: 19}}><Spin />{timeout ? <div className="kb-index-no-panel"><Icon type="smile"/><span className="kb-index-warn-info">由于您可见的数据范围较大,我们正在努力加载,请耐心等待哦</span></div> : null}</div>;
    }

    return (<div style={{marginBottom: 24}}>
        <h3>我的商户<span className="sub-title">(统计时间：{this.state.dataDate || '暂无法统计'}）</span></h3>
        <Row>
          <Col span="16" style={{'paddingRight': '15px'}}>
            <div className="border-panel kb-merchant-panel kb-store-panel" style={{padding: '24px 0'}}>
                <Row>
                  <Col span="12" className="merchant-list-item icon-item">
                    <CommonIconPanel type="exclamation-circle-o" title="合同驳回数" amount={this.state.data.rejectContractCnt} color="detail-red"/>
                  </Col>
                 <Col span="12" className="merchant-list-item icon-item">
                    <CommonIconPanel type="exclamation-circle-o" title="合同审核中数" amount={this.state.data.checkingContractCnt} color="detail-yellow"/>
                  </Col>
                </Row>
                <Row>
                 <Col span="12" className="merchant-list-item icon-item">
                    <CommonIconPanel type="exclamation-circle-o" title="合同30天内即将过期数" amount={this.state.data.expired30dContractCnt} color="detail-orange"/>
                  </Col>
                  <Col span="12" className="merchant-list-item icon-item">
                    <CommonIconPanel type="check-circle-o" title="审核通过数" amount={this.state.data.checkSuccessContractCnt} color="detail-green"/>
                  </Col>
                </Row>
            </div>
          </Col>
          <Col span="8">
           <div className="border-panel kb-store-panel kb-index-detail-list" style={{padding: '66px 20px'}}>
              <ul>
                <li>
                  <span className="kb-index-item-title">总在线(户)</span> <span className="detail-trend trend-tail"><span className={Util.highlightClass(this.state.data.onlineMerchantCntWr)}>周同比:</span>{Util.formatePercent(this.state.data.onlineMerchantCntWr)}</span><span className="kb-index-item-detail">{this.state.data.onlineMerchantCnt || '暂无数据'}</span>
                </li>
                <li>
                  <span className="kb-index-item-title">当面付解约(户)</span> <span className="detail-trend trend-tail"><span className={Util.highlightClass(this.state.data.terminateMerchantCntWr)}>周同比:</span>{Util.formatePercent(this.state.data.terminateMerchantCntWr)}</span><span className="kb-index-item-detail">{this.state.data.terminateMerchantCnt || '暂无数据'}</span>
                </li>
                <li>
                  <span className="kb-index-item-title">新签约(户)</span> <span className="detail-trend trend-tail"><span className={Util.highlightClass(this.state.data.newMerchantCntWr)}>周同比:</span>{Util.formatePercent(this.state.data.newMerchantCntWr)}</span><span className="kb-index-item-detail">{this.state.data.newMerchantCnt || '暂无数据'}</span>
                </li>
              </ul>
              </div>
         </Col>
        </Row>
  </div>);
  },
});

export default MyMerchantModule;
