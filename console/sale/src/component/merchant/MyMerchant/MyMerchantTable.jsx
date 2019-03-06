import { Table } from 'antd';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
import TransferAction from '../common/TransferAction';

function gotoDetail(r, e) {
  e.preventDefault();
  window.open('#/merchant/detail/' + r.partnerId);
}

function gotoConfig(r, e) {
  e.preventDefault();
  window.open('#/merchant/config/' + r.partnerId);
}

const MyMerchantTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '商户PID',
      dataIndex: 'partnerId',
    }, {
      title: '商户名称',
      dataIndex: 'merchantName',
    }, {
      title: '归属BD',
      dataIndex: 'staffName',
    }, {
      title: '操作',
      render: (_, r) => {
        const data = {...r};
        return (<div>
          <a onClick={gotoDetail.bind(this, r)}>查看</a>
          {
            r.canConfigFlag === true ? (<span>
              <span className="ft-bar">|</span>
              <a onClick={gotoConfig.bind(this, r)}>业务配置</a>
            </span>) : ''
          }
          {
            r.canTransferFlag === true ? (<span>
              <span className="ft-bar">|</span>
              <TransferAction data={data} onRefresh={this.refresh}>
                <a>转移</a>
              </TransferAction>
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

  componentWillReceiveProps(nextProps) {
    if (this.props.params !== nextProps.params) {
      this.fetch({
        ...nextProps.params,
        pageSize: this.state.pagination.pageSize,
        pageNum: 1,
      });
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
      ...this.props.params,
      ...pageParams,
    };

    this.setState({loading: true});

    ajax({
      url: '/sale/merchant/myMerchantList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = res.totalCount || res.data.length;
          pagination.pageSize = params.pageSize;
          pagination.current = params.pageNum;
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

export default MyMerchantTable;
