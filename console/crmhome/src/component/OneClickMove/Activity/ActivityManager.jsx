import React from 'react';
import { Tabs, Alert, Breadcrumb, Button, Row, Col, Checkbox, message, Spin, Modal, Tooltip } from 'antd';
import GoodDetail from '../goods/GoodDetail';
import { getUriParam, saveJumpTo } from '../../../common/utils';
import ApplySignModal from './ApplySignModal';
import RejectedModal from './RejectedModal';
import ajax from '../../../common/ajax';
import {uniq} from 'lodash';
import './activityManager.less';
const TabPane = Tabs.TabPane;

// function jumpToAddon(title, id) {
//   const url = `https://app.alipay.com/commodity/commodityDetail.htm?resource=onlineCommodity&commodityId=${id}`;
//   Modal.confirm({
//     title: `${title}应用订单已被驳回`,
//     content: <p>请到<a href={url} style={{color: '#f04134'}}>服务市场</a>重新订购应用，否则商品将无法正常上架。</p>,
//     okText: '马上去服务市场订购',
//     cancelText: '暂不订购',
//     iconType: 'info-circle',
//     onOk() {
//       saveJumpTo(url);
//     },
//   });
// }

/* 商家中心 活动管理(泛行业) */
const ActivityManager = React.createClass({
  propTypes: {
  },
  getInitialState() {
    return {
      tabPosition: 'top',
      KBchecked: true,
      visibleSignModal: false,  // 在线购买协议弹窗
      returnModifyModal: false, // 返回修改弹窗
      data: {},
      delLeadsId: [],
      loading: true,
      returnModifyvisible: false, // 点击驳回原因弹窗
      addonConfirmModalShow: false,
      addonConfirmModalTitle: null,
      addonConfirmModalUrl: '',
    };
  },
  componentWillMount() {
    this.fetch();
  },

  onClick() {
    const { data } = this.state;
    // 未签约在线购买协议，在点击确认的时候要弹窗在线购买协议
    if (!data.protocolSign.signed) {
      this.setState({
        visibleSignModal: true,
      });
    } else if (data.itemCommodityOrder && data.itemCommodityOrder.status === 'REJECTED') {
      const itemCommodityOrder = data.itemCommodityOrder || {};
      // const commodityId = data.serviceProvider ? data.serviceProvider.id : '';
      const commodityId = data.itemCommodityOrder.commodityId;
      this.jumpToAddon(itemCommodityOrder.title, commodityId);
    } else {
      this.confirmOrderAgree();
    }
  },
  onChange(value) {
    this.setState({
      KBchecked: value.target.checked,
    });
  },

  jumpToAddon(title, id) {
    const url = `https://app.alipay.com/commodity/commodityDetail.htm?resource=onlineCommodity&commodityId=${id}`;
    this.setState({
      addonConfirmModalShow: true,
      addonConfirmModalUrl: url,
      addonConfirmModalTitle: `${title}应用订单已被驳回`,
    });
  },

  confirmOrderAgree() {
    const { data } = this.state;
    const itemCommodityOrder = data.itemCommodityOrder || {};
    // const commodityId = data.serviceProvider ? data.serviceProvider.id : '';
    const commodityId = data.itemCommodityOrder.commodityId;
    const params = {
      delVoucherLeadsIds: this.state.delLeadsId,
      confirmOrderId: this.props.location.query.id,
    };
    ajax({
      url: `${window.APP.kbservindustryprodUrl}/item/leads/confirmorder/pass.json`,
      method: 'post',
      useIframeProxy: true,
      data: params,
      type: 'json',
      success: (result) => {
        this.setState({
          visibleSignModal: false,
        });
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          message.success('上架成功', 3);
          saveJumpTo(`#/oneclickmove-generic/submitsuccess?id=${params.confirmOrderId}`);
        } else {
          if (result.resultCode === 'ITEM_COMMODITY_REJECTED') {
            this.jumpToAddon(itemCommodityOrder.title, commodityId);
          } else {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: (result) => {
        this.setState({
          visibleSignModal: false,
        });
        if (result.resultCode === 'ITEM_COMMODITY_REJECTED') {
          this.jumpToAddon(itemCommodityOrder.title, commodityId);
        } else {
          message.error(result.resultMsg, 3);
        }
      },
    });
  },
  fetch() {
    const params = {
      confirmOrderId: getUriParam('id', this.props.history.search),
    };
    ajax({
      url: `${window.APP.kbservindustryprodUrl}/item/leads/confirmorder/queryDetail.json`,
      method: 'get',
      useIframeProxy: true,
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.setState({
            data: result.data,
          });
        } else {
          if (result.errorMsg) {
            message.error(result.resultMsg, 3);
          }
        }
        this.setState({ loading: false });
      },
      error: (result) => {
        this.setState({ loading: true });
        message.error(result.resultMsg, 3);
      },
    });
  },

  // 判断上架的复选框状态
  addDelLeadsId(e, leadsId) {
    const delLeadsId = uniq([...this.state.delLeadsId, leadsId]).filter(id => {
      if (leadsId !== id) return true;
      return e.target.checked;
    });
    this.setState({
      delLeadsId,
    });
  },


  // 在线购买协议弹窗
  handleSignCancel() {
    this.setState({ 'visibleSignModal': false });
  },

  // 返回修改
  reset() {
    this.setState({
      returnModifyModal: true,
    });
  },

  // 返回修改弹窗的取消按钮
  confirmHandleCancel() {
    this.setState({
      returnModifyModal: false,
    });
  },

  // 返回修改弹窗的确认
  confirmHandleOk() {
    this.setState({
      returnModifyModal: false,
    });
    saveJumpTo(`/merchant/index.htm`);
    // window.location.href = window.location.origin + '/merchant/index.htm';
  },

  returnModifyMemo(memo) {
    Modal.info({
      title: '退回原因',
      content: (<div>{memo}</div>),
      onOk() { },
    });
  },
  returnModifyHandleCancel() {
    this.setState({
      returnModifyvisible: false,
    });
  },
  render() {
    const { visibleSignModal, data, loading } = this.state;
    const confirmOrderId = this.props.location.query.id;
    const itemCommodityOrder = data.itemCommodityOrder || {};
    // 圈购买弹窗props
    const signModalOption = {
      merchantName: itemCommodityOrder.title,
      handleCancel: this.handleSignCancel,
      confirmOrderAgree: this.confirmOrderAgree, // 未签约
      onlineTradePayRate: data.protocolSign ? data.protocolSign.onlineTradePayRate : '',
    };
    const TabPaneList = [];
    if (data.leadsItems && data.leadsItems.length > 0) {
      data.leadsItems.map((c) => {
        TabPaneList.push(
          <TabPane tab={<Tooltip placement="topLeft" title={c.title}>
            <p className="tabTextOverflow">
              <span style={{ width: 160, textAlign: 'left' }}>{c.title}</span>
            </p>
          </Tooltip>} key={c.leadsId}>
            <GoodDetail leadsId={c.leadsId} addDelLeadsId={this.addDelLeadsId} delLeads={this.state.delLeadsId} isShow={data.confirmOrderAuditStatus === 'WAIT_TO_AUDIT'} />
          </TabPane>
        );
      });
    }
    /* 警告显示逻辑
    * 确认单审核状态，WAIT_TO_AUDIT(待审核)、AUDIT_REJECT(审核驳回)、AUDIT_SUCCESS(审核成功)
    * status:订购状态(WAIT_CONFIRM:待确认, WAIT_ISV_ACCEPT:待ISV接单, PURCHASED:已订购, REJECTED:已驳回
    * 如果data.confirmOrderAuditStatus=WAIT_TO_AUDIT为 待审核 则显示确认上架
    * 如果data.itemCommodityOrder.status=WAIT_CONFIRM 待确认 confirmOrderAuditStatus.status为待审核 则显示确认上架 并订购
    */
    let ShowAlert = '';
    if (data.confirmOrderAuditStatus === 'AUDIT_SUCCESS') {
      ShowAlert = <Alert message={`已确认${data.serviceProvider.name}代上架商品`} type="success" showIcon />;
    } else if (data.confirmOrderAuditStatus === 'AUDIT_REJECT') {
      ShowAlert = (<Alert
        message={<span>已驳回<span>{data.serviceProvider.name}</span>代上架商品,查看<a onClick={this.returnModifyMemo.bind(this, data.memo)}>退回原因</a></span>}
        type="warning"
        showIcon />);
    } else if (data.confirmOrderAuditStatus === 'WAIT_TO_AUDIT') {
      if (itemCommodityOrder.status === 'WAIT_CONFIRM' || itemCommodityOrder.status === 'REJECTED') {
        ShowAlert = (<Alert
          message={<span>{data.serviceProvider.name}提醒你对以下商品确认上架，同时为您订购<span style={{ color: '#f04134' }}>{itemCommodityOrder.title}</span>管理应用，确认后可通过此应用管理商品。</span>}
          type="info"
          showIcon />);
      } else if (itemCommodityOrder.status !== 'WAIT_CONFIRM' && itemCommodityOrder.status !== 'REJECTED') {
        ShowAlert = <Alert message={`${data.serviceProvider.name}提醒你对以下商品确认上架`} type="info" showIcon />;
      }
    }

    return (<div>
      {
        loading && <Row style={{ textAlign: 'center', marginTop: 80 }}><Spin /></Row>
      }
      <div style={{ display: loading ? 'none' : 'block' }}>
        <div className="app-detail-header" style={{ borderBottom: 0 }}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="/merchant/index.htm">消息中心</a></Breadcrumb.Item>
            <Breadcrumb.Item>详情</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="kb-detail-main">
          <div style={{ marginTop: '16px', marginBottom: '16px' }}></div>
          {ShowAlert}
          <div className="CommodityOrder-wrap">
            <div className="CommodityOrder-imgBox">
              <img src={itemCommodityOrder.logoUrl} />
            </div>
            <p className="CommodityOrderTitle">{itemCommodityOrder.title}</p>
          </div>
          <div className="tabConWrapBorder">
            <Tabs
              tabPosition={'left'}>
              {TabPaneList}
            </Tabs>
          </div>
          <div style={{ marginTop: '32px', display: data.confirmOrderAuditStatus === 'WAIT_TO_AUDIT' ? 'block' : 'none' }}>
            <Row>
              <Col span="10" offset="4">
                <div style={{ float: 'right' }}>
                  <Button
                    size={"large"}
                    type="primary"
                    style={{ marginRight: 12 }}
                    disabled={!this.state.KBchecked}
                    onClick={this.onClick}>确认上架全部商品</Button>
                  <Button size={"large"} type="ghost" style={{ marginRight: 12 }} onClick={this.reset}>返回修改</Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col style={{ marginTop: '16px' }} span="12" offset="9">
                <Checkbox defaultChecked={this.state.KBchecked} onChange={this.onChange} >阅读并同意</Checkbox><a target="_blank" href="https://render.alipay.com/p/f/fd-j1g41yxx/index.html">《口碑商家协议》</a>
              </Col>
            </Row>
          </div>

          {visibleSignModal ? <ApplySignModal {...signModalOption} /> : null}

          <RejectedModal
            confirmOrderId={confirmOrderId}
            returnModifyModal={this.state.returnModifyModal}
            confirmHandleOk={this.confirmHandleOk}
            confirmHandleCancel={this.confirmHandleCancel} />
          <Modal
            visible={this.state.addonConfirmModalShow}
            title={null}
            okText="马上去服务市场订购"
            cancelText="暂不订购"
            onCancel={() => { this.setState({ addonConfirmModalShow: false }); }}
            onOk={() => { saveJumpTo(this.state.addonConfirmModalUrl); }}
          >
            <div>
              <Row>
                <Col span={1} offset={1} style={{ color: '#2db7f5', fontSize: '20px' }}><i className="anticon anticon-info-circle" /></Col>
                <Col offset={1} span={19} style={{ fontWeight: 600, fontSize: '20px' }}>{this.state.addonConfirmModalTitle}</Col>
              </Row>
              <Row style={{ paddingTop: '10px' }}>
                <Col offset={3} style={{ fontSize: '14px' }} span={19}>
                  请到<a
                    href={this.state.addonConfirmModalUrl}
                    style={{ color: '#f04134' }}
                  >服务市场</a>
                  重新订购应用，否则商品将无法正常上架。
              </Col>
              </Row>
            </div>
          </Modal>
        </div>
      </div>
    </div>);
  },
});

export default ActivityManager;
