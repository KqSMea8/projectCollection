import React from 'react';
import { string } from 'prop-types';
import { Icon } from 'antd';

import './help.less';

export function Help(props) {
  const { fieldName } = props;
  if (fieldName === 'noticePhone') {
    return (
      <div className="setting-help">
        <div className="type">
          <Icon type="info-circle" />
        </div>
        <div className="content">
          <div>请输入至少1个电话号码 ，多个号码之间用英文（,）隔开，最多可输入3个；</div>
          <div>号码若为手机号码，请输入11位手机号；若为座机号码，请输入区号-电话号码，不支持分机；若为400电话 ，请输入10位号码。</div>
        </div>
      </div>
    );
  }
  if (props.fieldName === 'needNotice') {
    return (
      <div className="setting-help">
        <div className="type">
          <Icon type="info-circle" />
        </div>
        <div className="content">
          <div>建议打开，若选择关闭，则全部订单通知无法收取。</div>
        </div>
      </div>
    );
  }
  if (props.fieldName === 'setTime') {
    return (
      <div className="setting-help">
        <div className="type">
          <Icon type="info-circle" />
        </div>
        <div className="content">
          <div>建议以上时间设置为门店“开始营业前半小时~营业结束时间“，可以保证您及时接单。</div>
          <div>例如：可接单时间设置为10：00~次日02：00，当顾客在8：00预订了当天12：00开唱，则您会在10：00收到电话通知，</div>
          <div>并需要在10：15前接单。若顾客预订了10：00开唱，则系统会判断您无法及时处理而拒单。</div>
          <div>预留房（库存）订单由系统自动接单，不受以上时间的限制。</div>
        </div>
      </div>
    );
  }
  if (props.fieldName === 'timeOut') {
    return (
      <div className="setting-help">
        <div className="type">
          <Icon type="info-circle" />
        </div>
        <div className="content">
          <div>建议时间设置短一些，时间越长，您的订单的流失率会越高。</div>
        </div>
      </div>
    );
  }
  return null;
}

Help.propTypes = {
  fieldName: string,
};

