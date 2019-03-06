import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import {Divider} from '@alipay/kb-biz-components';
import './SumStat.less';
import {moneyCut} from '../../common/NumberUtils';

class SumStat extends Component {
  static propTypes = {
    data: PropTypes.array,
  };
  static defaultProps = {
    data: []
  };
  static calcStatResult(data) {
    const total = data.reduce((sum, record) => ({
      totalRealBillAmt: sum.totalRealBillAmt + record.realBillAmt.amount,
      totalUnpaidAmt: sum.totalUnpaidAmt + record.unpaidAmt.amount,
      totalInvoiceAmt: sum.totalInvoiceAmt + record.invoiceAmt.amount,
    }), {
      totalRealBillAmt: 0,
      totalUnpaidAmt: 0,
      totalInvoiceAmt: 0,
    });
    return {
      totalAmount: moneyCut(total.totalRealBillAmt, 2),
      pendingSettleAmount: moneyCut(total.totalUnpaidAmt, 2),
      unRelatedInvoicesAmount: moneyCut(total.totalRealBillAmt - total.totalInvoiceAmt, 2),
    };
  }
  render() {
    const {totalAmount, pendingSettleAmount, unRelatedInvoicesAmount} = SumStat.calcStatResult(this.props.data);
    return (
      <div className="kb-mid-commission-bill-sum-stat">
        <span>账单总金额：<em style={{color: '#090'}}>{totalAmount}元</em></span>
        <Divider/>
        <span>待结算金额：<em style={{color: '#090'}}>{pendingSettleAmount}元</em></span>
        <Divider/>
        <span>未关联发票金额：<em style={{color: '#f60'}}>{unRelatedInvoicesAmount}元</em></span>
        <span className="note"><Icon type="exclamation-circle" />只统计已勾选账单</span>
      </div>
    );
  }
}

export default SumStat;
