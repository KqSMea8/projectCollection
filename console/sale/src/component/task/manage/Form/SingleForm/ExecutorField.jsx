/**
 * @file Executor.jsx
 * @desc 单任务表单执行人表单项
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Popover} from 'antd';

import {TaskExeContent, TaskExecutor, TaskExecutorText} from '../../../common/enum';

class ExecutorField extends React.PureComponent {
  static propTypes = {
    exeContent: PropTypes.oneOf([
      TaskExeContent.SHOP, TaskExeContent.MERCHANT, TaskExeContent.LEADS
    ])
  };
  static defaultProps = {
    exeContent: TaskExeContent.SHOP
  };

  render() {
    const {exeContent} = this.props;
    let executorContent;
    switch (exeContent) {
    default:
    case TaskExeContent.SHOP:
      executorContent = <span>{TaskExecutorText[TaskExecutor.SHOP_OPERATOR]}</span>;
      break;
    case TaskExeContent.LEADS:
      executorContent = <span>{TaskExecutorText[TaskExecutor.LEADS_BELONGER]}</span>;
      break;
    case TaskExeContent.MERCHANT:
      executorContent = (
          <span>{TaskExecutorText[TaskExecutor.MERCHANT_BELONGER]}
            <Popover content="TKA商户是商户归属BD；非TKA商户是商户所有门店的代运营服务商人员" title="人户关系">
              <Icon type="question-circle-o"/>
            </Popover>
          </span>
        );
      break;
    }
    return executorContent;
  }
}

export default ExecutorField;
