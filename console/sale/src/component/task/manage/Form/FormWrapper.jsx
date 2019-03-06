import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Radio, Button, Alert } from 'antd';
import { Page, Block } from '@alipay/kb-framework-components/lib/layout';
import permission from '@alipay/kb-framework/framework/permission';

import { TaskType, TaskBizType, TaskTypeText, TaskBizTypeText } from '../../common/enum';
import { createTask, createTaskFlow } from '../../common/api';
import FormDataProcessor from './FormDataProcessor';

import { SubmitStatus, FormMode } from '../../../../common/enum';

import FlowForm from './FlowForm';
import SingleForm from './SingleForm';

import './style.less';

const TASK_PREVIEW_IMG = 'https://gw.alipayobjects.com/zos/rmsportal/ZADtBxzvSzSNRefDcPle.png';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 }
};
const bizTypePermission = {
  [TaskBizType.CITY]: 'CITY_TASK_DEF_MANAGER',
  [TaskBizType.HQ]: 'HQ_TASK_DEF_MANAGER',
  [TaskBizType.TKA]: 'TKA_TASK_DEF_MANAGER',
};

class FormWrapper extends React.Component {
  static propTypes = {
    bizType: PropTypes.oneOf([TaskBizType.CITY, TaskBizType.HQ, TaskBizType.TKA]),
    taskType: PropTypes.oneOf([TaskType.FLOW, TaskType.SINGLE]),
    mode: PropTypes.oneOf([FormMode.CREATE, FormMode.EDIT]),
    id: PropTypes.string // 任务（流）id，编辑模式必须
  };

  static defaultProps = {
    taskType: TaskType.SINGLE,
    mode: FormMode.CREATE,
    id: ''
  };

  constructor(props) {
    super();
    let bizType = props.bizType;
    if (bizType && !permission(bizTypePermission[bizType])) bizType = null;
    if (!bizType) {
      for (const [ type, permissionKey ] of Object.entries(bizTypePermission)) {
        if (permission(permissionKey)) {
          bizType = type;
          break;
        }
      }
    }
    this.state = {
      bizType,
      taskType: props.taskType,
      submitStatus: SubmitStatus.INIT
    };
    this.mode = props.mode;
  }

  componentDidMount() {
    const { taskType } = this.state;
    // todo load task(flow) data in edit mode
    // to be done 完整的任务流编辑功能暂时不需要
    if (this.mode === FormMode.EDIT) {
      if (taskType === TaskType.FLOW) {
        //
      }
    }
  }

  mode = FormMode.EDIT;
  isDirty = true;
  form = null;
  stashTaskTypeForm = {};

  handleTaskScopeChange = (e) => {
    this.setState({
      bizType: e.target.value
    });
  };

  handleTaskTypeChange = (e) => {
    const doChange = () => {
      this.setState({
        taskType: e.target.value,
        submitStatus: SubmitStatus.INIT
      });
    };
    if (this.mode === FormMode.CREATE) {
      this.stashTaskTypeForm[this.state.taskType] = this.form.getFieldsValue();
      doChange();
    }
  };

  handleSubmit = () => {
    const { bizType, taskType } = this.state;
    this.form.validateFields((error, data) => {
      if (error) {
        return;
      }
      this.setState({
        submitStatus: SubmitStatus.PENDING
      });
      if (this.mode === FormMode.CREATE) {
        if (taskType === TaskType.SINGLE) {
          createTask(FormDataProcessor.composeTaskCreateRequest({ ...data, bizType }))
            .then(() => {
              this.setState({
                submitStatus: SubmitStatus.DONE
              });
              this.props.history.push(`/task/manage/list/${bizType}/${taskType}`);
            })
            .catch(() => {
              this.setState({
                submitStatus: SubmitStatus.FAILED
              });
            });
        } else if (taskType === TaskType.FLOW) {
          createTaskFlow(FormDataProcessor.composeTaskFlowCreateRequest({ ...data, bizType }))
            .then(() => {
              this.setState({
                submitStatus: SubmitStatus.DONE
              });
              this.props.history.push(`/task/manage/list/${bizType}/${taskType}`);
            })
            .catch(() => {
              this.setState({
                submitStatus: SubmitStatus.FAILED
              });
            });
        }
      } else if (this.mode === FormMode.EDIT) {
        if (taskType === TaskType.SINGLE) {
          // 暂时弃用，在列表页使用弹窗即可编辑单任务
        } else if (taskType === TaskType.FLOW) {
          // 暂时弃用，在列表页使用弹窗编辑
          // updateTaskFlow({});
        }
      }
    });
  };

  bindFormRef = (c) => {
    if (c) {
      this.form = c.refs.wrappedComponent.props.form;
      if (this.stashTaskTypeForm[this.state.taskType]) {
        this.form.setFieldsValue(this.stashTaskTypeForm[this.state.taskType]);
        delete this.stashTaskTypeForm[this.state.taskType];
      }
    } else {
      // unmounted
      this.form = null;
    }
  };

  render() {
    const { taskType, bizType, submitStatus } = this.state;
    const { mode } = this.props;
    const breadcrumb = [
      { title: '任务管理', link: '#/task/manage' },
      { title: `${mode === FormMode.CREATE ? '创建任务' : '编辑任务'}` }
    ];
    const footer = (
      <Button
        loading={submitStatus === SubmitStatus.PENDING}
        disabled={submitStatus === SubmitStatus.DONE}
        onClick={this.handleSubmit}
        type="primary"
      >提交
      </Button>
    );
    return (
      <Page
        breadcrumb={breadcrumb}
        id="task-edit"
      >
        <Row type="flex">
          <Col span={6}>
            <Block title="案例-钉钉中台执行任务页">
              <img width={250} src={TASK_PREVIEW_IMG} alt="钉钉工作台任务列表预览图" />
            </Block>
          </Col>
          <Col span={16} offset={2}>
            <Block title="基础信息">
              <Form horizontal>
                <Form.Item label="任务模型" {...formItemLayout} required>
                  <Radio.Group
                    value={taskType}
                    onChange={this.handleTaskTypeChange}
                    disabled={mode === FormMode.EDIT}
                  >
                    {Object.keys(TaskType).map(t => (
                      <Radio value={TaskType[t]} key={TaskType[t]}>
                        {TaskTypeText[TaskType[t]]}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="业务类型" {...formItemLayout}>
                  <Radio.Group
                    value={bizType}
                    onChange={this.handleTaskScopeChange}
                    disabled={mode === FormMode.EDIT}
                  >
                    {Object.entries(bizTypePermission).map(([type, permissionKey]) => (
                      permission(permissionKey) && <Radio value={type} key={type}>{TaskBizTypeText[type]}</Radio>
                    ))}
                    <Alert message={bizType === TaskBizType.CITY ? '创建任务后，电脑端T+1天、移动端实时做展示' : '创建任务后，电脑端、移动端实时做展示'} type="info" showIcon />
                  </Radio.Group>
                </Form.Item>
              </Form>
              {taskType === TaskType.SINGLE && <SingleForm ref={this.bindFormRef} mode={mode} formItemLayout={formItemLayout} />}
              {taskType === TaskType.FLOW && <FlowForm ref={this.bindFormRef} mode={mode} formItemLayout={formItemLayout} />}
              <Row>
                <Col span={12} offset={4}>{footer}</Col>
              </Row>
            </Block>
          </Col>
        </Row>
      </Page>
    );
  }
}

export default FormWrapper;
