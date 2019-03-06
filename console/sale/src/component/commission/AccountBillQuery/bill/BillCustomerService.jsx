import { Popover} from 'antd';
import React, { PropTypes } from 'react';
import '../bills.less';
import BillCustomerNotice from './BillCustomerNotice';
import {shouldRead, billHandBook, billHelper} from './constants.js';
import log, {SubType} from '../../common/log';
import './BillCustomerService.less';

export default class BillCustomerService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentDidMount() {
    const self = this;
    if (this.props.visible) {
      log(SubType.CUSTOMER_SERVICE_VIEW);
      setTimeout(()=>{
        self.setState({visible: true});
      }, 500);
    }
  }
  handleVisibleChange(visible) {
    if (visible) {
      log(SubType.CUSTOMER_SERVICE_VIEW);
    }
    this.setState({ visible });
  }
  render() {
    const content = (
      <div className="customer-service-links">
        <div>
          <p className="link-item"><a target="_blank" href={billHelper}>在线客服</a></p>
        </div>
        <hr className="line-hr"/>
        <div>
          <p className="link-item" onClick={() => log(SubType.CS_MANUAL_CLICK)}>
            <a target="_blank" href={billHandBook}>协作费管理操作手册</a>
          </p>
          <p className="link-item" onClick={() => log(SubType.CS_SUBMIT_INVOICE_CLICK)}><BillCustomerNotice/></p>
          <p className="link-item" onClick={() => log(SubType.CS_COMPLAINT_CLICK)}>
            <a target="_blank" href={shouldRead}>申诉前必读</a>
          </p>
        </div>
      </div>
    );
    return (
      <div className="bill-service-container">
        <img className="bill-img" src="https://gw.alipayobjects.com/zos/rmsportal/gIcFvRmHIxFGaadJrbfA.png"/>
        <Popover
          placement="bottomRight"
          content={content}
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange.bind(this)}>
          <span className="bill-font">客服中心</span>
        </Popover>
      </div>
    );
  }
}


BillCustomerService.propTypes = {
  visible: PropTypes.bool,
};
