import React, {PropTypes} from 'react';
import {Row, Col, Form, Button, DatePicker, Select, Input} from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import MerchantInfoSelect from './MerchantInfoSelect';
import moment from 'moment';

const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const Option = Select.Option;

class MonthRangePicker extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      startDate: PropTypes.object,
      endDate: PropTypes.object,
    }),
    onChange: PropTypes.func,
  };
  static defaultProps = {};

  handleStartDateChange = (startDate) => {
    const {value, onChange} = this.props;
    onChange({
      ...value,
      startDate,
    });
  };

  handleEndDateChange = (endDate) => {
    const {value, onChange} = this.props;
    onChange({
      ...value,
      endDate,
    });
  };

  render() {
    const {startDate, endDate} = this.props.value;
    return (
      <div>
        <MonthPicker value={startDate} onChange={this.handleStartDateChange}
                     style={{width: 100}} />
        <span style={{padding: '0 6px'}}>-</span>
        <MonthPicker value={endDate} onChange={this.handleEndDateChange}
                     style={{width: 100}} />
      </div>
    );
  }
}

class BillsQueryForm extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    merchantData: PropTypes.array,
  };

  constructor(props) {
    super();
    this.state = {
      collapsed: true,
      merchantName: '',
      merchantData: props.merchantData,
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props.merchantData !== nextProps.merchantData) {
      this.setState({
        merchantData: nextProps.merchantData,
      });
      const initialValue = {};
      if (nextProps.merchantData && nextProps.merchantData.length === 1) {
        initialValue.merchantPid = nextProps.merchantData[0].partnerId;
      }
      this.setMerchantName(initialValue.merchantPid, nextProps.merchantData);
      this.props.form.setFieldsValue(initialValue);
    }
  }

  onSearch = () => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      const info = values;
      const period = values.period;
      info.startMonth = period.startDate ? moment(period.startDate).format('YYYYMM') : '';
      info.endMonth = period.endDate ? moment(period.endDate).format('YYYYMM') : '';
      delete info.period;
      this.props.onSearch(info);
    });
  };

  setMerchantName(merchantPid, merchantData) {
    if (merchantData) {
      merchantData.map((r) => {
        if (r.partnerId === merchantPid) {
          this.setState({
            merchantName: r.merchantName,
          });
        }
      });
    }
  }

  reset = (e) => {
    const {merchantData, form} = this.props;
    e.preventDefault();
    if (merchantData.length === 1) {
      form.resetFields(['createTime']);
    } else {
      form.resetFields();
    }
    form.setFieldsValue({
      billNo: '',
    });
  };

  static validatePeriod(rule, value, callback) {
    const {startDate, endDate} = value;
    if (!startDate && !endDate) {
      callback('请选择起止月份');
      return;
    }
    if (!startDate) {
      callback('请选择起始月份');
      return;
    }
    if (!endDate) {
      callback('请选择截止月份');
      return;
    }
    callback();
  }

  merchantSelect = (v) => {
    this.props.form.setFieldsValue({merchantPid: v});
  }

  handleBillNoChange = (billNo) => {
    const {setFieldsValue, resetFields} = this.props.form;
    if (billNo) {
      // clear all other fields
      resetFields();
      setFieldsValue({
        period: {
          startDate: null,
          endDate: null,
        },
        billNo
      });
    }
  };

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const {params} = this.props;
    const merchantData = this.state.merchantData || [];
    const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 18}};
    const billNo = getFieldValue('billNo');
    const isDateAndPIDRequired = billNo === '';
    const noopValidator = (rules, value, callback) => callback();
    return (
      <Form horizontal className="advanced-search-form">
        <Row key="1">
          <Col span="8">
            <FormItem
              {...formItemLayout}
              required={isDateAndPIDRequired}
              label="业务周期">
              <MonthRangePicker {...getFieldProps('period', {
                initialValue: {
                  startDate: params.billNo ? null : moment().add(-3, 'months').toDate(), // 通过url传入billNo时不需要设置日期
                  endDate: params.billNo ? null : moment().toDate(),
                },
                rules: [
                  {validator: isDateAndPIDRequired ? BillsQueryForm.validatePeriod : noopValidator}
                ]
              })}/>
            </FormItem>
          </Col>
          <Col span="8">
            {permission('SALE_REBATE_BILL_QUERY_BD') ? <FormItem
              label="服务商名称"
              {...formItemLayout}>
              <MerchantInfoSelect onSelect={this.merchantSelect} merchantName={this.state.merchantName}/>
            </FormItem> : <FormItem
              label="服务商名称"
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <MerchantInfoSelect merchantName={this.state.merchantName} {...getFieldProps('merchantPid')}
                                  disabled={merchantData.length === 1}/>
            </FormItem>}
          </Col>
          <Col span="8">
            {permission('SALE_REBATE_BILL_QUERY_BD') ? <FormItem
              label="服务商PID"
              required={billNo === ''}
              {...formItemLayout}>
              <Input merchantName={this.state.merchantName} {...getFieldProps('merchantPid', {
                rules: [{
                  required: isDateAndPIDRequired,
                  message: '请输入服务商PID',
                }]
              })}/>
            </FormItem> : <FormItem
              label="签约主体"
              {...formItemLayout}>
              <Select {...getFieldProps('instId', {initialValue: 'all'})} >
                <Option value="all" key="01">全部</Option>
                <Option value="K53" key="02">口碑(上海)信息技术有限公司</Option>
                <Option value="Z50" key="03">支付宝（中国）网络技术有限公司</Option>
              </Select>
            </FormItem>}
          </Col>
        </Row>
        <Row key="2">
          {permission('SALE_REBATE_BILL_QUERY_BD') && <Col span="8">
            <FormItem
              label="签约主体"
              {...formItemLayout}>
              <Select {...getFieldProps('instId', {initialValue: 'all'})} >
                <Option value="all" key="01">全部</Option>
                <Option value="K53" key="02">口碑(上海)信息技术有限公司</Option>
                <Option value="Z50" key="03">支付宝（中国）网络技术有限公司</Option>
              </Select>
            </FormItem>
          </Col>}
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="账单编号">
              <Input {...getFieldProps('billNo', {
                onChange: this.handleBillNoChange,
                initialValue: params.billNo || '',
                rules: [
                  {whitespace: true, message: '账单号不能为空格'}
                ]
              })}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <div style={{height: 1}}/>
          </Col>
          <Col span="10" offset="8">
            <div style={{float: 'right'}}>
              <Button type="primary" style={{marginRight: 12}} onClick={this.onSearch}>搜索</Button>
              <Button type="ghost" style={{marginRight: 12}} onClick={this.reset}>清除条件</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(BillsQueryForm);
