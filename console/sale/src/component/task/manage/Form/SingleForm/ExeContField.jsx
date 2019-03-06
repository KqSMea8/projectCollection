/**
 * @file ExecContField.jsx
 * @desc 单任务表单执行内容表单项
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Select } from 'antd';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import { ExcelUpload } from '@alipay/kb-framework-components/lib/biz';

import { TaskExeContent, TaskExeContentText, TaskIssueMode } from '../../../common/enum';
import { getTaskExeContentOnlineOptions } from '../../../common/api';

const UploadTemplateLink = {
  [TaskExeContent.SHOP]: 'http://p.tb.cn/rmsportal_9192__E6_89_A7_E8_A1_8C_E5_86_85_E5_AE_B9_E6_A8_A1_E6_9D_BF.xls',
  [TaskExeContent.LEADS]: 'http://p.tb.cn/rmsportal_9192__E6_89_A7_E8_A1_8C_E5_86_85_E5_AE_B9_E6_A8_A1_E6_9D_BF.xls',
  [TaskExeContent.MERCHANT]: 'http://p.tb.cn/rmsportal_9192__E6_89_A7_E8_A1_8C_E5_86_85_E5_AE_B9_E6_A8_A1_E6_9D_BF.xls'
};

class ExeContField extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      exeContent: PropTypes.oneOf([
        TaskExeContent.SHOP, TaskExeContent.LEADS, TaskExeContent.MERCHANT
      ]),
      issueMode: PropTypes.oneOf([TaskIssueMode.UPLOAD, TaskIssueMode.SYSTEM]),
      file: PropTypes.shape({
        ossKey: PropTypes.string,
        name: PropTypes.string
      }),
      dataSourceCode: PropTypes.string
    }),
    onChange: PropTypes.func,
    onValidate: PropTypes.func, // 主动触发校验
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    value: {
      exeContent: '',
      issueMode: '',
      file: null,
      dataSourceCode: null,
    },
    onChange: noop,
    disabled: false,
  };
  constructor(props) {
    const {
      exeContent, issueMode, file, dataSourceCode
    } = props.value;
    super();
    this.state = {
      exeContent,
      issueMode,
      dataSourceCode,
      file
    };
    getTaskExeContentOnlineOptions().then(resp => {
      this.onlineOptionsList = resp.data;
      this.forceUpdate();
    });
  }
  componentWillReceiveProps(nextProps) {
    if (isEqual(nextProps.value, this.state)) {
      return;
    }
    this.setState({
      ...this.state,
      ...nextProps.value
    });
  }
  onlineOptionsList = [];
  handleExeContentChange = (e) => {
    this.setState({
      exeContent: e.target.value
    }, () => this.props.onChange(this.state));
  };
  handleIssueModeChange = (e) => {
    this.setState({
      issueMode: e.target.value
    }, () => this.props.onChange(this.state));
  };
  handleOnlineOptionChange = (v) => {
    this.setState({
      dataSourceCode: v
    }, () => {
      this.props.onChange(this.state);
      if (this.props.onValidate) this.props.onValidate(this.state);
    });
  };
  handleFileChange = (fileList) => {
    const file = fileList[0];
    this.setState({
      file: file ? { ossKey: file.ossKey, name: file.name } : null,
    }, () => {
      this.props.onChange(this.state);
      if (this.props.onValidate) this.props.onValidate(this.state);
    });
  };

  render() {
    const {
      exeContent, issueMode, dataSourceCode, file
    } = this.state;
    const { disabled } = this.props;
    const defaultFileList = file ? [file] : [];
    return (
      <div>
        <div>
          <Radio.Group disabled={disabled} value={exeContent} onChange={this.handleExeContentChange}>
            {Object.keys(TaskExeContent).map(t => (
              <Radio.Button
                value={TaskExeContent[t]}
                key={TaskExeContent[t]}
              >{TaskExeContentText[TaskExeContent[t]]}
              </Radio.Button>
          ))}
          </Radio.Group>
        </div>
        <div>
          <Radio.Group disabled={disabled} value={issueMode} onChange={this.handleIssueModeChange}>
            <Radio value={TaskIssueMode.UPLOAD} key={TaskIssueMode.UPLOAD}>自定义上传内容</Radio>
            <Radio value={TaskIssueMode.SYSTEM} key={TaskIssueMode.SYSTEM}>选择来自系统上数据</Radio>
          </Radio.Group>
        </div>
        {issueMode === TaskIssueMode.UPLOAD && (
          <div>
            <ExcelUpload
              buttonText={`上传${TaskExeContentText[exeContent]}列表`}
              disabled={disabled}
              kbsalesUrl={window.APP.kbsalesUrl}
              onChange={this.handleFileChange}
              defaultFileList={defaultFileList}
              limit={1}
            />
            <div>请<a href={UploadTemplateLink[exeContent]} target="_blank">下载模版</a>，按照此模版填写后再上传，限1份，一次最多2万行纪录</div>
          </div>
        )}
        {issueMode === TaskIssueMode.SYSTEM && (
          <Select
            disabled={disabled}
            placeholder="请选择"
            value={dataSourceCode ? dataSourceCode : undefined}
            onChange={this.handleOnlineOptionChange}
            style={{ width: 150 }}
          >
            {this.onlineOptionsList.map(o => (
              <Select.Option value={o} key={o}>{o}</Select.Option>
            ))}
          </Select>
        )}
      </div>
    );
  }
}

export default ExeContField;
