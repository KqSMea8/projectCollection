import React, {PropTypes} from 'react';
import { Table, message, Button, Popconfirm } from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import ajax from 'Utility/ajax';
import AddListModal from './AddListModal';

const WhiteListTable = React.createClass({

  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '零售商pid',
      dataIndex: 'pid',
      width: 100,
    }, {
      title: '商户名称',
      dataIndex: 'displayName',
      width: 100,
    }, {
      title: '行业',
      width: 100,
      dataIndex: 'industryName',
    }, {
      title: '城市',
      width: 100,
      dataIndex: 'cityName',
    }, {
      title: '联系方式',
      width: 100,
      dataIndex: 'phone',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <div>
            <Popconfirm title="确定删除吗？" onConfirm={() => this.handleDelete(record.pid)} onCancel={this.cancel} okText="是" cancelText="否">
              <a> 删除 </a>
            </Popconfirm>
            <AddListModal data={record} onRefresh={this.getData} type="editor" />
          </div>
        );
      },
    }];

    return {
      data: [],
      record: [],
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      loading: true,
    };
  },

  componentDidMount() {
    this.getData();
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.getData();
    }
  },

  onTableChange(pagination) {
    const params = {
      pageSize: pagination.pageSize,
      current: pagination.current,
    };

    this.setState({
      params,
      pagination,
    });
    this.getData(params);
  },

  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  },

  getData(pageParams = this.state.pagination) {
    const pagination = {
      pageSize: pageParams.pageSize,
      pageNum: pageParams.current,
    };

    const params = {
      ...this.props.params,
      ...pagination,
    };

    if (permission('BRANDRETAILE_QUERY')) {
      this.setState({ loading: true });
      ajax({
        url: '/sale/brandRetailer/queryBrandRetailers.json',
        data: params,
        method: 'get',
        type: 'json',
        success: (res) => {
          const page = this.state.pagination;
          page.total = res.data.totalItems;
          if (res.status === 'succeed') {
            this.setState({
              data: res.data.data,
              loading: false,
              pageParams: page,
            });
          } else {
            this.setState({loading: false});
            message.error('请求数据失败！');
          }
        },
        error: () => {
          this.setState({loading: false});
          message.error('请求数据失败！');
        }
      });
    } else {
      this.setState({
        loading: false,
      });

      message.error('暂无权限');
    }
  },

  // 批量删除
  batchDel() {
    if (permission('BRANDRETAILE_MANAGER')) {
      this.setState({loading: true});
      const {selectedRows} = this.state;

      const list = [];
      for (let i = 0; i < selectedRows.length; i++) {
        list.push(selectedRows[i].pid);
      }
      this.setState({ loading: true });

      ajax({
        type: 'json',
        url: '/sale/brandRetailer/deleteBrandRetailerByPids.json',
        method: 'get',
        data: {
          pids: list,
        },
        success: (res) => {
          if (res.status === 'succeed') {
            message.success('删除成功');
            setTimeout(()=>{
              this.getData();
            }, 500);
            this.setState({selectedRowKeys: []});
          } else {
            message.error('操作失败');
            this.setState({
              loading: false,
              selectedRowKeys: [],
            });
          }
        },
        error: () => {
          message.error('操作失败');
          this.setState({
            loading: false,
            selectedRowKeys: [],
          });
        },
      });
    } else {
      message.error('无权限操作');
    }
  },

  // 单个删除
  handleDelete(id) {
    console.log(permission('BRANDRETAILE_MANAGER'));
    if (permission('BRANDRETAILE_MANAGER')) {
      this.setState({loading: true});
      ajax({
        type: 'json',
        url: '/sale/brandRetailer/deleteBrandRetailerByPids.json',
        method: 'get',
        data: {
          pids: id,
        },
        success: (res) => {
          if (res.status === 'succeed') {
            message.success('删除成功');
            this.setState({
              loading: false,
              selectedRowKeys: [],
            });
            setTimeout(()=>{
              this.getData();
            }, 500);
          } else {
            message.error('操作失败');
            this.setState({
              loading: false,
              selectedRowKeys: [],
            });
          }
        },
        error: () => {
          message.error('操作失败');
          this.setState({
            loading: false,
            selectedRowKeys: [],
          });
        },
      });
    } else {
      message.error('无权限操作');
    }
  },

  render() {
    const {data, pagination, loading, selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div>
          <Popconfirm title="确定批量删除吗？" onConfirm={this.batchDel} okText="是" cancelText="否">
            <Button
              type="primary"
              disabled={!hasSelected}
              style={{ marginTop: -78 }}
            >
              批量删除
            </Button>
          </Popconfirm>

          <Table bordered
                 columns={this.columns}
                 dataSource={data || []}
                 pagination={pagination}
                 loading={loading}
                 onChange={this.onTableChange}
                 rowSelection={rowSelection}
          />

        </div>
      </div>
    );
  },
});

export default WhiteListTable;
