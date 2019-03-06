import React, { PropTypes} from 'react';
import classnames from 'classnames';
import {padding} from '../../../common/dateUtils';
import { Icon } from 'antd';

const TradingTrendTable = React.createClass({
  propTypes: {
    dataSource: PropTypes.object,
    key: PropTypes.number,
  },

  getInitialState() {
    return {
      choosed: false,
    };
  },

  handleMouseOver() {
    this.setState({choosed: true});
  },

  handleMouseOut() {
    this.setState({choosed: false});
  },

  dealDate(gmtDate) {
    const ticketDate = new Date(gmtDate);
    return String(padding(ticketDate.getMonth() + 1) + '-' + padding(ticketDate.getDate()) + ' ' + padding(ticketDate.getHours()) + ':' + padding(ticketDate.getMinutes()));
  },

  render() {
    const data = this.props.dataSource;
    return (<div className={classnames('todo-card', {'choosed': this.state.choosed})} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
      { data ? <div>
        <div className="todo-title detail-ellipsis">来自@{data.createOperatorName}发起的 {data.configDisplayName}</div>
        <a href={`${window.APP.antprocessUrl}/ticket/dispatch/${data.idempotentId}`} target="_blank" id={data.ticketBizId}>去审批</a>
      <div className="todo-time">{this.dealDate(data.ticketGmtCreate)}</div>
       </div>
       : <div>
        <div className="todo-no-more"><Icon type="smile" />真棒！无待办事项</div>
      </div> }
    </div>);
  },
});

export default TradingTrendTable;

