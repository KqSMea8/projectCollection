import React, {PropTypes} from 'react';
import { Tabs, Button, Breadcrumb} from 'antd';
import StoredValueCardInfo from './StoredValueCardInfo';
import StoredValueCardLog from '../common/StoredValueCardLog';
import StoredValueCardOrder from './StoredValueCardOrder';
import permission from '@alipay/kb-framework/framework/permission';
import SupportModal from '../common/SupportModal';

const TabPane = Tabs.TabPane;

const StoredValueCardDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    this.itemId = this.props.params.itemId;
    return {
      allowPause: '',
      allowResume: '',
      loading: false,
      visible: false,
      title: '',
      data: {},
    };
  },

  componentWillMount() {
    this.fetchMerchantInfo();
  },

  componentDidMount() {
    this.fetch();
  },

  onClick(type) {
    let title = '恢复';
    if ( type === 'Pause') {
      title = '暂停';
    }
    this.setState({
      title: title,
      visible: true,
    });
  },

  onCancel() {
    this.setState({
      visible: false,
    });
  },

  handleChangeTabs(key) {
    window.location.hash = '/goods/storedvaluecarddetail/' + this.itemId + '/' + key;
  },

  handleResultData(oj) {
    this.setState({
      allowPause: oj.allowPause,
      allowResume: oj.allowResume,
      data: oj,
    });
  },

  fetch() {
  },

  fetchMerchantInfo() {
  },

  render() {
    const itemId = this.itemId;
    const {allowPause, allowResume} = this.state;
    return (<div className="kb-detail-main">
        {/* <h2 className="kb-page-title">储值卡详情</h2>*/}
        <Breadcrumb separator=">">
          <Breadcrumb.Item key="1" >储值卡</Breadcrumb.Item>
          <Breadcrumb.Item key="2" >详情</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs onChange={this.handleChangeTabs} destroyInactiveTabPane>
          <TabPane tab="基础信息" key="cardInfo">
            <StoredValueCardInfo ref="storedvaluecardInfo" goodsId={itemId} result={this.handleResultData}/>
          </TabPane>
          <TabPane tab="活动列表" key="cardOrder">
            <StoredValueCardOrder ref="storedvaluecardOrder" goodsId={itemId} />
          </TabPane>
          <TabPane tab="操作日志" key="cardLog">
            <StoredValueCardLog ref="operationLog" goodsId={itemId} />
          </TabPane>
        </Tabs>
        <div style={{position: 'absolute', top: 71, right: 16, zIndex: 1}}>
          { (allowPause === true && permission('ITEM_PAUSE') ) && <Button type="primary" size="large" onClick={this.onClick.bind(this, 'Pause')}>暂停</Button>}
          { (allowResume === true && permission('ITEM_RESUME') ) && <Button type="primary" size="large" onClick={this.onClick.bind(this, 'Resume')} style={{marginLeft: 10}}>恢复</Button>}
        </div>
        <SupportModal params={this.state.data} title={this.state.title} visible={this.state.visible} onCancel={this.onCancel}/>
      </div>);
  },

});

export default StoredValueCardDetail;
