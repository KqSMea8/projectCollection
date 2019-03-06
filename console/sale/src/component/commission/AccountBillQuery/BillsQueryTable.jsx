import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import {getUrl} from '@alipay/kb-framework-components/lib/util';
import isEmpty from 'lodash/isEmpty';

import {appendOwnerUrlIfDev} from '../../../common/utils';
import {transMMddData} from '../../../common/dateUtils';
import {Button, Table, message, Tag, Modal, Dropdown, Menu, Icon} from 'antd';
import BillCustomerBanner from './bill/BillCustomerBanner.jsx';
import {moneyCut} from '../common/NumberUtils';
import SumStat from './bill/SumStat';
import BillsDownload from './bill/BillsDownload';
import {PayStatus, PayStatusText} from './bill/enum';

const confirm = Modal.confirm;

const PrincipalName = {
  K53: '口碑(上海)信息技术有限公司',
  Z50: '支付宝（中国）网络技术有限公司',
};

class BillsQueryTable extends React.Component {
  static propTypes = {
    params: PropTypes.object,
  }

  state = {
    data: [],
    merchantData: [],
    loading: true,
    selectedIds: [],   // 用来存放，所选的 账单号
    instIdObj: [], // 解决分页选中不同主体可以提交的问题
    isShow: false,
    showSum: 0,
    pagination: {
      showQuickJumper: true,
      showSizeChanger: true,
      pageSize: 10,
      showTotal: (total) => {
        return `共${total}条记录`;
      },
      current: 1,
    },
  }

  componentWillMount() {
    this.setState({
      loading: false,
    });
  }

