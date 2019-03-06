import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SearchBar, List, Icon } from '@alipay/qingtai';
import { popPage } from '@alipay/kb-m-biz-util';
import PageList from 'rmc-pagelist/Antm2PageList';
import './my-merchant-list.less';

export default class extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    listReloadKey: 1,
  };

  onClick(item) {
    popPage({
      id: item.value,
      name: item.label,
    });
  }

  loadPage = (pageNo) => {
    const { dispatch } = this.props;
    return new Promise((resolve, reject) => {
      dispatch({ type: 'loadMyMerchantData', payload: { resolve, reject, pageNo } });
    });
  };

  onSearchChange = (value) => {
    this.props.dispatch({ type: 'onMyMerchantSearchChange', payload: value });
    this.setState({ listReloadKey: this.state.listReloadKey + 1 });
  };

  render() {
    const { className, chooseMerchantId, myMerchantData } = this.props;
    const checkExtra = <Icon type="check" color="#108EE9" />;

    return (<div className={`my-merchant-list ${className}`}>
      <SearchBar placeholder="商户名称" onSubmit={this.onSearchChange} />
      <PageList className="list" loadPage={this.loadPage} listReloadKey={this.state.listReloadKey}>
        <List>
          {myMerchantData && myMerchantData.map((item, index) => (
            <List.Item extra={chooseMerchantId === item.value && checkExtra}
              data-aspm-n={index + 1}
              onClick={this.onClick.bind(this, item)}>
              {item.label}
              <List.Item.Brief>{item.value}</List.Item.Brief>
            </List.Item>
          ))}
        </List>
      </PageList>
            </div>);
  }
}
