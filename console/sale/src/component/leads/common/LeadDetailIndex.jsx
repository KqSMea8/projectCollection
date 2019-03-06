import { Tabs, Button, message, Spin } from 'antd';
import ajax from 'Utility/ajax';
const TabPane = Tabs.TabPane;
import React, {PropTypes} from 'react';
import LeadDetail from './LeadDetail';
import LogDetail from './LogDetail';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';

const LeadDetailIndex = React.createClass({
  propTypes: {
    children: PropTypes.any,
    params: PropTypes.object,
  },
  getInitialState() {
    return {
      modify: false,
      isProcess: false,
    };
  },

  componentDidMount() {
    const {leadsId} = this.props.params;
    ajax({
      url: '/sale/leads/queryDetail.json',
      data: {leadsId},
      success: (res) => {
        const data = res.data;
        if (data.statusDesc === '已认领') {
          if (data.isCompleted === 'true') {
            data.statusDesc = '已补全信息';
          } else if (data.isCompleted === 'false') {
            data.statusDesc = '待补全信息';
          }
        }
        this.setState({
          modify: res.modify,
          isProcess: res.data.process,
          data,
        });
      },
      error: (e) => {
        message.error(e.resultMsg || '系统错误');
      },
    });
  },

  onChange(key) {
    window.location.hash = `leads/detail/${this.props.params.leadsId}/${key}`;
  },

  getTitleInfo() {
    let tabInfo;
    const {modify, isProcess, data} = this.state;
    let detailElement;
    let logsElement;
    detailElement = <LeadDetail params={this.props.params} data={data}/>;
    logsElement = <LogDetail params={this.props.params}/>;
    const tabBtn = modify ? (<span>{!!isProcess ? <span style={{paddingRight: 10}}>leads修改审核中，无法操作 </span> : null}<Button type="primary" size="large" disabled={!!isProcess} onClick={this.edit}>修改</Button></span>) : null;

    if (permission('LEADS_QUERY_DETAIL') && permission('LEADS_QUERY_ORDER_DETAIL')) {
      tabInfo = (<div className="kb-tabs-main">
      <Tabs
        defaultActiveKey="detail"
        onChange={this.onChange}
        tabBarExtraContent={tabBtn}
      >
        <TabPane tab="leads详情" key="detail">
          {detailElement}
        </TabPane>
        <TabPane tab="修改日志" key="logs">
          {logsElement}
        </TabPane>
      </Tabs>
    </div>);
    } else if (permission('LEADS_QUERY_DETAIL')) {
      tabInfo = (<div><div className="app-detail-header">
          leads详情
          <div style={{marginTop: -5, float: 'right'}}>
            {tabBtn}
          </div>
        </div>
        {detailElement}
      </div>);
    }

    return tabInfo;
  },

  edit() {
    const { data } = this.state;
    if (data.isCompleted !== 'true') {
      window.open('?mode=modify#/leads/edit/' + this.props.params.leadsId);
    } else {
      window.open('?mode=modify#/leads/edit/' + this.props.params.leadsId);
    }
  },
  render() {
    if (!permission('LEADS_QUERY_DETAIL') && !permission('LEADS_QUERY_ORDER_DETAIL')) {
      return <ErrorPage type="permission"/>;
    }

    if (!this.state.data) {
      return <Spin />;
    }
    return this.getTitleInfo();
  },
});

export default LeadDetailIndex;
