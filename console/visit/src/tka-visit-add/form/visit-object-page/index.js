import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { page as wrapper } from '@alipay/page-wrapper';
import { getParam } from '@alipay/kobe-util';
import { List, Checkbox, Result, ActionSheet } from '@alipay/qingtai';
import { openPage } from '@alipay/kb-m-biz-util';
import BackButtonConfirm from '../../../common/component/back-button-confirm';
import store from './store';
import spmConfig from './spm.config';
import './style.less';

const CheckboxItem = Checkbox.CheckboxItem;

@wrapper({ store, spmConfig })
class Index extends PureComponent {
  componentDidMount() {
    this.refreshOptionButton();
  }

  componentDidUpdate() {
    this.refreshOptionButton();
  }

  refreshOptionButton() {
    const { choose, dispatch } = this.props;
    const chooseIds = Object.keys(choose);
    kBridge.call('setOptionButton', {
      items: [{ title: chooseIds.length ? `完成(${chooseIds.length})` : '完成' }],
      onClick: () => {
        dispatch({ type: 'clickFinish' });
      },
    });
  }

  onItemChange(item, e) {
    const { dispatch } = this.props;
    if (e.target.checked) {
      dispatch({ type: 'addChoose', payload: item });
    } else {
      dispatch({ type: 'removeChoose', payload: item.id });
    }
  }

  onGroupChange(job, e) {
    const { dispatch } = this.props;
    if (e.target.checked) {
      dispatch({ type: 'addGroupChoose', payload: job });
    } else {
      dispatch({ type: 'removeGroupChoose', payload: job });
    }
  }

  onClickModify(item, e) {
    e.stopPropagation();
    openPage({
      url: 'tka-visit-add-visit-object-add.html',
      data: {
        data: JSON.stringify(item),
        merchantId: getParam().merchantId,
      },
    }, (result) => {
      this.props.dispatch({
        type: 'modifyItem',
        payload: {
          origin: item,
          modify: result,
        },
      });
    });
  }

  onClickDelete(item, e) {
    e.stopPropagation();
    const { dispatch } = this.props;

    const buttons = ['确定删除', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: buttons,
      cancelButtonIndex: buttons.length - 1,
      destructiveButtonIndex: buttons.length - 2,
      maskClosable: true,
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        dispatch({ type: 'doDeleteItem', payload: item });
      }
    });
  }

  onClickAddBtn() {
    openPage({
      url: 'tka-visit-add-visit-object-add.html',
      data: {
        merchantId: getParam().merchantId,
      },
    }, (addedItem) => {
      this.props.dispatch({ type: 'addItem', payload: addedItem });
    });
  }

  renderGroupCheck(job) {
    const { initData, choose } = this.props;
    if (!initData || !initData[job]) return null;
    let groupCheck = true;
    initData[job].forEach(item => {
      if (!groupCheck) return;
      if (!choose[item.id]) {
        groupCheck = false;
      }
    });
    return (<Checkbox className="header-check" checked={groupCheck} onChange={this.onGroupChange.bind(this, job)}>
      <span className="content">{job}</span>
            </Checkbox>);
  }

  render() {
    const { initData, choose, fieldChange } = this.props;
    return (<div className="visit-object-page">
      <BackButtonConfirm shouldConfirm={fieldChange} />
      {initData && Object.keys(initData).map(job => (
        <List className="list" key={job} renderHeader={this.renderGroupCheck(job)}>
          {initData[job] && initData[job].map(item => (
            <CheckboxItem key={item.id} checked={!!choose[item.id]}
              onChange={this.onItemChange.bind(this, item)}>
              <span className="list-item">{item.name}{item.phone && `(${item.phone})`}</span>
              <div className="item-btns">
                <span className="edit" onClick={this.onClickModify.bind(this, item)}>编辑</span>
                <span className="delete" onClick={this.onClickDelete.bind(this, item)}>删除</span>
              </div>
            </CheckboxItem>
          ))}
        </List>
      ))}
      {initData && Object.keys(initData).length === 0 && <Result title="列表为空，请先添加"
        imgUrl="https://os.alipayobjects.com/rmsportal/wtGDSpzccjsKiaS.png" />}
      <button className="add-btn" onClick={this.onClickAddBtn.bind(this)}>添加对象</button>
            </div>);
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
