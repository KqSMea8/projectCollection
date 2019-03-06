import React, { PropTypes } from 'react';
import { Table } from 'antd';
import { format, formatTime } from '../../../../common/dateUtils';
import { alipayRecordOperaLogMap } from '../../../../common/OperationLogMap';

const AlipayOperationLog = React.createClass({
  propTypes: {
    params: PropTypes.object,
    bizOrders: PropTypes.array,
  },
  getInitialState() {
    this.columns = [{
      title: '状态变更',
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
      title: '时间',
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
        return [processDate, <br />, gmtCreate];
      },
    }, {
      title: '原因',
      dataIndex: 'memo',
      width: 150,
    }];
    return {};
  },
  render() {
    return (
      <div>
        <Table
          rowKey={r => r.processDate}
          columns={this.columns}
          dataSource={this.props.bizOrders}
        />
      </div>
    );
  },
});

export default AlipayOperationLog;
