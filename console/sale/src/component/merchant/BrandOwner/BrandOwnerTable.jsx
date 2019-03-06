import { Table } from 'antd';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
import TransferBrandOwnerAction from './TransferBrandOwnerAction';

function gotoDetail(r, e) {
  e.preventDefault();
  window.open('#/merchant/brandOwner/detail/' + r.partnerId);
}

function gotoConfig(r, e) {
  e.preventDefault();
  window.open('#/merchant/brandOwner/manageBrandOwner?pid=' + r.partnerId + '&merchantName=' + r.merchantName);
}

const BrandOwnerTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '品牌商PID',
      dataIndex: 'partnerId',
    }, {
      title: '品牌商名称',
      dataIndex: 'merchantName',
    }, {
      title: '生效状态',
      dataIndex: 'state',
      render(text) {
        return (text === true ? '生效中' : '已失效');
      },
    }, {
      title: '归属BD',
      dataIndex: 'staffName',
    }, {
      title: '操作',
      render: (_, r) => {
        const data = {...r};
        return (<div>
          {
            r.canViewFlag === true ? (<a onClick={gotoDetail.bind(this, r)}>查看</a>) : ''
          }
          {
            (r.canViewFlag === true && r.canConfigFlag === true) ? (
              <span className="ft-bar">|</span>) : ''
          }
          {
            r.canConfigFlag === true ? (
              <a onClick={gotoConfig.bind(this, r)}>管理</a>
            ) : ''
          }
          {
            ((r.canViewFlag === true || r.canConfigFlag === true) && r.canTransferFlag === true) ? (<span className="ft-bar">|</span>) : ''
          }
          {
            r.canTransferFlag === true ? (<span>
              <TransferBrandOwnerAction data={data} onRefresh={this.refresh}>
                <a>转移</a>
              </TransferBrandOwnerAction>
            </span>) : ''
          }
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
      loading: true,
    };
  },

  componentDidMount() {
    const {current, pageSize} = {...this.state.pagination};
    this.onTableChange({
      current,
      pageSize,
    });
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
      ...pageParams,
      ...this.props.params,
    };

    this.setState({loading: true});

    ajax({
      url: '/sale/merchant/brandMerchantList.json',
      // url: '/sale/merchant/myMerchantList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = res.totalCount || res.data.length;
          this.setState({
            loading: false,
            data: res.data,
            pagination,
          });
        }
      },
      error: () => {
        this.setState({
          loading: false,
          data: [],
        });
      },
    });
  },

  render() {
    const {data, pagination, loading} = this.state;
    const locale = {};
    if (this.props.params) {
      locale.emptyText = '搜不到结果，换下其他搜索条件吧~';
    } else {
      locale.emptyText = '暂无数据，请输入查询条件搜索';
    }
    return (
      <div>
        <Table columns={this.columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               locale={locale}
               onChange={this.onTableChange}/>
      </div>
    );
  },
});

export default BrandOwnerTable;
