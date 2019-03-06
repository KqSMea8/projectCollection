import React from 'react';
import PropTypes from 'prop-types';

import { Form, Input, Button, Modal } from 'antd';
import FormMode from '../../../../../common/enum/FormMode';

import TaskEditTable from './TaskEditTable';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from '../EditTaskModal';

import FormDataProcessor from '../FormDataProcessor';

class FlowForm extends React.Component {
  static propTypes = {
    /* eslint react/forbid-prop-types:0 */
    formItemLayout: PropTypes.object,
    taskList: PropTypes.array
  };
  static defaultProps = {
    formItemLayout: {},
    taskList: []
  };
  constructor() {
    super();
    this.state = {};
  }
  addTaskModal = null;
  editTaskModal = null;
  taskIndexInEdit = -1; // 当前正在编辑的任务index
  handleAddTask = () => {
    this.addTaskModal.open();
  };
  handleAddTaskSubmit = (data) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const taskList = getFieldValue('taskList');
    setFieldsValue({ taskList: taskList.concat(data) });
    this.addTaskModal.close();
  };
  handleUpdateTask = (index) => {
    const { getFieldValue } = this.props.form;
    const taskList = getFieldValue('taskList');
    this.editTaskModal.open(taskList[index]);
    this.taskIndexInEdit = index;
  };
  handleEditTaskSubmit = (data) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const taskList = getFieldValue('taskList');
    taskList[this.taskIndexInEdit] = data;
    setFieldsValue({ taskList });
    this.taskIndexInEdit = -1;
    this.editTaskModal.close();
  };
  handleRemoveTask = (index) => {
    const doRemove = () => {
      const { getFieldValue, setFieldsValue } = this.props.form;
      const taskList = getFieldValue('taskList');
      taskList.splice(index, 1);
      setFieldsValue({ taskList });
    };
    Modal.confirm({
      title: '你是否确认删除这项内容?',
      onOk: doRemove
    });
  };
  bindAddTaskModalRef = (c) => {
    this.addTaskModal = c;
  };
  bindEditTaskModalRef = (c) => {
    this.editTaskModal = c;
  };
  render() {
    const { formItemLayout, form, mode } = this.props;
    const { getFieldProps, getFieldValue } = form;
    const nameProps = getFieldProps('name', {
      rules: [
        { required: true, max: 16, message: '必填，最多16个字' },
      ]
    });
    const descProps = getFieldProps('description', {
      rules: [
        { max: 20, message: '最多20个字' },
      ]
    });
    const taskListProps = getFieldProps('taskList', {
      initialValue: [],
      rules: [{
        validator(rule, value, callback) {
          if (value.length === 0) {
            callback('请添加任务');
          } else {
            callback();
          }
        }
      }]
    });
    const taskList = getFieldValue('taskList');
    const taskTableData = taskList.map(t => FormDataProcessor.composeTaskCreateRequest(t));
    return (
      <Form>
        <Form.Item label="任务流名称" {...formItemLayout} required>
          <Input {...nameProps} placeholder="最多16个字" />
        </Form.Item>
        <Form.Item label="任务流描述" {...formItemLayout}>
          <Input {...descProps} placeholder="描述任务的大致执行要求或价值，最多20个字" />
        </Form.Item>
        <Form.Item label="任务执行规则" {...formItemLayout}>
          <span>并行执行</span>
        </Form.Item>
        <Form.Item label="关联任务" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} required >
          {mode === FormMode.CREATE && <Button type="ghost" size="default" icon="plus" onClick={this.handleAddTask}>添加任务</Button>}
          <TaskEditTable list={taskTableData} readonly={mode === FormMode.EDIT} onUpdate={this.handleUpdateTask} onRemove={this.handleRemoveTask} />
          <input hidden {...taskListProps} />
        </Form.Item>
        <AddTaskModal ref={this.bindAddTaskModalRef} formItemLayout={formItemLayout} onSubmit={this.handleAddTaskSubmit} />
        <EditTaskModal ref={this.bindEditTaskModalRef} formItemLayout={formItemLayout} onSubmit={this.handleEditTaskSubmit} />
      </Form>
    );
  }
}

export default Form.create({ withRef: true })(FlowForm);
