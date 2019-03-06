import React, { PropTypes} from 'react';
import Util from './indexUtil';
import { Icon } from 'antd';

const CommonIconPanel = React.createClass({
  propTypes: {
    type: PropTypes.string,
    iconTitle: PropTypes.string,
    title: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    percentTitle: PropTypes.string,
    link: PropTypes.string,
    color: PropTypes.string,
  },

  render() {
    const {type, iconTitle, title, amount, percent, percentTitle, link} = this.props;
    const titleInfo = link ? <a href={link}><div className="detailnum detail-ellipsis" style={{width: '155px'}}>{Util.formateCash(amount)}</div></a> : <div className="detail-ellipsis" style={{width: '155px'}}>{Util.formateCash(amount)}</div>;
    return (<div>
        <div style={{display: 'inline-block'}}>
          {type ? <Icon type={type} className={`icon ${this.props.color}`}/> : <div className="icon-item-desc icon-legend"><div>{iconTitle.substr(0, iconTitle.length - 3)}</div><div className="detail-trend">{iconTitle.substr(-3)}</div></div>}
          <div className="icon-item-desc">
            {titleInfo}
            {title ? <div className="detail-title detail-ellipsis">{title}</div> : null}
            {percentTitle ? <span className="detail-trend"><span className={Util.highlightClass(percent)}>{percentTitle}</span>{Util.formatePercent(percent)}</span> : null}
          </div>
        </div>
    </div>);
  },
});

export default CommonIconPanel;

