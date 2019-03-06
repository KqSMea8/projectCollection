import React, { PropTypes} from 'react';
import classname from 'classnames';
import Util from './indexUtil';

const CommonPercent = React.createClass({
  propTypes: {
    title: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    percent: PropTypes.node,
    percentTitle: PropTypes.string,
    isPercent: PropTypes.bool,
  },

  render() {
    const { title, amount, percent, percentTitle, isPercent } = this.props;
    const percentH = 78 * Math.abs(percent);
    const analysisLink = `${window.APP.mdataprodUrl}/midoffice/index.htm#/data/midoffice_pc_shop_analysis`;
    return (<div>
          <div className="progress-bar">
            <div className={classname('progress-line', {'orange_bg': percent > 0, 'green_bg': percent < 0})} style={{height: percentH + 'px', marginTop: (78 - percentH) + 'px'}}>
            </div>
          </div>
          <div className="progress-desc">
            <span className="detail-trend"><span className={Util.highlightClass(percent)}>{percentTitle}</span>{Util.formatePercent(percent)}</span>
            <a href={analysisLink}><div className="detail-mid-num detail-ellipsis" style={{width: '100px', 'color': '#666'}}>{Util.formateCash(amount)}{isPercent && parseFloat(amount) ? '%' : ''}</div></a>
            <div className="detail-explain" style={{lineHeight: '20px'}}>{title}</div>
          </div>
    </div>);
  },
});

export default CommonPercent;

