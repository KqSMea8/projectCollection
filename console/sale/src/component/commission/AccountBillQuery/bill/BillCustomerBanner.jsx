import React from 'react';
import BillCustomerNotice from './BillCustomerNotice';
import log, {SubType} from '../../common/log';
export default class BillCustomerBanner extends React.Component {
  render() {
    return (
      <div style={{marginTop: '10px'}}>
        <div className="ant-alert ant-alert-warning">
          <i className="ant-alert-icon anticon anticon-exclamation-circle" style={{float: 'left'}}/>
          <div className="ant-alert-message" style={{display: 'inline-block'}}>
            <p>
              1. <span onClick={() => log(SubType.SUBMIT_INVOICE_MUST_READ_CLICK)}><BillCustomerNotice/></span>
              <span className="ft-red fn-pl8" style={{ fontWeight: 700 }}>开票要求有变更，开票前请务必仔细阅读</span>
              <a href="https://render.alipay.com/p/f/jcrjazvk/index.html" target="_blank">相关公告</a>
            </p>
            <p>2. 不同签约主体的账单不能一次同时提交，请分开提交</p>
            <p>3. 申诉时效说明：以账单详情页账单记录的最后一个出账日期为准次月起，3个月内可提交申诉。</p>
            <span className="ant-alert-description"/>
          </div>
        </div>
      </div>
    );
  }
}
