import React, { PropTypes} from 'react';
import Util from './indexUtil';
import {Dropdown, Menu, Icon, Table} from 'antd';

const TradingTrendTable = React.createClass({
  propTypes: {
    dataSource: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  },

  getInitialState() {
    return {
      type: 'BRAND',
    };
  },

  gainType(e) {
    this.setState({type: e.target.name});
  },

  gainConfigfrom(type) {
    const categoryList = Object.keys(this.props.dataSource);
    let categoryType;
    if (categoryList.indexOf(type) === -1) {
      categoryType = categoryList[0];
    } else {
      categoryType = type;
    }
    const titleConfig = {'BRAND': '品牌', 'PROVIDER': '服务商', 'SHOP': '门店'};
    const linkConfig = {
      'BRAND': window.APP.mdataprodUrl + '/midoffice/index.htm#/data/midoffice_pc_brand_analysis',
      'PROVIDER': window.APP.mdataprodUrl + '/midoffice/index.htm#/data/midoffice_pc_provider_analysis',
      'SHOP': window.APP.mdataprodUrl + '/midoffice/index.htm#/data/midoffice_pc_shop_analysis'};
    return { title: titleConfig[categoryType], data: this.dealData(this.props.dataSource[categoryType]), link: linkConfig[categoryType]};
  },

  dealData(data = []) {
    return data.map((item, index) => {
      const {trade_cnt, trade_amt} = item;
      return {
        'biz_value': <span><span className="trade-index">{index + 1}</span>{item.biz_value}</span>,
        'trade_cnt': Util.formateCash(trade_cnt),
        'trade_amt': Util.formateCash(trade_amt, true),
      };
    });
  },

  createTableHeader(headTitle) {
    const titleConfig = {'BRAND': '品牌', 'PROVIDER': '服务商', 'SHOP': '门店'};
    const categoryList = Object.keys(this.props.dataSource);

    const menu = (<Menu>
      {categoryList.map((item, index) => {
        return (<Menu.Item key={index}>
          <a onClick={this.gainType} name={item}>{titleConfig[item]}</a>
        </Menu.Item>);
      })}
    </Menu>);
    const DropTitle = categoryList.length > 1 ? (<Dropdown overlay={menu}>
      <a className="ant-dropdown-link">
         {headTitle} <Icon type="down" />
      </a>
      </Dropdown>) :
    (<span name={categoryList[0]}>{titleConfig[categoryList[0]]}</span>);

    return [{
      title: DropTitle,
      width: 33,
      dataIndex: 'biz_value',
      render: (text) => {
        return <div className="detail-ellipsis" style={{'maxWidth': '115px'}}>{text}</div>;
      },
    }, {
      title: <div style={{textAlign: 'right'}}> 交易笔数(笔) </div>,
      width: 33,
      dataIndex: 'trade_cnt',
      render: (text) => {
        return <div className="detail-ellipsis" style={{textAlign: 'right'}}>{text}</div>;
      },
    }, {
      title: <div style={{textAlign: 'right'}}> 交易金额(元) </div>,
      width: 33,
      dataIndex: 'trade_amt',
      render: (text) => {
        return <div className="detail-ellipsis" style={{textAlign: 'right'}}>{text}</div>;
      },
    }];
  },

  render() {
    const {title, data, link} = this.gainConfigfrom(this.state.type);
    const columns = this.createTableHeader(title);
    return (<div className="trend-table kb-index-table" style={{width: 'calc(100% - 604px)'}}>
      <span className="panel-title" style={{marginLeft: 0}}>交易笔数 <span className="panel-title-num">TOP5</span><a href={link} style={{float: 'right', fontSize: '12px', lineHeight: '36px'}}>更多</a></span>
      <Table style={{marginTop: 20}} columns={columns} rowKey={(r, index) => index} dataSource={data} pagination={false} />
      </div>);
  },
});

export default TradingTrendTable;
