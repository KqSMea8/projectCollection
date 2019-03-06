import React, {PropTypes} from 'react';
import { Table, message} from 'antd';
import ajax from 'Utility/ajax';
import OrderModal from '../common/OrderModal';
import {format, formatTime} from '../../../common/dateUtils';


const StoredValueCardOrder = React.createClass({
  propTypes: {
    goodsId: PropTypes.any,
  },


  getInitialState() {
    this.columns = [{
      title: '活动名称',
      dataIndex: 'campName',
      key: 'campName',
    }, {
      title: '活动状态',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '活动上下架时间',
      width: 260,
      render(text, r) {
        return format(new Date(r.startDate)) + ' ' + formatTime(new Date(r.startDate)) + ' ~ ' + format(new Date(r.endDate)) + ' ' + formatTime(new Date(r.endDate));
      },
    }, {
      title: '操作',
      render(text, r) {
        return (<div>
          <OrderModal id={r.listCampOption} />
        </div>);
      },
    }];

    return {
      data: [],
      loading: true,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 20,
        current: 1,
      },
    };
  },

  componentDidMount() {
    this.refresh();
  },

  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    this.fetch(params);
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      itemId: this.props.goodsId,
    };
    this.setState({loading: true});
    ajax({
      url: window.APP.crmhomeUrl + '/goods/koubei/cardCampOpLog.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        pagination.total = result.data.totalItems;
        this.setState({
          loading: false,
          data: result.data.data,
          pagination,
        });
      },
      error: (result) => {
        this.setState({
          loading: false,
          data: [],
        });
        if (result.errorMsg) {
          message.error(result.errorMsg, 3);
        }
      },
    });
  },
  description(data) {
    this.list = [{
      title: '操作时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 220,
      render(text) {
        return format(new Date(text)) + ' ' + formatTime(new Date(text));
      },
    }, {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 150,
    }, {
      title: '操作类型',
      dataIndex: 'opType',
      key: 'opType',
    }];
    return (
      <Table columns={this.list}
        dataSource={data.listCampOpeElementVO}
        pagination={false} />
    );
  },
  render() {
    const {data, pagination, loading} = this.state;
    return (
      <Table columns={this.columns}
        expandedRowRender={this.description}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={this.onTableChange}/>
    );
  },
});

export default StoredValueCardOrder;
