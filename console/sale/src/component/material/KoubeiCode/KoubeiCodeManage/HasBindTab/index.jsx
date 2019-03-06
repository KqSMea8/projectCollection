import React, { Component } from 'react';
import ajax from 'Utility/ajax';
import { Alert } from 'antd';
import { appendOwnerUrlIfDev } from '../../../../../common/utils';
import ShopTable from './ShopTable';
import FilterForm from './FilterForm';
import { downloadCodeUrl } from '../utils';
import { BIND_STATUS } from '../../common/enums';
import { FILTER_BY } from './enums';
import MaterialRequireAlert from '../../common/MaterialRequireAlert';

const SUBMIT_ACTION = {
  [FILTER_BY.SHOP]: 'kbasset.pageQueryKBCodeBindInfo',
  [FILTER_BY.MERCHANT]: 'kbasset.pageQueryKBCodePidBindInfo'
};

class HasBind extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    list: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    filter: {},
    filterBy: FILTER_BY.SHOP,
  };

  onDownloadCode(id) {
    window.open(id);
  }

  onDownloadCodeUrl = (targetId, bindScene = '') => {
    downloadCodeUrl({
      targetId,
      status: BIND_STATUS.BINDED,
      bindScene
    });
  };

  onTableChange = (pagination) => {
    this.setState({
      pagination,
    }, this.fetchShopList);
  };

  handleSubmitFilter = (filter) => {
    const { pagination } = this.state;
    pagination.current = 1;
    this.setState({
      filter,
      pagination,
    }, this.fetchShopList);
  };

  handleSwitchFilterBy = filterBy => {
    this.setState({
      filterBy,
      filter: {},
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    });
  };

  fetchShopList() {
    const { filter, pagination, filterBy } = this.state;
    const { current, pageSize } = pagination;
    this.setState({
      loading: true,
    });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: {
        mappingValue: SUBMIT_ACTION[filterBy],
        ...filter,
        pageNum: current,
        pageSize,
      },
      type: 'json',
    }).then(res => {
      this.setState({
        loading: false,
      });
      this.setState({
        list: res.data.data,
        pagination: {
          ...pagination,
          total: res.data.totalSize,
        },
      });
    }).catch(() => {
      this.setState({
        list: [],
        loading: false,
      });
    });
  }

  render() {
    const { list, loading, pagination, filterBy, filter } = this.state;
    const getEmptyText = () => {
      let text = '暂无数据';
      if (filterBy === FILTER_BY.SHOP && !filter.bindTargetId && !filter.merchantPrincipalId) {
        text = '请选择门店或商户再查询';
      } else if (filterBy === FILTER_BY.MERCHANT && !filter.merchantPrincipalId) {
        text = '请选择商户再查询';
      }
      return text;
    };
    return (
      <div>
        <MaterialRequireAlert />
        <FilterForm
          filterBy={filterBy}
          onSwitchFilterBy={this.handleSwitchFilterBy}
          onSubmit={this.handleSubmitFilter}
        />
        {filterBy === FILTER_BY.SHOP && (
          <Alert
            type="info"
            message="快消（超市、便利店等）类目门店请通过“查看绑定商户的数据”搜索"
            showIcon
          />
        )}
        <ShopTable
          filterBy={filterBy}
          data={list}
          loading={loading}
          pagination={pagination}
          onChange={this.onTableChange}
          onDownloadCode={this.onDownloadCode}
          onDownloadCodeUrl={this.onDownloadCodeUrl}
          locale={{emptyText: getEmptyText()}}
        />
      </div>
    );
  }
}

export default HasBind;
