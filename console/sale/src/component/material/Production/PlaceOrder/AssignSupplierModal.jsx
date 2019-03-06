import React, { Component } from 'react';
import { Modal, Table, message } from 'antd';

export default class AssignSupplierModal extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    selected: ''
  };

  componentWillReceiveProps(next) {
    if (next.picked !== this.state.selected) {
      this.setState({selected: next.picked});
    }
  }

  selectedSupplierObject = null;

  handleClickOk = () => {
    if (!this.state.selected) {
      message.error('请先选择供应商');
      return;
    }
    this.props.onChange(this.selectedSupplierObject);
  };

  handleSelectSupplier = (keys, rows) => {
    this.setState({
      selected: keys[0]
    });
    this.selectedSupplierObject = rows[0];
  };

  render() {
    const { visible, close, list } = this.props;
    const { selected } = this.state;
    const columns = [
      {title: '供应商名称/ID/类型', dataIndex: '',
        render: (t, r) => (
          <div>
            <span>{r.supplierName}</span>/
            <span>{r.id}</span>/
            <span>{r.supplierType}</span>
          </div>
        )
      },
      {title: '生产类型', dataIndex: 'produceType'},
      {title: '物料类型', dataIndex: 'stuffType'},
      {title: '服务城市', dataIndex: 'stuffSupplierCityList',
        render: (cityList) => cityList.map(c => c.cityName).join('/')
      },
    ];
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: selected ? [selected] : [],
      onChange: this.handleSelectSupplier
    };
    return (
      <Modal
        title="选择供应商"
        width={960}
        visible={visible}
        onOk={this.handleClickOk}
        onCancel={close}
      >
        <Table
          dataSource={list}
          columns={columns}
          pagination={false}
          rowSelection={rowSelection}
          rowKey="id"
        />
      </Modal>
    );
  }
}
