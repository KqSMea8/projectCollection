import React, {PropTypes} from 'react';
import {Button, Dropdown, Menu, Icon} from 'antd';
import ajax from '../../../common/ajax';
import {remoteLog} from './utils';
import SelectMerchantModal from './SelectMerchantModal';
import BatchTaskModal from './BatchTaskModal';

const BatchTaskButtons = React.createClass({
  propTypes: {
    style: PropTypes.object,
  },

  getInitialState() {
    return {
      selectMerchantModalVisible: false,
      batchTaskModalVisible: false,
      batchTaskType: '',
    };
  },

  create() {
    remoteLog('SHOP_NEW');
    window.open('?mode=create#/shop/create');
  },

  batchCreate(e) {
    e.preventDefault();
    this.batchAction('CREATE_SHOP');
  },

  batchModify(e) {
    e.preventDefault();
    this.showBatchModal('MODIFY_SHOP');
  },

  batchAction(batchTaskType) {
    ajax({
      url: '/shop/crm/merchantSelect.json',
      method: 'get',
    }).then((response) => {
      if (response.pids && response.pids.length > 0) {
        this.setState({
          pids: response.pids,
          batchTaskType: batchTaskType,
          selectMerchantModalVisible: true,
        });
      } else {
        this.showBatchModal(batchTaskType);
      }
    });
  },

  showBatchModal(batchTaskType) {
    this.setState({
      batchTaskType: batchTaskType,
      selectMerchantModalVisible: false,
      batchTaskModalVisible: true,
    });
  },

  closeSelectMerchantModal() {
    this.setState({
      selectMerchantModalVisible: false,
    });
  },

  closeBatchModal() {
    this.setState({
      batchTaskModalVisible: false,
    });
  },

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a target="_blank" onClick={this.create}>创建单个门店</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a onClick={this.batchCreate}>批量创建门店</a>
        </Menu.Item>
      </Menu>
    );
    return (<div style={this.props.style}>
      <SelectMerchantModal
        visible={this.state.selectMerchantModalVisible}
        pids={this.state.pids}
        batchTaskType={this.state.batchTaskType}
        onOk={this.showBatchModal}
        onCancel={this.closeSelectMerchantModal} />
      <BatchTaskModal
        batchTaskType={this.state.batchTaskType}
        searchParams={this.props.searchForm}
        visible={this.state.batchTaskModalVisible}
        onFinish={this.closeBatchModal} />
      {window.APP.roleType !== 'MALL_MERCHANT' && (<Dropdown overlay={menu}>
        <Button type="primary" size="large" style={{marginRight: 10}}>
          创建门店<Icon type="down"/>
        </Button>
      </Dropdown>)}
      {window.APP.roleType !== 'MALL_MERCHANT' && (<Button type="primary" size="large" onClick={this.batchModify}>批量修改门店</Button>)}
    </div>);
  },
});

export default BatchTaskButtons;
