import React, { PropTypes } from 'react';
import { Select } from 'antd';
import { loadSubCompany } from '../common/api';
import SubCompanyAddLink from './SubCompanyAddLink';

const Option = Select.Option;

class SubCompanyInput extends React.Component {

  static propTypes = {
    value: PropTypes.string, // 分公司名
    onChange: PropTypes.func, // (value) => {}
    merchantId: PropTypes.string, // 商户id
    showAddLink: PropTypes.bool, // 是否显示添加按钮
  };

  static defaultProps = {
    showAddLink: true,
  };

  state = {
    dataLoading: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.merchantId !== this.props.merchantId && this.props.merchantId) {
      if (this.props.onChange && this.props.value) this.props.onChange(undefined);
      this.loadData();
    }
  }

  loadData() {
    this.setState({ dataLoading: true });
    loadSubCompany(this.props.merchantId).then(res => {
      this.setState({
        list: res.data,
        dataLoading: false,
      });
    }).catch(() => {
      this.setState({ dataLoading: false });
    });
  }

  render() {
    const { merchantId, onChange, showAddLink, value } = this.props;
    const { list, dataLoading } = this.state;
    const options = list && list.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>) || [];
    if (options.length === 0 && dataLoading) {
      options.push(<Option key={-1} disabled value="加载中...">加载中...</Option>);
    }
    return (<div>
      <Select
        allowClear
        disabled={!merchantId}
        placeholder="请选择分公司名"
        notFoundContent="没有找到"
        value={merchantId ? value : undefined}
        onChange={onChange}
        style={{ width: showAddLink ? '80%' : '' }}
      >
        {options}
      </Select>
      {showAddLink && <SubCompanyAddLink style={{ marginLeft: 12 }} onAddSuc={this.loadData.bind(this)} merchantId={merchantId} />}
    </div>);
  }
}

export default SubCompanyInput;
