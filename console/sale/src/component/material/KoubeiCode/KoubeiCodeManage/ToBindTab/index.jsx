import React, { Component } from 'react';
import BatchTable from './BatchTable';
import FilterForm from './FilterForm';
import {appendOwnerUrlIfDev} from '../../../../../common/utils';
import {API_STATUS} from '../../common/enums';
import ajax from 'Utility/ajax';
import { trimParams } from '../../common/utils';
import MaterialRequireAlert from '../../common/MaterialRequireAlert';

class ToBind extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  state = {
    list: [],
    expandedRowKeys: [],
    loading: false,
    pagination: {
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
      total: 0,
    },
    filter: {},
  };

  componentDidMount() {
    this.fetchShopList();
  }

  handleTableChange(pagination) {
    this.setState({
      pagination,
    }, this.fetchShopList);
  }

  handleSubmitFilter(filter) {
    const { pagination } = this.state;
    pagination.current = 1;
    this.setState({
      filter,
      pagination,
    }, this.fetchShopList);
  }

  handleExpandedRowsChange = keys => {
    this.setState({
      expandedRowKeys: keys,
    });
  };

  fetchShopList() {
    const { filter, pagination } = this.state;
    const { current, pageSize } = pagination;
    this.setState({
      loading: true,
    });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: trimParams({
        mappingValue: 'kbasset.pageQueryKBCodeUnbindBatch',
        ...filter,
        pageNum: current,
        pageSize,
      }),
      type: 'json',
    }).then(res => {
      this.setState({
        loading: false,
      });
      if (res && res.status === API_STATUS.SUCCEED) {
        this.setState({
          list: res.data.data,
          expandedRowKeys: [],
          pagination: {
            ...pagination,
            total: res.data.totalSize,
          },
        });
      }
    }).catch(() => {
      this.setState({
        expandedRowKeys: [],
        list: [],
        loading: false,
      });
    });
  }

  render() {
    const { list, loading, pagination, filter, expandedRowKeys } = this.state;
    return (
      <div>
        <MaterialRequireAlert />
        <FilterForm onSubmit={this.handleSubmitFilter}/>
        <BatchTable
          applicant={filter.applicant}
          data={list}
          loading={loading}
          pagination={pagination}
          expandedRowKeys={expandedRowKeys}
          onExpandedRowsChange={this.handleExpandedRowsChange}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default ToBind;
