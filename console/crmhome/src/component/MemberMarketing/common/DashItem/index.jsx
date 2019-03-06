import React, {PropTypes} from 'react';
import CountUp from '../../../index/common/CountUp';

const DashItem = React.createClass({
  propTypes: {
    items: PropTypes.array,
  },

  render() {
    const {items} = this.props;
    const dataItems = items.map((v, i) => {
      const sub1 = v.subArr[0];
      const sub2 = v.subArr[1];
      return (<div className="item" key={i} style={i === 2 ? {marginRight: 0} : {}}>
        <p className="info">
          {v.mainInfo}
        </p>
        <p className="main-num" data-num={v.mainNum} data-name={v.mainInfo}><CountUp useGrouping decimals={ v.mainInfo.indexOf('元') > -1 ? 2 : 0 }>{v.mainNum || 0}</CountUp></p>
        {v.moreLink ? <p className="more-link"><a href={v.moreLink}>查看详情</a></p> : null}
        <div className={sub2 ? 'column-bar' : 'column-bar column-center'} >
          {
            sub1 ? (
              <div className={ sub2 ? 'column-item column-item-l' : 'column-item'}>
                <p className="detail-info">{sub1.info}</p>
                <p className="detail-num" data-num={sub1.num} data-name={sub1.info}><CountUp useGrouping decimals={ sub1.info.indexOf('元') > -1 ? 2 : 0 }>{sub1.num || 0}</CountUp></p>
              </div>
            ) : null
          }
          {
            sub2 ? (
              <div className="column-item">
                <p className="detail-info">{sub2.info}</p>
                <p className="detail-num" data-num={sub2.num} data-name={sub2.info}><CountUp useGrouping decimals={ sub2.info.indexOf('元') > -1 ? 2 : 0 }>{sub2.num || 0}</CountUp></p>
              </div>
            ) : null
          }
        </div>
      </div>);
    });

    return (
      <div>
        {dataItems}
      </div>
    );
  },
});

export default DashItem;
