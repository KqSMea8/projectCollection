import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SearchBar, List, Icon } from '@alipay/qingtai';
import PageList from 'rmc-pagelist/Antm2PageList';
import { popPage } from '@alipay/kb-m-biz-util';
import './under-merchant-list.less';

export default class extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    listReloadKey: 1,
    autoFocusResetKey: 1,
    scrollToGroup: '',
  };

  onClick(item) {
    popPage({
      id: item.value,
      name: item.label,
    });
  }

  onClickScrollTo(group) {
    this.setState({
      scrollToGroup: group,
      autoFocusResetKey: this.state.autoFocusResetKey + 1,
    });
  }

  loadPage = (pageNo) => {
    const { dispatch } = this.props;
    return new Promise((resolve, reject) => {
      dispatch({ type: 'loadUnderMerchantData', payload: { resolve, reject, pageNo } });
    });
  };

  onSearchChange = (value) => {
    this.props.dispatch({ type: 'onUnderMerchantSearchChange', payload: value });
    this.setState({ listReloadKey: this.state.listReloadKey + 1 });
  };

  render() {
    const { className, chooseMerchantId, underMerchantData, underMerchantDataGroups } = this.props;
    const { scrollToGroup, listReloadKey, autoFocusResetKey } = this.state;
    const checkExtra = <Icon type="check" color="#108EE9" />;
    // TODO 封装索引滚动组件
    let spmN = 1;
    return (<div className={`under-merchant-list ${className}`}>
      <SearchBar placeholder="商户名称、BD的名称" onSubmit={this.onSearchChange} />
      <PageList className="list" loadPage={this.loadPage} listReloadKey={listReloadKey}
        autoFocusQuerySelector={`[data-group="${scrollToGroup}"]`}
        autoFocusToPosition="top"
        autoFocusResetKey={autoFocusResetKey}>
        {underMerchantDataGroups && underMerchantDataGroups.map(group => (
          <List renderHeader={<span data-group={group}>{group}</span>}>
            {underMerchantData && underMerchantData[group].map(item => (
              <List.Item extra={chooseMerchantId === item.value && checkExtra}
                data-aspm-n={spmN++}
                wrap
                onClick={this.onClick.bind(this, item)}>
                {item.label}
                <List.Item.Brief>
                  <div>{item.value}</div>
                  <div>{item.ownerName}</div>
                </List.Item.Brief>
              </List.Item>
            ))}
          </List>
        ))}
      </PageList>
      <div className="right-index">
        {underMerchantDataGroups && underMerchantDataGroups.map(group => (
          <div onClick={this.onClickScrollTo.bind(this, group)}>{group}</div>
        ))}
      </div>
            </div>);
  }
}
