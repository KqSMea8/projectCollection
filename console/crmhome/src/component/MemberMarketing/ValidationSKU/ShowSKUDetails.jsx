import React from 'react';
import {Tabs, Modal, Button} from 'antd';
import StoresModal from './StoresModal';
// import ajax from '../../../common/ajax';
import SUKModal from './SKUModal';
const TabPane = Tabs.TabPane;

const ShowSKUDetails = React.createClass({

  getInitialState() {
    return {
      activeKey: '',
    };
  },

  onChange(activeKey) {
    this.setState({
      activeKey,
    });
  },

  onCancel() {
    this.setState({activeKey: ''});
    this.props.closeModal('cancael');
  },

  setVoucherInfo(voucherInfo) {
    this.setState({ voucherInfo });
  },

  handleOk() {
    this.setState({activeKey: ''});
    this.props.closeModal('ok');
  },

  downloadSku() {
    const {voucherInfo} = this.state;
    const datas = {
      partnerId: voucherInfo.partnerId,
      voucherId: voucherInfo.voucherId,
    };
    window.location = `${window.APP.kbretailprod}/downloadSkuCheck.htm?biz=supermarket.skucheck&action=/skuCheck/voucherSkuSingleExcel&data=${JSON.stringify(datas)}`;
  },

  render() {
    const {visible, type} = this.props;
    const {activeKey} = this.state;
    return (
      <div style={{position: 'relative'}}>
        <Modal
          title="商户单品SKU回传验证"
          width="1000px"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.onCancel}>
          <Button type="primary" style={{ position: 'absolute', right: 17, top: 68, zIndex: '9999' }} onClick={this.downloadSku}>下载详单</Button>
          <div>
            <Tabs activeKey={activeKey ? activeKey : type} onChange={this.onChange}>
              <TabPane tab="按门店查看" key="stores">
                <StoresModal voucherId={this.props.voucherId} setVoucherInfo={this.setVoucherInfo}/>
              </TabPane>
              <TabPane tab="按SKU查看" key="sku">
                <SUKModal voucherId={this.props.voucherId} setVoucherInfo={this.setVoucherInfo}/>
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  },
});

export default ShowSKUDetails;

