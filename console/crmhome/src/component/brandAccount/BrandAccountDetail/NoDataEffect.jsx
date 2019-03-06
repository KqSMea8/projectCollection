import React from 'react';

/**
 * 无数据 默认 显示
 */
class NoDataEffect extends React.Component {
  render() {
    return (
      <div className="nodata-effect">
        <img src="https://gw.alipayobjects.com/zos/rmsportal/fRKafDNJQywCQaVVmNCc.png"/>
        <p>暂无{this.props.name}</p>
        <span>请添加{this.props.name}</span>
      </div>
    );
  }
}

export default NoDataEffect;
