import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { page as wrapper } from '@alipay/page-wrapper';
import { List, Radio, TextareaItem } from '@alipay/qingtai';

import store from './store';
import spmConfig from './spm.config';
import './style.less';

const RadioItem = Radio.RadioItem;

@wrapper({ store, spmConfig })
class Index extends PureComponent {
  componentWillMount() {
    kBridge.call('setOptionButton', {
      items: [{
        title: '提交',
      }],
      onClick: (data) => {
        this.props.dispatch({ type: 'approve' });
      },
    });
  }

  triggerValid = () => {
    this.props.setValid(!this.props.valid);
  }

  handleChangeReason = (value) => {
    this.props.setInvalidReason(value);
  }

  renderReason() {
    const { valid, invalidReason } = this.props;
    if (valid) return null;
    return (
      <div className="reason">
        <TextareaItem placeholder="必填，请描述无效理由" rows={5} count={1000} value={invalidReason}
          onChange={this.handleChangeReason} />
        <div className="reason-hint">必填</div>
      </div>
    );
  }

  render() {
    const { valid } = this.props;

    return (
      <div className="index">
        <List>
          <RadioItem checked={valid} onChange={this.triggerValid}>
            这是有效拜访
          </RadioItem>
          <RadioItem checked={!valid} onChange={this.triggerValid}>
            这是无效拜访
          </RadioItem>
        </List>
        {this.renderReason()}
      </div>
    );
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
