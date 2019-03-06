import React, {PropTypes} from 'react';
import {message, Menu, Dropdown, Icon, Modal} from 'antd';
import ajax from '../../../../common/ajax';

const BrandActivityAction = React.createClass({
  propTypes: {
    item: PropTypes.object,
    refresh: PropTypes.func,
    index: PropTypes.number,
    isKbserv: PropTypes.bool,
  },

  componentWillMount() {
    this.buildMenu(this.props.item);
  },

  componentWillReceiveProps(nextProps) {
    this.buildMenu(nextProps.item);
  },

  buildMenu(item) {
    const { activityStatus, inviteStatus, planId, orderId, planOutBizType, enterpriseBenifit } = item;

    this.Menuitems = [];

    this.menu = (
      <Menu>
        {this.Menuitems}
      </Menu>
    );
    const shelves = (window.location.href).indexOf('op_merchant_id') >= 0 ? <a href={'#/marketing/retailers/brands-activity-view/' + orderId}>{inviteStatus === 'AUDIT' ? '待确认' : '确认上架'}</a> : <a target="_blank" href={'#/marketing/retailers/brands-activity-view/' + orderId}>{inviteStatus === 'AUDIT' ? '待确认' : '确认上架'}</a>;
    let comfirmUp = (
      <Menu.Item key="comfirmUp">
        {
          planOutBizType ?
            shelves
            : (<a target="_blank" href={'/goods/itempromo/discountDetail.htm?planAndOrderId=' + planId + '|' + orderId}>确认上架</a>)
        }
      </Menu.Item>
    );

    // 口碑福利详情
    if (enterpriseBenifit) {
      comfirmUp = (
        <Menu.Item key="comfirmUp">
          <a target="_blank" href={'#/marketing/retailers/welfare/' + orderId}>{inviteStatus === 'AUDIT' ? '待确认' : '确认上架'}</a>
        </Menu.Item>
      );
    }

    const cancel = (
      <Menu.Item key="cancel">
        {
          planOutBizType ?
            (<a target="_blank" href="#" onClick={this.handleOffLine}>取消上架</a>)
            : (<a target="_blank" href={'/goods/itempromo/discountDetail.htm?planAndOrderId=' + planId + '|' + orderId}>取消上架</a>)
        }

      </Menu.Item>
    );

    if (activityStatus === 'PLAN_GOING' && inviteStatus === 'INIT' ) {
      this.Menuitems.push(comfirmUp);
    }

    if (activityStatus === 'PLAN_GOING' && inviteStatus === 'SUCCESS') {
      this.Menuitems.push(cancel);
    }

    if (activityStatus === 'PLAN_GOING' && inviteStatus === 'AUDIT' ) {
      this.Menuitems.push(comfirmUp);
    }

    if ((activityStatus === 'STARTED' || activityStatus === 'CLOSED') && inviteStatus === 'SUCCESS') {
      const download = (
        <Menu.Item key="download">
          <a target="_blank" href={'/promo/brand/downloadMerchantBill.htm?orderId=' + orderId}>下载对账单</a>
        </Menu.Item>
      );

      const promo = (
        <Menu.Item key="promo">
          <a target="_blank" href={window.APP.mdataProd + '/offlinetb/kb_retailer_promo_data.htm?promoType=BRANDOWNER_SINGLE_DISCOUNT'}>查看活动效果</a>
        </Menu.Item>
      );

      this.Menuitems.push(download);
      // 如果是企业福利活动
      if (!enterpriseBenifit) {
        this.Menuitems.push(promo);
      }
    }
  },

  handleOffLine(event) {
    event.preventDefault();

    const self = this;
    const { orderId } = self.props.item;

    Modal.confirm({
      title: '是否确认取消参加品牌商的活动？',
      content: '取消前请确认活动生效时间，活动生效后将不能继续参加活动。',
      onOk() {
        ajax({
          url: 'promo/recruit/cancel.json',
          method: 'get',
          data: {
            orderId: orderId,
          },
          type: 'json',
          success: (req) => {
            if (req.status === 'success') {
              message.success('下架成功');

              self.props.refresh();
            } else {
              message.error(req.resultMsg);
            }
          },
        });
      },
    });
  },


  render() {
    const { planId, orderId, planOutBizType, enterpriseBenifit, activityStatus, inviteStatus } = this.props.item;
    const See = (window.location.href).indexOf('op_merchant_id') >= 0 ? <a href={'#/marketing/retailers/brands-activity-view/' + orderId} >查看</a> : <a href={'#/marketing/retailers/brands-activity-view/' + orderId} target="_blank" >查看</a>;
    let detailLink = planOutBizType ? See : (<a href={'/goods/itempromo/discountDetail.htm?planAndOrderId=' + planId + '|' + orderId} target="_blank">查看</a>);

    // 如果是口碑福利活动，则跳口碑福利活动详情页
    if (enterpriseBenifit) {
      detailLink = <a href={'#/marketing/retailers/welfare/' + orderId}>查看</a>;
    }
    const cancelActivity = (
      <Menu.Item key="cancelactivity">
        <a href={'#/marketing/retailers/brands-activity-view/' + orderId + '/cancelactivity'} target="_blank" >取消参加活动</a>
      </Menu.Item>
    );

    if (this.props.isAllowModifyShop && ( activityStatus === 'STARTED' || activityStatus === 'PLAN_ENDING' ) && inviteStatus === 'SUCCESS' && planOutBizType === 'BIZTYPE_BRAND_CAMPAIGN') {
      this.Menuitems.push(cancelActivity);
    }

    return (
      <div>
        {detailLink}
        { this.Menuitems.length > 0 ? (
          <Dropdown overlay={ this.menu }>
            <span style={{color: '#2db7f5'}}className="ant-dropdown-link"> | 更多 <Icon type="down" /></span>
          </Dropdown>
        ) : null }
      </div>
    );
  },
});

export default BrandActivityAction;
