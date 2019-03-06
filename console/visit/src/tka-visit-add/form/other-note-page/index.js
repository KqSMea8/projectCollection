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
        popPage(value);
      },
    });
    showVoiceInputAlertOnce();
  }

  render() {
    return (<List className="other-note-page">
      <BackButtonConfirm shouldConfirm={this.state.fieldChange} />
      <TextareaItem rows={10}
        placeholder="非必填，商户最新动态、商户在竞对的营销/服务情况"
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
