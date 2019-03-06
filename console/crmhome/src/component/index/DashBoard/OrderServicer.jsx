import {Button, Icon} from 'antd';
import React, {PropTypes} from 'react';
import {briefNum} from '../../../common/utils';

const OrderServicer = React.createClass({
  propTypes: {
    data: PropTypes.object,
    handleHide: PropTypes.func,
  },

  orderInstant() {
    this.props.handleHide();
    window.location.href = this.props.data.orderUrl;  // eslint-disable-line no-location-assign
  },

  render() {
    const {logoUrl, title, subtitle, score, orderCount} = this.props.data;
    const rateVal = Math.round(Number(score));
    const rateInfo = Array.from({length: 5}, (_, i) => {
      return i < rateVal ? <Icon type="star" key={i} /> : <Icon type="star-o" key={i} />;
    });
    return (<div className="service-item kb-precise-service">
      <div className="logo-container">
        <img src={logoUrl} />
      </div>
      <div className="text-ellipsis">{title}</div>
      <div className="sub-text text-ellipsis">{subtitle}</div>
      <div><span style={{paddingRight: 5}}>{score}</span><span className="rate-text">{rateInfo}</span></div>
      <div className="sub-text">订购数: {briefNum(orderCount, true)}</div>
      <div><Button type="primary" size="large" onClick={this.orderInstant}>立即订购</Button></div>
	</div>
   );
  },
});

export default OrderServicer;
