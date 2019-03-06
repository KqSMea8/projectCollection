import React, {PropTypes} from 'react';
import {message, Breadcrumb, Button, Table, Modal} from 'antd';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev, floatAdd} from '../../../common/utils';
import {moneyCut} from '../common/NumberUtils';
import FillCourierModel from './FillCourierModel';
import InvalidModel from './InvalidModel';
import {transFormData, transMMddData} from '../../../common/dateUtils';
import {invoiceTypeMap} from '../../../common/OperationLogMap';
import permission from '@alipay/kb-framework/framework/permission';
import {complainHelper} from './bill/constants.js';
import './bills.less';
const confirm = Modal.confirm;

const mailTypeMap = {'01': '寄送', '02': '退回'};
const BillsDetail = React.createClass({
  propTypes: {
    id: PropTypes.string,
  },

  getInitialState() {
    return {
      data: [],
      invalidVisible: false,
      BillByInvoiceIdData: [],
      mailInfoVOdata: [],
      loading: true,
    };
  },
  componentWillMount() {
    this.fetch();
    this.getInvoiceMail();
    this.getBillByInvoiceId();
  },
  getInvoiceAmt() {
    const invoiceData = this.state.data.apInvoiceLineVOs;
    let items = 0;
    let taxAmtAmount = 0;
    let taxExclusiveAmtAmount = 0;
    for (let i = 0; i < invoiceData.length; i++) {
      const taxAmt = invoiceData[i].taxAmt || {};
      const taxExclusiveAmt = invoiceData[i].taxExclusiveAmt || {};
      taxAmtAmount = taxAmtAmount + Number(taxAmt.amount);
      taxExclusiveAmtAmount = taxExclusiveAmtAmount + Number(taxExclusiveAmt.amount);
    }
    items = floatAdd(taxAmtAmount, Number(taxExclusiveAmtAmount));
    if (isNaN(items)) {
      this.setState({
        invoiceAmt: 0,
      });
    } else {
      this.setState({
        invoiceAmt: items,
      });
    }
  },
  getBillByInvoiceId() {
    const params = {
      invoiceId: this.props.params.invoiceId,
    };
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/merchantRebateBillByInvoiceId.json'),
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            loading: false,
            BillByInvoiceIdData: result.data,
          });
        }
      },
    });
  },
  getInvoiceMail() {
    const params = {
      invoiceId: this.props.params.invoiceId,
    };
    if (permission('SALE_REBATE_BILL_QUERY')) {
      if (params.invoiceId) {
        ajax({
          url: appendOwnerUrlIfDev('/sale/rebate/getInvoiceMail.json'),
          method: 'post',
          data: params,
          type: 'json',
          success: (result) => {
            if (result.status && result.status === 'succeed') {
              this.setState({
                loading: false,
                mailInfoVOdata: result.data || [],
              });
            }
          },
        });
      }
    } else {
      this.setState({
        loading: false,
      });
      message.warn('你没有操作权限', 3);
    }
  },
  fetch() {
    this.setState({
      loading: true,
    });
    const invoiceNo = decodeURIComponent(this.props.params.invoiceNo);
    const params = {
      invoiceNo: invoiceNo,
      invoiceCode: this.props.params.invoiceCode,
    };
    if (permission('SALE_REBATE_BILL_QUERY')) {
      ajax({
        url: appendOwnerUrlIfDev('/sale/rebate/getInvoice.json'),
        method: 'post',
        data: params,
        type: 'json',
        success: (result) => {
          if (!result) {
            return;
          }
          if (result.status && result.status === 'succeed') {
            this.setState({
              loading: false,
              data: result.data,
            });
            this.getInvoiceAmt();
          }
        },
      });
    } else {
      this.setState({
        loading: false,
      });
      message.warn('你没有查询快递信息的操作权限', 3);
    }
  },
  gpTochangeBill(invoiceNo, invoiceCode) {
    const invoiceNoUrl = encodeURIComponent(invoiceNo);
    window.open('#/accountBill/submitInvoice/' + invoiceNoUrl + '/' + invoiceCode + '?instId=' + this.props.location.query.instId);
  },
  handleOk(values) {
    const self = this;
    this.setState({
      ModalVisible: false,
    });
    confirm({
      title: '你是否覆盖信息?',
      content: '以当前修改的结果，覆盖原来的信息',
      onOk() {
        ajax({
          url: appendOwnerUrlIfDev('/sale/rebate/modifyInvoiceMailInfo.json'),
          method: 'post',
          data: values,
          type: 'json',
          success: (result) => {
            if (result.status && result.status === 'succeed') {
              message.success('提交成功', 3);
              self.fetch();
              self.getInvoiceMail();
              self.getBillByInvoiceId();
            }
          },
        });
      },
      onCancel() {},
    });
  },
  goTochangeMail() {
    this.setState({
      ModalVisible: true,
    });
  },
  invalidHandleCancel() {
    this.setState({
      ModalVisible: false,
    });
  },
  invalidOk(values) {
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
              if (result.invoiceNo) {
                window.location.hash = `#/accountbill/invoicesDetail/${result.invoiceNo}/${values.invoiceCode}/${values.invoiceId}?instId=${values.buyerInstId}`;
                window.location.reload();
              } else {
                window.location.hash = `#/accountBill/InvoicesList`;
              }
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
  invalidModal(id) {
    this.setState({
      invoiceId: id,
      invalidVisible: true,
    });
  },
  invalidCancel() {
    this.setState({
      invalidVisible: false,
    });
  },
  render() {
    const columnsI = [{
      title: '货物或应税劳务、服务名称',
      dataIndex: 'productName',
      width: 210,
    }, {
      title: '规格型号',
      dataIndex: 'productSpecification',
      width: 150,
    }, {
      title: '单位',
      dataIndex: 'measurementUnit',
      width: 200,
    }, {
      title: '数量',
      dataIndex: 'quantity',
      width: 150,
    }, {
      title: '单价(元)',
      dataIndex: 'unitAmt',
      width: 150,
      render(text) {
        let unitAmt = '';
        if (!text || text === 0) {
          unitAmt = <span></span>;
        } else {
          unitAmt = <span>{moneyCut(text, 2)}</span>;
        }
        return unitAmt;
      },
    }, {
      title: '金额(元)',
      dataIndex: 'taxExclusiveAmt',
      width: 150,
      render(text) {
        return <span>{text && moneyCut(text.amount, 2)}</span>;
      },
    }, {
      title: '税率',
      dataIndex: 'taxRate',
      width: 150,
      render(text) {
        return <span>{text && !isNaN(text) ? text * 100 + '%' : ''}</span>;
      },
    }, {
      title: '税额(元)',
      dataIndex: 'taxAmt',
      width: 150,
      render(text) {
        return <span>{text && moneyCut(text.amount, 2)}</span>;
      },
    }];
    const columnsMail = [{title: '寄送时间', dataIndex: 'mailDate',
    render(t) {
      return t ? t.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3') : '';
    }}, {title: '类型', dataIndex: 'mailType',
      render(t) {
        return mailTypeMap[t];
      },
    }, {title: '快递单号 (公司)', dataIndex: 'trackingNo',
      render(t, r) {
        return t ? (t + '(' + r.expressCompanyName + ')') : '';
      },
    }, {title: '操作人', dataIndex: 'creator',
      render(t, r) {
        return r.mailType === '01' ? t : r.lastModifier;
      },
    }, {title: '备注', dataIndex: 'mome', width: 300,
      render(t, r) {
        let dom = '-';
        if (r.mailType === '01') {
          dom = (<div>
          <div> 退票收件人姓名： {r.senderName}</div>
          <div> 联系方式： {r.senderTel}</div>
          <div> 退票收件地址：{r.senderAddress}</div>
        </div>);
        } else if (r.mailType === '02') {
          dom = (<div>
          <div> 收件人姓名： {r.recipientsName}</div>
          <div> 联系方式： {r.recipientsTel}</div>
          <div> 收件地址：{r.recipientsAddress}</div>
        </div>);
        }
        return dom;
      },
    }];
    const limitHeight = 6;
    const heightStyle = {
      height: limitHeight > 6 ? '650px' : 'auto',
      overflow: 'auto',
      borderBottom: '0px solid #e9e9e9',
    };
    const {data, mailInfoVOdata, BillByInvoiceIdData} = this.state;
    const ApInvoiceLineVO = data.apInvoiceLineVOs;
    const invoiceStatu = {
      '01': '发票已提交',
      '02': '审核中(已收票)',
      '03': '已审核',
      '04': '已驳回',
      '05': '已认证',
      '06': '已撤回',
      '07': '已作废',
    };
    const isShowChangeInvoiceButton = data.invoiceStatus === '01' || data.invoiceStatus === '04' || data.invoiceStatus === '06';
    return (
      <div className="kb-detail-main">
        <div className="app-detail-header" style= {{borderTop: '0px'}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item key="1" href="#/accountbill/InvoicesList">发票查询</Breadcrumb.Item>
            <Breadcrumb.Item key="2">发票详情</Breadcrumb.Item>
          </Breadcrumb>
       </div>
       <div style={{float: 'right', marginTop: -40}}>
         {permission('SALE_REBATE_INVOICE_EDIT') && isShowChangeInvoiceButton && <Button type="primary" onClick={this.gpTochangeBill.bind(this, data.invoiceNo, data.invoiceCode)}>修改发票及账单信息</Button>}
         {(permission('SALE_REBATE_MAIL_EDIT') && data.mailStatus === '02') && <Button type="primary" style={{marginLeft: 15}} onClick={this.goTochangeMail.bind(this, data.invoiceId)}>修改快递信息</Button>}
         {(permission('SALE_REBATE_INVOICE_CANCEL') &&
           data.invoiceStatus === '01'
           && data.mailStatus === '01'
           && data.invoiceType !== '06'
           && data.invoiceType !== '07'
          ) &&
           (<span>
              <Button type="ghost" style={{marginLeft: 15}} onClick={this.invalidModal.bind(this, data.invoiceId)}>撤回</Button>
            </span>)
           }
          {(permission('SALE_REBATE_INVOICE_INVALID') &&
            data.invoiceStatus === '01'
            && data.mailStatus === '01'
            && data.invoiceType !== '06'
            && data.invoiceType !== '07'
          ) && <Button type="ghost" style={{marginLeft: 15}} onClick={this.handleCancellation.bind(this, data)}>作废</Button>}
       </div>
            <div>
              <div>
                <h3 className="kb-page-sub-title" style={{display: 'inline-block'}}>发票信息</h3>
                <a className="bill-font" target="_target" style={{float: 'right', margin: '10px 0'}} href={complainHelper}>发票在线客服</a>
              </div>
              <div className="invoicse-wrap">
              <div className="invoies-buy">
                <div className="invoies-buy-txt">
                  <p><span>购买方</span></p>
                </div>
                <div className="invoies-buy-con">
                  <div className="invoies-buy-con-list">
                    <p className="invoies-buy-con-title">名称:</p>
                    <p className="invoies-buy-con-titleR">{data.buyerInvoiceTitle}</p>
                  </div>
                  <div className="invoies-buy-con-list">
                    <p className="invoies-buy-con-title">纳税人识别号:</p>
                    <p className="invoies-buy-con-titleR">{data.buyerTaxNo}</p>
                  </div>
                  <div className="invoies-buy-con-list">
                    <p className="invoies-buy-con-title">地址/电话:</p>
                    <p className="invoies-buy-con-titleR">{data.buyerAddress}/{data.buyerTelephone}</p>
                  </div>
                  <div className="invoies-buy-con-list">
                    <p className="invoies-buy-con-title">开户行及账号:</p>
                    <p className="invoies-buy-con-titleR">{data.buyerBankName}/{data.buyerBankAccount}</p>
                  </div>
                </div>
              </div>
              <div className="invoies-buy" style={{marginLeft: '2%'}}>
                <div className="invoies-buy-txt">
                  <p><span>销售方</span></p>
                </div>
                <div className="invoies-buy-con">
                  <div className="invoies-buy-con-list">
                    <p className="invoies-buy-con-title">名称:</p>
                    <p className="invoies-buy-con-titleR">{data.sellerCompanyName}</p>
                  </div>
                  <div className="invoies-buy-con-list">
                    <p className="invoies-buy-con-title">纳税人识别号:</p>
                    <p className="invoies-buy-con-titleR">{data.sellerTaxNo}</p>
                  </div>
                  <div className="invoies-buy-con-list">
                    <p className="invoies-buy-con-title">地址/电话:</p>
                    <p className="invoies-buy-con-titleR">{data.sellerAddress}/{data.sellerTelephone}</p>
                  </div>
                  <div className="invoies-buy-con-list">
                    <p className="invoies-buy-con-title">开户行及账号:</p>
                    <p className="invoies-buy-con-titleR">{data.sellerBankName}/{data.sellerBankAccount}</p>
                  </div>
                </div>
              </div>
            </div>
              <table className="kb-detail-table-4">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">发票类型</td>
                    <td>{invoiceTypeMap[data.invoiceType]}</td>
                    <td className="kb-detail-table-label">发票号</td>
                    <td>{data.invoiceNo}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">发票代码</td>
                    <td>{data.invoiceCode}</td>
                    <td className="kb-detail-table-label">开票日期</td>
                    <td>{transFormData(data.invoiceDate)}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">发票状态</td>
                    <td>{invoiceStatu[data.invoiceStatus]}</td>
                    <td className="kb-detail-table-label"></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">备注</td>
                    <td colSpan="3">{data.memo}</td>
                  </tr>
                </tbody>
              </table>
              <h3 className="kb-page-sub-title"></h3>
              <Table
                rowKey={record => record.invoiceLineId}
                columns={columnsI}
                style={heightStyle}
                dataSource={ApInvoiceLineVO}
                pagination={false}
                footer={() => <div style={{height: 25}}><div style={{float: 'right', fontSize: '14px'}}>总价税合计：<p style={{float: 'right', fontSize: '18px', color: '#ff6e0d'}}>
                <span style={{marginLeft: 20}}>{this.state.invoiceAmt && moneyCut(this.state.invoiceAmt, 2)}元</span></p></div></div>} />
            </div>
            {BillByInvoiceIdData && BillByInvoiceIdData.length > 0 &&
            (<div>
              <h3 className="kb-page-sub-title">账单信息</h3>
                <table className="detailTable">
                  <tbody>
                    <tr>
                    <td className="detailTable-label">账单号</td>
                    <td className="detailTable-label">业务周期</td>
                    <td className="detailTable-label">已开票金额(元)</td>
                    </tr>
                    {
                      BillByInvoiceIdData && BillByInvoiceIdData.map((r, i) => {
                        const invoiceAmt = r.invoiceAmt || {};
                        return (<tr key={i}>
                          <td>{r.billNo}</td>
                          <td>{transMMddData(r.startDate)}至{transMMddData(r.endDate)}</td>
                          <td>{invoiceAmt.amount && moneyCut(invoiceAmt.amount, 2)}</td>
                        </tr>);
                      })
                    }
                </tbody>
              </table>
            </div>)}
            {mailInfoVOdata.length > 0 &&
              <div>
                <h3 className="kb-page-sub-title">快递信息</h3>
                <Table columns={columnsMail}
                 rowKey={r => r.mailId}
                 dataSource={mailInfoVOdata}
                 pagination={false}
                 bordered/>
              </div>}
              {(data.invoiceId && mailInfoVOdata.length > 0) && <FillCourierModel
                mailInfoVOdata={mailInfoVOdata}
                ModalVisible={this.state.ModalVisible}
                handleCancel={this.invalidHandleCancel}
                handleOk={this.handleOk}
                invoiceId={data.invoiceId} />}
        <InvalidModel
          invalidVisible={this.state.invalidVisible}
          invalidHandleCancel={this.invalidCancel}
          invalidHandleOk={this.invalidOk} />
      </div>
    );
  },

});

export default BillsDetail;
