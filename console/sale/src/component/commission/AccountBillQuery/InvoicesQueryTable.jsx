import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {Button, Table, Popover, message, Modal} from 'antd';
import FillCourierModel from './FillCourierModel';
import InvalidModel from './InvalidModel';
import {transFormData} from '../../../common/dateUtils';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import {moneyCut} from '../common/NumberUtils';
import {invoiceTypeMap, invoiceTypeMapList} from '../../../common/OperationLogMap';
import permission from '@alipay/kb-framework/framework/permission';
import {Divider} from '@alipay/kb-framework-components/lib/layout';
const confirm = Modal.confirm;

const InvoicesQueryTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    form: PropTypes.any,
  },

  getInitialState() {
    return {
      PopoverData: {},
      invalidVisible: false,
      ModalVisible: false,
      visible: false,
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
    };
  },

  componentWillMount() {
    this.setState({
      loading: false,
    });
    this.receiveInvoiceMailInfo();
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },

  onTableChange(pagination, filters = {}) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      invoiceType: filters.invoiceType && filters.invoiceType.join(','),
    };
    this.fetch(params);
  },

  onSelectChange(selectedRowKeys) {
    this.setState({
      selectedIds: selectedRowKeys,
    });
  },
  hide() {
    this.setState({
      visible: false,
    });
  },
  handleVisibleChange(visible) {
    this.setState({ visible });
  },
  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },
  receiveInvoiceMailInfo() {
    if (permission('SALE_REBATE_INVOICE_MAIL')) {
      ajax({
        url: appendOwnerUrlIfDev('/sale/rebate/receiveInvoiceMailInfo.json'),
        method: 'post',
        data: '',
        type: 'json',
        success: (result) => {
          result.data = result.data || {};
          this.setState({
            PopoverData: result.data,
          });
        },
      });
    } else {
      message.warn('你没有查看快递信息权限', 3);
    }
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });
    if (permission('SALE_REBATE_INVOICE_QUERY')) {
      ajax({
        url: appendOwnerUrlIfDev('/sale/rebate/rebateInvoiceList.json'),
        method: 'post',
        data: params,
        type: 'json',
        success: (result) => {
          result.data = result.data || {};
          const dataList = [];
          for (let i = 0; i < result.data.length; i++) {
            dataList.push(Object.assign({}, result.data[i].apInvoiceVO, result.data[i].mailInfoVO, {'taxRate': result.data[i].taxRate}, {amt: result.data[i].amt || ''}, {taxAmt: result.data[i].taxAmt}));
          }
          const pagination = {...this.state.pagination};
          pagination.total = result.totalCount;
          this.setState({
            loading: false,
            data: dataList,
            pagination,
          });
        },
        error: () => {
          this.setState({
            loading: false,
          });
        },
      });
    } else {
      this.setState({
        loading: false,
      });
      message.warn('你没有操作权限', 3);
    }
  },
  goToFillCourier() {
  },


  showModal() {
    this.setState({
      ModalVisible: true,
    });
  },
  handleCancel() {
    this.setState({
      ModalVisible: false,
    });
  },

  // 修改快递信息
  handleOk(values) {
    values.invoiceIds = this.state.selectedIds;
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/addInvoiceMailInfo.json'),
      method: 'post',
      data: values,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('关联成功', 3);
          this.setState({
            ModalVisible: false,
          });
          window.location.reload();
        }
      },
    });
  },

  handleCancellation(values) {
    confirm({
      title: '是否确认作废',
      content: '是否作废这张发票',
      onOk: () => {
        ajax({
          url: appendOwnerUrlIfDev('/sale/rebate/invalidInvoice.json'),
          method: 'post',
          data: {
            invoiceId: values.invoiceId,
            invoiceNo: values.invoiceNo,
            invoiceCode: values.invoiceCode,
            sellerIpRoleId: values.sellerIpRoleId
          },
          type: 'json',
          success: (result) => {
            if (result.status === 'succeed') {
              message.success('发票已作废', 3);
              this.fetch();
            } else {
              if (result.resultMsg) {
                message.error(result.resultMsg, 3);
              }
            }
          },
        });
      },
      onCancel() {},
    });
  },

  invalidHandleOk(values) {
    const self = this;
    values.invoiceId = this.state.invoiceId;
    this.setState({
      invalidVisible: false,
    });
    confirm({
      title: '是否确认撤回',
      content: '是否撤回这张发票',
      onOk() {
        ajax({
          url: appendOwnerUrlIfDev('/sale/rebate/cancelInvoice.json'),
          method: 'post',
          data: values,
          type: 'json',
          success: (result) => {
            if (result.status === 'succeed') {
              message.success('发票已撤回', 3);
              self.fetch();
            }
          },
        });
      },
      onCancel() {},
    });
  },

  invalidShowModal(id) {
    this.setState({
      invoiceId: id,
      invalidVisible: true,
    });
  },
  invalidHandleCancel() {
    this.setState({
      invalidVisible: false,
    });
  },
  render() {
    const columns = [
      {
        title: '发票代码/发票号',
        dataIndex: 'invoiceNo',
        width: 150,
        render(text, record) {
          return (<span>{record.invoiceCode}
            <br/>
          <span>{text}</span>
          </span>);
        },
      },
      {
        title: '价税合计金额(元)',
        width: 120,
        dataIndex: 'amt',
        render(text) {
          return (<span>
        {text && moneyCut(text.amount, 2)}
          </span>);
        },
      },
      {
        title: '开票日期',
        width: 90,
        dataIndex: 'invoiceDate',
        render(text) {
          return transFormData(text);
        },
      },
      {
        title: '购买方名称',
        width: 100,
        dataIndex: 'buyerInvoiceTitle',
      },
      {
        title: '发票状态',
        width: 90,
        dataIndex: 'invoiceStatus',
        render(text) {
          const invoiceStatu = {
            '01': '发票已提交',
            '02': '审核中(已收票)',
            '03': '已审核',
            '04': '已驳回',
            '05': '已认证',
            '06': '已撤回',
            '07': '已作废',
          };
          return invoiceStatu[text];
        },
      },
      {
        title: '发票类型',
        width: 90,
        dataIndex: 'invoiceType',
        render(text) {
          return invoiceTypeMap[text];
        },
        filters: invoiceTypeMapList,
        onFilter: (value, record) => record.invoiceType.indexOf(value) === 0,
      },
      {
        title: '快递信息',
        width: 120,
        dataIndex: 'trackingNo',
        render(text, r) {
          return <span>{text}{r.expressCompanyName && <span>({r.expressCompanyName})</span>}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 150,
        render: (t, r) => {
          let menu;
          let invoiceNo;
          invoiceNo = encodeURIComponent(r.invoiceNo);
          if (permission('SALE_REBATE_INVOICE_CANCEL')) {
            if (
              r.invoiceStatus === '01'
              && r.mailStatus === '01'
              && r.invoiceType !== '06'
              && r.invoiceType !== '07'
            ) {
              menu = (
                <span>
                  <Divider />
                  <a onClick={this.invalidShowModal.bind(this, r.invoiceId)}>撤回</a>
                </span>);
            }
          }
          return (<span>
              <a target="_blank" href={'#/accountbill/invoicesDetail/' + invoiceNo + '/' + r.invoiceCode + '/' + r.invoiceId + '?instId=' + r.buyerInstId}>详情</a>
              {menu}
              {
                permission('SALE_REBATE_INVOICE_INVALID')
                && r.invoiceStatus === '01'
                && r.mailStatus === '01'
                && r.invoiceType !== '06'
                && r.invoiceType !== '07'
                && (
                <span>
                    <Divider/>
                    <a onClick={this.handleCancellation.bind(this, r)}>作废</a>
                </span>
              )}
          </span>);
        },
      },
    ];
    const {pagination, selectedIds, loading, data, PopoverData} = this.state;
    this.rowSelection = {
      selectedRowKeys: selectedIds,
      onChange: this.onSelectChange,
      getCheckboxProps(record) {
        return {
          disabled: (record.mailStatus !== '01' && record.mailStatus !== '05' && record.mailStatus !== '06'),
        };
      },
    };
    const buttonArea = (
     !loading && data && data.length > 0 &&
      (<div>
          <span style={{marginRight: 12}}>已选({selectedIds.length})</span>
            <Button disabled={selectedIds.length === 0 && true} type="primary" onClick={this.showModal.bind(this, selectedIds)}>
              填写快递信息
            </Button>
        </div>
      )
    );
    return (
      <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', right: '200px', top: '-40px'}}>
          <Popover content=
          {<div style={{width: 500, height: 200}}>
            <p style={{marginTop: 10, color: '#ff6e0d'}}>发票寄送到付一律拒收，由此产生的发票遗失风险请自行承担。</p>
            <table className="kb-detail-table-2" style={{marginTop: 16}}>
              <tbody>
                <tr>
                  <td className="kb-detail-table-label">收件人</td>
                  <td>{PopoverData.name}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">联系方式</td>
                  <td>{PopoverData.telephone}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">收件地址</td>
                  <td>{PopoverData.address}</td>
                </tr>
              </tbody>
            </table>
            </div>
          } title="请将发票（发票联和抵扣联）寄送至: " trigger="click" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
            <a type="primary" style={{fontSize: 16}}>发票邮寄信息</a>
          </Popover>
        </div>
        {permission('SALE_REBATE_MAIL_ADD') && buttonArea && <div style={{marginBottom: 10}}>{buttonArea}</div>}
        <Table columns={columns}
          rowKey={r => r.invoiceId}
          rowSelection={this.rowSelection}
          dataSource={data}
          loading={loading}
          locale={{emptyText: !this.props.params ? '暂无数据,请输入查询条件' : '搜不到结果，换下其他搜索条件吧~'}}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
        {permission('SALE_REBATE_MAIL_ADD') && buttonArea && <div style={{marginBottom: 10}}>{buttonArea}</div>}

        <FillCourierModel
          ModalVisible={this.state.ModalVisible}
          handleCancel={this.handleCancel}
          handleOk={this.handleOk} />

        <InvalidModel
          invalidVisible={this.state.invalidVisible}
          invalidHandleCancel={this.invalidHandleCancel}
          invalidHandleOk={this.invalidHandleOk} />
      </div>
    );
  },
});

export default InvoicesQueryTable;
