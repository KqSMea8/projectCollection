import React from 'react';
import { Table, Dropdown, Menu, Icon, message } from 'antd';
import ajax from '../../../common/ajax';
import ShowSKUDetails from './ShowSKUDetails';
const MenuItem = Menu.Item;


// function rowKey(record) {
//   return record.orderId;
// }

const ValidationSKUTable = React.createClass({

  getInitialState() {
    this.columns = [{
      title: '券名称',
      width: 90,
      dataIndex: 'voucherName',
    }, {
      title: '券ID',
      width: 140,
      dataIndex: 'voucherId',
    }, {
      title: '券适用门店数',
      width: 100,
      dataIndex: 'shopCount',
      render: (text) => {
        return (
          <div>{text}家</div>
        );
      },
    }, {
      title: '券状态',
      dataIndex: 'voucherStatus',
      width: 140,
      render: (text) => {
        return (
          <div style={{color: text === '已开始' ? 'red' : ''}}>{text}</div>
        );
      },
    }, {
      title: '券SKU总数量',
      width: 80,
      dataIndex: 'skuCount',
      render: (text) => {
        return (
          <div>{text}个</div>
        );
      },
    }, {
      title: '已回传SKU',
      width: 80,
      dataIndex: 'skuBackCount',
      render: (text) => {
        return (
          <div>{text}个</div>
        );
      },
    }, {
      title: '未回传SKU',
      width: 80,
      dataIndex: 'skuNotBackCount',
      render: (text) => {
        return (
          <div>{text}个</div>
        );
      },
    }, {
      title: 'SKU回传比例',
      width: 80,
      dataIndex: 'backRatio',
      render: (text) => {
        return (
          <span>{text}</span>
        );
      },
    }, {
      title: '所属活动',
      width: 80,
      dataIndex: 'activityName',
      render: (text) => {
        return (
          <span>{text}</span>
        );
      },
    }, {
      title: '券时间',
      width: 100,
      dataIndex: 'voucherDuring',
      render: (text) => {
        return (
          <span>{text}</span>
        );
      },
    }, {
      title: '活动来源',
      width: 80,
      dataIndex: 'activitySource',
      render: (text) => {
        return (
          <span>{text}</span>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 100,
      render: (r, d) => {
        return (<Dropdown overlay={
          <Menu>
            <MenuItem><a onClick={() => this.showModal('stores', d.voucherId)}>按门店查看</a></MenuItem>
            <MenuItem><a onClick={() => this.showModal('sku', d.voucherId)}>按SKU查看</a></MenuItem>
          </Menu>
        } >
          <a className="ant-dropdown-link">操作<Icon type="down" style={{marginRight: 8, fontSize: 10}}/></a>
        </Dropdown>);
      },
    }];
    return {
      type: '',
      visible: false,
      data: [],
      isAllowModifyShop: false,
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
    this.fetch({
      pageNo: 1,
      pageSize: 10,
    });
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },

  onTableChange(pagination) {
    this.fetch({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    });
    this.setState({pagination});
  },

  fetch(pageParams) {
    const params = {
      ...this.props.params,
      ...pageParams,
    };
    this.setState({loading: true});
    ajax({
      url: window.APP.kbretailprod + '/gateway.htm',
      method: 'get',
      data: {
        biz: 'supermarket.skucheck',
        action: '/skuCheck/voucherSkuCheck',
        data: JSON.stringify(params),
      },
      type: 'json',
      success: (res) => {
        if (res.success) {
          const pagination = {...this.state.pagination};
          pagination.total = res.totalNum;
          this.setState({
            loading: false,
            data: res.voucherSkuCheckList,
            pagination,
          });
        } else {
          message.error(res.errorMsg);
        }
      },
      error: (res) => {
        this.setState({
          loading: false,
          data: [],
        }, () => {
          message.error(res.errorMsg);
        });
      },
    });
  },

  closeModal(type) {
    if (type === 'cancel') {
      this.setState({visible: false});
    } else {
      this.setState({visible: false});
    }
  },

  showModal(modalType, voucherId) {
    this.setState({
      type: modalType,
      visible: true,
      voucherId,
    });
  },

  render() {
    const {pagination, loading, visible, type, data, voucherId} = this.state;
    const showProps = {
      voucherId: voucherId,
      type: type,
      visible,
      closeModal: this.closeModal,
    };
    return (
      <div style={{ marginTop: 20 }}>
        <Table bordered
               columns={this.columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onChange={this.onTableChange}
               scroll={{ x: 1360 }}
               rewKey={record => record.voucherId}
        />
        {
          visible && <ShowSKUDetails {...showProps}/>
        }

      </div>

    );
  },
});

export default ValidationSKUTable;
