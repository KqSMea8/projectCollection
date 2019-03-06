import { Table, message} from 'antd';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
import permission from '@alipay/kb-framework/framework/permission';

function rowKey(record) {
  return record.id;  // 比如你的数据主键是 uid
}

const MyBrandsTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '品牌名',
      dataIndex: 'brandName',
      width: 150,
    }, {
      title: '归属人',
      dataIndex: 'nickName',
      width: 100,
    }, {
      title: (<div style={{textAlign: 'right'}}>操作</div>),
      width: 100,
      render: (t, r) => {
        let url = '#/shop/my?brandId=' + r.id + '&brandName=' + encodeURIComponent(r.brandName);
        if (r.isOwner === '0') {
          url = '#/shop/team/team-list?brandId=' + r.id + '&brandName=' + encodeURIComponent(r.brandName);
        }
        return (<div style={{textAlign: 'right'}}>
          <a href={url} target = "_blank">查看门店</a>
          { permission('VISITRECORD_QUERY_PC') ? <span className="ant-divider"></span> : null }
          { permission('VISITRECORD_QUERY_PC') ? <a href={'#/record/' + r.id + '/' + r.brandName} target = "_blank">拜访小记</a> : null}
        </div>);
      },
    }];

    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: this.showTotal,
        current: 1,
      },
      loading: false,
    };
  },
  componentDidMount() {
  },
  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.refresh();
    }
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
  refresh(update) {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: update ? current : 1,
    });
  },
  showTotal(total) {
    return `共 ${total} 条`;
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({loading: true});
    ajax({
      url: '/sale/visitrecord/queryBrand.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          const data = result.data;
          const pagination = {...this.state.pagination};
          pagination.total = data.totalItems;
          pagination.current = data.pageNo;
          this.setState({
            loading: false,
            data: data.data,
            pagination,
          });
        }
      },
      error: (result) => {
        if (result.status === 'failed') {
          message.error(result.resultMsg);
        }
        this.setState({loading: false});
      },
    });
  },
  render() {
    const { data, pagination, loading } = this.state;
    const locale = {};
    if (this.props.params) {
      locale.emptyText = '搜不到结果，换下其他搜索条件吧~';
    } else {
      locale.emptyText = '暂无数据，请输入查询条件搜索';
    }
    return (
      <div>
        <div>
          <Table bordered
                 columns={this.columns}
                 dataSource={data}
                 pagination={pagination}
                 loading={loading}
                 locale={locale}
                 onChange={this.onTableChange}
                 firstShow={!this.props.params}
                 rowKey={rowKey}/>
        </div>
      </div>
    );
  },
});

export default MyBrandsTable;
