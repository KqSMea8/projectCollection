import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, Button, DatePicker } from 'antd';
import { StuffType, StuffTypeText } from '../../../common/enum';
import { OrderStatus, OrderStatusText } from '../../common/enums';
import moment from 'moment';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

export const initialValues = {
  produceOrderId: '',
  stuffType: '',
  supplierName: '',
  gmtStart: moment().day(-30).hour(0).minute(0).second(0),
  gmtEnd: moment().hour(23).minute(59).second(59),
  purchaserName: '',
  supplierId: '',
  status: ''
};

class FilterForm extends Component {
  constructor() {
    super();
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form;
    const { onSubmit } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        const orderTime = values.orderTime;
        const filter = {
          ...values,
          gmtStart: moment(orderTime[0]).hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
          gmtEnd: moment(orderTime[1]).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
        };
        onSubmit(filter);
      }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldProps } = this.props.form;
    const { loading } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form
        horizontal
        className="advanced-search-form"
      >
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="采购单号"
            >
              <Input
                {...getFieldProps('produceOrderId', {
                  initialValue: initialValues.produceOrderId
                })}
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="物料属性"
            >
              <Select
                {...getFieldProps('stuffType', {
                  initialValue: initialValues.stuffType
                })}
              >
                <Option value="" key="_">全部</Option>
                {Object.keys(StuffType).map(k => <Option key={k} value={k}>{StuffTypeText[k]}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="供应商名称"
            >
              <Input
                {...getFieldProps('supplierName', {
                  initialValue: initialValues.supplierName
                })}
                placeholder="请输入"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="采购时间"
            >
              <RangePicker
                {...getFieldProps('orderTime', {
                  initialValue: [initialValues.gmtStart.toDate(), initialValues.gmtEnd.toDate()]
                })}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="采购员名称"
            >
              <Input
                {...getFieldProps('purchaserName', {
                  initialValue: initialValues.purchaserName
                })}
                placeholder="请输入域帐号"
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="供应商ID"
            >
              <Input
                {...getFieldProps('supplierId', {
                  initialValue: initialValues.supplierId
                })}
                placeholder="请输入"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="采购分配状态"
            >
              <Select
                {...getFieldProps('status', {
                  initialValue: initialValues.status
                })}
              >
                <Option value="" key="">全部</Option>
                {Object.keys(OrderStatus).map(k => <Option value={k} key={k}>{OrderStatusText[k]}</Option>)}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
           <Col span={8} offset={16}>
            <div style={{float: 'right'}}>
              <Button
                loading={loading}
                type="primary"
                onClick={this.handleSubmit}
                style={{ marginRight: 12 }}
              >
                搜索
              </Button>
              <Button
                type="ghost"
                onClick={this.handleReset}
                style={{ marginRight: 12 }}
              >
                清除条件
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(FilterForm);
