import React, { PropTypes } from 'react';
import { Select } from 'antd';
import { loadVisitMerchant } from '../common/api';
import debounce from 'lodash.debounce';

const Option = Select.Option;

class MerchantSelect extends React.Component {

  static propTypes = {
    value: PropTypes.string, // id
    onChange: PropTypes.func, // (id) => {}
    isAllMerchant: PropTypes.bool, // 接口是否查找所有商户，否则根据 有无输入内容 查找 自己名下/自己+下属 商户
    placeholder: PropTypes.string,
  };

  state = {
    keyword: '',
    dataLoading: false,
  };

  componentDidMount() {
    this.loadMerchant();
    this.loadMerchantDelay = debounce(this.loadMerchant.bind(this), 1000);
  }

  onSearch(keyword) {
    this.dispatchChange(undefined);
    this.setState({ keyword }, () => {
      this.loadMerchantDelay();
    });
  }

  onSelect(value) {
    this.dispatchChange(value);
  }

  onBlur() {
    this.setState({
      keyword: '',
    });
  }

  getDisplayName(input) {
    const { list, keyword } = this.state;
    const find = list && list.find(item => item.value === input);
    if (find) return `${find.label}(pid: ${find.value})`;
    return keyword || input;
  }

  dispatchChange(value) {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  // 加载数据，多次触发仅最后一次生效
  loadMerchant() {
    this.setState({ dataLoading: true });
    const loadingMerchantRequest = loadVisitMerchant(this.state.keyword, this.props.isAllMerchant);
    loadingMerchantRequest.then(res => {
      if (loadingMerchantRequest !== this.loadingRequest) return; // 请求中又触发了请求，忽略这次请求结果
      this.setState({
        list: res.data && res.data.visitObjList,
        dataLoading: false,
        loadingErrorMsg: null,
      });
    }).catch(e => {
      this.setState({
        dataLoading: false,
        loadingErrorMsg: e.message,
      });
    });
    this.loadingRequest = loadingMerchantRequest;
  }

  render() {
    const { list, dataLoading, loadingErrorMsg } = this.state;
    const options = list && list.map(item => <Option key={item.value} value={item.value}>{`${item.label}(pid: ${item.value})`}</Option>) || [];
    if (options.length === 0 && dataLoading) {
      options.push(<Option key={-1} disabled value="加载中...">加载中...</Option>);
    }
    if (options.length === 0 && loadingErrorMsg) {
      options.push(<Option key={-1} disabled value="错误">{loadingErrorMsg}</Option>);
    }
    return (<Select
      allowClear
      combobox
      placeholder={this.props.placeholder || '请输入商户名或选择'}
      optionFilterProp="children"
      optionLabelProp="children"
      value={this.getDisplayName(this.props.value)}
      onSearch={this.onSearch.bind(this)}
      onSelect={this.onSelect.bind(this)}
      onBlur={() => this.onBlur()}
      style={this.props.style}
    >
      {options}
    </Select>);
  }
}

export default MerchantSelect;
