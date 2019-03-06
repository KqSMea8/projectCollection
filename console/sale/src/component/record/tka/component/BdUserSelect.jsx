import React, { PropTypes } from 'react';
import { Select } from 'antd';
import { loadVisitBdUser } from '../common/api';
import debounce from 'lodash.debounce';

const Option = Select.Option;

class MerchantSelect extends React.Component {

  static propTypes = {
    value: PropTypes.string, // loginName
    onChange: PropTypes.func, // (loginName) => {}
    isDefaultChooseSelf: PropTypes.bool, // 默认选中当前操作人
    doSearch: PropTypes.func, // 执行搜索
    style: PropTypes.any,
  };

  state = {
    keyword: '',
    dataLoading: false,
  };

  componentDidMount() {
    // if (this.props.isDefaultChooseSelf) {
    this.loadData(this.props.isDefaultChooseSelf);
    // }
    this.loadDataDelay = debounce(this.loadData.bind(this), 1000);
  }

  onBlur() {
    this.setState({
      keyword: '',
    }, () => {
      if (!this.props.value) {
        this.loadData();
      }
    });
  }

  onSearch(keyword) {
    this.dispatchChange(undefined); // 关键字搜索时删除选中
    this.setState({ keyword }, () => {
      this.loadDataDelay();
    });
  }

  onSelect(value) {
    this.dispatchChange(value);
  }

  getDisplayName(input) {
    const { list, keyword } = this.state;
    const find = list && list.find(item => item.loginName === input);
    if (find) return find.displayName;
    return keyword || input;
  }

  dispatchChange(value) {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  loadData(chooseSelf = false) {
    this.setState({ dataLoading: true });
    const loadingMerchantRequest = loadVisitBdUser(this.state.keyword, chooseSelf);
    loadingMerchantRequest.then(res => {
      if (loadingMerchantRequest !== this.loadingRequest) return; // 请求中又触发了请求，忽略这次请求结果
      this.setState({
        list: res.data,
        dataLoading: false,
      });
      if (chooseSelf && res.data.length) {
        this.dispatchChange(res.data[0].loginName);
        if (this.props.doSearch) this.props.doSearch();
      }
    }).catch(() => {
      this.setState({ dataLoading: false });
    });
    this.loadingRequest = loadingMerchantRequest;
  }

  render() {
    const { list, dataLoading } = this.state;
    const options = list && list.map(item => <Option key={item.loginName} value={item.loginName}>{item.displayName}</Option>) || [];
    if (options.length === 0 && dataLoading) {
      options.push(<Option key={-1} disabled value="加载中...">加载中...</Option>);
    }
    return (<Select
      allowClear
      combobox
      placeholder="请输入或选择花名/真名"
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
