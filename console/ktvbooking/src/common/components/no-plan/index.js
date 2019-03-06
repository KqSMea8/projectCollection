import React from 'react';
import { Button } from 'antd';
import { object, bool, func } from 'prop-types';

import './style.less';

export default function NoPlan(props) {
  const { history, hasPlan, dispatch, form } = props;
  function onClick() {
    if (history.location.pathname === '/plan') {
      form.validateFieldsAndScroll(['checkShop'], { force: true, scroll: { offsetTop: 100 } }, (err) => {
        if (err) {
          return;
        }
        dispatch({ type: 'queryServiceList', payload: { noPlan: true } });
      });
    } else {
      history.push('/plan');
    }
  }

  if (hasPlan !== false) {
    return null;
  }

  return (
    <div className="c-no-plan">
      <div className="c-no-plan-tit">您尚未对当前门店设置预订方案，设置预订方案后才能接单</div>
      <Button type="ghost" size="large" onClick={onClick}>去设置</Button>
    </div>
  );
}

NoPlan.propTypes = {
  hasPlan: bool, // 是否设置过预订方案
  history: object.isRequired, // router#history
  dispatch: func,
  form: object, // rc-form
};
