import React, {PropTypes} from 'react';
import {message, Menu, Dropdown, Icon, Modal} from 'antd';
import ajax from '../../../../common/ajax';

const BrandActivityAction = React.createClass({
  propTypes: {
    item: PropTypes.object,
    refresh: PropTypes.func,
    index: PropTypes.number,
  },

  componentWillMount() {
    this.buildMenu(this.props.item);
  },

  componentWillReceiveProps(nextProps) {
    this.buildMenu(nextProps.item);
  },

  buildMenu(item) {
    const { activityStatus, planId, inviteStatus, activityType } = item;

    this.Menuitems = [];

    this.menu = (
      <Menu>
        {this.Menuitems}
      </Menu>
    );

    if (activityStatus === 'STARTED') {
      const download = (
        <Menu.Item key="download">
          <a target="_blank" href={'/promo/mall/downloadMerchantBill.htm?planId=' + planId}>下载对账单</a>
        </Menu.Item>
      );

      this.Menuitems.push(download);
    }

    if (activityType === 'DIRECT_SEND' && inviteStatus === 1 && activityStatus === 'STARTING') {
      const promo = (
        <Menu.Item key="promo">
          <a target="#" onClick={this.handleActivityTest}>活动测试</a>
        </Menu.Item>
      );
      this.Menuitems.push(promo);
    }
  },

  handleActivityTest(event) {
    event.preventDefault();

    const { planId } = this.props.item;

    Modal.confirm({
      title: '活动测试',
      content: '系统将在您选择的门店下生成测试活动，该活动仅对测试名单可见。 ',
      onOk() {
        ajax({
          url: 'promo/activity/activityTest.json?planId=' + planId,
          method: 'get',
          data: {
            planId: planId,
          },
          type: 'json',
          success: (req) => {
            if (req.status === 'success') {
              Modal.success({
                title: '生成测试成功',
                content: (<div>系统将在您选择的门店下生成测试优惠，该优惠仅对测试名单可见（<a href="goods/itempromo/testList.htm" target="_blank">配置测试名单</a>）。您可在折扣管理中查看测试优惠的情况。<p className="kb-page-sub-title">测试方法</p><p>1.使用测试名单中的账号打开支付宝客户端，在您的店铺下领取测试优惠（若品牌商发布的是实时优惠则无需领取）</p>。<p>2.选择品牌商优惠中指定的商品，使用测试账号买单，验证券是否能正确核销，规则是否满足。</p><p>3.每个门店有10次测试机会，测试中商品的优惠差价由零售商自行承担。</p></div>),
              });
            } else {
              message.error(req.resultMsg);
            }
          },
        });
      },
    });
  },

  render() {
    const { planId } = this.props.item;

    return (
      <div>
        <a href={'#/marketing/retailers/external-activity-view/' + planId}>查看</a>

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
