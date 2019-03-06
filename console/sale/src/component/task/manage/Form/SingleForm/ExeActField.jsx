/**
 * @file ExecContField.jsx
 * @desc 单任务表单执行动作表单项
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Icon, Input, Popover } from 'antd';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';

import { TaskExeStrategy } from '../../../common/enum';

const IMG_TODO_DEAL_FORM = 'https://gw.alipayobjects.com/zos/rmsportal/dlrcsXGOrOzWshpbzyta.jpg';
const IMG_TODO_DEAL_SUCCESS = 'https://gw.alipayobjects.com/zos/rmsportal/VOwPTaFovJcoAHgFScyu.jpg';

class ExeActField extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.shape({
      exeStrategy: PropTypes.oneOf([TaskExeStrategy.DEFAULT, TaskExeStrategy.USER_DEF]),
      pcUrl: PropTypes.string,
      wirelessUrl: PropTypes.string,
    }),
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    onChange: noop,
    value: {
      exeStrategy: TaskExeStrategy.DEFAULT,
      pcUrl: '',
      wirelessUrl: ''
    },
    disabled: false,
  };
  constructor(props) {
    super();
    const { exeStrategy, pcUrl, wirelessUrl } = props.value;
    this.state = {
      exeStrategy,
      pcUrl,
      wirelessUrl
    };
  }
  componentWillReceiveProps(nextProps) {
    if (isEqual(nextProps.value, this.props.value)) {
      return;
    }
    this.setState({
      ...nextProps.value
    });
  }
  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ exeStrategy: value }, () => this.props.onChange(this.state));
  };
  handlePcUrlChange = (e) => {
    this.setState({ pcUrl: e.target.value }, () => this.props.onChange(this.state));
  };
  handleWirelessUrlChange = (e) => {
    this.setState({ wirelessUrl: e.target.value }, () => this.props.onChange(this.state));
  };
  render() {
    const { exeStrategy, pcUrl, wirelessUrl } = this.state;
    const { disabled } = this.props;
    const defaultActionPopover = (
      <Popover
        title="默认操作"
        content={(
          <div>
            <p>操作按钮：立即处理</p>
            <p>点击跳转：处理页，小二根据实际情况选择处理结果和任务触发的原因</p>
            <div style={{padding: '16 0'}}>
              <a href={IMG_TODO_DEAL_FORM} target="_blank"><img width="100" src={IMG_TODO_DEAL_FORM} alt="提交处理页"/></a>
              <a href={IMG_TODO_DEAL_SUCCESS} target="_blank"><img style={{marginLeft: 16}} width="100" src={IMG_TODO_DEAL_SUCCESS} alt="处理成功页"/></a>
            </div>
          </div>
        )}
      >
        <Icon type="question-circle-o" />
      </Popover>
    );
    return (
      <div>
        <Radio.Group disabled={disabled} value={exeStrategy} onChange={this.handleChange}>
          <Radio value={TaskExeStrategy.DEFAULT} key={TaskExeStrategy.DEFAULT}>
            默认操作流程 {defaultActionPopover}
          </Radio>
          <Radio value={TaskExeStrategy.USER_DEF} key={TaskExeStrategy.USER_DEF}>自定义操作流程</Radio>
        </Radio.Group>
        {exeStrategy === TaskExeStrategy.USER_DEF && (
          <div className="exec-action-url-inputs">
            <Input disabled={disabled} value={pcUrl} onChange={this.handlePcUrlChange} addonBefore="适用于PC中台" type="url" placeholder="输入跳转的URL" />
            <Input disabled={disabled} value={wirelessUrl} onChange={this.handleWirelessUrlChange} addonBefore="适用于钉钉中台" type="url" placeholder="输入跳转的URL" />
          </div>
        )}
      </div>
    );
  }
}

export default ExeActField;
