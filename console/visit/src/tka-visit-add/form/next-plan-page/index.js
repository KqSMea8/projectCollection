import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { page as wrapper } from '@alipay/page-wrapper';
import { getParam, popPage } from '@alipay/kb-m-biz-util';
import { List, TextareaItem } from '@alipay/qingtai';
import BackButtonConfirm from '../../../common/component/back-button-confirm';
import showVoiceInputAlertOnce from '../common/show-voice-input-alert-once';
import './style.less';

@wrapper({ store: {}, spmConfig: [] })
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: getParam().value,
      fieldChange: false,
    };
  }

  onChange = (val) => {
    this.setState({
      value: val,
      fieldChange: true,
    });
  };

  componentDidMount() {
    kBridge.call('setOptionButton', {
      items: [{ title: '完成' }],
      onClick: () => {
        const value = this.state.value;
        if (!value || value.length < 50) {
          kBridge.call('showToast', '请输入下一步计划, 至少50字');
          return;
        }
        popPage(value);
      },
    });
    showVoiceInputAlertOnce();
  }

  render() {
    return (<List className="next-plan-page">
      <BackButtonConfirm shouldConfirm={this.state.fieldChange} />
      <TextareaItem rows={10}
        placeholder="必填，至少50字，输入对当前拜访对象的下一步工作计划。"
        count={1000}
        onChange={this.onChange}
        value={this.state.value} />
            </List>);
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
