import React, { PropTypes} from 'react';
import Util from './indexUtil';
import {Dropdown, Menu, Icon, Table, Select} from 'antd';
const Option = Select.Option;
// const Option = Select.Option;

const IndustryAnalysis = React.createClass({
  propTypes: {
    tableData: PropTypes.array,
    changeChartType: PropTypes.func,
    changeChartTrade: PropTypes.func,
    chartColor: PropTypes.array,
    tradeKeys: PropTypes.array,
    tradeNames: PropTypes.array,
    tradeName: PropTypes.string,
    type: PropTypes.string,
    color: PropTypes.array,
  },

  getDefaultProps() {
    return {};
  },

  getTitle() {
    const titleConfig = {'shop_cnt': '门店数', 'trade_cnt': '交易数', 'trade_amt': '交易金额'};
    return titleConfig[this.props.type];
  },

  gainType(e) {
    const key = e.target.name;
    if (this.props.type !== key) {
      this.props.changeChartType(key);
    }
  },

  gainTrade(index, name) {
    if (name !== this.props.tradeName) {
      this.props.changeChartTrade(name);
    }
  },

  createTableHeader() {
    const {tableData, type} = this.props;
    // const hasCategoryMenu = tradeKeys && tradeKeys.length > 1;
    const hasTradeMenu = tableData && tableData[0] && Object.keys(tableData[0]).length > 3;

    const menu = (<Menu>
      <Menu.Item>
        <a onClick={this.gainType} name="shop_cnt">门店数</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={this.gainType} name="trade_cnt">交易数</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={this.gainType} name="trade_amt">交易金额</a>
      </Menu.Item>
    </Menu>);

    const categoryMenuList = this.props.tradeNames.map((item, index) => {
      return <Option key={index}>{item}</Option>;
    });

    const categoryMenu = <Select style={{width: '120px'}} onChange={this.gainTrade} defaultValue={this.props.tradeName}>{categoryMenuList}</Select>;

    const tradeMenu = hasTradeMenu ? (<Dropdown overlay={menu}>
          <a className="ant-dropdown-link">{this.getTitle()}<Icon type="down" /></a>
        </Dropdown>) : '门店数';

    return [{
      title: categoryMenu,
      dataIndex: 'cat_2_name',
      width: 10,
      render(text, record) {
        return <div className="detail-ellipsis" style={{'maxWidth': '115px'}}><span className="table-cell-legend" style={{background: record.color}}></span><span>{ text }</span></div>;
      },
    }, {
      title: tradeMenu,
      width: 120,
      dataIndex: type,
      render(text) {
        return <span>{Util.formateCash(text, type === 'trade_amt')}</span>;
      },
    }, {
      title: '笔单价',
      width: 100,
      dataIndex: 'avg_price',
      render(text) {
        return <span>{text}</span>;
      },
    }];
  },

  dealData() {
    const {tableData, color} = this.props;
    const data = [...tableData];
    let dataCollections;
    if (data && data.length) {
      dataCollections = data.map((item, index) => {
        const itemInfo = {...item};
        itemInfo.color = color[index];
        itemInfo.key = index;
        itemInfo.avg_price = Util.formateCash(itemInfo.avg_price, true);
        return itemInfo;
      });
    }
    return dataCollections;
  },

  render() {
    const tableData = this.dealData();
    const columns = this.createTableHeader();
    return (<div className="trade-table">
      <Table style={{minHeight: 200}} columns={columns} rowKey={r => r.cat_2_id || r.cat_1_id} dataSource={tableData} pagination={false} />
      </div>);
  },
});

export default IndustryAnalysis;
