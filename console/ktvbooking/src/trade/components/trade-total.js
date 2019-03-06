// 总计
import React from 'react';
import { object } from 'prop-types';
import { Tooltip, Icon } from 'antd';

import Block from '../../common/components/block';

import './trade-total.less';

export default function TradeTotal(props) {
  const text = '净收 = 实收 - 退款金额 - 服务费';
  const { tradeTotalData } = props;
  return (
    <Block className="trade-total" title="总计">
      <table width="600" height="200" className="tb">
        <tbody>
          <tr>
            <td className="td-border">消费订单（单）</td>
            <td className="td-border">实收（元）</td>
            <td className="td-border">净收（元）
              <Tooltip placement="top" title={text}>
                <Icon className="top-icon" type="question-circle-o" />
              </Tooltip>
            </td>
          </tr>
          <tr className="total-tr">
            <td className="td-borders">{tradeTotalData.spendOrderTotality}</td>
            <td className="td-borders">{tradeTotalData.incomeTotality}</td>
            <td className="td-borders">{tradeTotalData.netAmountTotal}</td>
          </tr>
          <tr>
            <td className="td-border">手工退款订单（单）</td>
            <td className="td-border">退款金额（元）</td>
            <td className="td-border">服务费（元）</td>
          </tr>
          <tr className="total-tr">
            <td className="td-borders">{tradeTotalData.refundOrderTotality}</td>
            <td className="td-borders">{tradeTotalData.refundTotalMoney}</td>
            <td className="td-borders">{tradeTotalData.chargeAmount}</td>
          </tr>
        </tbody>
      </table>
    </Block>
  );
}

TradeTotal.propTypes = {
  tradeTotalData: object,
};
