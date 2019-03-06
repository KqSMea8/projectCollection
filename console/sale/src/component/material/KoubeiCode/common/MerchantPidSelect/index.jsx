import React, { Component } from 'react';
import { Select } from 'antd';
import ajax from 'Utility/ajax';
import { isEmpty } from 'lodash';
import { API_STATUS } from '../enums';
import { SEARCH_MERCHANT_URL } from '../constants';

const Option = Select.Option;
let timer = null;
const SEARCH_INPUT_DELAY = 400;

function readableName(parent, child) {
  const [logonId, pid] = child.label.split(',');
  return `${parent.label}/${logonId}(${pid})`;
}

function transform(data) {
  return data.map(elem => (
    elem.children.map(child => ({
      key: child.value,
      value: readableName(elem, child),
    }))
  ))
  .reduce((accum, curr) => accum.concat(curr), []);
}

class ShopSelect extends Component {

  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }

  state = {
    loading: false,
    merchantList: [],
  };

  fetchMerchantList(keyword) {
    this.setState({
      loading: true,
    });
    ajax({
      url: SEARCH_MERCHANT_URL,
      method: 'get',
      data: {
        keyword,
        size: 100,
      },
      type: 'json',
    })
      .then(res => {
        this.setState({
          loading: false,
        });
        if (res.status === API_STATUS.SUCCEED) {
          this.setState({
            merchantList: transform(res.data),
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  }

  handleSearch(keyword) {
    const doSearch = () => {
      if (isEmpty(keyword)) {
        this.setState({
          merchantList: [],
        });
      } else {
        this.fetchMerchantList(keyword);
      }
    };

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(doSearch, SEARCH_INPUT_DELAY);
  }

  render() {
    const { merchantList, loading } = this.state;
    const isName = ( this.props && this.props.isName ) ? true : false;
    return (
      <Select
        showSearch
        optionFilterProp="children"
        placeholder="请输入商户名称或PID"
        searchPlaceholder="输入商户名称或PID"
        onSearch={this.handleSearch}
        notFoundContent={loading ? '搜索中…' : '未找到商户'}
        allowClear
        {...this.props}
      >
        {merchantList.map(({ key, value }) => <Option key={ isName ? value : key} value={ isName ? value : key}>{value}</Option>)}
      </Select>
    );
  }
}

export default ShopSelect;
