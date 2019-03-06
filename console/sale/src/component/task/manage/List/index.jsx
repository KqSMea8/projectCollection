import React from 'react';
import { Button } from 'antd';
import { PageNoAuth } from '@alipay/kb-framework-components';
import { TabPage } from '@alipay/kb-biz-components';
import permission from '@alipay/kb-framework/framework/permission';

import { TaskBizType, TaskBizTypeText } from '../../common/enum';
import './style.less';

import ListFactory from './ListFactory';

class List extends React.Component {
  constructor(props) {
    super();
    const { bizType } = props.params;
    let tabBizType = bizType;
    if (!tabBizType && window.APP.isKA) tabBizType = TaskBizType.TKA;
    if (!tabBizType) tabBizType = TaskBizType.CITY;

    this.enabledViewBizTypes = [];
    if (permission('CITY_TASK_DEF_QUERY')) this.enabledViewBizTypes.push(TaskBizType.CITY);
    if (permission('HQ_TASK_DEF_QUERY')) this.enabledViewBizTypes.push(TaskBizType.HQ);
    if (permission('TKA_TASK_DEF_QUERY')) this.enabledViewBizTypes.push(TaskBizType.TKA);
    if (this.enabledViewBizTypes.indexOf(tabBizType) === -1) {
      tabBizType = this.enabledViewBizTypes[0];
    }
    this.state = { bizType: tabBizType };
  }
  handleCreateTask = () => {
    this.props.history.push(`/task/manage/create/${this.state.bizType}`);
  };
  render() {
    if (!permission('CITY_TASK_DEF_QUERY') && !permission('HQ_TASK_DEF_QUERY') && !permission('TKA_TASK_DEF_QUERY')) {
      return <PageNoAuth authCodes={['TASK_DEF_QUERY_MENU', 'CITY_TASK_DEF_QUERY/HQ_TASK_DEF_QUERY/TKA_TASK_DEF_QUERY']}/>;
    }
    const { taskType } = this.props.params;
    const { bizType } = this.state;
    const tabs = this.enabledViewBizTypes.map(t => ({
      title: `${TaskBizTypeText[t]}任务`,
      key: t,
      component: <ListFactory bizType={t} taskType={taskType} />
    }));
    const header = (
      <div style={{ overflow: 'hidden', float: 'right' }}>
        {(permission('CITY_TASK_DEF_MANAGER') || permission('HQ_TASK_DEF_MANAGER') || permission('TKA_TASK_DEF_MANAGER'))
        && <Button type="primary" style={{ marginRight: 8 }} onClick={this.handleCreateTask}>创建任务</Button>}
      </div>
    );
    return (
      <TabPage
        tabs={tabs}
        activeKey={bizType}
        onChange={key => this.setState({ bizType: key })}
        header={header}
      />
    );
  }
}

export default List;
