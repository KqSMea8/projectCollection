import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Table, Icon, Menu, Dropdown } from 'antd';
import history, { Link } from '@alipay/kobe-history';
import { Page } from '@alipay/kb-biz-components';

import SearchForm from './components/search-form';
import store from './store';
import { indexType } from './prop-type';
import spmConfig from './spm.config';
import './style.less';

const { shape, object, array, func, bool } = PropTypes;

@page({ store, spmConfig })
class Index extends PureComponent {
  static propTypes = {
    dispatch: func,
    history: object,
    initData: shape(indexType),
    list: array,
    loading: bool,
  }

  handleSearch = (payload) => {
    const { dispatch } = this.props;
    dispatch({ type: 'getList', payload });
  }

  handleClickMenu = () => {
    history.push('/spiDetail');
  }

  renderMenu() {
    return (
      <Menu onClick={this.handleClickMenu} >
        <Menu.Item key="1" >Add</Menu.Item>
        <Menu.Item key="2" >Remove</Menu.Item>
      </Menu>
    );
  }

  getColumns() {
    return [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: 'Operation',
      key: 'operation',
      render: () => (
        <span>
          <Link to="/detail">Detail</Link>
          <span className="ant-divider" />
          <Dropdown overlay={this.renderMenu()} trigger={['click']}>
            <a className="ant-dropdown-link">
              More <Icon type="down" />
            </a>
          </Dropdown>
        </span>
      ),
    }];
  }

  render() {
    const { list, loading } = this.props;
    const breadcrumb = [
      { title: '列表' },
    ];
    return (
      <Page id="index" breadcrumb={breadcrumb}>
        <SearchForm onSearch={this.handleSearch} />
        <Table loading={loading} columns={this.getColumns()} dataSource={list} />
      </Page>
    );
  }
}

export default Index;
