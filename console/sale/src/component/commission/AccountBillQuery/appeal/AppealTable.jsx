import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {Table} from 'antd';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
import moment from 'moment';


const InvoicesQueryTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    form: PropTypes.any,
  },

  getInitialState() {
    return {
      PopoverData: {},
      invalidVisible: false,
      ModalVisible: false,
      visible: false,
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
  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.refresh();
    }
  },
  onShowSizeChange(_, pageSize) {
    this.onTableChange({
      current: 1,
      pageSize,
    });
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
  refresh() {
    const {pageSize} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: 1,
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
      url: appendOwnerUrlIfDev('/sale/rebate/queryAppealPageList.json'),
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        result.data = result.data || {};
        if (result.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = result.data.totalItems;
          this.setState({
            loading: false,
            data: result.data.data,
            pagination,
          });
        }
      },
      error: () => {
        this.setState({
          loading: false,
        });
      },
    });
  },


  render() {
    const columns = [
      {
        title: '申诉日期',
        width: 90,
        dataIndex: 'gmtApply',
        render(text) {
          return moment(text).format('YYYY-MM-DD');
        },
      },
      {
        title: '账单编号',
        width: 120,
        dataIndex: 'billNo',
      },
      {
        title: '申诉类型',
        width: 100,
        dataIndex: 'appealType',
      },

      {
        title: '申诉状态',
        width: 90,
        dataIndex: 'applyStatus',
        render: (text)=>{
          const applyStatusMap = {
            AUDIT_REJECT: '申诉失败',
            FINISH: '申诉成功',
          };
          if (['AUDIT_REJECT', 'FINISH'].indexOf(text) !== -1) { // 申诉失败,申诉成功
            return applyStatusMap[text];
          }
          return '申诉中';
        },
      },
      {
        title: '申诉反馈信息',
        width: 120,
        dataIndex: 'feedbackMsg',
        render(text, r) {
          if (['AUDIT_REJECT', 'FINISH'].indexOf(r.applyStatus) !== -1) { // 申诉失败,申诉成功
            return <span>{text} {r.expressCompanyName && <span>({r.expressCompanyName})</span>}</span>;
          }
          return '您的申诉正在处理中,请耐心等待申诉结果';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 150,
        render: (t, r) => {
          if (r.ipRoleId) {
            return (<span>
                <a target="_blank" href={`#/accountbill/billsdetail/${r.billNo}/${r.ipRoleId}?ipRoleId=${r.ipRoleId}`}>详情</a>
            </span>);
          }
          return (<div></div>);
        },
      },
    ];
    const {pagination, loading, data} = this.state;

    return (
      <div style={{position: 'relative'}}>
        <Table columns={columns}
          rowKey={r => r.applyNo}
          dataSource={data}
          loading={loading}
          locale={{emptyText: !this.props.params ? '暂无数据,请输入查询条件' : '搜不到结果，换下其他搜索条件吧~'}}
          pagination={pagination}
          onChange={this.onTableChange} />
      </div>
    );
  },
});

export default InvoicesQueryTable;
