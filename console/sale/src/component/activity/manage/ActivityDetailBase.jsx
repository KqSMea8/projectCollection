import React, {PropTypes} from 'react';
import { message } from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import { getQueryFromURL, keepSessionAlive } from '../../../common/utils';

const activityPageMap = {
  'CONSUME_SEND_OLD': '/goods/koubei/promotionDetail.htm',
  'GUESS_SEND': '/goods/koubei/promotionDetail.htm',
};

let messageHandler = null;
const ActivityDetailBase = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    return {};
  },

  componentDidMount() {
    keepSessionAlive();
    messageHandler = e => { // eslint-disable-line
      try {
        const postData = JSON.parse(e.data);
        const action = postData.action;
        switch (action) {
        case 'warning':
        case 'warn': {
          message.warn(postData.message);
          break;
        }
        case 'error': {
          message.error(postData.message);
          break;
        }
        case 'success': {
          message.success(postData.message);
          break;
        }
        case 'goback': {
          const params = getQueryFromURL(this.props.location.search); // fromUrl 覆盖掉所有跳转逻辑
          const fromUrl = params.fromUrl;
          if (fromUrl) {
            location.href = fromUrl;
          } else if (postData.url && postData.url.indexOf('#/') === 0) {
            location.hash = postData.url;
          } else if (postData.url) {
            location.href = postData.url;
          } else {
            location.reload();
          }
          break;
        }
        default:
        }
      } catch (err) {console.log(err);}
    };
    window.addEventListener('message', messageHandler);
  },

  componentWillUnmount() {
    if (messageHandler) {
      window.removeEventListener('message', messageHandler);
    }
  },

  render() {
    const {type, merchantId, campId, fromSource, campStatusFlag} = this.props.params;
    let url;
    if (type === 'CONSUME_SEND_OLD' || type === 'CONSUME_SEND' && campStatusFlag === 'CAMP_OLD') {
      if (fromSource === 'KB_SERVICE') {
        url = window.APP.crmhomeUrl + '/goods/koubei/promotionDetail.htm.kb?campId=' + campId + '&op_merchant_id=' + merchantId;
      } else if (fromSource === 'KB_SALES') {
        url = window.APP.crmhomeUrl + '/goods/itempromo/promoDetail.htm.kb?campId=' + campId + '&op_merchant_id=' + merchantId;
      }
    } else if (campStatusFlag === 'CAMP_NEW') {// new camp
      if (type === 'MULTI_STEP_CASH') {
        // 判断服务小二是否有权限
        url = window.APP.crmhomeUrl + '/main.htm.kb?op_merchant_id=' + merchantId + '#/marketing-activity/catering-discount/detail/' + campId + '?allowOffline=' + (permission('SERVICEC_CAMPAIGN_OFFLINE') ? 'Y' : 'N') + '&isSupport=Y';
      } else if (type === 'BRAND_CART_DISCOUNT') {
        // 判断服务小二是否有权限 isSuport: 是否是服务中台
        url = window.APP.crmhomeUrl + '/main.htm.kb?op_merchant_id=' + merchantId + '#/marketing-activity/brand-bill-discount/detail/' + campId + '?allowOffline=' + (permission('SERVICEC_CAMPAIGN_OFFLINE') ? 'Y' : 'N') + '&isSupport=Y';
      } else {
        url = window.APP.crmhomeUrl + '/goods/itempromo/newPromoDetailForServe.htm.kb?campId=' + campId + '&op_merchant_id=' + merchantId + '&fromSource=' + fromSource;
      }
    } else {
      url = window.APP.crmhomeUrl + activityPageMap[type] + '?campId=' + campId + '&op_merchant_id=' + merchantId;
    }
    if (type === 'BUY_ITEM_CUT') { // 商品立减
      url = `${window.APP.crmhomeUrl}/main.htm.kb?op_merchant_id=${merchantId}#/marketing-activity/goods/detail/${campId}`;
    }
    if (type === 'BUY_ITEM_REDUCE_TO') {// 商品特价
      url = `${window.APP.crmhomeUrl}/main.htm.kb?op_merchant_id=${merchantId}#/marketing-activity/goods/special/detail/${campId}`;
    }
    if (type === 'GROUP_PURCHASE') { // 商品拼团
      url = `${window.APP.crmhomeUrl}/p/kb-groupbooking/index.htm.kb?op_merchant_id=${merchantId}#/detail?activityId=${campId}`;
    }
    if (type === 'BK_ITEM_DEDUCT') {// 商品特价
      url = `${window.APP.crmhomeUrl}/main.htm.kb?op_merchant_id=${merchantId}#/marketing-activity/booking-subtraction/detail/${campId}`;
    }
    return (
      <div>
        <iframe id="crmhomePage" src={url} style={{width: '100%'}} height="700" scrolling="no" border="0" frameBorder="0"></iframe>
      </div>
    );
  },
});

export default ActivityDetailBase;
