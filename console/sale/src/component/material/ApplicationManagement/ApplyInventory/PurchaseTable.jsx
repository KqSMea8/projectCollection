import React, {PropTypes} from 'react';
import {Table, message, Button} from 'antd';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
import ajax from '@alipay/kb-framework/framework/ajax';
import TableActions from '../../common/TableAction';
import {format} from '../../../../common/dateUtils';
import {MaterialPropertiesObj} from '../../common/MaterialLogMap';
const KASelect = React.createClass({
  propTypes: {
    onNext: PropTypes.func,
  },
  mixins: [TableActions],
  getInitialState() {
    this.columns = [
      {
        title: '采购单号',
        dataIndex: 'produceOrderId',
      }, {
        title: '模版名称／ID',
        dataIndex: 'applicant',
        render(text, record) {
          return (<div>{record.templateName}<br/>{record.templateId}</div>);
        },
      }, {
        title: '物料属性',
        dataIndex: 'stuffType',
        render(text) {
          return (<div>{MaterialPropertiesObj[text]}</div>);
        },
      }, {
        title: '物料类型',
        dataIndex: 'stuffAttrName',
      }, {
        title: '规格尺寸',
        dataIndex: 'sizeName',
      }, {
        title: '材质',
        dataIndex: 'materialName',
      }, {
        title: '拟库存数量',
        dataIndex: 'stockQuantity',
      }, {
        title: '分配申请单数量',
        dataIndex: 'assignedApplyOrderCount',
      }, {
        title: '已分配数量',
        dataIndex: 'assignedQuantity',
      }, {
        title: '供应商名称/ID',
        dataIndex: 'supplierName',
        render(text, record) {
          return (<div>{text}<br/>{record.supplierId}</div>);
        },
      }, {
        title: '采购员／时间',
        dataIndex: 'purchaserName',
        render(text, record) {
          return (<div>{text}<br/>{format(new Date(record.gmtCreate))}</div>);
        },
      },
    ];
    return {
      showModal: false,
      loading: true,
      tableData: [],
      selectData: {},
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
    };
  },
  componentWillMount() {
    this.refresh();
  },
  radioOnChange(selectedRowKeys, selectedRows) {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({
      selectData: selectedRows[0],
    });
  },
  fetch(pageParams = {}) {
    const params = {
      mappingValue: 'kbasset.pageQueryProduceOrder',
      domain: 'KOUBEI',
      status: 'ASSIGNABLE',
      ...pageParams,
      ...this.props.params,
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
          const pagination = {...this.state.pagination};
          pagination.total = result.data.totalSize;
          this.setState({
            loading: false,
            operatorId: result.operatorId,
            tableData: result.data.data || [],
            pagination,
          });
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: (e) => {
        message.error(e.resultMsg || '服务器繁忙');
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
  goNextStep() {
    this.props.onNext(this.state.selectData);
  },
  render() {
    const rowSelection = {
      onChange: this.radioOnChange,
      type: 'radio',
    };
    const tableOptions = {
      rowSelection,
      loading: this.state.loading,
      dataSource: this.state.tableData,
      columns: this.columns,
      pagination: this.state.pagination,
      onChange: this.onTableChange,
    };
    const canNext = !this.state.selectData.hasOwnProperty('produceOrderId');
    return (<div>
        <div className="kb-detail-content">
           <Table style={{marginTop: 20, marginBottom: 10}} rowKey={r => r. produceOrderId} {...tableOptions}/>
        </div>
         <div className="content-footer">
           <Button onClick={this.goNextStep} style={{marginRight: 20}} type="primary" disabled={canNext}>下一步</Button>
           <Button>返回</Button>
         </div></div>
     );
  },
});

export default KASelect;

