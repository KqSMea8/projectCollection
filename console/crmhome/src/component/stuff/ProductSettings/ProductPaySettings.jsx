import React from 'react';
import { Table, message } from 'antd';
import ajax from '../../../common/ajax';
import ProductPaySettingsModal from './ProductPaySettingsModal';

const status = {
  CLOSED: '已关闭',
  OPENED: '已开通',
};

const ProductPaySettings = React.createClass({
  getInitialState() {
    const payColumns = [
      {title: '渠道名称', dataIndex: 'channelName'},
      {
        title: '费率',
        dataIndex: 'value',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 200,
        render: (text)=> {
          return status[text];
        },
      },
      {
        title: '操作',
        dataIndex: '',
        width: 150,
        render: (text, record = {}) => {
          return (
            <span>
              {
                record.channelCode !== 'FC' ? '--' : (record.status && <ProductPaySettingsModal onOk={this.onOk} listData = {record} />)
              }
            </span>
          );
        },
      },
    ];
    const signColumns = [
      {title: '产品名称', dataIndex: 'prodName'},
      {
        title: '签约订单',
        dataIndex: 'arrangementNo',
        width: 210,
      },
      {
        title: '期限',
        dataIndex: 'gmtEnd',
        width: 200,
      },
      {
        title: '签约时间',
        dataIndex: 'gmtSign',
        width: 200,
      },
      {
        title: '操作',
        dataIndex: '',
        width: 150,
        render: () => {
          return <div><a href="https://render.alipay.com/p/f/fd-iuid3m48/index.html" target="_blank">查看协议</a></div>;
        },
      },
    ];
    return {
      payColumns,
      signColumns,
      payData: [],
      signData: [],
      payLoading: true,
      signLoading: true,
    };
  },

  componentWillMount() {
    this.fetch();
  },

  onOk(data = {}, operation) {
    if (data.securityId) {
      let url;
      if (operation === 'close') {
        url = '/goods/itempromo/closePayChannel.json';
      } else if (operation === 'open') {
        url = '/goods/itempromo/openPayChannel.json';
      }
      ajax({
        url: url,
        method: 'get',
        type: 'json',
        data: data,
        success: (result = {}) => {
          if (result.status === 'succeed') {
            this.fetch();// 如果成功之后则刷新页面
            message.success(result.data, 3);
          } else {
            message.error(result.resultMsg, 3);
          }
        },
        error: (result = {}) => {
          message.error(result.resultMsg, 3);
        },
      });
    }
  },

  fetch() {
    this.setState({
      payLoading: true,
      signLoading: true,
    });
    ajax({
      url: '/goods/itempromo/queryPayChannelList.json',
      method: 'get',
      type: 'json',
      success: (result = {}) => {
        if (result.status === 'succeed') {
          this.setState({
            payLoading: false,
            payData: result.data || [],
          });
        } else {
          this.setState({
            payLoading: false,
          });
        }
      },
      error: (errorObj = {}) =>{
        message.error(errorObj.resultMsg, 3);
        this.setState({
          payLoading: false,
        });
      },
    });
    ajax({
      url: '/goods/itempromo/queryArrangementInfo.json',
      method: 'get',
      type: 'json',
      success: (result = {}) => {
        if (result.status === 'succeed') {
          this.setState({
            signLoading: false,
            signData: result.data || [],
          });
        } else {
          this.setState({
            signLoading: false,
          });
        }
      },
      error: (errorObj = {}) => {
        message.error(errorObj.resultMsg, 3);
        this.setState({
          signLoading: false,
        });
      },
    });
  },

  render() {
    const {payColumns, signColumns, payLoading, signLoading, payData, signData} = this.state;
    return (
      <div>
        <h3 className="crm-productSettings-sub-title">
          <div className="crm-productSettings-sub-title-icon"></div>
          <span className="crm-productSettings-sub-title-text">商品支付渠道设置</span>
          <div className="crm-productSettings-sub-title-line"></div>
        </h3>
        <Table columns={payColumns}
          dataSource={payData}
          rowKey={r => r.channelCode}
          loading={payLoading}
          pagination= {false}
          bordered />
        <h3 className="crm-productSettings-sub-title">
          <div className="crm-productSettings-sub-title-icon"></div>
          <span className="crm-productSettings-sub-title-text">签约信息</span>
          <div className="crm-productSettings-sub-title-line"></div>
        </h3>
        <Table columns={signColumns}
          dataSource={signData}
          rowKey={r => r.arrangementNo}
          loading = {signLoading}
          pagination= {false}
          bordered />
        <div style={{marginTop: '20px'}}>
          <p>【提示】：</p>
          <p>1. 当前展示费率为<span style={{color: 'red'}}>优惠费率，至2018年6月30日。</span></p>
          <p>2. 本页设置仅影响消费者购买你店铺线上商品（宝贝）时的支付方式。</p>
          <p>3. 商品支付渠道指用户购买你的店铺线上商品（宝贝）时，可以使用的支付方式，通常包含银行卡、信用卡等。</p>
          <p>4. 服务费将在消费者到店使用商品后收取，以使用金额为基础。</p>
        </div>
      </div>
    );
  },
});

export default ProductPaySettings;
