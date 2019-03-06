import React from 'react';
import ajax from 'Utility/ajax';
import { message, Icon, Spin } from 'antd';
import Util from './common/indexUtil';
import IndustryAnalysisTable from './common/IndustryAnalysisTable';
import IndustryAnalysisChart from './common/IndustryAnalysisChart';

const IndustryAnalysisModule = React.createClass({
  getInitialState() {
    return {
      loading: true,
      timeout: false,
      tableData: [],
      type: 'shop_cnt',
      tradeName: '',
      tradeNames: [],
    };
  },

  componentDidMount() {
    const self = this;
    self.gainData();
  },

  gainData() {
    ajax({
      'url': '/sale/queryIndustryBizInfo.json',
      'success': (res) => {
        if ( res.status !== 'succeed') {
          this.setState({loading: false});
          return message.error('系统错误，请重试');
        }
        const dataSource = this.dataSource = res.data.cate_2_stat_info;
        const refreshState = {...this.dealData(Object.keys(dataSource)[0]), loading: false, dataDate: Util.formateDate(res.data.data_date), tradeKeys: Object.keys(dataSource)};
        this.setState(refreshState);
      },
    });
    setTimeout(() => {
      if (this.state.loading) {
        this.setState({timeout: true});
      }
    }, 10000);
  },

  dealData() {
    const dataCollection = {};
    const allCollection = [];
    const tradeNames = ['全部品类'];

    this.dataSource.forEach((item) => {
      const itemInfo = {...item};
      const tradeName = item.cat_1_name;
      if (itemInfo.cat_level === '2') {
        if (dataCollection[tradeName]) {
          dataCollection[tradeName].push(itemInfo);
        } else {
          dataCollection[tradeName] = [itemInfo];
          tradeNames.push(tradeName);
        }
      } else if (itemInfo.cat_level === '1') {
        itemInfo.cat_2_name = itemInfo.cat_1_name;
        allCollection.push(itemInfo);
      }
    });

    dataCollection['全部品类'] = allCollection;
    this.dataCollection = dataCollection;
    const tradeName = tradeNames[0];
    const tableData = dataCollection[tradeName] || [];
    return {
      tableData: tableData,
      type: 'shop_cnt',
      tradeNames: tradeNames,
      tradeName: tradeName,
    };
  },

  changeChartTrade(tradeName) {
    this.setState({
      tableData: this.dataCollection[tradeName],
      tradeName: tradeName,
    });
  },

  changeChartType(type) {
    this.setState({type});
  },

  render() {
    const {loading, timeout} = this.state;
    if (loading) {
      return <div style={{marginBottom: 19}}><Spin />{timeout ? <div className="kb-index-no-panel"><Icon type="smile"/><span className="kb-index-warn-info">由于您可见的数据范围较大,我们正在努力加载,请耐心等待哦</span></div> : null}</div>;
    }

    const chartColor = this.state.tableData.map((item, index) => { return ['#61A5E8', '#7ECF51', '#EECB5F', '#E4925D', '#E16757', '#ff6600', '#b01111', '#ac5724', '#572d8a', '#333333', '#7bab12', '#c25e5e', '#a6c96a', '#133960', '#2586e7'][index] || Util.randomColor();});
    return (<div style={{marginBottom: 24}}>
      <h3>品类分析<span className="sub-title">(统计时间：{this.state.dataDate || '暂无法统计'}）</span></h3>
      {!this.state.tableData || !this.state.tableData.length ? <div className="border-panel" style={{color: '#ccc', 'fontSize': '16px', 'lineHeight': '120px', 'textAlign': 'center'}}>暂无数据</div> :
      (<div className="trade-panel border-panel pad-panel kb-index-table" style={{padding: '48px 24px 0'}}>
        <IndustryAnalysisTable tableData={this.state.tableData} tradeName={this.state.tradeName} tradeNames={this.state.tradeNames} tradeKeys={this.state.tradeKeys} type={this.state.type} color={chartColor} changeChartType={this.changeChartType} changeChartTrade={this.changeChartTrade}/>
        <IndustryAnalysisChart tableData={this.state.tableData} type={this.state.type} color={chartColor}/>
      </div>) }
    </div>);
  },
});

export default IndustryAnalysisModule;
