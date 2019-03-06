import React, {PropTypes} from 'react';
import {Form, Input, Button, Select, message, Modal, Alert} from 'antd';
import {Uploader, normalizeUploadValueTweenty} from '../common/Uploader';
import ajax from 'Utility/ajax';
import {Lifecycle, History } from 'react-router';
import ConfirmOut from '../common/ConfirmOut';
import BillCustomerService from './bill/BillCustomerService.jsx';
import {shouldRead} from './bill/constants.js';
import log, {SubType} from '../common/log';
import './bills.less';
const Option = Select.Option;

const ComplaintOption = [
  {key: 'SHOP_OR_MERCHANT_QUANTITY_STATISTICS_ERROR', text: '账单中门店或商户数量统计存疑', extraTxt: '账单明细的门店或商户比实际业务数据少的情况，请选择此类型进行申诉'},
  {key: 'ACCOUNT_BASIS_ERROR', text: '结算依据存疑', extraTxt: '结算根据账单特殊说明中的公式计算得出，若您对结算依据金额有疑义，选择此申诉类型'},
  {key: 'ACCOUNT_RATE_ERROR', text: '结算费率存疑', extraTxt: '结算费率与返佣政策不一致，请选择此原因'},
  {key: 'FAKE_TRANSACTION_APPEAL', text: '虚假交易申诉', extraTxt: '若进行虚假交易申诉，请提供申诉表格及门店经营相关资料'},
  {key: 'OTHER', text: '其他', extraTxt: '除数值字段以外的申诉，若您对不结算原因（即非返佣范围）有疑义，请选择此类型进行申诉'},
];
const uploadHelp = {
  SHOP_OR_MERCHANT_QUANTITY_STATISTICS_ERROR: '', // 备注文案
  ACCOUNT_RATE_ERROR: '请先依据政策公告进行比对，若不一致，上传申诉表格及政策公告截图',
  ACCOUNT_BASIS_ERROR: '若进行虚假交易申诉 ，请提供申诉表格及门店经营相关的资料',
  FAKE_TRANSACTION_APPEAL: '若进行虚假交易申诉 ，请提供申诉表格及门店经营相关的资料',
  OTHER: '对账单中门店的非返佣范围不认可，即对结算政策规则判定的结果不认可或者对政策规则不认可，明确指出申诉诉求，并按照模板上格式填写上传',
};
const FormItem = Form.Item;
const SubmitComplaint = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  mixins: [Lifecycle, History],
  getInitialState() {
    return {
      showOutModel: false,
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    const billNo = this.props.params.billNo;
    const pid = this.props.params.pid;
    const ipRoleId = this.props.params.ipRoleId;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const self = this;
      const attachments = values.appealAttachments;
      const appealAttachments = [];
      attachments.map(each => {
        appealAttachments.push({fileName: each.response.fileName, ossKey: each.response.ossKey});
      });
      const formData = {
        billNo,
        ipRoleId,
        appealType: values.appealType,
        applyReason: values.applyReason,
        appealAttachments,
      };
      ajax({
        url: '/sale/rebate/addAppeal.json',
        method: 'post',
        data: {
          billAppealParam: JSON.stringify(formData),
        },
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            Modal.success({
              title: '申诉提交成功',
              content: `请记录账单号，后续在账单详情中查询进度。
              申诉结果将在5个工作日通知，请关注钉消息（公司签约账号对应的钉钉）、销售中台电脑端消息、签约账号对应的邮箱通知。`,
              okText: '知道了',
              onOk() {
                self.isCreateSuccess = 'hidenModel';
                window.location.hash = `/accountbill/billsDetail/${billNo}/${pid}?ipRoleId=${ipRoleId}`;
              },
            });
          }
        },
        error: (result) => {
          if (result.status === 'failed') {
            message.error(result.resultMsg || '提交失败');
          }
        },
      });
    });
  },
  // 二次确认框,
  hideOutModel() {
    this.setState({showOutModel: false});
  },
  gotoNext() {
    this.forceGoto = true;
    window.location.hash = this.nextPath;
  },
  routerWillLeave(nextLocation) {
    this.nextPath = nextLocation.pathname;
    if (this.isCreateSuccess !== 'hidenModel') {
      this.setState({showOutModel: !this.forceGoto});
      return !!this.forceGoto;
    }
  },
  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 9 },
    };
    const optionVal = getFieldValue('appealType') || 'SHOP_OR_MERCHANT_QUANTITY_STATISTICS_ERROR';
    const uploadUrl = '/sale/rebate/fileUpload.json';
    const excelSchema = {fileName: '111 4.jpg'};
    return (<div>
    <div className="app-detail-header" style={{position: 'relative'}}>申诉
    <div className="tabs-top-right-plugin">
          <BillCustomerService />
          </div>
    </div>
    <div>
      <div className="alert-customer">
        <Alert message={<a href={shouldRead} onClick={() => log(SubType.COMPLAINT_MUST_READ_CLICK)} target="_blank">申诉前必读</a>} type="warning" showIcon />
      </div>
      <Form onSubmit={this.handleSubmit} horizontal>
        <FormItem
          {...formItemLayout}
          label="账单编号：">
          <span>{this.props.params.billNo}</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="申诉类型：">
          <Select placeholder="请选择" {...getFieldProps('appealType', {
            rules: [{
              required: true, message: '请选择申诉类型',
            }],
          })}>
            {
              ComplaintOption.map(k =>
              <Option key={k.key} value={k.key}>
                <div>
                  <p>{k.text}</p>
                  <span className="bill-option-span" style={{whiteSpace: 'normal'}}>{k.extraTxt}</span>
                </div>
              </Option>)
              }
          </Select>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注：">
          <Input {...getFieldProps('applyReason', {
            rules: [{
              required: true, message: '请填写备注信息',
            }, {
              max: 100,
              message: '限100个字',
            }],
          })} type="textarea" rows={3} placeholder={uploadHelp[optionVal]}/>
        </FormItem>
        <FormItem
          label="附件："
          data={excelSchema}
          {...formItemLayout}
          help="支持 jpg，jpeg，xls，xlsx，txt，csv 格式文件，不超过5MB。"
          required>
            <Uploader
            uploadUrl={uploadUrl}
            acceptType="jpg, jpeg, xls, xlsx, txt, csv"
            {...getFieldProps('appealAttachments', {
              valuePropName: 'fileList',
              normalize: normalizeUploadValueTweenty,
              rules: [{
                required: true,
                max: 20,
                type: 'array',
              }],
            })}/>
        </FormItem>
        <div style={{borderTop: '1px solid #ddd', paddingTop: 20, marginTop: 30}}>
          <FormItem
            wrapperCol={{ span: 9, offset: 6 }}
            >
              <Button type="primary" htmlType="submit">提交</Button>
          </FormItem>
        </div>
      </Form>
    </div>
    {this.state.showOutModel ? <ConfirmOut onCancel={this.hideOutModel} onOk={this.gotoNext}/> : null}
    </div>
    );
  },
});

export default Form.create()(SubmitComplaint);
