import React from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import MyMerchantForm from './MyMerchantForm';
import MyMerchantTable from './MyMerchantTable';
import { Button, Dropdown, Menu, Icon } from 'antd';
import BatchTaskModal from '../../shop/common/BatchTaskModal';

const MyMerchant = React.createClass({
  getInitialState() {
    return {
      batchTaskModalVisible: false,
      batchTaskType: '',
      rateText: '',
      params: {},
    };
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },
  closeBatchModal() {
    this.setState({
      batchTaskModalVisible: false,
    });
  },
  rateModal(key, e) {
    e.preventDefault();
    this.setState({
      batchTaskType: 'CITY_MESSAGE',
      batchTaskModalVisible: true,
      rateText: key,
    });
  },
  render() {
    const RATE = ['导入大区-城市信息'];
    const {batchTaskType, rateText, batchTaskModalVisible, params} = this.state;
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
    return (<div>
      <div className="app-detail-header">
        <span>服务商</span>
        {permission('UPLOAD_REGION_CONFIG') && <span style={{float: 'right'}}>
          <Dropdown overlay={rateMenu}>
            <Button type="primary" size="large" style={{marginRight: 10}}>
            导入直属城市信息<Icon type="down"/>
            </Button>
          </Dropdown>
        </span>}
      </div>
      <div className="app-detail-content-padding">
        <MyMerchantForm onSearch={this.onSearch}/>
        <MyMerchantTable params={this.state.params}/>
      </div>
      <BatchTaskModal
        batchTaskType={batchTaskType}
        rateMenus={rateText}
        bizType="CITY_MESSAGE"
        visible={batchTaskModalVisible}
        onFinish={this.closeBatchModal}
        searchParams={params} />
    </div>);
  },
});

export default MyMerchant;
