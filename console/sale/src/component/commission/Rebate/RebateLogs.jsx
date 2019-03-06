import React from 'react';
import { Spin } from 'antd';
import moment from 'moment';
import '../AccountBillQuery/bills.less';
import {billHelper} from '../AccountBillQuery/bill/constants';

const applyStatusMap = {'AUDIT_REJECT': '申诉失败', 'FINISH': '申诉成功', 'AUDIT_PROCESS': '申诉中', 'ABANDON': '申诉作废'};
export default class RebateLogs extends React.Component {
  downLoadAttachment(ossKey, name) {
    window.open(`/sale/rebate/fileDownload.resource?ossKey=${ossKey}&name=${encodeURIComponent(name)}&_input_charset=utf-8`,
      '_self', 'menubar=no,location=no,status=no,scrollbars=no');
  }

  render() {
    const { data, loading } = this.props;
    if (loading) {
      return <div style={{ textAlign: 'center', marginTop: '16px' }}><Spin /></div>;
    }
    if (data && data.length) {
      return (
        <div>
          <h3 className="kb-page-sub-title" style={{ display: 'inline-block', marginBottom: 0, marginRight: 15}}>申诉记录</h3>
          <div className="bill-service-container">
              <img className="bill-img" src="https://gw.alipayobjects.com/zos/rmsportal/gIcFvRmHIxFGaadJrbfA.png"></img>
              <a className="bill-font" href={billHelper} target="_blank">账单问题在线客服</a>
          </div>
          {data.map((datum, index) => {
            let applyStatusColor = '';
            if (datum.applyStatus && datum.applyStatus === 'FINISH') {
              applyStatusColor = '#0c0';
            } else if (datum.applyStatus && datum.applyStatus === 'AUDIT_REJECT') {
              applyStatusColor = 'red';
            }
            return (<div key={index} style={{borderBottom: index < data.length - 1 ? '1px dashed #ccc' : '', paddingBottom: 20}}>
            <table className="kb-detail-table-4" style={{ marginTop: '20px'}}>
              <tbody>
                <tr>
                  <td className="kb-detail-table-label">申诉日期</td>
                  <td>{moment(datum.gmtApply).format('YYYY-MM-DD')}</td>
                  <td className="kb-detail-table-label">申诉单号</td>
                  <td>
                    {datum.applyNo}
                  </td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">申诉类型</td>
                  <td>{datum.appealType}</td>
                  <td className="kb-detail-table-label">申诉状态</td>
                  <td style={{color: applyStatusColor}}>{datum.applyStatus && (applyStatusMap[datum.applyStatus] || '申诉中')}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">备注</td>
                  <td colSpan={3}>{ ['AUDIT_REJECT', 'FINISH'].indexOf(datum.applyStatus) !== -1 ? datum.applyReason : '您的申诉正在处理中,请耐心等待申诉结果' }</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">附件</td>
                  <td colSpan={3}>{datum.resourceItemVOs && datum.resourceItemVOs.length > 0 &&
                    datum.resourceItemVOs.map((d, i) => (
                      <span key={d.resourceNo}>
                        {i > 0 && '、'}
                        <a title={d.description} onClick={this.downLoadAttachment.bind(this, d.value, d.name)}>{d.name}</a>
                      </span>
                    ))}</td>
                </tr>
              </tbody>
            </table>
            {datum.feedbackMsg && (datum.applyStatus === 'FINISH' || datum.applyStatus === 'AUDIT_REJECT' || datum.applyStatus === 'ABANDON') &&
            <table className="kb-detail-table-2" style={{ marginTop: '15px'}}>
              <tbody>
                <tr>
                  <td className="kb-detail-table-label">申诉反馈信息</td>
                  <td>{datum.feedbackMsg}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">附件</td>
                  <td>
                    {(datum.auditFiles && datum.auditFiles.length > 0) ?
                      datum.auditFiles.map((d, i) => (
                        <span key={d.resourceNo}>
                          {i > 0 && '、'}
                          <a title={d.description} onClick={this.downLoadAttachment.bind(this, d.value, d.name)}>{d.name}</a>
                        </span>
                      )) : '-'
                    }
                  </td>
                </tr>
              </tbody>
            </table>}
            </div>);
          })}
        </div>
      );
    }
    return null;
  }
}
