import React from 'react';
import './ShopInfoErrorTip.less';
import { Icon } from 'antd';
import classnames from 'classnames';

export default props => {
  const { top = '-30px', left = '50%', message, shopId, dir = 'top' } = props;
  if (!message) {
    return <div className="shoptip-wrapper">{props.children}</div>;
  }
  const clsName = classnames('shoptip', dir);
  return (
    <div className="shoptip-wrapper">
      <div className={clsName} style={{ top, left }}>
        <span style={{ color: '#fff' }}>
          <Icon type="exclamation-circle-o" />
          {` ${message}`}
          <a href={`?mode=modify#/shop/edit/${shopId}`} target="_blank">马上修改</a>
          {
            props.cancelEnable &&
            <span> | <a data-err-type={props.errType} onClick={props.cancelError}>取消报错</a></span>
          }
        </span>
      </div>
      {props.children}
    </div>
  );
};
