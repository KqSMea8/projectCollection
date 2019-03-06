import React, { PropTypes } from 'react';
import Util from './indexUtil';

const LineGraph = React.createClass({
  propTypes: {
    tradeInfo: PropTypes.array,
    id: PropTypes.string,
    color: PropTypes.string,
    chartKey: PropTypes.string,
    labelOffset: PropTypes.number,
  },

  componentDidMount() {
    this.createGraph();
  },

  componentWillUnmount() {
    this.chart.destroy();
  },

  filterData() {
    return this.props.tradeInfo.map(item => {
      item.biz_value = Util.formateDate(item.biz_value);
      item.trade_amt = parseFloat(item.trade_amt / 100);
      item.trade_cnt = parseFloat(item.trade_cnt);
      return item;
    });
  },

  createGraph() {
    const chart = this.chart = new window.G2.Chart({
      id: this.props.id,
      width: 580,
      height: 230,
    });
    chart.legend(false); // 图例的位置和配置信息
    chart.tooltip({
      map: [{
        name: '交易金额',
        value: 'trade_amt',
      }, {
        name: '交易笔数',
        value: 'trade_cnt',
      }],
    });
    const defs = {
      'biz_value': {
        type: 'time',
        mask: 'mm-dd',
        tickCount: this.props.tradeInfo.length,
      },
      'trade_amt': {
        tickCount: 2,
        alias: '交易金额',
      },
      'trade_cnt': {
        tickCount: 2,
        alias: '交易笔数',
      },
    };
    chart.axis('biz_value', {title: null, tickLine: null});
    chart.axis('trade_amt', {title: null, tickLine: null, line: null, labels: {custom: true}});
    chart.axis('trade_cnt', {title: null, tickLine: null, line: null, labels: {custom: true}});
    chart.source(this.filterData(), defs);

    chart.line().position('biz_value * trade_cnt').color('#73B8FE');
    chart.line().position('biz_value * trade_amt').color('#FF5037');
    chart.render();
  },

  render() {
    return <div {...this.props} ></div>;
  },
});

export default LineGraph;
