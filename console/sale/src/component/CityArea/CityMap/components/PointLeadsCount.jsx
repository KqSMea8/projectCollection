import React from 'react';
import { Tooltip, Icon } from 'antd';
import PointCountText from './PointShopCountText';
import './PointShopCount.less';

export default class PointShopCount extends React.Component {

  static propTypes = {
    cityCode: React.PropTypes.string,
    bizType: React.PropTypes.string,
    category: React.PropTypes.string,
    pointChooseValue: React.PropTypes.array,
    positions: React.PropTypes.array,
  };

  render() {
    const { cityCode, bizType, category, pointChooseValue, positions } = this.props;
    return (<div className={`PointShopCount ${this.props.className}`} style={this.props.style}>
      <div>
        指标leads数
        <Tooltip title="指网格中符合当前已筛选的指标数据">
          <Icon className="icon_qus" type="question-circle-o" />
        </Tooltip>
      </div>
      <div className="text_value">
        <PointCountText cityCode={cityCode} category={category} bizType={bizType}
          pointChooseValue={pointChooseValue} positions={positions} filterShopType="LEADS" />
      </div>
    </div>);
  }
}
