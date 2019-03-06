import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Input, DatePicker, Select } from 'antd';
import noop from 'lodash/noop';

import { TaskBizType, TaskType, TaskStatus, TaskStatusText, TaskFlowStatus, TaskFlowStatusText, TaskExeContent } from '../../../common/enum';
import ExecontentField from './ExecontentField';
import ExecutorField from './ExecutorField';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class SearchForm extends React.Component {
  static propTypes = {
    scope: PropTypes.oneOf([TaskBizType.CITY, TaskBizType.HQ, TaskBizType.TKA]),
    type: PropTypes.oneOf([TaskType.SINGLE, TaskType.FLOW]),
    onSearch: PropTypes.func,
    loading: PropTypes.bool,
    initialData: PropTypes.object,
  };

  static defaultProps = {
    scope: TaskBizType.CITY,
    type: TaskType.SINGLE,
    onSearch: noop,
    loading: false,
    initialData: {},
  };

  componentDidMount() {
    this.props.form.setFieldsValue({
      executor: this.props.initialData && this.props.initialData.executor,
    });
  }

  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form;
    const { onSearch } = this.props;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      onSearch(values);
    });
  };

  handleReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
  };

  render() {
    const { type, loading, form } = this.props;
    const { getFieldProps } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    const taskFLowNameProps = getFieldProps('taskFlowName');
    const taskNameProps = getFieldProps('taskName');
    const bizIdProps = getFieldProps('bizId');
    const exeContentAndNameProps = getFieldProps('exeContentAndName', {
      initialValue: {
        exeContent: TaskExeContent.LEADS,
      }
    });
    const executorProps = getFieldProps('executor', {
      rules: [
        { required: true, message: '执行人必选' },
      ]
    });
    const taskStatusProps = getFieldProps('taskStatus');
    const flowStatusProps = getFieldProps('taskFlowStatus');
    const beginTimeProps = getFieldProps('beginTime');
    const deadlineTimeProps = getFieldProps('deadlineTime');

    return (
      <Form horizontal className="ant-advanced-search-form" style={{ marginTop: 16, marginBottom: 16 }}>
        <Row gutter={16}>
          <Col sm={8}>
            {type === TaskType.FLOW && (
              <FormItem
                label="任务流名称"
                {...formItemLayout}
              >
                <Input {...taskFLowNameProps} placeholder="请输入任务流名称" />
              </FormItem>
            )}
            <FormItem
              label="任务名称"
              {...formItemLayout}
            >
              <Input {...taskNameProps} placeholder="请输入任务名称" />
            </FormItem>
            <FormItem
              label="执行主体名称"
              {...formItemLayout}
            >
              <ExecontentField {...exeContentAndNameProps}/>
            </FormItem>
          </Col>
          <Col sm={8}>
            {type === TaskType.FLOW && (
              <FormItem
                label="任务流状态"
                {...formItemLayout}
              >
                <Select multiple {...flowStatusProps} placeholder="全部状态" >
                  {[TaskFlowStatus.ONGOING].map(k => (
                    <Select.Option value={k} key={k}>{TaskFlowStatusText[k]}</Select.Option>
                  ))}
                </Select>
              </FormItem>
            )}
            <FormItem
              label="任务状态"
              {...formItemLayout}
            >
              <Select multiple {...taskStatusProps} placeholder="全部状态">
                {[TaskStatus.PROCESSING, TaskStatus.PROCESSING_PART_FAIL].map(k => (
                  <Select.Option value={k} key={k}>{TaskStatusText[k]}</Select.Option>
                ))}
              </Select>
            </FormItem>
            <FormItem
              label="执行主体ID"
              {...formItemLayout}
            >
              <Input {...bizIdProps} placeholder="请输入门店/leads/商户的ID"/>
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem
              label="开始时间"
              {...formItemLayout}
            >
              <RangePicker size="default" {...beginTimeProps} />
            </FormItem>
            <FormItem
              label="截止时间"
              {...formItemLayout}
            >
              <RangePicker size="default" {...deadlineTimeProps} />
            </FormItem>
         </Col>
        </Row>
        <Row>
          <Col sm={16}>
            <FormItem
              label="执行人"
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}
            >
              <ExecutorField {...executorProps}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={12} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: 8 }}>搜索</Button>
            <Button loading={loading} onClick={this.handleReset}>清除条件</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(SearchForm);
