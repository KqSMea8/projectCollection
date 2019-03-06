import React, {PropTypes} from 'react';
import {message, Modal} from 'antd';
import Table from '../../../../common/Table';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
import {format} from '../../../../common/dateUtils';
import moment from 'moment';
const confirm = Modal.confirm;

const MaterialAcceptanceTable = React.createClass({
  propTypes: {
    params: PropTypes.any,
  },
  getInitialState() {
    return {
      showModal: false,
      data: [],
      loading: true,
      selectedIds: [],
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

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },

  onTableChange(pagination) {
    const pager = {...this.state.pagination};

    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });

    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };

    this.fetch(params);
  },

  onSelectChange(selectedRowKeys) {
    this.setState({
      selectedIds: selectedRowKeys,
    });
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
      paveStartDate: format(moment().add(-3, 'months').toDate()),
      paveEndDate: format(moment().toDate()),
    });
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/batchKaStuffApplyOrderForQuery.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          result.data = (result.data && result.data.length) ? result.data : (result.KaApplyOrderVOs || []);
          result.data.forEach( (a, index) => {
            a.key = index;
            if (a.statusDesc === '作废') {
              a.opertion = '--';
            } else {
              a.opertion = '作废';
            }
          });
          const pagination = {...this.state.pagination};
          pagination.total = result.totalItems;
          this.setState({
            loading: false,
            data: result.data || [],
            pagination,
          });
          this.props.setPagination(pagination);
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: (result) => {
        console.log(result);
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

  reload() {
    location.reload();
  },
  doNothing() {
  },
  remove(e) {
    // 作废
    const ee = e || event;
    const target = ee.currentTarget;
    const dataId = target.getAttribute('data');
    const that = this;
    const {pageSize, current} = this.state.pagination;
    if ( !(target.className.indexOf('click_elem') !== -1)) {
      return false;
    }
    console.log(dataId);
    confirm({
      title: '您是否确认要作废这项内容',
      content: '作废后，不可恢复',
      onOk() {
        ajax({
          url: appendOwnerUrlIfDev('/sale/asset/batchKaStuffApplyOrderInvalid.json'),
          method: 'get',
          data: {orderId: dataId},
          type: 'json',
          success: (result) => {
            if (result.status === 'succeed') {
              target.innerHTML = '--';
              message.success('作废操作成功');
              // 刷新
              that.fetch({
                pageSize,
                pageNum: current,
              });
            } else {
              if (result.resultMsg) {
                message.error(result.resultMsg, 3);
              }
            }
          },
          error: (result) => {
            console.log(result);
          },
        });
      },
      onCancel() {},
    });
  },
  render() {
    const {loading, data, pagination} = this.state;
    const that = this;
    const columns = [
      {
        title: '行业',
        width: 95,
        dataIndex: 'industryDesc',
        key: 1,
      }, {
        title: '需求发起人/日期',
        width: 125,
        dataIndex: 'applicant',
        key: 2,
        render(applicant, r) {
          return [applicant, <br/>, format(new Date(r.gmtApply))];
        }
      }, {
        title: '品牌名称',
        width: 95,
        dataIndex: 'brandName',
        key: 3,
      }, {
        title: '商户名称',
        width: 165,
        dataIndex: 'merchantName',
        key: 4,
      }, {
        title: '门店名称',
        width: 130,
        dataIndex: 'shopName',
        key: 5,
      }, {
        title: '服务商名称',
        width: 95,
        dataIndex: 'providerName',
        key: 6,
      }, {
        title: 'BD',
        width: 80,
        dataIndex: 'bd',
        key: 7,
      }, {
        title: '城市',
        width: 60,
        dataIndex: 'city',
        key: 8,
      }, {
        title: '物料模版名称',
        width: 115,
        dataIndex: 'templateName',
        key: 88,
      }, {
        title: '物料属性',
        width: 95,
        dataIndex: 'stuffType',
        key: 9,
      }, {
        title: '物料材质',
        width: 95,
        dataIndex: 'material',
        key: 11,
      }, {
        title: '数量',
        width: 50,
        dataIndex: 'stuffCount',
        key: 12,
      }, {
        title: '收货地址',
        width: 165,
        dataIndex: 'receiveAddress',
        key: 13,
      }, {
        title: '联系人/联系电话',
        width: 125,
        dataIndex: 'contacts',
        key: 14,
        render(contacts, r) {
          return [contacts, <br/>, <span></span>, r.contactNumber];
        }
      }, {
        title: '供应商',
        width: 95,
        dataIndex: 'supplier',
        key: 15,
      }, {
        title: '物流公司名称/单号',
        dataIndex: 'expressCompany',
        key: 16,
        fixed: 'right',
        width: 130,
        render(expressCompany, r) {
          return [expressCompany, <br/>, <span></span>, r.expressNo];
        }
      }, {
        title: '物流状态',
        dataIndex: 'expressStatusDesc',
        key: 17,
        fixed: 'right',
        width: 80,
      }, {
        title: '申请单状态',
        dataIndex: 'statusDesc',
        key: 18,
        fixed: 'right',
        width: 80,
      }, {
        title: '操作',
        dataIndex: 'opertion',
        key: 19,
        fixed: 'right',
        width: 80,
        render(text, a) {
          return (<div>
            <span className="click_elem" key="20" style={{color: '#2db7f5', cursor: 'pointer' }} data={a.id} onClick={a.statusDesc === '有效' ? that.remove : that.doNothing}>
            {text}
            </span>
          </div>);
        },
      }];
    return (
      <div>
        <Table scroll={{ x: 1940 }} key="0" columns={columns}
               rowKey={r => r.stuffCheckId}
               dataSource={data}
               loading={loading}
               pagination={pagination}
               firstShow={!this.props.params}
               onChange={this.onTableChange} />
      </div>
    );
  },
});

export default MaterialAcceptanceTable;
