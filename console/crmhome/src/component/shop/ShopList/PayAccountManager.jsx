import React from 'react';
import { Spin, Modal, message, Radio, Alert } from 'antd';
import ajax from '../../../common/ajax';
const RadioGroup = Radio.Group;

const PayAccountManager = React.createClass({
  getInitialState() {
    return {};
  },
  componentDidMount() {
    ajax({
      url: '/shop/crm/merchantSelect.json',
      method: 'get',
    }).then((response) => {
      if (response.pids && response.pids.length > 1) {
        // 如果商户数量 > 1，需要先选择商户
        this.setState({
          pids: response.pids,
          modalVisible: true,
        });
      } else {
        // <= 1 则直接进入账户管理页面
        window.location.href = '/shop/payeequery.htm';  // eslint-disable-line no-location-assign
      }
    });
  },
  onModalOk() {
    const choosePid = this.state.choosePid || this.state.pids[0].partnerId;
    this.setState({ modalLoading: true });
    ajax({
      url: '/shop/crm/pidChoose.json',
      method: 'get',
      data: { partnerId: choosePid },
    }).then((response) => {
      if (response.status === 'succeed') {
        // 进入账户管理页面
        window.location.href = '/shop/payeequery.htm';  // eslint-disable-line no-location-assign
      } else {
        this.setState({ modalLoading: false });
        message.error(response.resultMsg || '提交出错');
      }
    }).catch((response) => {
      console.warn(response);
      this.setState({ modalLoading: false });
      message.error(response.resultMsg || '提交出错');
    });
  },
  render() {
    const { modalVisible, pids, modalLoading } = this.state;
    return (
      <div style={{ textAlign: 'center' }}>
        <Spin />
        <Modal
          visible={modalVisible}
          title="选择主账号"
          onOk={this.onModalOk}
          maskClosable={false}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            window.location.hash = '/shop';  // eslint-disable-line no-location-assign
          }}
          confirmLoading={modalLoading}
        >
          <Alert message="你要对一下哪个账号进行操作呢？" type="info" showIcon />
          <RadioGroup
            onChange={(e) => this.setState({ choosePid: e.target.value })}
            defaultValue={pids && pids[0].partnerId}
          >
            {pids && pids.map((pid, index) =>
              (<Radio style={{ display: 'block', height: 52, lineHeight: '20px' }} key={index} value={pid.partnerId}>
                {pid.logonId}({pid.name})
                <div style={{ marginLeft: 22 }}>{pid.partnerId}</div>
              </Radio>)
            )}
          </RadioGroup>
        </Modal>
      </div>
    );
  },
});

export default PayAccountManager;
