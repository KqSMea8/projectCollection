import { Table } from 'antd';
import React, {PropTypes} from 'react';
import {format, formatTime} from '../../../../common/dateUtils';
import {alipayRecordOperaLogMap} from '../../../../common/OperationLogMap';

function rowKey(record) {
  return record.orderId;  // 比如你的数据主键是 uid
}

const OperationLog = React.createClass({
  propTypes: {
    bizOrders: PropTypes.array,
    params: PropTypes.object,
  },
  getInitialState() {
    this.columns = [{
      title: '操作',
      dataIndex: 'type',
      width: 210,
      render(text) {
        if (!text) {
          return '';
        }
        let typeDesc;
        alipayRecordOperaLogMap.forEach((operaLog) => {
          if (operaLog.text === text) {
            typeDesc = operaLog.value;
            return;
          }
        });
        return typeDesc;
      },
    }, {
      title: '操作人',
      dataIndex: 'operatorName',
      width: 210,
    }, {
      title: '操作时间',
      dataIndex: 'gmtCreate',
      width: 150,
      render(text, record) {
        if (!text) {
          return '';
        }
        let processDate;
        let gmtCreate;
        if (record.gmtCreate) {
          processDate = format(new Date(record.gmtCreate));
          gmtCreate = formatTime(new Date(record.gmtCreate));
        } else {
          gmtCreate = '';
        }
        return [processDate, <br/>, gmtCreate];
      },
    }, {
      title: '备注',
      dataIndex: 'memo',
      width: 150,
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
