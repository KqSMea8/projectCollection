import React, {PropTypes} from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import { Tabs, Button, Dropdown, Menu, Icon } from 'antd';
import TeamShopList from './TeamShopList';
import TeamPosShopList from './TeamPosShopList';
import StayOpenShopList from './StayOpenShopList';
import BatchTaskButton from '../../../common/BatchTaskButton';
import BatchTaskButtonKbSales from '../../../common/BatchTaskButtonKbSales';
import BatchTaskModal from '../common/BatchTaskModal';

const TabPane = Tabs.TabPane;

const TeamShopIndex = React.createClass({
  propTypes: {
    children: PropTypes.any,
    params: PropTypes.object,
  },
  getInitialState() {
    return {
      batchTaskModalVisible: false,
      batchTaskType: '',
      rateText: '',
      showRateText: false,
      params: {},
    };
  },
  onChange(key) {
    window.location.hash = '/shop/team/' + key;
  },
  closeBatchModal() {
    this.setState({
      batchTaskModalVisible: false,
    });
  },
  rateModal(key, e) {
    e.preventDefault();
    const now = Date.now();
    const date = new Date(now);
    const getHours = date.getHours();
    if (getHours >= 11 && getHours < 13 || getHours >= 18 && getHours < 20 ) {
      this.setState({showRateText: true});
    }
    this.setState({
      batchTaskType: 'RATE_SHOP',
      batchTaskModalVisible: true,
      rateText: key,
    });
  },
  render() {
    const RATE = ['借记卡0费率申请'];
    const {batchTaskType, rateText, batchTaskModalVisible, params, showRateText} = this.state;
    const { brandId, brandName } = this.props.location.query;
    let activeKey = permission('SHOP_TEAM_POS_SALE_SHOP_LIST') ? 'team-pos-list' : 'team-list';
    if (this.props.children) {
      activeKey = this.props.children.key;
    }
    const rateItems = RATE.map((key, index) => (
      <Menu.Item key={`rate-${index}`}>
        <a onClick={this.rateModal.bind(this, key)}>{key}</a>
      </Menu.Item>
    ));
    const rateMenu = (
      <Menu>
        {rateItems}
      </Menu>
    );
    const useShopBatchNew = permission('SHOP_BATCH_AUTH_NEW') && permission('BATCH_FILE_MANAGE');
    return (<div className="kb-detail-main">
      <div style={{ display: 'inline-block', borderBottom: 0, padding: '8px 16px 8px' }} className="app-detail-header">团队门店</div>
      <div style={{ display: 'inline-block', float: 'right', paddingTop: '8px' }}>
        {activeKey !== 'team-pos-list' && <div>
          {(permission('SHOP_ZERO_RATE_ADJUST') && permission('BATCH_FILE_MANAGE')) ?
            (<span style={{ display: 'inline-block' }}><Dropdown overlay={rateMenu}>
              <Button type="primary" size="large" style={{ marginRight: 10 }}>
                申请特殊费率<Icon type="down" />
              </Button>
            </Dropdown>
            </span>) : null}
          {useShopBatchNew && (<span style={{ display: 'inline-block' }}>
             <BatchTaskButtonKbSales scene="SHOP_AUTHORIZATION_MODIFY_BATCH" modalTitle="批量授权"
               maxImportCountText={2000}>批量授权门店</BatchTaskButtonKbSales>
          </span>)}
          {!useShopBatchNew && permission('SHOP_BATCH_AUTH') && (<span style={{ display: 'inline-block' }}>
            <BatchTaskButton bizType="AUTHORIZE_SHOP" />
          </span>)}
        </div>}
      </div>
      <Tabs
        onChange={this.onChange}
        activeKey={activeKey}>
        {[
          permission('SHOP_TEAM_POS_SALE_SHOP_LIST') && <TabPane tab="团队POS销售门店" key="team-pos-list">
            <TeamPosShopList initBrand={{ id: brandId, name: brandName }} />
          </TabPane>,
          permission('SHOP_TEAM_SHOP_LIST') && <TabPane tab="团队代运营门店" key="team-list">
            <TeamShopList initBrand={{ id: brandId, name: brandName }} />
          </TabPane>,
          permission('SHOP_TO_BE_OPENED_SHOP_TEAM_LIST') && <TabPane tab="待开门店" key="stay-open">
            <StayOpenShopList />
          </TabPane>,
        ].filter(tab => tab)}
      </Tabs>
      <BatchTaskModal
        batchTaskType={batchTaskType}
        rateMenus={rateText}
        showRateText={showRateText}
        bizType="RATE_MENU_TEAM"
        visible={batchTaskModalVisible}
        onFinish={this.closeBatchModal}
        searchParams={params} />
    </div>);
  },
});

export default TeamShopIndex;
