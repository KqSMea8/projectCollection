import React, {PropTypes} from 'react';
import {message, Popconfirm, Dropdown, Menu, Icon} from 'antd';
import Table from '../../../common/Table';
import ajax from 'Utility/ajax';
// import permission from '@alipay/opbase-biz-kb-framework/framework/permission';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import {format} from '../../../common/dateUtils';
import { ApplyRecordStatusMap } from '../common/MaterialLogMap';

const ApplicationRecordTable = React.createClass({
  propTypes: {
    params: PropTypes.any,
  },
  getInitialState() {
    this.columns = [
      {
        title: '申请单号',
        dataIndex: 'orderId',
      }, {
        title: '申请人/时间',
        dataIndex: 'applicant',
        render(text, record) {
          return [text, <br />, format(new Date(record.gmtCreate))];
        },
      }, {
        title: '申请单状态',
        dataIndex: 'status',
        render(text) {
          if (!text) {
            return '';
          }
          return ApplyRecordStatusMap[text];
        },
      }, {
        title: '仓库类型',
        dataIndex: 'storageType',
        render(text, record) {
          let type = '';
          if (text === 'CITY') {
            type = '城市';
          } else if (text === 'KA') {
            type = 'KA';
          } else if (text === 'YUNZONG') {
            type = '云纵';
          }
          return [type, '(', record.storageName, ')'];
        },
      }, {
        title: '申请城市',
        dataIndex: 'storageName',
      }, {
        title: '申请总额',
        dataIndex: '',
        render(t, r) {
          return [r.applyAmount.amount, <span>&nbsp;</span>, '元'];
        },
      }, {
        title: '操作',
        dataIndex: '',
        width: 100,
        render: (text, record) => {
          const menu = (
            <Menu>
              <Menu.Item key="0">
                <Popconfirm title="结束入库后，本单将不可采购、不可入库。确认结束入库吗？" onConfirm={this.endStock.bind(this, record)}>
                  <a>结束入库</a>
                </Popconfirm>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="1">
                <a href={'#/material/applicationManagement/applyDetail/' + record.orderId} target="_blank">详情</a>
              </Menu.Item>
            </Menu>
          );
          return (<span>
            {(record.displayPermission.quotePriceEnable === '1' && this.state.operatorId === record.purchaserId) && <a href={'#/material/quote/' + record.orderId} target="_blank">报价</a>}
            {(record.displayPermission.quotePriceEnable === '1' && this.state.operatorId === record.purchaserId) && <span className="ant-divider"></span>}

            {(record.displayPermission.applyEnable === '1') && <a href={'#/material/applicationManagement/applyMaterial?applyId=' + record.orderId} target="_blank">申请</a>}
            {(record.displayPermission.applyEnable === '1') && <span className="ant-divider"></span>}

            {(record.displayPermission.detailEnable === '1' && record.displayPermission.inStockEnalbe === '0') && <a href={'#/material/applicationManagement/applyDetail/' + record.orderId} target="_blank">详情</a>}

            {(record.displayPermission.inStockEnalbe === '1') && <a href={'#/material/inbound/' + record.orderId} target="_blank">入库</a>}
            {(record.displayPermission.inStockEnalbe === '1') && <span className="ant-divider"></span>}

            {(record.displayPermission.detailEnable === '1' && record.displayPermission.inStockEnalbe === '1' && record.displayPermission.endStockEnable === '1') &&
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">更多<Icon type="down" /></a>
            </Dropdown>}
          </span>);
        },
      },
    ];
    return {
      showModal: false,
      data: [],
      loading: true,
      selectedIds: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      operatorId: '',
    };
  },

  componentWillMount() {
    this.refresh();
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
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNo: pagination.current,
    };
    this.fetch(params);
  },

  endStock(record) {
    const params = {
      orderId: record.orderId,
    };
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/stuffStockActionEndInStock.json'),
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          message.success('结束入库操作成功');
          this.refresh();
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
    });
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNo: current,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      mappingValue: 'kbasset.pageQueryApplyOrder',
      domain: 'KOUBEI',
      ...pageParams,
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = result.data.totalSize;
          this.setState({
            loading: false,
            operatorId: result.operatorId,
            data: result.data.data || [],
            pagination,
          });
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: () => {
        const pagination = {...this.state.pagination};
        pagination.total = 0;
        this.setState({
          loading: false,
          data: [],
          pagination,
        });
      },
    });
  },
  expandedRowRender(record) {
    const columns = [
      {
        title: '模板ID',
        dataIndex: 'templateId',
        key: 'templateId',
        width: 95,
      }, {
        title: '模板名称',
        dataIndex: 'templateName',
        key: 'templateName',
        width: 95,
      }, {
        title: '申请数量',
        dataIndex: 'applyQuantity',
        key: 'applyQuantity',
        width: 95,
      },
    ];
    return (
      <Table
        rowKey={r => r.templateId}
        columns={columns}
        dataSource={record.stuffApplyItemDtoList}
        size="small"
        pagination={false}
        scroll={{x: false, y: 300}}
      />
      );
  },

  render() {
    const {loading, data, pagination } = this.state;
    return (
        <div>
          <Table columns={this.columns}
                 rowKey={r => r.orderId}
                 dataSource={data}
                 loading={loading}
                 expandedRowRender={this.expandedRowRender}
                 pagination={pagination}
                 firstShow={!this.props.params}
                 onChange={this.onTableChange} />
        </div>
    );
  },
});

export default ApplicationRecordTable;
