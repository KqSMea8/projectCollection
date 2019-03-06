import React from 'react';
import { INVOICE_MAP } from './contants';

function renderParkingTip(buyTipsTemplate) {
  const tips = [];
  if (buyTipsTemplate.freePark) {
    if (buyTipsTemplate.freeParkHours) {
      tips.push(`免费停车 ${buyTipsTemplate.freeParkHours} 小时`);
    } else {
      return '是';
    }
  } else {
    if (buyTipsTemplate.parkFeePerHour) {
      tips.push(`每小时 ${buyTipsTemplate.parkFeePerHour} 元`);
    }
    if (buyTipsTemplate.parkFeeUpperBoundPerDay) {
      tips.push(`24 小时封顶 ${buyTipsTemplate.parkFeeUpperBoundPerDay} 元`);
    }
    if (!tips.length) {
      return '否';
    }
  }
  return tips.length ? tips.join('，') : '';
}

function renderReserveTip(buyTipsTemplate) {
  if (!buyTipsTemplate.limitUserNum) { return '否'; }
  return buyTipsTemplate.userNumLimited ? `限制 ${buyTipsTemplate.userNumLimited || ''} 人` : '限制';
}

export default function BuyRulesDetail(props) {
  const { value, ...otherProps } = props;
  const { buyTips, buyTipsTemplate } = value;
  return (
    <ul {...otherProps}>
      {buyTipsTemplate && (
        React.Children.toArray([
          <li>是否支持免费 WIFI：{buyTipsTemplate.freeWifi ? '是' : '否'}</li>,
          <li>是否免费停车：{renderParkingTip(buyTipsTemplate)}
          </li>,
          <li>是否预约：{!buyTipsTemplate.needReserve ? '无需预约（高峰时可能需要等位）' : buyTipsTemplate.reserveNote || ''}</li>,
          <li>是否限制使用人数：{renderReserveTip(buyTipsTemplate)}</li>,
          <li>是否可以开具发票：{!buyTipsTemplate.supplyInvoice ? '否' : (buyTipsTemplate.invoiceTypes || []).map(d => INVOICE_MAP[d]).join('、') || ''}</li>,
        ])
      )}
      <li>
        更多须知内容：{
          buyTips && buyTips.length > 0 && buyTips[0].key
            ? (
              <dl>
                {React.Children.toArray(buyTips.map(item => {
                  const title = item.key;
                  const content = item.value;
                  return [
                    <dt>{title}</dt>,
                    ...content.map(d => <dd>{d}</dd>),
                  ];
                }))}
              </dl>
            )
            : '暂无'
        }
      </li>
    </ul>
  );
}
