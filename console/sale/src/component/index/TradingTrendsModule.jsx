import React from 'react';
import ajax from 'Utility/ajax';
import LineGraph from './common/indexLineGraph';
import TradingTrendTable from './common/TradingTrendTable';
import Util from './common/indexUtil';
import { Spin, message, Icon } from 'antd';

const TradingTrendsModule = React.createClass({
  getInitialState() {
    return {
      loading: true,
      tableData: {},
      dataDate: '',
      timeout: false,
    };
  },

  componentDidMount() {
    ajax({
      'url': '/sale/queryTradeBizInfo.json',
      'success': (res) => {
        if ( res.status !== 'succeed') {
          return message.error('系统错误，请重试');
        }
        this.setState({
          'loading': false,
          'avePrivce': this.avePrivce(res.data.trade_trend_7d),
          'tradeInfo': res.data.trade_trend_7d,
          'tableData': res.data.top_stat_info,
          'dataDate': Util.formateDate(res.data.data_date),
        });
      }, error: () => {
        this.setState({
          loading: false,
        });
      },
    });
    setTimeout(() => {
      if (this.state.loading) {
        this.setState({timeout: true});
      }
    }, 10000);
  },

  avePrivce(data) {
    const sumPrice = (data.reduce((prev, next) => {
      return prev + parseFloat(next.trade_cnt);
    }, 0));
    return Util.formateCash(sumPrice / data.length);
  },

  render() {
    const {avePrivce, tradeInfo, tableData = [], loading, timeout} = this.state;
    const tableCollection = {};
    Object.keys(tableData).forEach(item => {
      if (item && tableData[item] && tableData[item].length) {
        tableCollection[item] = [...tableData[item]];
      }
    });
    const noChartRes = !tradeInfo || !tradeInfo.length;
    const noTableRes = !Object.keys(tableCollection).length;
    if (loading) {
      return <div><Spin />{timeout ? <div className="kb-index-no-panel"><Icon type="smile"/><span className="kb-index-warn-info">由于您可见的数据范围较大,我们正在努力加载,请耐心等待哦</span></div> : null}</div>;
    }
    return (<div style = {{marginBottom: 8}}>
        <div style = {{clear: 'both'}}>
          <h3> 交易趋势 <span className="sub-title">(统计时间：过去7天）</span></h3>
        </div>
        {noChartRes && noTableRes ?
        (<div className="border-panel" style={{color: '#ccc', 'fontSize': '16px', 'lineHeight': '120px', 'textAlign': 'center'}}>暂无数据</div>)
        : (<div className="pad-panel border-panel" style={{paddingTop: 20, paddingBottom: 20, minHeight: '240px'}}>
            <div style={{display: 'inline-block'}}>
                <div className="panel-title"><span style={{color: '999'}}>日均交易笔数: </span>{avePrivce ? <span><em className="detail-ellipsis panel-title-num" >{avePrivce}</em> 笔</span> : <span style={{'lineHeight': '27px', 'display': 'inline-block', 'verticalAlign': 'bottom', 'fontSize': '24px'}}>暂无数据</span>}</div>
                {noChartRes ? <div className="noLineRes">暂无数据</div> :
                  (<div className="kb-chart-group" style={{marginTop: 8}}>
                    <LineGraph id="tradeChart" tradeInfo={tradeInfo} />
                    <span className="chart-legend-left"><span className="table-cell-legend" style={{ background: '#FF5037'}}></span>交易金额</span>
                    <span className="chart-legend-right"><span className="table-cell-legend" style={{ background: '#73B8FE'}}></span>交易笔数</span>
                  </div>)
                }
            </div>
            {!noTableRes ? <TradingTrendTable dataSource={tableCollection} /> : <div style={{display: 'inline-block', width: 'calc(100% - 604px)', 'textAlign': 'center', 'paddingTop': 120, 'verticalAlign': 'top'}}><div>暂无数据</div></div>}
            <div style={{clear: 'both'}}></div>
          </div>)}
        </div>);
  },
});

export default TradingTrendsModule;
