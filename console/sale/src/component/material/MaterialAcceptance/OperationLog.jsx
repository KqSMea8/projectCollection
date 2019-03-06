import { Table } from 'antd';
import React, {PropTypes} from 'react';
import {format, formatTime} from '../../../common/dateUtils';

function rowKey(record) {
  return record.orderId;  // 比如你的数据主键是 uid
}

const OperationLog = React.createClass({
  propTypes: {
    bizOrders: PropTypes.array,
  },
  getInitialState() {
    this.columns = [{
      title: '流程节点',
      dataIndex: 'typeDesc',
      width: 210,
    }, {
      title: '操作人/操作时间',
      dataIndex: 'operatorName',
      width: 150,
      render(text, record) {
        if (!text) {
          return '';
        }
        let processTime;
        let processDate;
        if (record.processTime) {
          processDate = format(new Date(record.processTime));
          processTime = formatTime(new Date(record.processTime));
        } else {
          processTime = '';
        }
        return [text, <br/>, processDate, <span>&nbsp;</span>, processTime];
      },
    }, {
      title: '操作结果',
      dataIndex: 'operatorStatusDesc',
      width: 150,
    }, {
      title: '说明',
      dataIndex: 'memo',
      render(text, record) {
        if (!text) {
          return '';
        }
        let desc;
        if (record.desc) {
          desc = record.desc;
        } else {
          desc = '';
        }
        return [text, <br/>, desc];
      },
    }];

    return {};
  },
  render() {
    return (
      <div>
        <div>
          <Table columns={this.columns}
             dataSource={this.props.bizOrders}
             rowKey={rowKey}/>
        </div>
      </div>
    );
  },
});

export default OperationLog;
