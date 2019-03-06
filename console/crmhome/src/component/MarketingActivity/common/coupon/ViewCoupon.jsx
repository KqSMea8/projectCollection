import React, {PropTypes} from 'react';
import ViewCouponModal from './ViewCouponModal';
import {couponType, couponStyle} from './util';

const Index = React.createClass({
  propTypes: {
    value: PropTypes.object,
  },

  getInitialState() {
    return {
      showModal: false,
    };
  },

  showModal(e) {
    e.preventDefault();
    this.setState({
      showModal: true,
    });
  },

  hideModal() {
    this.setState({
      showModal: false,
    });
  },
  /*eslint-disable */
  render() {
    /*eslint-enable */
    const {value} = this.props;
    const count = value.sendNum;
    const {showModal} = this.state;
    const promotionType = value.promotionType;
    let type = value.type;
    if (promotionType === 'ALL_ITEM' && type === 'MONEY') {
      type = 'ALL_MONEY';
    } else if (promotionType === 'SINGLE_ITEM') {
      if (type === 'RATE') {
        type = 'ONE_RATE';
      } else if (type === 'MONEY') {
        type = 'ONE_MONEY';
      } else if (type === 'REDUCETO') {
        type = 'ONE_MONEY_REDUCETO';
      }
    }
    const data = {
      ...value,
      customType: type,
    };
    if (data.consumeSendType === 3) {
      couponStyle.marginTop = 8;
    }
    const voucherCard = (<span style={couponStyle}>
      {type === 'ALL_MONEY' && data.worthValue + '元'}
      {type === 'ONE_RATE' && data.rate + '折'}
      {(type === 'ONE_MONEY' || type === 'ONE_MONEY_REDUCETO') && data.promotionRule}
      {type === 'EXCHANGE' && data.name}
      <br/>
      {couponType[type]}
    </span>);
    const consumeRuleStyle = {
      display: 'inline-block',
      width: 130,
      textAlign: 'right',
    };
    return (<div>
      {data.consumeSendType === 3 ? (<div style={{width: '510px', height: '60px', backgroundColor: '#ececec', marginBottom: '2px'}}>
        <span style={{display: 'inline-block', marginTop: '15px', marginLeft: '15px'}}>
          阶梯{data.index + 1}：{data.minimumAmount ? `消费满${data.minimumAmount}元，` : '消费即'}送{data.sendNum}张
        </span>
        {voucherCard}
        <a href="#" style={{marginLeft: 16}} onClick={this.showModal}>查看</a>
      </div>) : ''}
      {data.consumeSendType === 1 ? (<div>
        <span>每次送</span>
        {voucherCard}
        <span style={{marginLeft: 8}}>{count}张</span>
        <a href="#" style={{marginLeft: 16}} onClick={this.showModal}>查看</a>
      </div>) : ''}
      {data.consumeSendType === 2 ? (<div style={{marginBottom: '16px'}}>
        {data.minimumAmount ? <span style={consumeRuleStyle}>{data.index === 0 ? `消费满${data.minimumAmount}元，` : ''} 送{data.sendNum}张</span> : <span style={consumeRuleStyle}>{data.index === 0 ? '消费即' : ''}送{data.sendNum}张</span>}
        {voucherCard}
        <a href="#" style={{marginLeft: 16}} onClick={this.showModal}>查看</a>
      </div>) : ''}
      {showModal ? <ViewCouponModal data={data} onCancel={this.hideModal}/> : null}
    </div>);
  },
});

export default Index;
