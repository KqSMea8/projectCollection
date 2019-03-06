import { Table } from 'antd';
import React, {PropTypes} from 'react';

const PurchaseStorageDetailModalOperationLog = React.createClass({
  propTypes: {
    stuffInStockItemVOList: PropTypes.array,
  },
  getInitialState() {
    this.columns = [{
      title: '入库数量',
      dataIndex: 'curQuantity',
      width: 210,
      render(text) {
        return [text, <span>&nbsp;</span>, '件'];
      },
    }, {
      title: '收货物流公司/单号',
      dataIndex: 'logisticOrderNo',
      width: 210,
      render(text, record) {
        return (<div>{record.logisticName}<br/>{text}</div>);
      },
    }, {
      title: '入库验收人',
      dataIndex: 'checkOperatorName',
      width: 150,
    }];

    return {};
  },

  render() {
    return (
      <div>
        <Table style={{height: '300px', overflow: 'auto'}} columns={this.columns} pagination={false} dataSource={this.props.stuffInStockItemVOList}/>
      </div>
    );
  },
});

export default PurchaseStorageDetailModalOperationLog;
