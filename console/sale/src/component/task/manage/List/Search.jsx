import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, DatePicker, Select } from 'antd';
import noop from 'lodash/noop';
import { UserByRoleSelect, AreaSelect } from '@alipay/kb-framework-components/lib/biz';

import { TaskBizType, TaskType, TaskStatus, TaskStatusText, TaskFlowStatus, TaskFlowStatusText } from '../../common/enum';
import TaskSelect from '../../common/TaskSelect';
import TaskFlowSelect from '../../common/TaskFlowSelect';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class SearchForm extends React.Component {
  static propTypes = {
    bizType: PropTypes.oneOf([TaskBizType.CITY, TaskBizType.HQ, TaskBizType.TKA]),
    taskType: PropTypes.oneOf([TaskType.SINGLE, TaskType.FLOW]),
    onSearch: PropTypes.func,
    loading: PropTypes.bool
  };

  static defaultProps = {
    bizType: TaskBizType.CITY,
    taskType: TaskType.SINGLE,
    onSearch: noop,
    loading: false
  };

  componentDidMount() {
    if (this.props.bizType !== TaskBizType.CITY) {
      this.props.onSearch({}); // 非城市的任务 用默认搜索条件 触发搜索
    }
  }

  onCityDataLoad = (data) => {
    try {
      const { setFieldsValue } = this.props.form;
      const firstCityValue = [data[0].value, data[0].children[0].value];
      setFieldsValue({city: firstCityValue});
      this.props.onSearch({city: firstCityValue}); // 城市数据初始化后 触发列表搜索
    } catch (e) {
      // console.error(e);
    }
  };

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
    const { bizType, taskType, loading } = this.props;
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    const taskIdProps = getFieldProps('taskId', {});
    const taskFlowIdProps = getFieldProps('taskFlowId', {});
    const statusProps = getFieldProps('statusList', {
      initialValue: []
    });
    const flowStatusProps = getFieldProps('flowStatusList', {
      initialValue: []
    });
    const creatorProps = getFieldProps('creator', {});
    const beginTimeProps = getFieldProps('beginTime', {});
    const deadlineTimeProps = getFieldProps('deadlineTime', {});
    return (
      <Form horizontal className="ant-advanced-search-form" style={{ marginTop: 16, marginBottom: 16 }}>
        <Row gutter={16}>
          <Col sm={8}>
            {taskType === TaskType.FLOW && (
              <FormItem
                label="任务流名称"
                {...formItemLayout}
              >
                <TaskFlowSelect {...taskFlowIdProps} />
              </FormItem>
            )}
            <FormItem
              label="任务名称"
              {...formItemLayout}
            >
              <TaskSelect {...taskIdProps} />
            </FormItem>
            <FormItem
              label="创建人"
              {...formItemLayout}
            >
              <UserByRoleSelect showRole={false} role={window.APP.userType === 'BUC' ? 'BD' : 'PROVIDER'} {...creatorProps} />
            </FormItem>
          </Col>
          <Col sm={8}>
            {taskType === TaskType.FLOW && (
              <FormItem
                label="任务流状态"
                {...formItemLayout}
              >
                <Select multiple {...flowStatusProps} placeholder="全部状态" >
                  {Object.keys(TaskFlowStatus).filter(k => TaskFlowStatus[k] !== TaskFlowStatus.DELETE).map(k => (
                    <Select.Option value={k} key={k}>{TaskFlowStatusText[k]}</Select.Option>
                  ))}
                </Select>
              </FormItem>
            )}
            <FormItem
              label="任务状态"
              {...formItemLayout}
            >
              <Select multiple {...statusProps} placeholder="全部状态">
                {Object.keys(TaskStatus).filter(k => TaskStatus[k] !== TaskStatus.DELETE).map(k => (
                  <Select.Option value={k} key={k}>{TaskStatusText[k]}</Select.Option>
                ))}
              </Select>
            </FormItem>
            {bizType === TaskBizType.CITY && (
              <FormItem
                label="城市"
                {...formItemLayout}
              >
                <AreaSelect {...getFieldProps('city', { rules: [{required: true, message: '请选择城市'}] })}
                  kbservcenterUrl={window.APP.kbservcenterUrl} placeholder="请选择城市"
                  size="default" maxLevel={2} type="allOfMyJobs" onDataLoad={this.onCityDataLoad} />
              </FormItem>
            )}
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
