import React, { PropTypes} from 'react';
import Util from './indexUtil';

const TradingTrendTable = React.createClass({
  propTypes: {
    title: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit: PropTypes.string,
    percentTitle: PropTypes.string,
    percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    link: PropTypes.string,
    isCash: PropTypes.bool,
  },

  render() {
    const {title, amount, percentTitle, percent, link, isCash} = this.props;
    return (<div>
            <a href={link}><div className="detail-ellipsis detail-data-info">{Util.formateCash(amount, isCash)}</div></a>
            <div>
              <span className="detail-title shop-title" style={{width: '50%', display: 'inline-block'}}>{title}<span style={{fontSize: '12px', color: '#ccc'}}></span></span>
              {percentTitle ? <span className="detail-trend trend-tail"><span className={Util.highlightClass(percent)}>{percentTitle}</span>{Util.formatePercent(percent)}</span> : null}
            </div>
          </div>);
  },
});

export default TradingTrendTable;
