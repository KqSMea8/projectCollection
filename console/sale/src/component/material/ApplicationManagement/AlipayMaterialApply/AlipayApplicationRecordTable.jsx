import React, { PropTypes } from 'react';
import { message } from 'antd';
import Table from '../../../../common/Table';
import ajax from 'Utility/ajax';
import './alipayApplycationRecord.less';
import { appendOwnerUrlIfDev } from '../../../../common/utils';
import { format } from '../../../../common/dateUtils';
import './alipayApplycationRecord.less';
// import moment from 'moment';
// import permission from '@alipay/kb-framework/framework/permission';

// const FormItem = Form.Item;
const STATUS = {
  // isv专用
  '500': '已驳回',
  '501': '发货完毕',
  '502': '申请中',
  '503': '审核中',
  '504': '发货中',
  // 转账码专用
  '600': '待制作',
  '601': '制作中',
  '602': '已寄送',
};

const AlipayApplicationRecordTable = React.createClass({
  propTypes: {
    params: PropTypes.any,
    // form: PropTypes.object,
    bizSourceData: PropTypes.string,
  },
  getInitialState() {
    return {
      showModal: false,
      data: [],
      loading: true,
      selectedIds: [],
      recordDataSource: [],
      itemOrderId: null,
      // downloadData: [],
      // selecteCount: 0,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      // rejectApplyVisible: false,
      // selectedRowKeys: [],
    };
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
    const pager = { ...this.state.pagination };
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

  // onCancel() {
  //   this.setState({
  //     rejectApplyVisible: false,
  //   });
  // },
  // onSearch() {
  //   this.props.form.validateFields((error, value) => {
  //     if (error) {
  //       return;
  //     }
  //     if (value.rejectReason && value.rejectReason !== '' ) {
  //       const params = {
  //         mappingValue: 'kbasset.rejectStuffOrder',
  //         orderId: this.state.itemOrderId,
  //         reason: value.rejectReason,
  //       };
  //       ajax({
  //         url: appendOwnerUrlIfDev('/proxy.json'),
  //         method: 'get',
  //         data: params,
  //         type: 'json',
  //         success: (result) => {
  //           if (result.status === 'succeed') {
  //             message.success('驳回成功', 2);
  //           } else if (result.status === 'failed') {
  //             if (result.resultMsg) {
  //               message.error(result.resultMsg, 2);
  //             }
  //           }
  //         },
  //         error: (err) => {
  //           if (err.resultMsg) {
  //             message.error(err.resultMsg, 3);
  //           } else {
  //             message.error('请求异常', 3);
  //           }
  //         },
  //       });
  //       this.setState({ rejectApplyVisible: false });
  //       this.onTableChange({
  //         current: this.state.pagination.current,
  //         pageSize: this.state.pagination.pageSize,
  //       });
  //     }
  //   });
  // },
  // onSelectChange(selectedRowKeys) {
  //   this.setState({ selectedRowKeys });
  // },
  // 驳回
  // rejectApply(record) {
  //   if (!permission('STUFF_APPLY_ORDER_REJECT')) {
  //     message.error('您没有该操作的权限');
  //     return false;
  //   }
  //   this.props.form.resetFields();
  //   this.setState({
  //     rejectApplyVisible: true,
  //     itemOrderId: record.orderId,
  //   });
  // },
  fetch(pageParams = {}) {
    const self = this;
    const params = {
      mappingValue: 'kbasset.pageQueryApplyOrder',
      // domain: 'ALIPAY',
      ...pageParams,
      ...this.props.params,
    };
    this.setState({
      loading: true,
      // selecteCount: 0,
      selectedRowKeys: [],
    });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const pagination = {...self.state.pagination};
          pagination.total = result.data.totalSize;
          self.setState({
            loading: false,
            data: result.data.data || [],
            pagination,
          });
        } else if (result.status === 'failed') {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: () => {
        const pagination = {...self.state.pagination};
        pagination.total = 0;
        self.setState({
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
      }, {
        title: '已发货数量',
        dataIndex: 'alreadyPurchaseQuantity',
        key: 'alreadyPurchaseQuantity',
        width: 95,
      },
    ];
    return (
      <Table
        rowKey={r => r.itemId}
        columns={columns}
        dataSource={record.stuffApplyItemDtoList}
        scroll={{ x: false, y: 300 }}
        pagination={false}
        size="small"
      />
      );
  },
  // download() {
  //   const self = this;
  //   if (!permission('STUFF_DELIVER_DOWNLOAD')) {
  //     message.error('您没有该操作的权限');
  //     return false;
  //   }
  //   this.refresh();
  //   const orderIdArray = {};
  //   this.state.downloadData.forEach((orderData) => {
  //     const obj = [];
  //     if (orderData.stuffApplyItemDtoList.length !== 0) {
  //       orderData.stuffApplyItemDtoList.forEach((itemData) => {
  //         obj.push(itemData.itemId);
  //         const orderId = parseFloat(orderData.orderId);
  //         orderIdArray[orderId] = obj;
  //       });
  //     }
  //   });
  //   const orderIdData = JSON.stringify(orderIdArray);
  //   const params = {
  //     orderIdData,
  //   };
  //   ajax({
  //     url: appendOwnerUrlIfDev('/sale/asset/buildDeliverFile.json'),
  //     method: 'get',
  //     data: params,
  //     type: 'json',
  //     success: (result) => {
  //       if (result.status && result.status === 'succeed') {
  //         const url = appendOwnerUrlIfDev('/sale/asset/downloadDeliverFile.resource?' + '&orderIdData=' + orderIdData);
  //         location.href = url;
  //         setTimeout(() => {
  //           self.refresh();
  //         }, 1000);
  //       } else if (result.status === 'failed') {
  //         if (result.resultMsg) {
  //           message.error(result.resultMsg, 3);
  //         }
  //       }
  //     },
  //     error: () => {
  //       message.error('系统异常,请刷新页面或稍后重试', 3);
  //     },
  //   });
  //   this.setState({
  //     selectedRowKeys: [],
  //     // selecteCount: 0,
  //   });
  // },
  refresh() {
    const { pageSize, current } = this.state.pagination;
    this.fetch({
      pageNo: current,
      pageSize,
      bizSource: this.props.bizSourceData,
    });
  },
  render() {
    // const self = this;
    const { loading, pagination } = this.state;
    const {bizSourceData} = this.props;
    // const { getFieldProps } = this.props.form;
    // const onemonthago = moment().add('months', -1).format('YYYY-MM-DD');
    // 超过一个月和状态为 500: '已驳回',501: '发货完毕'的不能下载
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    //   getCheckboxProps: record => ({
    //     disabled: (format(new Date(record.gmtCreate)) < onemonthago || record.status === 500 || record.status === 501),
    //   }),
    //   onSelect(record, selected, selectedRows) {
    //     self.setState({
    //       // selecteCount: selectedRows.length,
    //       downloadData: selectedRows,
    //     });
    //   },
    //   onSelectAll(selected, selectedRows) {
    //     self.setState({
    //       // selecteCount: selectedRows.length,
    //       downloadData: selectedRows,
    //     });
    //   },
    // };
    this.columns = [
      {
        title: '申请单号',
        dataIndex: 'orderId',
      }, {
        title: '申请人/时间',
        dataIndex: 'applicant',
        render(text, record) {
          return [record.applicant, <br />, format(new Date(record.gmtCreate))];
        },
      }, {
        title: '申请单状态',
        dataIndex: 'status',
        render(text) {
          if (!text) {
            return '';
          }
          return STATUS[text];
        },
      }, {
        title: this.props.bizSourceData === 'ISV_STUFF' ? 'ISV名称/编号' : '商户名称/编号',
        dataIndex: 'storageType',
        render(text, record) {
          return [record.storageName, <br />, record.storageCode];
        },
      }, {
        title: '操作',
        render(text, record) {
          return (<div>
                <span><a rel="noopener noreferrer" href={'#/material/applicationManagement/alipayApplyDetail/' + record.orderId + '?bizSource=' + bizSourceData} target="_blank">详情&nbsp;</a></span>
              </div>);
        },
      },
    ];
    return (
      <div>
        <div style={{marginTop: '27px'}}></div>
        <Table
          columns={this.columns}
          bordered
          rowKey={r => r.orderId}
          // rowSelection={this.props.bizSourceData === 'ISV_STUFF' ? rowSelection : null}
          dataSource={this.state.data}
          loading={loading}
          expandedRowRender={this.expandedRowRender}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange}
        />
      </div>
    );
  },
});

export default AlipayApplicationRecordTable;
