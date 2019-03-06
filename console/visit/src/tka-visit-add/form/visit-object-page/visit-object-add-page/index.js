/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { page as wrapper } from '@alipay/page-wrapper';
import { getParam } from '@alipay/kobe-util';
import { List, TextareaItem, Picker } from '@alipay/qingtai';
import BackButtonConfirm from '../../../../common/component/back-button-confirm';
import store from './store';
import spmConfig from './spm.config';
import './style.less';

const pickerData = [
  { value: '运营总监', label: '运营总监' },
  { value: 'CEO', label: 'CEO' },
  { value: '推广总监', label: '推广总监' },
  { value: '市场总监', label: '市场总监' },
  { value: '', label: '其他' },
];

@wrapper({ store, spmConfig })
class Index extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

    const param = getParam();
    const data = param.data && JSON.parse(param.data);
    const isEdit = !!data;
    kBridge.call('setOptionButton', {
      items: [{ title: '完成' }],
      onClick: () => {
        if (isEdit) {
          dispatch({ type: 'doAddOrEdit', payload: data.id });
        } else {
          dispatch({ type: 'doAddOrEdit' });
        }
      },
    });
  }

  onPickChange(value) {
    this.props.dispatch({ type: 'setJob', payload: value[0] });
  }

  isChooseOtherJob() {
    const job = this.props.job;
    if (!job) return true;
    for (const item of pickerData) {
      if (item.value === job) return false;
    }
    return true;
  }

  render() {
    const { name, phone, job, dispatch, fieldChange } = this.props;
    return (<List className="visit-object-add-page">
      <BackButtonConfirm shouldConfirm={fieldChange} />
      <TextareaItem title="姓名" placeholder="必填，请输入" maxLength={10} value={name} onChange={v => dispatch({ type: 'setName', payload: v })} />
      <TextareaItem title="电话" placeholder="手机或座机" maxLength={15} value={phone} onChange={v => dispatch({ type: 'setPhone', payload: v })} />
      <Picker title="选择职务"
        cols={1}
        data={pickerData}
        value={[this.isChooseOtherJob() ? '' : job]}
        onChange={this.onPickChange.bind(this)}>
        <List.Item arrow="horizontal">选择职务</List.Item>
      </Picker>
      {this.isChooseOtherJob() && (
        <TextareaItem title="其他职务" placeholder="必填，请输入具体职务名称" maxLength={15} value={job} onChange={v => dispatch({ type: 'setJob', payload: v })} />
      )}
            </List>);
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
