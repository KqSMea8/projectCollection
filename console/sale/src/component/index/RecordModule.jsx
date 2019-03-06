import React from 'react';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import {Row, Col} from 'antd';
import {format} from '../../common/dateUtils';
import {appendOwnerUrlIfDev} from '../../common/utils';
import classnames from 'classnames';
import moment from 'moment';

const RecordModule = React.createClass({
  getInitialState() {
    return {
      loading: true,
      data: [],
      timeout: false,
      today: format(moment().toDate()),
      yestoday: format(moment().add(-1, 'days').toDate()),
    };
  },

  componentWillMount() {
    // 查询访客角色
    this.queryLoginRole();
    // 查询今日拜访量
    this.queryCountByToday();
    // 查询近30日拜访量
    this.queryCountByMonth();
  },

  queryLoginRole() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/visitrecord/queryLoginRole.json'),
      success: (result) => {
        if (result.status === 'succeed') {
          const items = result.data;
          for (let i = 0; i < items.length; i++) {
            if (items[i] === 'manager') {
              this.setState({
                isManager: true,
              });
              break;
            }
          }
        }
      },
      error: () => {},
    });
  },

  queryCountByToday() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/visitrecord/queryCountByToday.json'),
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            countToday: result.data,
          });
        }
      },
      error: () => {},
    });
  },

  queryCountByMonth() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/visitrecord/queryCountByMonth.json'),
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            countMonth: result.data,
          });
        }
      },
      error: () => {},
    });
  },

  render() {
    const {isManager, today, countToday, yestoday, countMonth} = this.state;
    const paddingStyle = {
      padding: '10px 3px',
    };
    return (<div className="kb-todo-panel">
    <h3>拜访小记{!isManager && permission('VISITRECORD_ADD_PC') && <a target="_blank" href={`#/record/newrecord/SHOP`}>新增</a>}</h3>
    <div style={{marginTop: '10px'}}>
      <Row>
        <div style={{'textAlign': 'justify'}}>
          <Col span="12" style={{paddingRight: 6}}>
            <div className={classnames('border-panel')} style={{padding: 20}}>
              <div className="todo-time" style={{fontSize: '10'}}>统计时间: {today}</div>
              {(isManager && countToday >= 0) && <div className="todo-title" style={paddingStyle}>
                {countToday}</div>}
              {(!isManager && countToday >= 0) && <div className="todo-title" style={paddingStyle}>
                <a target="_blank" href={'#/record?day=Today'}>{countToday}</a>
                </div>}
              {countToday === undefined && <div className="todo-title" style={paddingStyle}>暂无数据</div>}
              <div className="todo-title" style={{fontSize: '10'}}>{isManager && '团队'}今日拜访数</div>
            </div>
          </Col>
          <Col span="12">
            <div className={classnames('border-panel')} style={{padding: 20}}>
              <div className="todo-time" style={{fontSize: '10'}}>统计时间: {yestoday}</div>
              {(isManager && countMonth >= 0) && <div className="todo-title" style={paddingStyle}>
                {countMonth}</div>}
              {(!isManager && countMonth >= 0) && <div className="todo-title" style={paddingStyle}>
                <a target="_blank" href={window.APP.mdataprodUrl + '/midoffice/index.htm#/data/midoffice_pc_mcp_record_shop'}>{countMonth}</a>
                </div>}
              {countMonth === undefined && <div className="todo-title" style={paddingStyle}>暂无数据</div>}
              <div className="todo-title" style={{fontSize: '10'}}>{isManager && '团队'}近30日拜访数</div>
            </div>
          </Col>
        </div>
      </Row>
    </div>
  </div>);
  },
});

export default RecordModule;
