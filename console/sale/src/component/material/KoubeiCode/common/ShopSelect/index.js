import React, { Component } from 'react';
import { Select, message } from 'antd';
import ajax from 'Utility/ajax';
import isEmpty from 'lodash/isEmpty';
import { API_STATUS } from '../enums';
import { SEARCH_SHOP_URL } from '../constants';

const Option = Select.Option;
let timer = null;
const SEARCH_INPUT_DELAY = 400;

class ShopSelect extends Component {

  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }

  state = {
    loading: false,
    shopList: [],
  };

  fetchShopList(shopName) {
    this.setState({
      loading: true,
    });
    ajax({
      url: SEARCH_SHOP_URL,
      method: 'get',
      data: {
        shopName,
      },
      type: 'json',
    })
      .then(res => {
        this.setState({
          loading: false,
        });
        if (res.status === API_STATUS.SUCCEED) {
          this.setState({
            shopList: res.data,
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  }

  handleSearch(shopName) {
    const doSearch = () => {
      if (shopName.length < 2) {
        message.warn('请至少输入2个字');
        return;
      }
      if (isEmpty(shopName)) {
        this.setState({
          shopList: [],
        });
      } else {
        this.fetchShopList(shopName);
      }
    };

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(doSearch, SEARCH_INPUT_DELAY);
  }

  render() {
    const { shopList, loading } = this.state;
    return (
      <Select
        showSearch
        optionFilterProp="children"
        placeholder="请输入门店名称"
        searchPlaceholder="输入门店名称"
        onSearch={this.handleSearch}
        notFoundContent={loading ? '搜索中…' : '未找到门店'}
        allowClear
        {...this.props}
      >
        {shopList.map(shop => <Option key={shop.shopId} value={shop.shopId}>{shop.shopName}</Option>)}
      </Select>
    );
  }
}

export default ShopSelect;
