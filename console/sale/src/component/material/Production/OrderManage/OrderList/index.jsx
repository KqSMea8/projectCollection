import React, { Component } from 'react';
import { Button } from 'antd';
import PageLayout from 'Library/PageLayout';
import FilterForm, { initialValues } from './FilterForm';
import ListTable from './ListTable';

import { getOrderList } from '../../../common/api';

export default class OrderList extends Component {
  constructor() {
    super();
  }

  state = {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    loading: false,
    filter: {
      ...initialValues,
      gmtStart: initialValues.gmtStart.format('YYYY-MM-DD HH:mm:ss'),
      gmtEnd: initialValues.gmtEnd.format('YYYY-MM-DD HH:mm:ss')
    },
    list: []
  };

  componentDidMount() {
    this.loadList();
  }

  onClickPlaceOrder = () => {
    location.hash = '#/material/production/placeorder';
  };

  /**
   * @method 加载列表数据
   * @param next 下一页，用于分页器
   */
  loadList = next => {
    this.setState({loading: true});
    const { filter, pagination } = this.state;
    getOrderList({
      ...filter,
      pageSize: pagination.pageSize,
      pageNum: next || pagination.current
    })
      .then(res => {
        this.setState({
          list: res.data.data,
          pagination: {
            ...pagination,
            current: next || pagination.current,
            total: res.data.totalSize
          },
          loading: false
        });
      })
      .catch(() => {
        let nextState = {loading: false};
        // 分页器加载下一页失败时不重置列表
        if (!next) {
          nextState = {
            ...nextState,
            list: [],
            pagination: {
              ...pagination,
              current: 1,
              total: 0
            }
          };
        }
        this.setState({...nextState});
      });
  };

  handleSearch = filter => {
    this.setState({filter}, this.loadList);
  };

  handleViewDetail = (id) => {
    this.props.history.push(`/material/production/order-manage/${id}`);
  };

  handleAllocate = (id) => {
    this.props.history.push(`/material/production/order-manage/allocate/${id}`);
  };

  render() {
    const { list, loading, pagination } = this.state;
    const ButtonPlaceOrder = () => {
      return (
        <Button
          style={{float: 'right'}}
          type="primary"
          onClick={this.onClickPlaceOrder}
        >
          新增预采单
        </Button>
      );
    };
    return (
      <PageLayout
        title="预采购单管理"
        header={<ButtonPlaceOrder/>}
      >
        <FilterForm loading={loading} onSubmit={this.handleSearch}/>
        <ListTable
          loading={loading}
          data={list}
          pagination={{...pagination, onChange: next => {this.loadList(next);}, showQuickJumper: true, showTotal: total => `共${total}条`}}
          onViewDetail={this.handleViewDetail}
          onAllocate={this.handleAllocate}
        />
      </PageLayout>
    );
  }
}