  componentDidMount() {
    if (!isEmpty(this.props.params)) {
      this.fetch();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  }

  onTableChange = (pagination, filters = {}) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      payStatus: filters.payStatus && filters.payStatus.join(','),
    };
    this.fetch(params);
  }

  onSelectChange = (selectedRowKeys) => {
    // 实现点击提交发票不同主题不能提交(主要是解决分页选中时不同主体可以提交)
    for (let i = 0; i < selectedRowKeys.length; i++) {
      for (let j = 0; j < this.state.data.length; j++) {
        if (selectedRowKeys[i] === this.state.data[j].billNo && this.state.instIdObj.indexOf(this.state.data[j].instId) === -1) {
          const obj = {};
          obj.billNo = this.state.data[j].billNo;
          obj.instId = this.state.data[j].instId;
          this.state.instIdObj.push(obj);
        }
      }
    }
    this.setState({
      selectedIds: selectedRowKeys,
    });
  }

  getSelectedRows() {
    const {selectedIds, data} = this.state;
    return data.filter(row => selectedIds.includes(row.billNo));
  }

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  }

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });

    if (permission('SALE_REBATE_BILL_QUERY')) {
      ajax({
        url: appendOwnerUrlIfDev('/sale/rebate/merchantRebateBillQuery.json'),
        method: 'post',
        data: params,
        type: 'json',
        success: (result) => {
          result.data = result.data || {};
          const pagination = {...this.state.pagination};
          pagination.total = result.totalCount;
          this.collectPolicyNames(result.data);
          this.setState({
            loading: false,
            data: result.data || [],
            selectedIds: [],
            pagination,
          });
        },
        error: () => {
          this.setState({
            loading: false,
          });
        },
      });
    } else {
      this.setState({
        loading: false,
      });
      message.warn('你没有操作权限', 3);
    }
  }

  gotoSubmitInvoice(params) { // params账单号[]
    // 实现点击提交发票不同主题不能提交
    let isShowModel = false;
    let instIdStr = '';
    const instIdArr = []; //  临时储存instId
    for (let i = 0; i < params.length; i++) {
      for (let j = 0; j < this.state.instIdObj.length; j++) {
        if (this.state.instIdObj[j].billNo === params[i]) {
          instIdArr.push(this.state.instIdObj[j].instId);
          this.instIdArr = instIdArr;
        }
      }
    }
    for (let n = 0; n < this.instIdArr.length; n++) {
      for (let m = 0; m < this.instIdArr.length; m++) {
        if (instIdArr[n] !== this.instIdArr[m]) {
          isShowModel = true;
          break;
        }
      }
      break;
    }
    if (isShowModel) {
      Modal.error({
        title: '提交失败',
        content: '不同签约主体的账单请分别提交发票',
        okText: '知道了',
      });
    } else {
      instIdStr = this.instIdArr[0];
      const targetUrl = '#/accountBill/submitInvoice/' + params + '?instId=' + instIdStr;
      if (!window.open(targetUrl)) {
        Modal.info({
          title: '请在新页面中操作',
          okText: '放弃操作',
          content: <a href={targetUrl} target="_blank"><span style={{fontSize: 14}}>点击打开新页面进行提交</span></a>
        });
      }
    }
    // 提交发票后，清空所选勾选的状态
    // const {current} = this.state.pagination;
    params.length = 0;
    this.setState({
      tablekey: new Date(),
      pagination: {
        current: 1,
      },
    });
    this.fetch();// 刷新无票付款成功后的金额();
  }

  doSubmitDummyInvoices(billNos) {
    ajax({
      url: getUrl(window.APP.kbservcenterUrl, '/sale/rebate/addDummyInvoice.json'),
      data: {billNos},
      method: 'post'
    })
      .then(
        res => {
          if (res.status === 'succeed') {
            this.setState({
              selectedIds: [],
              pagination: {
                current: 1,
              },
            });
            this.fetch();
          }
        }
      );
  }

  submitDummyInvoices = (billNos) => {
    ajax({
      url: getUrl(window.APP.kbservcenterUrl, '/sale/rebate/dummyInvoiceVerify.json'),
      data: {billNos},
      method: 'post',
    })
      .then(() => {
        confirm({
          ...BillsQueryTable.addDummyInvoiceModalOptions,
          onOk: () => this.doSubmitDummyInvoices(billNos)
        });
      })
      .catch(res => {
        if (res) {
          Modal.error({
            width: 430,
            title: (<span style={{fontWeight: 400}}>{res.resultMsg}</span>),
            okText: '知道了',
            iconType: 'exclamation-circle',
          });
        }
      });
  }

  goToRebate(r, e) {// 调整转到--申诉
    e.preventDefault();
    const that = this;
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/appealVerify.json?billNo=' + r.billNo),
      method: 'get',
      type: 'json',
      success: () => {
        const targetUrl = `#/accountbill/complaint/${r.billNo}/${r.ipRoleId}/${that.props.params.merchantPid}`;
        if (!window.open(targetUrl)) {
          Modal.info({
            title: '请在新页面中操作',
            okText: '放弃申诉',
            content: <a href={targetUrl} target="_blank"><span style={{fontSize: 14}}>点击打开新页面进行申诉</span></a>
          });
        }
      },
      error: (result) => {
        Modal.error({
          title: (
            <span style={{fontWeight: 400, position: 'absolute', paddingRight: '40px'}}>{result.resultMsg}</span>),
          okText: '知道了',
          iconType: 'exclamation-circle',
        });
      },
    });
  }

  collectPolicyNames(data) {
    const result = new Set();
    data.forEach(r => result.add(r.pricePolicyName));
    this.policyNameSet = result;
  }

  static addDummyInvoiceModalOptions = {
    title: (
      <div style={{fontWeight: 400, position: 'relative', left: '34px', top: '-21px', width: '300px', height: '50px'}}>
        <Icon type="info-circle"
              style={{fontSize: 24, color: 'rgb(0, 170, 250)', position: 'absolute', left: '-33px'}}/>
        企业不能提供有效合规的发票，口碑将扣减<span style={{color: '#F46E65'}}>32%</span>的税费后予以结算付款
        <span style={{display: 'block', fontSize: 12, color: '#333'}}>注：其中增值税税额按照6%计算，所得税税额按照25%计算，附加税税额按照1%计算</span>
      </div>
    ),
    iconType: <Icon type="info-circle" style={{fontSize: 24, color: 'rgb(0, 170, 250)'}}/>,
    content: <div style={{marginTop: 20}}><span style={{color: '#F46E65'}}>一旦提交无票付款，不可撤消，请谨慎操作。</span></div>
  }

  policyNameSet = new Set();

  render() {
    const {pagination, selectedIds, loading, showSum, data} = this.state;

    const rowSelection = {
      selectedRowKeys: selectedIds,
      onChange: this.onSelectChange,
      getCheckboxProps(record) {
        const realBillAmt = record.realBillAmt || {};
        const invoiceAmt = record.invoiceAmt || {};
        let disabledValue = false;
        if (realBillAmt.amount <= invoiceAmt.amount) {
          disabledValue = true;
        }
        if (record.fbdPayType) {
          disabledValue = true;
        }
        return {
          disabled: disabledValue,  // disabledValue为true不可选
        };
      },
    };

    const bulkActions = (
      !loading && data && data.length > 0 &&
      (<div style={{display: 'inline-block'}}>
        <span style={{marginRight: 12}}>已选({selectedIds.length})</span>
        <Button disabled={selectedIds.length === 0 || selectedIds.length <= showSum} type="primary"
                onClick={this.gotoSubmitInvoice.bind(this, selectedIds)}>
          提交发票
        </Button>

        <Button
          style={{marginLeft: '10px'}}
          type="primary"
          disabled={selectedIds.length === 0 || selectedIds.length <= showSum}
          onClick={this.submitDummyInvoices.bind(this, selectedIds.join(','))}
        >
          批量无票付款
        </Button>
      </div>)
    );

    const policyNameFilterList = Array.from(this.policyNameSet).map(name => ({text: name, value: name}));

    const columns = [
      {
        title: '账单号',
        dataIndex: 'billNo',
        fixed: window.innerWidth <= 1440 ? 'left' : false,
        width: 150,
        render(text) {
          return (<span>{text}</span>);
        },
      },
      {
        title: '业务周期',
        dataIndex: 'shopName',
        width: 120,
        render(text, r) {
          return (<span>
            {transMMddData(r.startDate)}至{transMMddData(r.endDate)}<br/>
          </span>);
        },
      },
      {
        title: '签约主体',
        dataIndex: 'instId',
        width: 120,
        render: (id) => <span>{PrincipalName[id]}</span>,
      },
      {
        title: '政策名称',
        dataIndex: 'pricePolicyName',
        width: 120,
        render: (t, r) => {
          if (r.policyNoticeUrl) {
            return <a href={r.policyNoticeUrl} target="_blank">{t}</a>;
          }
          return t;
        },
        filters: policyNameFilterList,
        onFilter: (value, record) => record.pricePolicyName === value,
      },
      {
        title: '应结算金额(元)',
        dataIndex: 'realBillAmt',
        width: 120,
        render(text) {
          return <span>{text && moneyCut(text.amount, 2)}</span>;
        },
      },
      {
        title: '付款金额(元)',
        dataIndex: 'paidAmt',
        width: 120,
        render(text, r) {
          return (
            <div>
              <p>已付:{text && moneyCut(text.amount, 2)} </p>
              <p>未付:<span style={{color: 'red'}}>{moneyCut(r.unpaidAmt.amount, 2)}</span></p>
            </div>
          );
        },
      },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        width: 120,
        render(text, r) {
          if (r.fbdPayType === '01' || r.fbdPayType === '02') {
            return <div><span>{PayStatusText[text] || text}</span><br/><Tag color="red">暂停结算</Tag></div>;
          } else if (!r.fbdPayType) {
            return <span>{PayStatusText[text] || text}</span>;
          }
        },
        filters: Object.keys(PayStatusText).map(s => ({text: PayStatusText[s], value: s})),
        onFilter: (value, record) => record.payStatus === value,
      },
      {
        title: '已开票金额(元)',
        dataIndex: 'invoiceAmt',
        width: 120,
        render(text) {
          return <span>{text && moneyCut(text.amount, 2)}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'create',
        fixed: window.innerWidth <= 1440 ? 'right' : false,
        width: 120,
        render: (text, r) => { // 参数分别为当前行的值，当前行数据，行索引
          const btns = permission('SALE_REBATE_APPEAL_MANAGE')
            ? [<a key="shensu" target="_blank" onClick={this.goToRebate.bind(this, r)}>申诉</a>]
            : [];

          if (r.billInvoiceLinkStatus !== '01') { // 关联 (01未关联)
            btns.push(
              <a key="detail" target="_blank"
                 href={`#/accountbill/List/${r.billNo}/${this.props.params.merchantPid}`}>
                查看发票
              </a>
            );
          }

          if (r.payStatus === PayStatus.NONE_PAY || r.payStatus === PayStatus.PARTIAL_PAY) {
            btns.push(
              <a key="nopayment" target="_blank"
                 onClick={this.submitDummyInvoices.bind(this, r.billNo)}>
                无票付款
              </a>
            );
          }

          return (
            <div>
              <a target="_blank"
                 href={`#/accountbill/billsdetail/${r.billNo}/${this.props.params.merchantPid}?ipRoleId=${r.ipRoleId}`}>详情</a>
              {btns.length > 0 && <span style={{margin: '0 8px', color: '#ccc'}}>|</span>}
              {btns.length > 1 && (
                <Dropdown overlay={<Menu>{btns.map((btn, ix) => <Menu.Item key={'ix' + ix}>{btn}</Menu.Item>)}</Menu>}>
                  <a className="ant-dropdown-link">
                    更多
                  </a>
                </Dropdown>
              )}
              {btns.length === 1 && btns[0]}
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <div style={{marginBottom: 10}}>
          {permission('SALE_REBATE_INVOICE_ADD') && bulkActions}
          <BillsDownload style={{float: 'right'}} params={this.props.params}/>
          {permission('SALE_REBATE_INVOICE_ADD') && <BillCustomerBanner/>}
        </div>
        <SumStat data={this.getSelectedRows()}/>
        <Table
          columns={columns}
          rowKey={r => r.billNo}
          rowSelection={rowSelection}
          dataSource={data}
          loading={loading}
          locale={{emptyText: !this.props.params ? '暂无数据,请输入查询条件' : '搜不到结果，换下其他搜索条件吧~'}}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange}
          scroll={{x: window.innerWidth <= 1440 ? columns.reduce((sum, c) => sum + c.width, 60) : false}}/>
        {permission('SALE_REBATE_INVOICE_ADD') && bulkActions && <div style={{marginTop: -44}}>{bulkActions}</div>}
      </div>
    );
  }
}

export default BillsQueryTable;
