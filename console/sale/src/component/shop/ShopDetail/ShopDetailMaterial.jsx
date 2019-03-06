import React, {PropTypes} from 'react';
import {Table, message} from 'antd';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import { PageNoAuth } from '@alipay/kb-framework-components';

const columns = [
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作人',
    dataIndex: 'opName',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'pics',
    render(text) {
      return (text || []).map((p) => {
        return (<a href={p} target="_blank" key={p}>
          <img src={p} style={{width: 45, height: 36, marginRight: 8}}/>;
        </a>);
      });
    },
  },
];

const ShopDetailMaterial = React.createClass({
  propTypes: {
    id: PropTypes.string,
  },

  getInitialState() {
    return {
      data: [],
      loading: true,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: this.showTotal,
        current: 1,
      },
    };
  },

  componentDidMount() {
    if (permission('SHOP_MATEAILAS_QUEYR')) this.refresh();
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
  showTotal(total) {
    return `共 ${total} 条`;
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
      shopId: this.props.id,
      ...pageParams,
    };
    this.setState({loading: true});
    ajax({
      url: '/sale/visitrecord/queryMaterials.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = result.data.totalCount;
          this.setState({
            loading: false,
            data: result.data.queryResult.visitRecordList,
            pagination,
          });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  rowKey(record) {
    return record.id;
  },

  render() {
    if (!permission('SHOP_MATEAILAS_QUEYR')) return <PageNoAuth authCodes={['SHOP_MATEAILAS_QUEYR']} />;
    return (
      <div>
        <Table columns={columns}
          rowKey={this.rowKey}
          dataSource={this.state.data}
          loading={this.state.loading}
          pagination={this.state.pagination} />
      </div>
    );
  },
});

export default ShopDetailMaterial;
