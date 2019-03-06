import React, {PropTypes} from 'react';
import {Modal} from 'antd';
import AllMoneyTable from './AllMoneyTable';
import OneRateTable from './OneRateTable';
import OneMoneyTable from './OneMoneyTable';
import ExchangeTable from './ExchangeTable';
import {couponType} from './util';

const ViewCouponModal = React.createClass({
  propTypes: {
    data: PropTypes.object,
    onCancel: PropTypes.func,
  },

  render() {
    const {data} = this.props;
    const type = data.customType;
    const newData = {
      ...data,
      type: couponType[type],
    };
    return (<Modal title="查看详情" visible footer="" onCancel={this.props.onCancel}>
      {type === 'ALL_MONEY' && <AllMoneyTable data={newData}/>}
      {type === 'ONE_RATE' && <OneRateTable data={newData}/>}
      {(type === 'ONE_MONEY' || type === 'ONE_MONEY_REDUCETO') && <OneMoneyTable data={newData}/>}
      {type === 'EXCHANGE' && <ExchangeTable data={newData} />}
    </Modal>);
  },
});

export default ViewCouponModal;
