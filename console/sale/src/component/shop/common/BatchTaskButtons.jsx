import React, {PropTypes} from 'react';
import {Button, Dropdown, Menu, Icon} from 'antd';
import BatchTaskModal from './BatchTaskModal';
import BatchControlModal from './BatchControlModal';
import {remoteLog} from '../../../common/utils';
import permission from '@alipay/kb-framework/framework/permission';
import ajax from 'Utility/ajax';

const BatchTaskButtons = React.createClass({
  propTypes: {
    style: PropTypes.object,
    getParams: PropTypes.func,
  },

  getInitialState() {
    return {
      batchTaskModalVisible: false,
      batchControlModalVisible: false,
      batchTaskType: '',
      rateText: '',
      showRateText: false,
      params: {},
      status: 'SUCCESS',
      downloadResultBatchId: null,
    };
  },

  getLastBatchControlResult() {
    ajax({
      url: '/support/batch/queryLastBatchResult.json',
      method: 'get',
      data: {'scene': 'CONTROL_EVENT_SM'},
      type: 'json',
      success: (result) => {
        this.setState({
          status: result.status,
          downloadResultBatchId: result.batchId ? result.batchId : null,
        });
      },
    });
  },

  create() {
    window.open('?mode=create#/shop/create');
  },
  createMall() {
    remoteLog('SHOP_NEW');
    window.open('#/mall/create');
  },
  batchCreate(e) {
    e.preventDefault();
    this.showBatchModal('CREATE_SHOP');
  },

  batchModify(e) {
    e.preventDefault();
    this.showBatchModal('MODIFY_SHOP');
  },

  showBatchModal(batchTaskType) {
    const params = this.props.getParams();
    this.setState({
      batchTaskType: batchTaskType,
      batchTaskModalVisible: true,
      params: params,
    });
  },

  closeBatchModal() {
    this.setState({
      batchTaskModalVisible: false,
    });
  },

  showBatchControlModal() {
    this.setState({
      batchControlModalVisible: true,
    });
    this.getLastBatchControlResult();
  },

  closeBatchControlModal() {
    this.setState({
      batchControlModalVisible: false,
    });
  },

  rateModal(key, e) {
    e.preventDefault();
    const date = new Date();
    const getHours = date.getHours();
    if (getHours >= 11 && getHours < 13 || getHours >= 18 && getHours < 20 ) {
      this.setState({showRateText: true});
    }
    this.showBatchModal('RATE_SHOP');
    this.setState({
      rateText: key,
    });
  },
  render() {
    const items = [];
    if (permission('SHOP_CREATE')) {
      items.push(<Menu.Item key="0">
          <a target="_blank" onClick={this.create}>创建单个门店</a>
        </Menu.Item>);
    }

    if (permission('SHOP_BATCH_CREATE')) {
      items.push(<Menu.Item key="1">
          <a onClick={this.batchCreate}>批量创建门店</a>
        </Menu.Item>);
    }
    const menu = (
      <Menu>
        {items}
      </Menu>
    );
    const RATE = ['借记卡0费率申请'];
    const rateItems = RATE.map((key, index)=>{
      return (<Menu.Item key={`rate-${index}`}>
                <a onClick={this.rateModal.bind(this, key)}>{key}</a>
              </Menu.Item>);
    });
    const rateMenu = (
      <Menu>
        {rateItems}
      </Menu>
    );
    return (<div style={this.props.style}>
      <BatchTaskModal
        batchTaskType={this.state.batchTaskType}
        rateMenus={this.state.rateText}
        bizType="RATE_MENU_SHOP"
        showRateText={this.state.showRateText}
        visible={this.state.batchTaskModalVisible}
        onFinish={this.closeBatchModal}
        searchParams={this.state.params} />
      <BatchControlModal
        visible={this.state.batchControlModalVisible}
        onFinish={this.closeBatchControlModal}
        status={this.state.status}
        downloadResultBatchId={this.state.downloadResultBatchId}
        getLastBatchControlResult={this.getLastBatchControlResult}/>
      {
        (permission('SHOP_ZERO_RATE_ADJUST') && permission('BATCH_FILE_MANAGE')) ? (<Dropdown overlay={rateMenu}>
        <Button type="primary" size="large" style={{marginRight: 10}}>
          申请特殊费率<Icon type="down"/>
        </Button>
        </Dropdown>) : null
      }
      {
        permission('CREATE_CONTROL_EVENT') &&
        <Button type="primary" size="large" style={{marginRight: 10}} onClick={this.showBatchControlModal}>批量管控</Button>
      }
      {
        permission('SHOP_CREATE_MALL') &&
        <Button type="primary" size="large" style={{marginRight: 10}} onClick={this.createMall}>创建综合体</Button>
      }
      <Dropdown overlay={menu}>
        <Button type="primary" size="large" style={{marginRight: 10}}>
          创建门店<Icon type="down"/>
        </Button>
      </Dropdown>
      {permission('SHOP_BATCH_MODIFY') && <Button type="primary" style={{marginRight: 10}} size="large" onClick={this.batchModify}>批量修改门店</Button>}
    </div>);
  },
});

export default BatchTaskButtons;
