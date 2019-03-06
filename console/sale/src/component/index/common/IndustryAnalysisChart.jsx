import React, { PropTypes} from 'react';

const IndustryAnalysisChart = React.createClass({
  propTypes: {
    tableData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    color: PropTypes.array,
    type: PropTypes.string,
  },

  componentDidMount() {
    const self = this;
    if (!self.chart) {
      self.chart = new window.G2.Chart({
        id: 'anayChart',
        width: 367,
        height: 344,
      });

      self.chart.coord('theta');
      self.chart.legend('cat_2_name', false);
      self.chart.tooltip(false);
    }
    this.refresh();
  },

  componentDidUpdate() {
    this.refresh();
  },

  componentWillUnmount() {
    this.chart.destroy();
  },

  refresh() {
    const {tableData, color, type} = this.props;
    if (tableData) {
      const showedData = this.dealData();
      this.chart.clear();
      this.chart.source(showedData);
      this.chart
      .intervalStack()
      .position(window.G2.Stat.summary.percent(type))
      .color('cat_2_name', color.slice(0, showedData.length))
      .label('cat_2_name', {custom: true, renderer: this.formater, labelLine: true, offset: 100, labelHeight: 100});
      this.chart.render();
    }
  },

  dealData() {
    const {tableData, type} = this.props;
    const tableCollections = tableData.map(item => {
      item[type] = parseFloat(item[type]);
      return item;
    });
    return tableCollections;
  },

  formater(text, item) {
    const point = item.point; // 每个弧度对应的点
    let percent = point['..percent']; // ..proportion 字段由Stat.summary.proportion统计函数生成
    percent = (percent * 100).toFixed(2) + '%';
    return '<span class="" style="white-space:nowrap;">' + text + '</span><br><span style="color:' + point.color + '">' + percent + '</span>';
  },

  render() {
    return <div id="anayChart" className="trade-chart"></div>;
  },
});

export default IndustryAnalysisChart;

