import React, {Component} from 'react';
import {Form, Button, Col, Row, DatePicker, Input} from 'antd';
import UserSelect from '../../../../../common/UserSelect';
import StuffSelect from '../../common/StuffSelect';
import { USER_TYPE } from '../../common/enums';
import moment from 'moment';
import classnames from 'classnames';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class FilterForm extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    const { validateFields } = form;
    validateFields((errors, values) => {
      if (!errors) {
        const { batchId, stuff, staff } = values;
        const [ , templateNickName ] = stuff || ['', ''];
        let params = {
          templateNickName,
          batchId,
          applicant: staff ? staff.id : '',
        };
        if (values.time && values.time[0] && values.time[1]) {
          const [ start, end ] = values.time;
          params = {
            ...params,
            gmtCreateStart: moment(start).format('YYYY-MM-DD'),
            gmtCreateEnd: moment(end).format('YYYY-MM-DD'),
          };
        }
        onSubmit(params);
      }
    });
  }

  handleReset = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
    this.handleSubmit(e);
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <Form
        horizontal
        className="advanced-search-form"
        onSubmit={this.handleSubmit}
      >
        <Row >
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="模板类型："
            >
              <StuffSelect
                {...getFieldProps('stuff')}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="提交人："
            >
              <UserSelect
                allowClear
                {...getFieldProps('staff')}
                disabled={window.APP.userType === USER_TYPE.BUC}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="生成时间："
            >
              <RangePicker
                {...getFieldProps('time')}
                disabledDate={current => (
                  current && (
                    (current.getTime() > Date.now()) ||
                    (current.getTime() <= Date.now() - 90 * 24 * 60 * 60 * 1000)
                  )
                )}
                format="yyyy-MM-dd"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="生成批次："
              validateStatus={classnames({ error: !!getFieldError('batchId') })}
              help={getFieldError('batchId')}
            >
              <Input
                {...getFieldProps('batchId', {
                  rules: [{
                    type: 'string',
                    pattern: /^[0-9]+$/,
                    message: '请输入数字',
                  }],
                })}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8" offset="16">
            <div style={{float: 'right'}}>
              <Button
                type="primary"
                htmlType="submit"
                style={{marginRight: 12}}
              >
                搜索
              </Button>
              <Button
                type="ghost"
                htmlType="reset"
                onClick={this.handleReset}
                style={{marginRight: 12}}
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
