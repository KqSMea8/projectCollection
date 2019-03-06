import React from 'react';
import {Button, Modal} from 'antd';
import ajax from '../../../common/ajax';
import {customLocation, decodeHTML} from '../../../common/utils';
import objectAssign from 'object-assign';

const FloatMessageModal = React.createClass({
  getInitialState() {
    return {
      showModal: false,
      floatMessage: {},
      msgTemplateType: '',
      msgTemplateData: {},
    };
  },

  componentDidMount() {
    const {bizType} = this.props;
    const url = bizType === 'brand' ? '/merchant/brandFloatNotify.json' : '/merchant/recruitNotify.json';
    ajax({
      url,
      method: 'post',
      type: 'json',
      success: (data) => {
        if (data.status === 'succeed') {
          if (data.msgTemplateType) { // 新消息展示
            this.setState({
              showModal: true,
              msgTemplateType: data.msgTemplateType,
              msgTemplateData: data.msgTemplateData,
            });
          } else if (data.data) {
            this.setState({
              showModal: true,
              floatMessage: this.formatData(data.data),
            });
          }
        }
      },
    });
  },

  formatData(data) {
    const list = {};
    const iterator = (obj) => {
      Object.keys(obj).forEach(v => {
        if (typeof obj[v] === 'object') {
          iterator(obj[v]);
        } else {
          if (typeof v === 'string') {
            list[v] = decodeHTML(obj[v]);
          } else {
            list[v] = obj[v];
          }
        }
      });
    };
    iterator(data);
    if (list.subtitle) {
      objectAssign(list, JSON.parse(list.subtitle));
    }
    ['applyTime', 'campTime', 'warmTime', 'sellTime'].forEach(v => {
      if (list[v]) {
        const timer = list[v].split('-');
        if (timer[0] === timer[1]) {
          list[v] = timer[0] + '（仅此一天）';
        }
      }
    });
    return list;
  },

  closeModal() {
    this.setState({
      showModal: false,
    });
  },

  goDetail(floatMessage) {
    const {orderId, planId, megId, planApplyWays, planOutBizType, operationPlanType, activityId } = floatMessage;
    let link = `/goods/itempromo/promotion.htm#/item-promo/detail/activity?orderId=${orderId}&planId=${planId}`;
    if (planApplyWays === 'MULTI_RECRUIT_PLAN' && planOutBizType !== 'BIZTYPE_OMP_CAMPAIGN') {
      // 泛行业商品
      link = `/goods/itempromo/promotion.htm#/item-promo/detail/product-goods?orderId=${orderId}&planId=${planId}`;
      if (['ITEM_VOUCHER', 'GENERIC_ITEM', 'PRODUCT_VOUCHER'].indexOf(operationPlanType) !== -1) {
        link = `/goods/itempromo/promotion.htm#/item-promo/detail/goods?inviteListId=${orderId}&activityId=${activityId}`;
      }
    }
    ajax({
      url: '/merchant/modifyNewsStatus.json',
      method: 'post',
      type: 'json',
      data: {
        id: megId,
      },
      success: () => {
        customLocation(link);
      },
      error: () => {
        customLocation(link);
      },
    });
  },

  render() {
    const {showModal, floatMessage, msgTemplateType, msgTemplateData} = this.state;
    const {planApplyWays, planOutBizType, applyTime, warmTime, campTime, autoApplyItemsFlag,
    title, planIntroduction, investType, percentByKb, operationPlanType} = floatMessage;
    let description = '';
    if (operationPlanType === 'ITEM_VOUCHER') {
      // 因为商品券会有商户出资，口碑互补贴的情况，所以要单独区分出来
      if (investType === '0' && percentByKb === '100') {
        description = <li style={{color: 'red'}}>该活动无需报名,口碑已经为您提供活动优惠补贴</li>;
      }
    } else {
      description = <li style={{color: 'red'}}>该活动无需报名,口碑已经为您提供活动优惠补贴</li>;
    }
    const d2 = <li style={{color: 'red'}}>口碑已经为您提供活动优惠补贴</li>;

    const showTimeByWays = () => {
      if (planApplyWays === 'MULTI_RECRUIT_PLAN' && planOutBizType !== 'BIZTYPE_OMP_CAMPAIGN') {
        // 商品活动(非单品折、单品代金券的主子单模式)
        return (<ul className="activity-item">
          <li>活动报名：{applyTime}</li>
          { warmTime ? <li>活动预热：{warmTime}</li> : null }
          <li>活动开售：{campTime}</li>
          { autoApplyItemsFlag === 'true' ? description : null }
          { operationPlanType === 'ITEM_VOUCHER' && autoApplyItemsFlag !== 'true' && percentByKb === '100' && investType === '0' ? d2 : null }
        </ul>);
      }

      // 非商品活动
      return (<ul className="activity-item">
        <li>报名时间：{applyTime}</li>
        <li>活动时间：{campTime}</li>
      </ul>);
    };

    let modal = null;
    if (!!msgTemplateType) {  // 新消息展示
      if (msgTemplateType === 'simple') {
        modal = (<Modal className="avtivity-float-box" width="960" title="" onCancel={this.closeModal} visible={showModal} footer={null} maskClosable={false} >
          <div className="avtivity-new-img" style={{backgroundImage: `url(${msgTemplateData.backgroudImageUrl})`}}>
            <a className="avtivity-new-btn" href={msgTemplateData.backgroudImageLink} />
          </div>
        </Modal>);
      }
    } else {
      modal = (<Modal className="avtivity-float-box" width="960" title="" onCancel={this.closeModal} visible={showModal} footer={null} maskClosable={false} >
        <div className="activity-box">
          <div className="activity-head" style={{background: 'url(https://t.alipayobjects.com/images/rmsweb/T1WWpiXXhfXXXXXXXX.jpg) 0 0 no-repeat'}}>
            <div className="activity-mask"></div>
            <div className="activity-content">
              <p className="activity-title ft-ellipsis">{title}</p>
              <p className="activity-sub-title ft-ellipsis" title={planIntroduction} style={{width: 500, margin: 'auto'}}>{planIntroduction}</p>
            </div>
          </div>

          { showTimeByWays() }

          <p className="activity-detail">
            <Button type="primary" size="large" onClick={() => this.goDetail(floatMessage)}>查看详情</Button>
          </p>
        </div>
      </Modal>);
    }

    return modal;
  },
});

export default FloatMessageModal;
