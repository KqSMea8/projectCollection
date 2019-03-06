import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Select } from 'antd';
import store from './store';
import spmConfig from './spm.config';
import './style.less';

/* eslint-disable */
const { object, func, array } = PropTypes;
const Option = Select.Option;
@page({ store, spmConfig })
class Index extends PureComponent {
  static propTypes = {
    list: object,
    dispatch: func,
    serverHostData: array,
    serverHostDatas: array,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'queryAppNames' });
  }

  render() {
    const { serverHostData, serverHostDatas } = this.props;
    let options;
    if (serverHostDatas && serverHostDatas.length !== 0) {
      options = serverHostDatas.map((val, index) => (
        <Option key={index} value={val}>
          {val}
        </Option>
      ));
    } else {
      options = serverHostData.map((val, index) => (
        <Option key={index} value={val}>
          {val}
        </Option>
      ));
    }
    return (
      <Select showSearch className="select-server-host"
        style={{ width: '200px', }}
        placeholder="请输入"
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        {...this.props}>
        {options}
      </Select>
    );
  }
}

export default Index;
