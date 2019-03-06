import React from 'react';
import PropTypes from 'prop-types';

import { Form, Input } from 'antd';

import TipsImageUpload from './TipsImageUpload';
import ExeContField from './ExeContField';
import ExeActField from './ExeActField';
import ExecutorField from './ExecutorField';
import DeadlineTimeField from './DeadlineTimeField';

import './SingleForm.less';
import { FormMode } from '../../../../../common/enum';
import { TaskExeContent, TaskExeStrategy, TaskIssueMode, TaskStatus } from '../../../common/enum';

class SingleForm extends React.Component {
  static propTypes = {
    /* eslint react/forbid-prop-types:0 */
    formItemLayout: PropTypes.object,
    mode: PropTypes.oneOf([FormMode.CREATE, FormMode.EDIT]),
  };
  static defaultProps = {
    formItemLayout: {},
    mode: FormMode.EDIT,
  };

  static validateExeAct(rule, value, callback) {
    const urlPattern = /https?:\/\/\w+/;
    const {exeStrategy, pcUrl, wirelessUrl} = value;
    if (exeStrategy === TaskExeStrategy.USER_DEF) {
      if (!pcUrl && !wirelessUrl) {
        callback('请至少输入一个URL');
      } else if (
        (pcUrl && !urlPattern.test(pcUrl)) || (wirelessUrl && !urlPattern.test(wirelessUrl))
      ) {
        callback('请输入正确的URL');
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  static validateExeCont(rule, value, callback) {
    const { issueMode, file, dataSourceCode } = value;
    if (issueMode === TaskIssueMode.UPLOAD) {
      if (!file) {
        callback('请上传Excel文件');
        return;
      }
    } else if (issueMode === TaskIssueMode.SYSTEM) {
      if (!dataSourceCode) {
        callback('请选择数据源');
        return;
      }
    }
    callback();
  }

  render() {
    const { formItemLayout, mode } = this.props;
    const { getFieldProps, getFieldValue } = this.props.form;
    const nameProps = getFieldProps('name', {
      rules: [
        { required: true, max: 16, message: '必填，最多16个字' },
      ]
    });
    const descProps = getFieldProps('description', {
      rules: [
        { maxLength: 20, max: 20, message: '最多20个字' }
      ]
    });
    const deadlineProps = getFieldProps('deadlineTimeTypeDTO', {
      validateTrigger: 'onValidate',
      rules: [
        { required: true, message: '请选择截止日期' },
        { validator: DeadlineTimeField.validate },
      ]
    });
    const tipsProps = getFieldProps('tips', {
      initialValue: null
    });
    const exeContProps = getFieldProps('exeContentValues', {
      validateTrigger: 'onValidate',
      initialValue: {
        exeContent: TaskExeContent.SHOP,
        issueMode: TaskIssueMode.UPLOAD,
        file: null,
        dataSourceCode: ''
      },
      rules: [{validator: SingleForm.validateExeCont}]
    });
    const exeActProps = getFieldProps('exeActValues', {
      validateTrigger: '_', // onChange 时不校验
      initialValue: {
        exeStrategy: TaskExeStrategy.DEFAULT,
        pcUrl: '',
        wirelessUrl: ''
      },
      rules: [{validator: SingleForm.validateExeAct}]
    });
    const status = getFieldValue('status');
    return (
      <Form>
        {/* 隐藏域，用于编辑模式下保存`status`字段 */}
        <input {...getFieldProps('status')} hidden/>
        <Form.Item label="任务名称" {...formItemLayout} required>
          <Input
            {...nameProps}
            placeholder="最多16个字"
            disabled={mode === FormMode.EDIT && [TaskStatus.PROCESSING_PART_FAIL, TaskStatus.PROCESSING].includes(status)}
          />
        </Form.Item>
        <Form.Item label="任务描述" {...formItemLayout}>
          <Input {...descProps} placeholder="描述任务的大致执行要求或价值，最多20个字" />
        </Form.Item>
        <Form.Item label="截止时间" {...formItemLayout} required>
          <DeadlineTimeField
            {...deadlineProps}
            disabled={mode === FormMode.EDIT && [TaskStatus.PROCESSING_PART_FAIL, TaskStatus.PROCESSING].includes(status)}
          />
        </Form.Item>
        <Form.Item label="执行攻略" {...formItemLayout}>
          <TipsImageUpload {...tipsProps} />
        </Form.Item>
        <Form.Item label="执行内容" {...formItemLayout}>
          <ExeContField
            {...exeContProps}
            disabled={mode === FormMode.EDIT && [TaskStatus.PROCESSING_PART_FAIL, TaskStatus.PROCESSING].includes(status)}
          />
        </Form.Item>
        <Form.Item label="执行动作" {...formItemLayout}>
          <ExeActField
            {...exeActProps}
            disabled={mode === FormMode.EDIT && [TaskStatus.PROCESSING_PART_FAIL, TaskStatus.PROCESSING].includes(status)}
          />
        </Form.Item>
        <Form.Item label="执行者" {...formItemLayout}>
          <ExecutorField exeContent={getFieldValue('exeContentValues').exeContent} />
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({ withRef: true })(SingleForm);
