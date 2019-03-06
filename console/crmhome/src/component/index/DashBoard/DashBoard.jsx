import React, {PropTypes} from 'react';
import CountUp from '../common/CountUp';
import {Icon} from 'antd';

const DashBoard = React.createClass({
  propTypes: {
    items: PropTypes.array,
    detailCb: PropTypes.func,
  },

  render() {
    const {items, detailCb} = this.props;
    const typeArr = ['memberDataInfo', 'profitDataInfo', 'activityDataInfo'];
    const dataItems = items.map((v, i) => {
      const sub1 = v.subArr[0];
      const sub2 = v.subArr[1];
      return (<div className="item" key={i} style={i === 2 ? {marginRight: 0} : {}}>
        <p className="info">
          {v.mainInfo}
          <Icon className="question-badge" type="question-circle" onClick={() => detailCb.call(this, typeArr[i])} />
        </p>
        <p className="main-num" data-num={v.mainNum} data-name={v.mainInfo}><CountUp useGrouping decimals={ v.mainInfo.indexOf('元') > -1 ? 2 : 0 }>{v.mainNum || 0}</CountUp></p>
        {v.moreLink ? <p className="more-link"><a href={v.moreLink}>查看详情</a></p> : null}
        <div className="column-bar" >
          <div className="column-item column-item-l" style={i === 1 ? {width: 130} : {}}>
            <p className="detail-info">{sub1.info}</p>
            <p className="detail-num" data-num={sub1.num} data-name={sub1.info}><CountUp useGrouping decimals={ sub1.info.indexOf('元') > -1 ? 2 : 0 }>{sub1.num || 0}</CountUp></p>
          </div>
          <div className="column-item">
            <p className="detail-info">{sub2.info}</p>
            <p className="detail-num" data-num={sub2.num} data-name={sub2.info}><CountUp useGrouping decimals={ sub2.info.indexOf('元') > -1 ? 2 : 0 }>{sub2.num || 0}</CountUp></p>
          </div>
        </div>
      </div>);
    });

    return (
      <div className="index-dashboard-wrap">
        <div className="index-title">
          <div className="kb-form-sub-title-icon"></div>
          我的运营数据
          <p className="index-sub-title">订购专属服务，监测更多运营数据</p>
        </div>
        <div className="index-dashboard-container">
          {dataItems}
        </div>
      </div>
    );
  },
});

export default DashBoard;
