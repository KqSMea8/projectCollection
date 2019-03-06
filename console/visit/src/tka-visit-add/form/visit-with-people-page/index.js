import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { page as wrapper } from '@alipay/page-wrapper';
import { List, SearchBar, Checkbox } from '@alipay/qingtai';
import TouchScroll from 'rmc-touchscroll';
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
    const { choose } = this.props;
    const chooseIds = Object.keys(choose);
    kBridge.call('setOptionButton', {
      items: [{ title: chooseIds.length ? `完成(${chooseIds.length})` : '完成' }],
      onClick: () => {
        this.props.dispatch({ type: 'clickFinish' });
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

  render() {
    const { inputSearchValue, list, headChoose, choose, dispatch } = this.props;
    const bodyList = list.filter(item => !headChoose[item.id]);
    return (<div className="visit-with-people-page">
      <SearchBar value={inputSearchValue}
        placeholder="小二真名或花名"
        onChange={v => dispatch({ type: 'onSearchInput', payload: v })}
        onSubmit={v => dispatch({ type: 'doSearch', payload: v })} />
      <TouchScroll className="list">
        <List>
          {headChoose && Object.keys(headChoose).map(id => (
            <CheckboxItem key={id} checked={!!choose[id]}
              onChange={this.onItemChange.bind(this, headChoose[id])}>
              {headChoose[id].name}
            </CheckboxItem>
          ))}
          {bodyList.map(item => (
            <CheckboxItem key={item.id} checked={!!choose[item.id]}
              onChange={this.onItemChange.bind(this, item)}>
              {item.name}
            </CheckboxItem>
          ))}
        </List>
      </TouchScroll>
            </div>);
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
