import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { page as wrapper } from '@alipay/page-wrapper';
import { List, TextareaItem } from '@alipay/qingtai';
import BackButtonConfirm from '../../../../common/component/back-button-confirm';
import store from './store';
import spmConfig from './spm.config';
import './style.less';

@wrapper({ store, spmConfig })
class Index extends PureComponent {
  componentDidMount() {
    kBridge.call('setOptionButton', {
      items: [{ title: '完成' }],
      onClick: () => {
        this.props.dispatch({ type: 'doAddItem' });
      },
    });
  }

  render() {
    const { content, dispatch, fieldChange } = this.props;
    return (<List className="visit-sub-company-add-page">
      <BackButtonConfirm shouldConfirm={fieldChange} />
      <TextareaItem rows={5}
        placeholder="请输入分公司的全称，最多50字"
        maxLength={50}
        onChange={v => dispatch({ type: 'onContentChange', payload: v })}
        value={content} />
            </List>);
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
