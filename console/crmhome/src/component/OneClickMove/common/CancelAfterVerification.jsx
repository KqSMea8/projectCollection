/**
* 核销方式
*/
import React, { PropTypes } from 'react';
import { Icon } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import { CardSelect } from '@alipay/xform';
import './card-select.less';

const tip1 = (
  <span>推荐使用“<span style={{ color: '#f90' }}>口碑掌柜-收款／验券</span>
    ”或“
    <span style={{ color: '#f90' }}>商家中心-验券</span>”功能核销商品券</span>
);

const tip2 = <span>扫描顾客的付款码核销，<span style={{ color: '#f90' }}>此方式需与口碑单品打通</span></span>;
const tip3 = <span>需使用“<span style={{ color: '#f90' }}>外部券码-码商</span>”的相应核销功能核销商品券</span>;

const helpLink = (
  <a
    href="https://render.alipay.com/p/f/fd-j9zb6mdt/index.html"
    target="_blank"
  >
    <div style={{ display: 'flex' }}>
      <Icon type="question-circle-o" />
      <span style={{ fontSize: 14, display: 'inline-block' }}>&nbsp;核销教程</span>
    </div>
  </a>
);

const cardSelectOption = [{
  key: 'TICKET_CODE',
  helpLink,
  title: '券码核销',
  icon: <img width="50" src="https://gw.alipayobjects.com/zos/rmsportal/shhGikGFIbWOfRsKkNxR.png" />,
  tip: tip1,
}, {
  key: 'USER_PAY_CODE',
  title: '付款码核销',
  icon: <img width="50" src="https://gw.alipayobjects.com/zos/rmsportal/EjUobZhexCFstzYKXTyT.png" />,
  tip: tip2,
}, {
  key: 'EXTERNAL_TICKET_CODE',
  title: '外部券码核销',
  icon: <img width="50" height="50" src="https://gw.alipayobjects.com/zos/rmsportal/sIarDVefiBeqPNWDSkGh.svg" />,
  tip: tip3,
}];

export default class CancelAfterVerification extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    field: PropTypes.string.isRequired,
    // isMulti: PropTypes.bool,     // 次卡需求新增，如果为 true 表示是 次卡 业务场景，候选项只有付款码核销 @郁丹丹  deprecated
    // isTicket: PropTypes.bool,    // 活动修改 true 只显示券码 @毛步云  deprecated
    hasExternal: PropTypes.bool,    // 是否显示外部券核销
    hasTicketCode: PropTypes.bool,
    hasUserPayCode: PropTypes.bool,
  }

  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    label: '核销方式',
    rules: [],
    hasTicketCode: false,
    hasUserPayCode: false,
    hasExternal: false,
  }

  render() {
    const { label, required, labelCol, wrapperCol, field, rules, hasTicketCode, hasUserPayCode, hasExternal } = this.props;
    const options = [];
    if (hasTicketCode) {
      options.push(cardSelectOption[0]);
    }
    if (hasUserPayCode) {
      options.push(cardSelectOption[1]);
    }
    if (hasExternal) {
      options.push(cardSelectOption[2]);
    }
    return (
      <CardSelect
        label={label}
        required={required}
        {...{ labelCol, wrapperCol }}
        field={field}
        rules={rules}
      >
        {options.map((item) => {
          return (
            <CardSelect.Option
              key={item.key}
              helpLink={item.helpLink}
              title={item.title}
              icon={item.icon}
            >
              {item.tip}
            </CardSelect.Option>
          );
        })}
      </CardSelect>);
  }
}
