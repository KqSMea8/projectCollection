import React, {PropTypes} from 'react';
import {Form, Breadcrumb, message, Popconfirm, Button, Modal, Table, Collapse, Row, Col, Input, Select, DatePicker, InputNumber, Alert} from 'antd';
import AddAccountBillModal from './AddAccountBillModal';
import {appendOwnerUrlIfDev, floatAdd, floatSub} from '../../../common/utils';
import {moneyCut} from '../common/NumberUtils';
import ajax from 'Utility/ajax';
import {formatYYYYMMDD, transFormData, toDate, transMMddData} from '../../../common/dateUtils';
import './bills.less';
import moment from 'moment';
import {BillsStatuMap, LinkStatusMap} from '../../../common/OperationLogMap';
// import BillGuideModal from './bill/BillGuideModal';
import BillCustomerService from './bill/BillCustomerService';
import BillGuideModal from './bill/BillGuideModal';
import log, {SubType} from '../common/log';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
function errorMsg(resultMsg) {
  Modal.error({
    title: (<span style={{fontWeight: 400, position: 'absolute', paddingRight: '40px', paddingTop: '8px'}}>{resultMsg}</span>),
    iconType: 'exclamation-circle',
    okText: '知道了',
  });
}
const SubmitInvoice = React.createClass({
  propTypes: {
    form: PropTypes.object,
    ids: PropTypes.any,
    invoiceNo: PropTypes.any,
    invoiceCode: PropTypes.any,
  },

  getInitialState() {
    return {
      // 发票类型（01专票，02普票）
      keys: '',
      // 账单信息
      billData: [],
      // 发票信息
      invoiceData: [],
      // 购买方信息
      buyerData: {},
      // 账单号
      billNos: '',
      instId: '',
      // 未回票(未上传发票)总金额 (未开票总金额)
      notUploadInvoiceAmt: 0,
      // 总价税合计
      invoiceAmt: 0,
      // 防止重复提交
      isLoading: true,
      invoiceTypeValue: '',
      addAccountBillModal: {
        visible: false,
        billData: null,
      }
    };
  },

  componentWillMount() {
    // 获取购买方相关的数据
    this.fetchBuyerData();
    // 设置回显发票信息的数据 和 账单数据
    this.getEditInvoiceBillData();
  },

  // 货物或应税劳务、服务名称
  onClickProductName(r, i, productName) {
    const {getFieldValue} = this.props.form;
    const {invoiceData} = this.state;
    invoiceData[i].productName = getFieldValue(productName);
  },

  // 规格型号
  onClickProductSpecification(r, i, productSpecification) {
    const {getFieldValue} = this.props.form;
    const {invoiceData} = this.state;
    invoiceData[i].productSpecification = getFieldValue(productSpecification);
  },

  // 单位
  onClickMeasurementUnit(r, i, measurementUnit) {
    const {getFieldValue} = this.props.form;
    const {invoiceData} = this.state;
    invoiceData[i].measurementUnit = getFieldValue(measurementUnit);
  },

  // 数量
  onClickQuantity(r, i, quantity) {
    const {getFieldValue} = this.props.form;
    const {invoiceData} = this.state;
    // 设置数量
    invoiceData[i].quantity = getFieldValue(quantity);
  },

  // 单价
  onClickUnitAmt(r, i, unitAmt) {
    const {getFieldValue} = this.props.form;
    const {invoiceData} = this.state;
    // 设置单价
    invoiceData[i].unitAmt = getFieldValue(unitAmt);
  },

  // 不含税金额 taxExclusiveAmt  invoiceData[i].taxExclusiveAmt  getFieldValue(taxExclusiveAmt) 这里的金额指的是不含税金额
  onClickTaxExclusiveAmt(r, i, taxExclusiveAmt) {
    const {getFieldValue} = this.props.form;
    const {invoiceData} = this.state;
    // 设置不含税金额
    invoiceData[i].taxExclusiveAmt = getFieldValue(taxExclusiveAmt);
    // 计算含税金额
    // const taxExclusiveAmtData = isNaN(invoiceData[i].taxExclusiveAmt) ? 0 : invoiceData[i].taxExclusiveAmt;
    // const taxAmt = isNaN(getFieldValue('taxAmt' + i)) ? 0 : getFieldValue('taxAmt' + i);
    // invoiceData[i].amt = taxExclusiveAmtData + taxAmt;
    // 获取总价税合计
    this.getInvoiceAmt();
  },

  // 税率
  onClickTaxRate(r, i, taxRate) {
    const {getFieldValue} = this.props.form;
    const {invoiceData} = this.state;
    // 设置税率
    invoiceData[i].taxRate = getFieldValue(taxRate);
  },

  // 税额 taxAmt invoiceData[i].taxAmt getFieldValue(taxAmt)
  onClickTaxAmt(r, i, taxAmt) {
    const {getFieldValue} = this.props.form;
    const {invoiceData} = this.state;
    // 设置税额
    invoiceData[i].taxAmt = getFieldValue(taxAmt);
    // 计算含税金额
    // const taxAmtData = isNaN(invoiceData[i].taxAmt) ? 0 : invoiceData[i].taxAmt;
    // const taxExclusiveAmt = isNaN(getFieldValue('taxExclusiveAmt' + i)) ? 0 : getFieldValue('taxExclusiveAmt' + i);
    // invoiceData[i].amt = taxAmtData + taxExclusiveAmt;
    // 获取总价税合计
    this.getInvoiceAmt();
  },

  // 新增帐单
  onAddAccountBill(billData) {
    this.setState({
      addAccountBillModal: {
        billData,
        visible: true,
      }
    });
  },

  // 取消新增帐单（点击取消按钮）
  onCancelAddAccountBill() {
    this.setState({
      addAccountBillModal: {
        billData: null,
        visible: false,
      }
    });
  },

  // 新增帐单成功
  onAddAccountBillOk(data) {
    this.addColumnsBRow(data);
    this.setState({
      addAccountBillModal: {
        visible: false,
        billData: null,
      }
    });
  },

  // 获取总价税合计=不含税金额+税额  //即开票金额
  getInvoiceAmt() {
    const {getFieldValue} = this.props.form;
    const {invoiceData} = this.state;
    let items = 0;
    let taxExclusiveAmt = 0;
    let taxAmt = 0;
    for (let i = 0; i < invoiceData.length; i++) {
      const taxExclusiveAmtAmount = isNaN(getFieldValue('taxExclusiveAmt' + i)) ? 0 : getFieldValue('taxExclusiveAmt' + i);
      const taxAmtAmount = isNaN(getFieldValue('taxAmt' + i)) ? 0 : getFieldValue('taxAmt' + i);
      taxExclusiveAmt = floatAdd(Number(taxExclusiveAmt), Number(taxExclusiveAmtAmount));
      taxAmt = floatAdd(Number(taxAmt), Number(taxAmtAmount));
    }
    items = floatAdd(Number(taxExclusiveAmt), Number(taxAmt));
    this.setState({
      invoiceAmt: items,
    });
  },

  // 未回票(未上传发票)总金额
  getNotUploadInvoiceAmt() {
    const {billData} = this.state;
    let sum = 0;
    let realBillAmt = 0;  // 应结算金额
    let invoiceAmt = 0;   // 已开票金额 (元)
    for (let i = 0; i < billData.length; i++) {
      // 获取应结算金额
      const realBillAmtObj = billData[i].realBillAmt || {};
      const realBillAmtAmount = isNaN(realBillAmtObj.amount) ? 0 : realBillAmtObj.amount;
      // 获取开票金额
      const invoiceAmtObj = billData[i].invoiceAmt || {};
      const invoiceAmtAmount = isNaN(invoiceAmtObj.amount) ? 0 : invoiceAmtObj.amount;
      realBillAmt = floatAdd(Number(realBillAmt), Number(realBillAmtAmount));
      invoiceAmt = floatAdd(Number(invoiceAmt), Number(invoiceAmtAmount));
    }
    sum = floatSub(Number(realBillAmt), Number(invoiceAmt));
    // sum = realBillAmt.amount - invoiceAmt.amount;
    this.setState({
      notUploadInvoiceAmt: sum,
    });
  },

  // 设置回显发票信息的数据 和账单数据
  getEditInvoiceBillData() {
    if (this.props.params.invoiceNo && this.props.params.invoiceCode) {
      const invoiceNo = decodeURIComponent(this.props.params.invoiceNo);
      const params = {
        invoiceNo: invoiceNo,
        invoiceCode: this.props.params.invoiceCode,
      };
      ajax({
        url: appendOwnerUrlIfDev('/sale/rebate/getInvoice.json'), // 发票详情信息
        type: 'json',
        data: params,
        method: 'post',
        success: (result) => {
          if (result.status === 'succeed') {
            // 把获取的发票列表信息,转化成需要的格式
            const invoiceDataW = result.data.apInvoiceLineVOs;
            const {invoiceData} = this.state;
            // 设置需要传参的数组参数
            for (let i = 0; i < invoiceDataW.length; i++) {
              // console.log(invoiceDataW);
              // const invoiceAmount = invoiceDataW[i].unitAmt || {};     // wb-ydd加的 @ wb-zdw
              // const unitAmt = invoiceAmount.amount === 0 ? '' : invoiceAmount.amount;
              const objY = {
                productName: invoiceDataW[i].productName,
                productSpecification: invoiceDataW[i].productSpecification,
                measurementUnit: invoiceDataW[i].measurementUnit,
                quantity: invoiceDataW[i].quantity || '',
                unitAmt: invoiceDataW[i].unitAmt,
                // amt: invoiceDataW[i].amt.amount,
                taxRate: invoiceDataW[i].taxRate,
                taxAmt: invoiceDataW[i].taxAmt.amount,
                taxExclusiveAmt: invoiceDataW[i].taxExclusiveAmt.amount,
              };
              invoiceData.push(objY);
              // 设置回显需要的数组的值
              const obj = {};
              obj['productName' + i] = invoiceDataW[i].productName;
              obj['productSpecification' + i] = invoiceDataW[i].productSpecification;
              obj['measurementUnit' + i] = invoiceDataW[i].measurementUnit;
              obj['quantity' + i] = invoiceDataW[i].quantity || '';
              obj['unitAmt' + i] = invoiceDataW[i].unitAmt;
              // obj['amt' + j] = invoiceData[j].amt; 含税金额不在页面上展示可以不用设置
              obj['taxRate' + i] = invoiceDataW[i].taxRate;
              obj['taxAmt' + i] = invoiceDataW[i].taxAmt.amount;
              obj['taxExclusiveAmt' + i] = invoiceDataW[i].taxExclusiveAmt.amount;
              this.props.form.setFieldsValue(obj);
              this.setState({
                obj: obj,
              });
            }
            // 把yyyymmdd时间转换成yyyy-mm-dd再转换成utc时间转换成格式
            result.data.invoiceDate = toDate(transFormData(result.data.invoiceDate));
            this.props.form.setFieldsValue(result.data);
            // 根据发票Id，查询关联的账单信息
            this.merchantRebateBillByInvoiceId(result.data.invoiceId);
            // 把发票id保存起来供后期使用
            this.setState({
              invoiceId: result.data.invoiceId,
            });
            // 获取总价税合计=不含税金额+税额
            this.getInvoiceAmt();
            // 在修改发票时把上次提交的发票金额 为避免+0.05出现的逻辑错误
            this.saveLastModifyInvoiceAmtData(result.data.apInvoiceLineVOs);
            // 可以提交
            this.setState({
              isLoading: false,
            });
          } else {
            if (result.resultMsg) {
              errorMsg(result.resultMsg);
            }
          }
        },
      });
    } else if (this.props.params.idNo && this.props.params.idCode) {
      const invoiceNo = decodeURIComponent(this.props.params.idNo);
      const params = {
        invoiceNo: invoiceNo,
        invoiceCode: this.props.params.idCode,
      };
      ajax({
        url: appendOwnerUrlIfDev('/sale/rebate/getInvoice.json'), // 发票详情信息
        type: 'json',
        data: params,
        method: 'post',
        success: (result) => {
          if (result.status === 'succeed') {
            // 把获取的发票列表信息,转化成需要的格式
            const invoiceDataW = result.data.apInvoiceLineVOs;
            const {invoiceData} = this.state;
            // 设置需要传参的数组参数
            for (let i = 0; i < invoiceDataW.length; i++) {
              const objY = {
                productName: invoiceDataW[i].productName,
                taxRate: invoiceDataW[i].taxRate,
              };
              invoiceData.push(objY);
              // 设置回显需要的数组的值
              const obj = {};
              obj['productName' + i] = invoiceDataW[i].productName;
              obj['taxRate' + i] = invoiceDataW[i].taxRate;
              this.props.form.setFieldsValue(obj);
              this.setState({
                obj: obj,
              });
            }
            // 把yyyymmdd时间转换成yyyy-mm-dd再转换成utc时间转换成格式
            result.data.invoiceDate = toDate(transFormData(result.data.invoiceDate));
            this.props.form.setFieldsValue(result.data);
            this.props.form.resetFields(['invoiceNo', 'invoiceCode']);
            // 根据发票Id，查询关联的账单信息
            this.setState({
              invoiceData,
              isLoading: false, // 可以提交
            });
            // 根据账单号获取账单数据(内部含有获取未回票(未上传发票)总金额)
            this.fetchBillData();
            // 获取总价税合计=不含税金额+税额
            this.getInvoiceAmt();
          } else {
            if (result.resultMsg) {
              errorMsg(result.resultMsg);
            }
          }
        },
      });
    } else if (this.props.params.ids) {
      // 当初次添加发票的时候
      const { invoiceData } = this.state;
      invoiceData.push(
        {
          productName: '', // 货物或应税劳务、服务名称
          productSpecification: '', // 规格型号
          measurementUnit: '', // 单位
          quantity: '', // 数量
          unitAmt: '', // 单价
          // amt: '',     // 含税金额
          taxRate: '',  // 税率
          taxAmt: '',  // 税额
          taxExclusiveAmt: '', // 不含税金额
        }
      );
      this.setState({
        invoiceData,
        isLoading: false, // 可以提交
      });
      // 根据账单号获取账单数据(内部含有获取未回票(未上传发票)总金额)
      this.fetchBillData();
      // 获取总价税合计=不含税金额+税额
      this.getInvoiceAmt();
    }
  },

  // 初次添加发票时,回填销售方数据(如果有就回填,没有就空着)
  getSalesData(sellerIpRoleId) {
    const params = {
      endTime: formatYYYYMMDD(moment().toDate()),
      startTime: formatYYYYMMDD(moment().add(-12, 'months').toDate()),
      merchantPid: sellerIpRoleId,
    };
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/rebateInvoiceList.json'),
      type: 'json',
      data: params,
      method: 'post',
      success: (result) => {
        if (result.status === 'succeed' && result.data.length !== 0) {
          const item = result.data[0].apInvoiceVO;
          const cache = {};
          cache.sellerCompanyName = item.sellerCompanyName;
          cache.sellerTaxNo = item.sellerTaxNo;
          cache.sellerAddress = item.sellerAddress;
          cache.sellerTelephone = item.sellerTelephone;
          cache.sellerBankName = item.sellerBankName;
          cache.sellerBankAccount = item.sellerBankAccount;
          this.props.form.setFieldsValue(cache);
        }
      },
      error: (result) => {
        if (result.resultMsg) {
          Modal.error({
            title: '失败',
            content: result.resultMsg,
          });
          // errorMsg(result.resultMsg);
        }
      },
    });
  },

  // 在添加和删除发票行的时候 回填发票列表里的数据
  setBackFieldsData(invoiceData) {
    for (let j = 0; j < invoiceData.length; j++) {
      // 设置回显需要的数组的值
      const obj = {};
      obj['productName' + j] = invoiceData[j].productName;
      obj['productSpecification' + j] = invoiceData[j].productSpecification;
      obj['measurementUnit' + j] = invoiceData[j].measurementUnit;
      obj['quantity' + j] = invoiceData[j].quantity;
      obj['unitAmt' + j] = invoiceData[j].unitAmt;
      // obj['amt' + j] = invoiceData[j].amt; 含税金额不在页面上展示可以不用设置
      obj['taxRate' + j] = invoiceData[j].taxRate;
      obj['taxAmt' + j] = invoiceData[j].taxAmt;
      obj['taxExclusiveAmt' + j] = invoiceData[j].taxExclusiveAmt;
      this.props.form.setFieldsValue(obj);
    }
  },
  // 在修改发票时把上次提交的发票金额 为避免+0.05出现的逻辑错误
  saveLastModifyInvoiceAmtData(result) {
    let items = 0;
    let taxExclusiveAmt = 0;
    let taxAmt = 0;
    for (let i = 0; i < result.length; i++) {
      const taxExclusiveAmtObj = result[i].taxExclusiveAmt || {};
      const taxAmtObj = result[i].taxAmt || {};
      const taxExclusiveAmtAmount = isNaN(taxExclusiveAmtObj.amount) ? 0 : taxExclusiveAmtObj.amount;
      const taxAmtAmount = isNaN(taxAmtObj.amount) ? 0 : taxAmtObj.amount;
      taxExclusiveAmt = floatAdd(Number(taxExclusiveAmt), Number(taxExclusiveAmtAmount));
      taxAmt = floatAdd(Number(taxAmt), Number(taxAmtAmount));
    }
    items = floatAdd(Number(taxExclusiveAmt), Number(taxAmt));
    this.setState({
      saveLastModifyInvoiceAmt: items,
    });
  },

  // 根据发票Id，查询关联的账单信息
  merchantRebateBillByInvoiceId(invoiceId) {
    const params = {
      invoiceId: invoiceId,
    };
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/merchantRebateBillByInvoiceId.json'),
      type: 'json',
      data: params,
      method: 'post',
      success: (result) => {
        if (result.status === 'succeed' && result.data.length !== 0) {
          const data = result.data;
          // 把数组里的billNo拼接成用逗号隔开的字符串
          let billNos = data[0].billNo;
          for (let i = 0; i < data.length; i++) {
            if (i === 0) {
              continue;
            } else {
              billNos = billNos + ',' + data[i].billNo;
            }
          }
          this.setState({
            // 账单信息
            billData: result.data,
            // 账单号
            billNos: billNos,
            // 签约主题
            instId: result.data[0].instId,
            // 销方sellerIpId
            sellerIpId: result.data[0].mid,
            // 销方角色sellerIpRoleId
            sellerIpRoleId: result.data[0].ipRoleId,
          });
          // 获取未回票(未上传发票)总金额
          this.getNotUploadInvoiceAmt();
        }
      },
      error: (result) => {
        if (result.resultMsg) {
          errorMsg(result.resultMsg);
        }
      },
    });
  },

  // 根据账单号获取账单数据
  fetchBillData() {
    const params = {
      billNos: this.props.params.ids,
    };

    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/merchantRebateBillByBillNos.json'),
      type: 'json',
      data: params,
      method: 'get',
      success: (result) => {
        if (result.status === 'succeed' && result.data.length !== 0) {
          this.setState({
            // 账单信息
            billData: result.data,
            // 账单号
            billNos: params.billNos,
            // 销方sellerIpId
            sellerIpId: result.data[0].mid,
            // 销方角色sellerIpRoleId
            sellerIpRoleId: result.data[0].ipRoleId,
            // 签约主题
            instId: result.data[0].instId,
          });
          // 初次添加发票时,回填销售方数据(如果有就回填,没有就空着)
          if (!this.props.params.idNo) {
            this.getSalesData(result.data[0].ipRoleId);
          }
          // 获取未回票(未上传发票)总金额
          this.getNotUploadInvoiceAmt();
        }
      },
      error: (result) => {
        if (result.resultMsg) {
          errorMsg(result.resultMsg);
        }
      },
    });
  },
  // 获取购买方信息(没有入参)
  fetchBuyerData() {
    const params = {
      instId: this.props.location.query.instId,
    };
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/queryInvoiceUserInfo.json'),
      type: 'json',
      data: params,
      method: 'get',
      success: (result) => {
        if (result.status === 'succeed' && result.data !== null) {
          this.setState({
            buyerData: result.data,
          });
        }
      },
      error: (result) => {
        if (result.resultMsg) {
          errorMsg(result.resultMsg);
        }
      },
    });
  },

  // 添加账单
  addColumnsBRow(result) {
    const {billData, billNos} = this.state;
    const items = billNos + ',' + result.billNo;
    billData.push(result);
    this.setState({
      billData,
      billNos: items,
    });
    // 获取未回票(未上传发票)总金额
    this.getNotUploadInvoiceAmt();
  },

  // 删除账单
  removeColumnsB(record, index) {
    const {billData, billNos} = this.state;
    if (billData.length === 1) {
      // message.error('请至少保留一条记录', 3);
      errorMsg('请至少保留一条记录');
      return false;
    }
    let items = [];
    items = billNos.split(',');
    for (let i = 0; i < items.length; i++) {
      if (items[i] === record.billNo) {
        items.splice(i, 1);
        break;
      }
    }
    const chche = items.join(',');
    billData.splice(index, 1);
    this.setState({
      billData,
      billNos: chche,
    });
    // 获取未回票(未上传发票)总金额
    this.getNotUploadInvoiceAmt();
  },
  // 添加发票行
  showConfirm(r, i) {
    const self = this;
    Modal.confirm({
      title: '提示',
      content: `当一张纸质发票有多行内容条目时，选择【新增发票行】；如果发票有多张，请点击提交后，请点击【返回】，进入发票提交页面再次选择关联.`,
      okText: '新增发票行',
      onOk() {
        self.addColumnsIRow(r, i);
      },
      onCancel() {},
    });
  },
  // 添加发票行
  addColumnsIRow(r, i) {
    log(SubType.ADD_INVOICE_ITEM_CLICK);
    const {getFieldValue} = this.props.form;
    const {invoiceData} = this.state;
    invoiceData.push({
      productName: getFieldValue('productName' + i), // 货物或应税劳务、服务名称
      productSpecification: getFieldValue('productSpecification' + i), // 规格型号
      measurementUnit: getFieldValue('measurementUnit' + i), // 单位
      quantity: getFieldValue('quantity' + i), // 数量
      unitAmt: getFieldValue('unitAmt' + i), // 单价
      taxExclusiveAmt: getFieldValue('taxExclusiveAmt' + i), // 不含税金额
      taxRate: getFieldValue('taxRate' + i),  // 税率
      taxAmt: getFieldValue('taxAmt' + i),  // 税额
      // amt: invoiceData[i].amt,     // 含税金额 不需要在页面展示
    });
    this.setState({
      invoiceData,
    });
    // 设置回显
    this.setBackFieldsData(invoiceData);
    // 获取总价税合计
    this.getInvoiceAmt();
  },

  // 删除发票行
  removeColumnsI(r, i) {
    const {invoiceData} = this.state;
    if (invoiceData.length === 1) {
      // message.error('请至少保留一条记录', 3);
      errorMsg('请至少保留一条记录');
      return false;
    }
    invoiceData.splice(i, 1);
    this.setState({
      invoiceData,
    });
    // 设置回显
    this.setBackFieldsData(invoiceData);
    // 获取总价税合计
    this.getInvoiceAmt();
  },
  alterSubmit() {
    if (this.props.params.invoiceNo) {
      const self = this;
      confirm({
        title: '你是否覆盖信息？',
        content: '以当前修改的结果，覆盖原来的信息',
        onOk() {
          self.submitApply();
        },
      });
    } else {
      this.submitApply();
    }
  },
  submitApply(relevance) { // 提交并继续关联发票参数relevance
    const {submit, validateFields} = this.props.form;
    const { keys, billNos, instId, sellerIpId, sellerIpRoleId, invoiceData, invoiceAmt, notUploadInvoiceAmt, invoiceId, saveLastModifyInvoiceAmt} = this.state;
    submit(() => {
      validateFields((errors, values)=> {
        if (!errors) {
          let diffs = 0;
          const invoiceAmtData = isNaN(invoiceAmt) ? 0 : invoiceAmt;
          const notUploadInvoiceAmtData = isNaN(notUploadInvoiceAmt) ? 0 : notUploadInvoiceAmt;

          if (keys === '01') {
            if (this.props.params.invoiceNo && this.props.params.invoiceCode) {
              // 当修改发票是判断的逻辑和新增发票的逻辑略有不同
              const saveLastModifyInvoiceAmtData = isNaN(saveLastModifyInvoiceAmt) ? 0 : saveLastModifyInvoiceAmt;
              const cache = floatSub(Number(invoiceAmtData), Number(notUploadInvoiceAmtData));
              diffs = floatSub(Number(cache), Number(saveLastModifyInvoiceAmtData));
              // diffs = invoiceAmt - notUploadInvoiceAmt - saveLastModifyInvoiceAmt;
            } else {
              diffs = floatSub(Number(invoiceAmtData), Number(notUploadInvoiceAmtData));
              // diffs = invoiceAmt - notUploadInvoiceAmt;
            }
            if (diffs > 0.05) {
              errorMsg('总价税合计金额不得超过未开票总金额');
              return false;
            }
          } else if (keys === '02') {
            const payTax = notUploadInvoiceAmtData * 0.93;
            diffs = floatSub(Number(invoiceAmtData), Number(payTax));
            if (diffs >= 0.01) {
              Modal.error({
                title: (<span style={{fontWeight: 400, position: 'absolute', paddingRight: '40px', paddingTop: '8px'}}
                >此发票类型将会扣除未开票金额 7% 的手续费。你的开票金额为未开票金额 X 93%。</span>),
                iconType: 'exclamation-circle',
                okText: '知道了',
              });
              return false;
            }
          }
          // if (!invoiceAmt || invoiceAmt <= 0) {
          //   message.error('开票金额不能为空或开票金额不能小于0', 3);
          //   return false;
          // }
          let params = {};
          let url = '';
          params = {
            // 多个账单id ","分割(需要单独获取)
            billNos: billNos,
            // 签约主体
            instId: instId,
            // 销方sellerIpId(需要单独获取)
            sellerIpId: sellerIpId,
            // 发票基本信息
            invoiceType: values.invoiceType,
            invoiceNo: values.invoiceNo,
            invoiceCode: values.invoiceCode,
            // 把utc时间转换成yyyymmdd格式
            invoiceDate: formatYYYYMMDD(values.invoiceDate),
            // 总价税合计
            invoiceAmt: invoiceAmt,
            // 销售方信息
            sellerCompanyName: values.sellerCompanyName,
            sellerTaxNo: values.sellerTaxNo,
            sellerAddress: values.sellerAddress,
            sellerTelephone: values.sellerTelephone,
            sellerBankName: values.sellerBankName,
            sellerBankAccount: values.sellerBankAccount,
            // 销方角色sellerIpRoleId(需要单独获取)
            sellerIpRoleId: sellerIpRoleId,
            // 发票行列表(需要单独获取)
            invoiceLineOrder: JSON.stringify(invoiceData),
          };
          if (this.props.params.ids) {
            url = appendOwnerUrlIfDev('/sale/rebate/addInvoice.json');
          } else if (invoiceId) {
            params.invoiceId = invoiceId;
            url = appendOwnerUrlIfDev('/sale/rebate/modifyInvoice.json');
          }
          this.setState({
            isLoading: true,
          });
          ajax({
            url: url,
            method: 'post',
            data: params,
            type: 'json',
            success: (result) => {
              this.setState({
                isLoading: false,
              });
              if (!result) {
                return;
              }
              if (result.status && result.status === 'succeed') { // 提交成功
                message.success('提交成功', 3);
                if (relevance === 'relevance' && result.invoiceNo && result.invoiceCode) {
                  const invoiceNo = encodeURIComponent(result.invoiceNo);
                  location.hash = '#/accountBill/submitInvoice/' + this.props.params.ids + '/' + invoiceNo + '/' + result.invoiceCode + '?instId=' + this.props.location.query.instId;
                  location.reload();
                } else {
                  location.hash = '#/accountBill';
                }
              } else {
                if (result.resultMsg) {
                  errorMsg(result.resultMsg);
                }
              }
            },
            error: (result) => {
              this.setState({
                isLoading: false,
              });
              if (result.resultMsg) {
                errorMsg(result.resultMsg);
              }
            },
          });
        }
      });
    });
  },
  cancelSubmit() {
    location.hash = '#/accountBill';
  },
  disabledDate(vale) {
    return vale.getTime() >= moment().toDate();
  },
  invoiceTypeChange(notUploadInvoiceAmt, keysType) {
    // const payTax = notUploadInvoiceAmt * 0.93;
    // 发票类型 文案提示
    if (keysType === '02') {
      this.setState({
        invoiceTypeValue: <p style={{color: 'red'}}>此发票类型将会扣除未开票金额 7% 的手续费。你的开票金额为未开票金额 X 93%。</p>,
        keys: '02'
      });
    } else if (keysType === '01') {
      this.setState({
        invoiceTypeValue: '',
        keys: '01'
      });
    }
  },
  render() {
    const {getFieldProps, getFieldError} = this.props.form;
    const {billData, invoiceData, buyerData, invoiceAmt, notUploadInvoiceAmt, isLoading, invoiceTypeValue} = this.state;
    const columnsB = [{
      title: '账单号',
      dataIndex: 'billNo',
      width: 210,
    }, {
      title: '业务周期',
      width: 150,
      render(t, r) {
        return (
          <div>{transMMddData(r.startDate)} 至 {transMMddData(r.endDate)}</div>
          );
      },
    }, {
      title: '账单类型',
      dataIndex: 'pricePolicyName',
      width: 200,
      render(text) {
        return BillsStatuMap[text] || text;
      },
    }, {
      title: '签约主体',
      dataIndex: 'instId',
      width: 200,
      render(r) {
        const Theme = {
          K53: '口碑(上海)信息技术有限公司',
          Z50: '支付宝（中国）网络技术有限公司',
        };
        return (<span>{Theme[r]}</span>);
      },
    }, {
      title: '应结算金额 (元)',
      width: 150,
      render(t, r) {
        const realBillAmtObj = r.realBillAmt || {};
        return (<div>{realBillAmtObj && moneyCut(realBillAmtObj.amount, 2)}</div>);
      },
    }, {
      title: '付款金额 (元)',
      width: 150,
      render(t, r) {
        // 应付
        const realBillAmtObj = r.realBillAmt || {};
        const realBillAmt = realBillAmtObj.amount || 0;
        // 已付
        const paidAmtObj = r.paidAmt || {};
        const paidAmt = paidAmtObj.amount || 0;
        const fbdPayAmtObj = r.fbdPayAmt || {};
        const fbdPayAmt = fbdPayAmtObj.amount || 0;
        // const difference = realBillAmt - paidAmt - fbdPayAmtObj.amount;
        const cache = floatSub(Number(realBillAmt), Number(paidAmt));
        const difference = floatSub(Number(cache), Number(fbdPayAmt));
        return (<div>已付:{paidAmtObj && moneyCut(paidAmtObj.amount, 2)}<br/>未付:<span style={{color: 'red'}}>{difference && moneyCut(difference, 2)}</span></div>);
      },
    }, {
      title: '对账状态',
      width: 150,
      dataIndex: 'payStatus',
      render(text) {
        return LinkStatusMap[text] || text;
      },
    }, {
      title: '已开票金额 (元)',
      width: 150,
      render(t, r) {
        const invoiceAmtObj = r.invoiceAmt || {};
        return (<div>{invoiceAmtObj && moneyCut(invoiceAmtObj.amount, 2)}</div>);
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (t, r, i) => {
        const fbdPayAmt = r.fbdPayAmt || {};
        const realBillAmt = r.realBillAmt || {};
        let anotherPay = 0;
        if (realBillAmt) {
          const realBillAmtAmount = realBillAmt.amount || 0;
          const fbdPayAmtAmount = fbdPayAmt.amount || 0;
          const paidAmtAmount = r.paidAmt.amount || 0;
          anotherPay = floatSub(floatSub(realBillAmtAmount, fbdPayAmtAmount), paidAmtAmount);
        }
        return (
          <div>
            {
              billData.length !== 1 && r.realBillAmt.amount > 0 && anotherPay > 0 && r.invoiceAmt && r.invoiceAmt.amount <= realBillAmt.amount ? (
                <Popconfirm title="您确定要删除该条目么？" onConfirm={this.removeColumnsB.bind(this, r, i)} >
                  <a>删除</a>
                </Popconfirm>
              ) : null
            }
            {
              (i === billData.length - 1) && (billData.length !== 1) && r.realBillAmt.amount > 0 && anotherPay > 0 && r.invoiceAmt && r.invoiceAmt.amount <= realBillAmt.amount ? (<span className="ft-bar">|</span>) : null
            }
            {
              (i === billData.length - 1) && <a onClick={this.onAddAccountBill.bind(this, billData)}>新增</a>
            }
          </div>
        );
      },
    }];
    const columnsI = [{
      title: <span>货物或应税劳务、 <br />服务名称</span>,
      dataIndex: 'productName',
      width: 160,
      render: (t, r, i) => {
        const productName = 'productName' + i;
        return (
          <div>
            <FormItem>
              <Input placeholder="请输入" style={{width: '160px'}} onBlur={this.onClickProductName.bind(this, r, i, productName)}
              {...getFieldProps(productName, {
                rules: [{
                  required: true,
                  message: '不能为空',
                }],
              })} />
            </FormItem>
          </div>
        );
      },
    }, {
      title: '规格型号',
      dataIndex: 'productSpecification',
      width: 85,
      render: (t, r, i) => {
        const productSpecification = 'productSpecification' + i;
        return (
          <div>
            <FormItem>
              <Input placeholder="请输入" style={{width: '85px'}}onBlur={this.onClickProductSpecification.bind(this, r, i, productSpecification)}
              {...getFieldProps(productSpecification)} />
            </FormItem>
          </div>
        );
      },
    }, {
      title: '单位',
      dataIndex: 'measurementUnit',
      width: 85,
      render: (t, r, i) => {
        const measurementUnit = 'measurementUnit' + i;
        return (
          <div>
            <FormItem>
              <Input placeholder="请输入" style={{width: '85px'}} onBlur={this.onClickMeasurementUnit.bind(this, r, i, measurementUnit)}
              {...getFieldProps(measurementUnit)} />
            </FormItem>
          </div>
        );
      },
    }, {
      title: '数量',
      dataIndex: 'quantity',
      width: 85,
      render: (t, r, i) => {
        const quantity = 'quantity' + i;
        return (
          <div>
            <FormItem>
              <InputNumber style={{width: '85px'}} step={0.00000001} placeholder="请输入" onBlur={this.onClickQuantity.bind(this, r, i, quantity)}
              {...getFieldProps(quantity)} />
            </FormItem>
          </div>
        );
      },
    }, {
      title: '单价 (元)',
      width: 85,
      render: (t, r, i) => {
        const unitAmt = 'unitAmt' + i;
        return (
          <div>
            <FormItem>
              <InputNumber style={{width: '85px'}} step={0.00000001} placeholder="请输入" onBlur={this.onClickUnitAmt.bind(this, r, i, unitAmt)}
              {...getFieldProps(unitAmt)} />
            </FormItem>
          </div>
        );
      },
    }, {
      title: '金额 (元)', // 这里的金额指的是不含税金额
      width: 85,
      render: (t, r, i) => {
        const taxExclusiveAmt = 'taxExclusiveAmt' + i;
        return (
          <div>
            <FormItem>
              <InputNumber style={{width: '85px'}} step={0.01} placeholder="请输入" onBlur={this.onClickTaxExclusiveAmt.bind(this, r, i, taxExclusiveAmt)}
              {...getFieldProps(taxExclusiveAmt, {
                rules: [{
                  required: true,
                  message: '不能为空',
                  type: 'number',
                }, {
                  pattern: /^-?([1-9]+(\.(\d*)|0)?)|(0(\.\d+){1})$/,
                  message: '不能输入0',
                }],
              })} />
            </FormItem>
          </div>
        );
      },
    }, {
      title: '税率',
      width: 85,
      render: (t, r, i) => {
        const taxRate = 'taxRate' + i;
        return (
          <div>
            <FormItem>
              <InputNumber style={{width: '85px'}} step={0.00000001} placeholder="示例: 0.06" onBlur={this.onClickTaxRate.bind(this, r, i, taxRate)}
              {...getFieldProps(taxRate, {
                rules: [{
                  required: true,
                  message: '不能为空',
                  type: 'number',
                }, {
                  pattern: /^\d+(\.{0,1}\d+){0,1}$/,
                  message: '不能输入负数',
                }],
              })} />
            </FormItem>
          </div>
        );
      },
    }, {
      title: '税额 (元)',
      width: 85,
      render: (t, r, i) => {
        const taxAmt = 'taxAmt' + i;
        return (
          <div>
            <FormItem>
              <InputNumber style={{width: '85px'}} step={0.01} placeholder="请输入" onBlur={this.onClickTaxAmt.bind(this, r, i, taxAmt)}
              {...getFieldProps(taxAmt, {
                rules: [{
                  required: true,
                  message: '不能为空',
                  type: 'number',
                }, {
                  pattern: /^\d+(\.{0,1}\d+){0,1}$/,
                  message: '不能输入负数',
                }],
              })} />
            </FormItem>
          </div>
        );
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 120,
      render: (t, r, i) => {
        return (
          <div style={{width: '120px'}}>
            {
              invoiceData.length !== 1 ? (
                <Popconfirm title="您确定要删除该条目么？" onConfirm={this.removeColumnsI.bind(this, r, i)} >
                  <a>删除</a>
                </Popconfirm>
              ) : null
            }
            {
              (i === invoiceData.length - 1) && (invoiceData.length !== 1) && (invoiceData.length < 8) ? (<span className="ft-bar">|</span>) : null
            }
            {
              (i === invoiceData.length - 1) && (invoiceData.length < 8) ? (<a onClick={this.showConfirm.bind(this, r, i)}>新增发票行</a>) : null
            }
          </div>
        );
      },
    }];
    const limitHeight = 6;
    const heightStyle = {
      height: limitHeight > 6 ? '650px' : 'auto',
      overflow: 'auto',
      marginLeft: '19px',
      borderBottom: '0px solid #e9e9e9',
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };
    return (
      <div>
        <div className="app-detail-content-padding, app-detail-header">
          <Breadcrumb separator=">">
            <Breadcrumb.Item key="1" href="#accountBill">账单查询</Breadcrumb.Item>
            <Breadcrumb.Item key="2">{this.props.params.ids ? '提交' : '修改'}发票</Breadcrumb.Item>
          </Breadcrumb>
          <div className="submit-notice"><BillCustomerService visible/></div>
        </div>
        <div>
          <Form horizontal>
            <div style={{marginLeft: '19px'}}>
              <h3 className="kb-form-sub-title">
                <div className="kb-form-sub-title-icon"></div>
                <span className="kb-form-sub-title-text">账单信息</span>
              </h3>
            </div>
            <FormItem
              required
              wrapperCol={{ span: 24 }}>
              <Table rowKey={r => r.billNo} columns={columnsB} style={heightStyle} dataSource={billData} pagination={false}
              footer={() => <div style={{float: 'right', fontSize: '16px'}}>未开票总金额：<p style={{float: 'right', fontSize: '18px', color: '#ff6e0d'}}>
                <span style={{marginLeft: 20}}>{notUploadInvoiceAmt && moneyCut(notUploadInvoiceAmt, 2)} 元</span></p></div>} />
            </FormItem>
            <div style={{marginLeft: '19px'}}>
              <h3 className="kb-form-sub-title">
                <div className="kb-form-sub-title-icon"></div>
                <span className="kb-form-sub-title-text">发票信息</span>
              </h3>
            </div>
            <div className="invoicse-wrap" style={{marginLeft: '19px'}}>
                    <div className="invoies-buy">
                      <div className="invoies-buy-txt">
                        <p><span>购买方<i className="anticon anticon-down" style={{marginTop: 65}}></i></span></p>
                      </div>
                      <div className="invoies-buy-con">
                        <FormItem
                          label="名称："
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 16 }} >
                          <p className="invoies-buy-con-titleR">{buyerData.title}</p>
                        </FormItem>
                        <FormItem
                          label="纳税人识别号："
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 16 }} >
                          <p className="invoies-buy-con-titleR">{buyerData.taxNo}</p>
                        </FormItem>
                        <FormItem
                          label="地址："
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 16 }} >
                          <p className="invoies-buy-con-titleR">{buyerData.address}</p>
                        </FormItem>
                        <FormItem
                          label="联系电话："
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 16 }} >
                          <p className="invoies-buy-con-titleR">{buyerData.telephone}</p>
                        </FormItem>
                        <FormItem
                          label="开户行："
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 16 }} >
                          <p className="invoies-buy-con-titleR">{buyerData.bankName}</p>
                        </FormItem>
                        <FormItem
                          label="开户行账号："
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 16 }} >
                          <p className="invoies-buy-con-titleR">{buyerData.bankAccount}</p>
                        </FormItem>
                      </div>
                    </div>
                    <div className="invoies-buy" style={{marginLeft: '2%'}}>
                      <div className="invoies-buy-txt">
                        <p><span>销售方<i className="anticon anticon-down" style={{marginTop: 65}}></i></span></p>
                      </div>
                      <div className="invoies-buy-con">
                            <FormItem
                            label="名称："
                            required
                            {...formItemLayout} >
                            <Input placeholder="税局代开发票请填写本公司信息" {...getFieldProps('sellerCompanyName', {
                              rules: [
                                {
                                  required: true,
                                  message: '不能为空',
                                },
                              ]}
                            )}/>
                          </FormItem>
                            <FormItem
                              label="纳税人识别号："
                              required
                              {...formItemLayout} >
                              <Input placeholder="请输入" {...getFieldProps('sellerTaxNo', {
                                rules: [
                                  {
                                    required: true,
                                    message: '不能为空',
                                  },
                                ]}
                              )}/>
                            </FormItem>
                            <FormItem
                              label="地址："
                              required
                              {...formItemLayout} >
                              <Input {...getFieldProps('sellerAddress', {
                                rules: [
                                  {
                                    required: true,
                                    message: '不能为空',
                                  },
                                ]}
                              )} defaultValue="" placeholder="请填写正确的地址"/>
                            </FormItem>
                            <FormItem
                              required
                              label="联系电话："
                              {...formItemLayout} >
                              <Input type="Number" {...getFieldProps('sellerTelephone', {
                                rules: [
                                  {
                                    required: true,
                                    message: '不能为空',
                                  },
                                ]}
                              )} placeholder="请填写联系电话"/>
                            </FormItem>
                            <FormItem
                              label="开户行："
                              required
                              {...formItemLayout} >
                              <Input {...getFieldProps('sellerBankName', {
                                rules: [
                                  {
                                    required: true,
                                    message: '不能为空',
                                  },
                                ]}
                              )} defaultValue="" placeholder="请输入开户行名称"/>
                            </FormItem>
                            <FormItem
                              required
                              label="开户行账号："
                              {...formItemLayout} >
                              <Input type="Number" {...getFieldProps('sellerBankAccount', {
                                rules: [
                                  {
                                    required: true,
                                    message: '不能为空',
                                  },
                                ]}
                              )} defaultValue="" placeholder="请输入银行账号"/>
                              <p className="bill-p-notice">税局代开发票请填写本公司信息</p>
                            </FormItem>
                      </div>
                    </div>
                  </div>
            <div style={{marginLeft: '19px'}}>
             <Collapse defaultActiveKey={['1']}>
                <Panel header="发票信息" key="1">{/* todo */}
                <div className="alert-customer">
                  <Alert message={<BillGuideModal/>} type="warning" showIcon />
                </div>
                  <Row>
                    <Col span="12">
                      <FormItem
                        required
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}
                        help={(getFieldError('invoiceType') || invoiceTypeValue )}
                        label="发票类型："
                        >
                        <Select
                        placeholder="请选择"
                        onSelect={this.invoiceTypeChange.bind(this, notUploadInvoiceAmt )}
                        {...getFieldProps('invoiceType', {
                          rules: [{
                            required: true,
                            message: '不能为空',
                          }],
                        })}
                        >
                          <Option key="01">增值税专用发票</Option>
                          <Option key="02">增值税普通发票</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem
                        required
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}
                        label="发票号：">
                        <Input placeholder="请输入" {...getFieldProps('invoiceNo', {
                          rules: [
                            {
                              required: true,
                              message: '不能为空',
                            },
                          ],
                        })}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span="12">
                      <FormItem
                        required
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}
                        label="发票代码：">
                        <Input placeholder="请输入" {...getFieldProps('invoiceCode', {
                          rules: [
                            {
                              required: true,
                              message: '不能为空',
                            },
                          ],
                        })}/>
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem
                        required
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}
                        label="开票日期：">
                        <DatePicker disabledDate={this.disabledDate}
                          {...getFieldProps('invoiceDate', {
                            validateFirst: true,
                            rules: [{
                              required: true,
                              message: '不能为空',
                              type: 'date',
                            }]}
                        )} format="yyyy/MM/dd" style={{width: '100%'}} placeholder="请选择时间"/>
                      </FormItem>
                    </Col>
                  </Row>
                  <FormItem
                    required
                    wrapperCol={{ span: 24 }}>
                    <Table scroll={{ x: 1059 }} rowKey={record => record.id} columns={columnsI} style={heightStyle} dataSource={invoiceData} pagination={false} footer={() =>
                      <div style={{float: 'right', fontSize: '16px'}}>
                        总价税合计:
                        <p style={{float: 'right', fontSize: '18px', color: '#ff6e0d'}}>
                          <span style={{marginLeft: 20}}>{invoiceAmt && moneyCut(invoiceAmt, 2)} 元
                          </span>
                        </p>
                      </div>} />
                  </FormItem>
                </Panel>
              </Collapse>
            </div>
            <div className= "app-detail-header" style={{marginBottom: '20px'}}/>
            <FormItem
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 15}}
              >
              <p style={{marginLeft: 20, color: '#ff6e0d'}}>须关联快递信息，以便发票线上追踪，否则产生发票遗失风险请自行承担</p>
              <Button type= "primary" loading = {isLoading} onClick={this.alterSubmit} style={{marginLeft: '19px'}}>提交</Button>
              {this.props.params.ids && <Button
                type= "primary"
                // disabled={invoiceAmt + 0.05 >= notUploadInvoiceAmt}
                loading = {isLoading} onClick={this.submitApply.bind(this, 'relevance')} style={{marginLeft: '19px'}}>提交并继续关联发票</Button>}
              <Button style={{marginLeft: '10px'}} onClick={this.cancelSubmit}>取消</Button>
            </FormItem>
          </Form>
        </div>
        <AddAccountBillModal
          visible={this.state.addAccountBillModal.visible}
          instId={this.state.instId}
          billData={this.state.addAccountBillModal.billData}
          onAddOk={this.onAddAccountBillOk}
          onCancel={this.onCancelAddAccountBill}
        />
      </div>
    );
  },
});
export default Form.create()(SubmitInvoice);
