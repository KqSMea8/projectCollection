import React from 'react';
import { Select } from 'antd';

import { getAllTaskName } from './api';
import { SubmitStatus } from '../../../common/enum';

class TaskSelect extends React.Component {
  state = {
    loadingStatus: SubmitStatus.INIT,
    list: []
  };
  componentDidMount() {
    this.loadList();
  }
  loadList() {
    this.setState({ loadingStatus: SubmitStatus.PENDING });
    getAllTaskName()
      .then((resp) => {
        this.setState({
          list: resp.data,
          loadingStatus: SubmitStatus.DONE
        });
      })
      .catch(() => {
        this.setState({ loadingStatus: SubmitStatus.FAILED });
      });
  }
  render() {
    const { list, loadingStatus } = this.state;
    let placeholder;
    switch (loadingStatus) {
    default:
    case SubmitStatus.PENDING:
      placeholder = '加载中';
      break;
    case SubmitStatus.DONE:
      placeholder = '请输入关键字';
      break;
    case SubmitStatus.FAILED:
      placeholder = '加载失败，请刷新重试';
    }
    return (
      <Select
        placeholder={placeholder}
        showSearch
        allowClear
        optionFilterProp="children"
        {...this.props}
      >
        {list.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
      </Select>
    );
  }
}

export default TaskSelect;
