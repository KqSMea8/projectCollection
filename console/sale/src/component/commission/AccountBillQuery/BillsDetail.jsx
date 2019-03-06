import React, { PropTypes } from 'react';
import { message, Button, Modal } from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import { Page } from '@alipay/kb-framework-components/lib/layout';
import moment from 'moment';

import ajax from 'Utility/ajax';
import { transFormData, transMMddData } from '../../../common/dateUtils';
import { appendOwnerUrlIfDev, replaceDoubleQuotes } from '../../../common/utils';
import { moneyCut } from '../common/NumberUtils';
import RebateLogs from '../Rebate/RebateLogs';
import BillCustomerService from './bill/BillCustomerService';
import log, {SubType} from '../common/log';
import './bills.less';

const PrincipalName = {
  K53: '口碑(上海)信息技术有限公司',
  Z50: '支付宝（中国）网络技术有限公司',
};

const BillsDetail = React.createClass({
  propTypes: {
    id: PropTypes.any,
  },

  getInitialState() {
    return {
      data: {},
      dataPay: [],
      loading: true,
      isRebateLogsLoading: true,
      rebateLogsData: null,
      showApplyStatus: false,
    };
  },

  componentDidMount() {
    this.fetch();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id || nextProps.params.pid !== this.props.params.pid) {
      this.fetch();
    }
  },
  onClickDownload(file) {
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/rebateDownloadLog.json'),
      method: 'get',
      data: {
        downloadUrl: file.downloadUrl,
        dtlFileInfo: file.dtlFileInfo,
        billNo: file.billNo,
        chkRecordNo: file.chkRecordNo
      },
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          return;
        }
      },
    });
  },
  // 获取付款记录
  getRebateFullBillPaydtl() {
    const params = {
      billNo: this.props.params.id,
    };
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/merchantRebateFullBillPaydtl.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          let dataPays = [];
          if (result.data) {
            dataPays = result.data.filter(item => {
              return item.rcptNo;
            });
          }
          this.setState({
            dataPay: dataPays,
          });
        }
      },
    });
  },
  fetch() {
    const params = {
      billNo: this.props.params.id,
    };
    this.setState({
      loading: true,
      isRebateLogsLoading: true,
    });
    if (permission('SALE_REBATE_BILL_QUERY')) {
      ajax({
        url: appendOwnerUrlIfDev('/sale/rebate/merchantRebateBillDetail.json'),
        method: 'post',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status && result.status === 'succeed') {
            this.setState({
              loading: false,
              data: result.data.apMonthlyBillCustVO,
              monthlyBillCfmRecordVOs: result.data.monthlyBillCfmRecordVOs,
            });
          } else {
            this.setState({ loading: false });
            if (result.errorMsg) {
              message.error(result.errorMsg, 3);
            }
          }
        },
      });
      ajax({
        url: '/sale/rebate/queryAppealList.json',
        method: 'get',
        data: params,
        type: 'json',
        success: res => {
          const state = { isRebateLogsLoading: false};
          if (res.status === 'succeed') {
            state.rebateLogsData = res.data;
          } else {
            message.error(res.errorMsg || '获取申诉日志失败', 3);
          }
          this.setState(state);
          this.isShowApplyStatus(res.data);
        },
        error: () => {
          message.error('网络异常，请稍后重试', 3);
        },
      });
      this.getRebateFullBillPaydtl();
    } else {
      this.setState({
        loading: false,
        isRebateLogsLoading: false,
      });
      message.warn('你没有操作权限', 3);
    }
  },
  downloadInfo(value) {
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/merchantRebateDownloadUrl.json '),
      method: 'post',
      data: { dtlFileInfo: value },
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          const url = replaceDoubleQuotes(result.data);
          location.href = url;
        }
      },
    });
  },
  goToInvoice(billNo) {
    window.open('#/accountbill/List/' + billNo + '/' + this.props.params.pid);
  },
  goToRebate(billNo, e) {// 调整转到
    e.preventDefault();
    const that = this;
    ajax({
      url: appendOwnerUrlIfDev('/sale/rebate/appealVerify.json?billNo=' + billNo),
      method: 'get',
      type: 'json',
      success: () => {
        if (that.props.location && that.props.location.query && that.props.location.query.ipRoleId) {
          const targetUrl = `#/accountbill/complaint/${that.state.data.billNo}/${that.props.location.query.ipRoleId}/${that.props.params.pid}`;
          if (!window.open(targetUrl)) {
            Modal.info({
              title: '请在新页面中操作',
              okText: '放弃申诉',
              content: <a href={targetUrl} target="_blank"><span style={{fontSize: 14}}>点击打开新页面进行申诉</span></a>
            });
          }
        }
      },
      error: (result) => {
        Modal.error({
          title: (<span style={{fontWeight: 400, position: 'absolute', paddingRight: '40px', paddingTop: '4px'}}>{result.resultMsg}</span>),
          okText: '知道了',
          iconType: 'exclamation-circle',
          onOk() {},
        });
      },
    });
  },
  isShowApplyStatus(data) {
    if (data) {
      data.forEach(item => {
        if (item.applyStatus !== 'FINISH' && item.applyStatus !== 'AUDIT_REJECT' && item.applyStatus !== 'ABANDON') {
          this.setState({showApplyStatus: true});
        }
      });
    }
  },
  isCanRebate() {
    return this.props.location
      && this.props.location.query
      && this.props.location.query.ipRoleId
      && this.state.data
      && this.state.data.billNo;
  },
  render() {
    const {data} = this.state || {};
    const realBillAmt = data.realBillAmt || {};
    const paidAmt = data.paidAmt || {};
    const unpaidAmt = data.unpaidAmt || {};
    const invoiceAmt = data.invoiceAmt || {};
    const monthlyBillCfmRecordVOs = this.state.monthlyBillCfmRecordVOs || [];
    const LinkStatus = {
      '01': '待结算',
      '02': '部分结算',
      '03': '结算完成',
    };
    let monthlyBillDom = '';
    monthlyBillDom = monthlyBillCfmRecordVOs.map((r, i) => {
      let realBillAmt2 = '';
      if (r.realBillAmt) {
        realBillAmt2 = r.realBillAmt.amount;
      }
      return (<tr key={i}>
        <td>{r.chkRecordNo}</td>
        <td>{transFormData(r.chkDateStr)}</td>
        <td>{realBillAmt2 && moneyCut(realBillAmt2, 2)}</td>
        <td style={{ width: '500px' }}>{r.adjMemo}</td>
        <td>{permission('SALE_REBATE_DOWNLOAD') && r.downloadUrl && <a onClick={this.onClickDownload.bind(this, r)} href={r.downloadUrl} target="_blank">明细下载</a>}</td>
      </tr>);
    });

    let paymentDom = '';
    const parsePayReason = (r) => {
      if (!r.payReason) {
        return '';
      }
      return r.payReason.replace(/(\d{34}),?/g, '<a href="#/accountBill/BillsList/$1" target="_blank">$&</a>');
    };
    paymentDom = this.state.dataPay.map((r, i) => {
      return (<tr key={i}>
        <td>{r.payDate && <div>{moment(new Date(r.payDate)).format('YYYY-MM-DD')}<br />{moment(new Date(r.payDate)).format('HH:mm:ss')}</div>}</td>
        <td>{r.payeeAccountName}</td>
        <td>{r.payAmt && <div>{moneyCut(r.payAmt.amount, 2)}元</div>}</td>
        <td dangerouslySetInnerHTML={{__html: parsePayReason(r)}}/>
      </tr>);
    });
    const breadcrumb = [
      {
        title: '账单查询',
        link: '#/accountbill/billsList'
      },
      {
        title: '详情'
      }
    ];
    const header = (
      <div style={{ position: 'absolute', top: '8px', right: '15px' }}>
        {(data.payStatus === '02' || data.payStatus === '03') &&
        <Button
          type="primary"
          style={{ marginRight: '15px'}}
          onClick={this.goToInvoice.bind(this, data.billNo)}
        >
          查看发票
        </Button>
        }
        {permission('SALE_REBATE_APPEAL_MANAGE') && <Button
          type="primary"
          disabled={!this.isCanRebate()}
          style={{ marginRight: '15px'}}
          onClick={this.goToRebate.bind(this, data.billNo)}
        >
          申诉
        </Button>}
        <div style={{display: 'inline-block'}} onClick={()=>log(SubType.CUSTOMER_SERVICE_CLICK)}>
          <BillCustomerService visible/>
        </div>
      </div>
    );
    return (
      <Page
        breadcrumb={breadcrumb}
        header={header}
      >
        <div>
          <h3 className="kb-page-sub-title">支付状态：{LinkStatus[data.payStatus]}</h3>
          {!this.state.isRebateLogsLoading && this.state.showApplyStatus && this.state.rebateLogsData && this.state.rebateLogsData.length > 0 &&
            <h3 className="kb-page-sub-title">申诉状态：账单有申诉</h3>}
          {!this.state.isRebateLogsLoading && !this.state.showApplyStatus && this.state.rebateLogsData && this.state.rebateLogsData.length > 0 &&
            <h3 className="kb-page-sub-title">申诉状态：处理完成</h3>}
          <table className="kb-detail-table-6" style={{ marginTop: 16 }}>
            <tbody>
              <tr>
                <td className="kb-detail-table-label">账单号</td>
                <td>{data.billNo}</td>
                <td className="kb-detail-table-label">政策名称</td>
                <td>{data.pricePolicyName}</td>
                <td className="kb-detail-table-label">业务周期</td>
                <td>{transMMddData(data.startDate)}至{transMMddData(data.endDate)}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">应结算金额</td>
                <td>{realBillAmt && moneyCut(realBillAmt.amount, 2)}元</td>
                <td className="kb-detail-table-label">付款金额</td>
                <td>
                  <p>已付:{paidAmt && moneyCut(paidAmt.amount, 2)}元</p>
                  <p>未付:<span>{moneyCut(unpaidAmt.amount, 2)}元</span></p>
                </td>
                <td className="kb-detail-table-label">已开票金额</td>
                <td>{invoiceAmt && moneyCut(invoiceAmt.amount, 2)}元</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">签约主体</td>
                <td colSpan={5}>{PrincipalName[data.instId]}</td>
              </tr>
            </tbody>
          </table>
          <h3 className="kb-page-sub-title">账单记录
            <span style={{ marginLeft: 20, color: '#ff6e0d' }}>出账2天后可下载明细账单，品控或机具扣款不可下载明细账单</span>
          </h3>
          <table className="detailTable">
            <tbody>
              <tr>
                <td className="detailTable-label">出账批次号</td>
                <td className="detailTable-label">出账日期</td>
                <td className="detailTable-label">应结算金额 (元)</td>
                <td className="detailTable-label">调整原因</td>
                <td className="detailTable-label">操作</td>
              </tr>
              {monthlyBillDom}
            </tbody>
          </table>
          <h3 className="kb-page-sub-title" style={{ display: 'inline-block' }}>付款记录
            <span style={{ marginLeft: 20, color: '#ff6e0d' }}>单笔账单≥3000元时无票预付70%，发票验收通过结尾款</span>
          </h3>
          <table className="detailTable">
            <tbody>
              <tr>
                <td className="detailTable-label">付款时间</td>
                <td className="detailTable-label">收款账号</td>
                <td className="detailTable-label">付款金额（元）</td>
                <td className="detailTable-label" style={{ width: '500px' }}>备注</td>
              </tr>
              {paymentDom}
            </tbody>
          </table>
          <RebateLogs
            loading={this.state.isRebateLogsLoading}
            data={this.state.rebateLogsData}
          />
        </div>
      </Page>
    );
  },

});

export default BillsDetail;
