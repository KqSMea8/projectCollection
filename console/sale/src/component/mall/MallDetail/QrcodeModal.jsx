import React, {PropTypes} from 'react';
import {Modal, Tabs} from 'antd';
import QrcodeModalPay from './QrcodeModalPay';
import QrcodeModalPropaganda from './QrcodeModalPropaganda';
import QrcodeModalSMS from './QrcodeModalSMS';

const TabPane = Tabs.TabPane;

const QrcodeModal = React.createClass({
  propTypes: {
    id: PropTypes.string,
    onCancel: PropTypes.func,
    shopType: PropTypes.string,
  },

  render() {
    const items = [];
    if (this.props.shopType !== 'MALL') {
      items.push(
        (<TabPane tab="收款二维码" key="0">
          <QrcodeModalPay id={this.props.id}/>
        </TabPane>),
        (<TabPane tab="宣传二维码" key="2">
          <QrcodeModalPropaganda id={this.props.id}/>
        </TabPane>),
        (<TabPane tab="收款短信管理" key="1">
          <QrcodeModalSMS id={this.props.id}/>
        </TabPane>)
      );
    } else {
      items.push(
        <TabPane tab="宣传二维码" key="2">
          <QrcodeModalPropaganda shopType={this.props.shopType} id={this.props.id}/>
        </TabPane>
      );
    }
    return (<Modal title="门店二维码" visible
      width={770}
      onCancel={this.props.onCancel}
      footer={''}>
      <Tabs destroyInactiveTabPane>
        {items}
      </Tabs>
    </Modal>);
  },
});

export default QrcodeModal;
