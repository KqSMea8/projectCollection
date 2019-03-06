import React, {PropTypes} from 'react';
import {Modal, Table, message, Button} from 'antd';
import ajax from '@alipay/kb-framework/framework/ajax';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
function parseData(arr) {
  return arr.map(({itemId, orderId})=>({
    itemId, orderId}));
}
const GoodsCodeModal = React.createClass({

  propTypes: {
    onCancel: PropTypes.func,
    onSubmitDone: PropTypes.func,
    data: PropTypes.array,
  },

  getInitialState() {
    this.columns = [{
      title: '供应商名称/ID/类型',
      dataIndex: 'supplierName',
      key: 'name',
      render(text, all) {
        return (<div>{text}<br/>{all.id}<br/>{all.supplierType}</div>);
      },
    }, {
      title: '生产类型',
      dataIndex: 'produceType',
      key: 'produceType',
    }, {
      title: '物料类型',
      dataIndex: 'stuffType',
      key: 'stuffType',
    }, {
      title: '服务城市',
      key: 'stuffSupplierCityList',
      render(text, all) {
        let cities = '';
        if (all.stuffSupplierCityList) {
          all.stuffSupplierCityList.map((v, index)=>{
            if (index === all.stuffSupplierCityList.length - 1) {
              cities = cities.concat(`${v.cityName}`);
            } else {
              cities = cities.concat(`${v.cityName}，`);
            }
          });
        }
        return cities;
      },
    }];
    return {
      showModal: false,
      loading: true,
      btnLoading: false,
      selectedRows: [],
      tableData: [],
    };
  },
  componentWillMount() {
    this.fetch();
  },
  onSubmit() {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择供应商');
      return;
    }
    const id = this.state.selectedRows[0].hasOwnProperty('id') ? this.state.selectedRows[0].id : '';
    const itemIdAndOrderId = parseData(this.props.data);
    const params = {
      mappingValue: 'kbasset.assignSupplier',
      domain: 'KOUBEI',
      supplierId: id,
      itemIdAndOrderId: JSON.stringify(itemIdAndOrderId),
    };
    this.setState({btnLoading: true});
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          this.props.onSubmitDone();
          this.setState({btnLoading: false});
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg || '服务器繁忙稍后再试', 3);
            this.setState({btnLoading: false});
          }
        }
      },
      error: (err) => {
        message.error(err.resultMsg || '服务器繁忙稍后再试', 3);
        this.setState({btnLoading: false});
      },
    });
  },
  fetch() {
    const params = {
      mappingValue: 'kbasset.queryStuffSupplier',
      domain: 'KOUBEI',
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            loading: false,
            tableData: result.data || [],
          });
        } else {
          if (result.resultMsg) {
            message.error('服务器繁忙稍后再试' || result.resultMsg, 3);
          }
        }
      },
      error: () => {
        const pagination = {...this.state.pagination};
        pagination.total = 0;
        this.setState({
          loading: false,
          data: [],
          pagination,
        });
      },
    });
  },
  modalOnCancel() {
    this.setState({selectedRows: []});
    this.props.onCancel();
  },
  render() {
    const self = this;
    const modalOptions = {
      visible: true,
      title: '选择供应商',
      maskClosable: false,
      onCancel: this.props.onCancel,
      width: 720,
    };
    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        self.setState({selectedRows});
      },
      type: 'radio',
    };
    const tableOptions = {
      rowSelection,
      loading: this.state.loading,
      dataSource: this.state.tableData,
      columns: this.columns,
      pagination: false,
    };
    console.log(this.props.data);
    return (
      <Modal
      footer={[<Button key="back" type="ghost" size="large" onClick={this.props.onCancel}>取消</Button>,
              <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.onSubmit}> 提 交
                  </Button>,
                ]}
        {...modalOptions}>
        <Table style={{marginTop: 20, marginBottom: 10}}
         {...tableOptions}/>
       </Modal>);
  },
});

export default GoodsCodeModal;
