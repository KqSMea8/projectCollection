import React, {PropTypes} from 'react';
import { Modal, DatePicker, Form, Button, Select, message } from 'antd';
import ajax from 'Utility/ajax';
import moment from 'moment';
const FormItem = Form.Item;
const {MonthPicker} = DatePicker;

const PromotionBillModal = React.createClass({
  propTypes: {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    taskConfig: PropTypes.array,
  },

  getInitialState() {
    return {
      visible: false,
    };
  },
  componentDidMount() {
  },

  onDownload() {
    this.setState({
      visible: true,
    });
  },

  onOK() {
    const {validateFields} = this.props.form;
    validateFields((error, values) => {
      if (!error) {
        values.billPeriod = moment(values.billPeriod).format('YYYYMM');
        ajax({
          url: window.APP.kbopenprodUrl + '/commodity/bill/getDownloadUrlByProvider.json',
          method: 'get',
          data: values,
          type: 'json',
          success: (res) => {
            if (res.status === 'succeed') {
              window.open(res.data);
              message.success('下载月度账单明细成功');
              this.setState({
                visible: false,
              });
            } else {
              message.error(res.resultMsg);
            }
          }, error: (_, errorMsg) => {
            message.error(errorMsg);
          },
        });
      }
    });
  },

  onCancel() {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  },

  disabledMonth(current) {
    // can not select days after today and today
    const nowMonth = new Date(moment().format('YYYY-MM'));
    return current.getTime() >= nowMonth.getTime();
  },

  render() {
    const {form, taskConfig} = this.props;
    const {getFieldProps, getFieldError} = form;
    const {visible} = this.state;
    return (<div>
      <Button className="promotion-bill-download" type="primary"
      onClick={this.onDownload}>月度账单明细下载</Button>
      <Modal className="promotion-bill-modal" width={500}
        title="下载月度账单明细" visible={visible}
        okText="下载" onOk={this.onOK} onCancel={this.onCancel}>
        <FormItem
          label="推广任务类型："
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          validateStatus={getFieldError('taskType') ? 'error' : ''}
          help= {getFieldError('taskType')}>
            <Select style={{width: 165}}
              placeholder="请选择"
              {...getFieldProps('taskType', {
                rules: [{
                  required: true,
                  message: '此处必填',
                }],
              })}>
              {
                taskConfig.map(item => {
                  return (<Option value={item.taskType} key={item.taskType}>{item.taskTypeName}</Option>);
                })
              }
            </Select>
        </FormItem>
        <FormItem
          label="账单月份："
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          validateStatus={getFieldError('billPeriod') ? 'error' : ''}
          help= {getFieldError('billPeriod')}>
            <MonthPicker placeholder="请选择账单月份"
              disabledDate={this.disabledMonth}
              {...getFieldProps('billPeriod', {
                rules: [{
                  required: true,
                  message: '此处必填',
                }],
              })}
            />
        </FormItem>
    </Modal>
    </div>);
  },
});

export default Form.create()(PromotionBillModal);
