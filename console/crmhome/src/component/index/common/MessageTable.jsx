import React, {PropTypes} from 'react';
import {message, Table, Modal} from 'antd';
import ajax from '../../../common/ajax';
import classnames from 'classnames';
import {decodeHTML} from '../../../common/utils';
import ApplySignModal from './ApplySignModal';

const Index = React.createClass({
  propTypes: {
    data: PropTypes.array,
  },

  getInitialState() {
    this.columns = [{
      title: '消息',
      dataIndex: 'title',
      width: 80,
      render: (text, item) => {
        const {status, title, createTime, link} = item;
        return <div onClick={() => { this.goToMessage(link, item); }} className="index-message-item" ><span className={classnames({readed: status === '2' || status === '3'})}>{decodeHTML(title)}</span><div style={{float: 'right'}}>{createTime}</div></div>;
      },
    }];
    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: this.showTotal,
        current: 1,
      },
      loading: false,
      visibleSignModal: false,
      merchantName: '',
    };
  },

  componentDidMount() {
    this.refresh();
  },

  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
    };
    this.fetch(params);
  },

  handleSignCancel() {
    this.setState({'visibleSignModal': false});
  },

  goToMessage(link, item) {
    if (item.bizType === '2') {
      ajax({
        url: link,
        type: 'get',
        success: (res) => {
          const data = JSON.parse(res.response);
          if (data && data.orderId) {
            window.location.href = `/goods/itempromo/discountDetail.htm?planAndOrderId=${item.extInfo.split('|')[0]}|${data.orderId}`;  // eslint-disable-line no-location-assign
          }
        },
      });
    } else if (item.bizType === '23') {
      Modal.success({
        title: '门店退出活动',
        content: item.content,
        iconType: 'none',
      });
    } else if (item.bizType === '32') {
      this.setState({
        merchantName: link,
        visibleSignModal: true,
      });
    } else {
      window.location.href = link;  // eslint-disable-line no-location-assign
    }
  },

  refresh(update) {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      currentPage: update ? current : 1,
    });
  },

  showTotal(total) {
    return `共 ${total} 条`;
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
    };
    ajax({
      url: '/merchant/merchantNewsList.json',
      type: 'json',
      data: params,
      success: (data) => {
        const pagination = {...this.state.pagination};
        if (data.brokerIndexCondition) {
          pagination.total = data.brokerIndexCondition.totalSize;
          pagination.current = data.brokerIndexCondition.currentPage;
        }
        this.setState({pagination, loading: false, data: (data.newsList && data.newsList.jsonNewsList || [])});
      }, error: (result) => {
        if (result.errorMsg) {
          message.error(result.errorMsg, 3);
        }
        this.setState({loading: false});
      },
    });
  },

  defaultMeg(bizType) {
    if (window.Tracker && window.Tracker.kb) {
      window.Tracker.kb('crmhomeindexerror', {
        message: '默认bizType: ' + bizType,
      });
    }
  },

  /** 大牌排期
   * 前端技改：若后期将(大牌通用代金、大牌单品券)改成react方式，则可简化以下逻辑，仅区分是否为泛行业
   * subTitle：TRADE_VOUCHER（泛行业商品）、 VOUCHER（券）
   * volType：SINGLE（单品）、ALL（全场）
   * voucherType：CASH（代金）、EXCHANGE（兑换）
   * purchaseMode：BUY（购买）、OBTAIN（领取）
   * content:volType_voucherType_purchaseMode,content一定有值
   */
  bigBrandLink(item) {
    const {bizContext, extInfo, subTitle, content} = item;
    let link = '';
    if (subTitle === 'TRADE_VOUCHER') { // 泛行业券购买
      link = `/goods/itempromo/promotion.htm#/item-promo/new?orderId=${extInfo}&planId=${bizContext}`;
    } else {
      const arr = content.split('_');
      if (arr[2] === 'BUY' || arr[1] === 'EXCHANGE') { // 餐饮券购买、兑换券
        link = `/goods/itempromo/promotion.htm#/item-promo/detail?orderId=${extInfo}&planId=${bizContext}`;
      } else { // 其他(通用代金券、单品券)
        link = `/goods/itempromo/recruitItemApplyQuery.htm?orderId=${extInfo}&planId=${bizContext}`;
      }
    }
    return link;
  },

 /*eslint-disable */
  linkRule(item) {
    const {bizType, bizContext, extInfo, content} = item;
    let link = '';
    switch (bizType) {
    case '2':
      const [plan, merchantId, workId] = extInfo.split('|');
      link = `/merchant/queryOrderId.json?planId=${plan}&merchantId=${merchantId}&workerId=${workId}`;
      break;
    case '5':
      link = `/goods/itempromo/detail.htm?itemId=${bizContext}`;
      break;
    case '6':
      link = `/goods/itempromo/promoDetail.htm?campId=${bizContext}`;
      break;
    case '7':
      link = `${content}`;
      break;
    case '8':
    case '10':
      link = `/goods/itempromo/discountDetail.htm?planAndOrderId=${bizContext}`;
      break;
    case '20':
      const [planId, orderId] = bizContext.split('|');
      link = `/main.htm#/marketing/retailers/brands-activity-view/${planId}/${orderId}`;
      break;
    case '22':
      link = this.bigBrandLink(item);
      break;
    case '9':
    case '11':
    case '21':
    case '23':
    case '31':
    case '32':
      link = `${extInfo}`;
      break;
    case '41':
    case '50':
      link = extInfo.replace(/&amp;/g, '&');
      break;
    default:
      link = `./merchantNewsDetail.htm?id=${item.id}`;
      this.defaultMeg();
    }
    return link;
  },

  render() {
    const { data, pagination, loading, visibleSignModal, merchantName } = this.state;
    const tableData = data.map(item => {return {link: this.linkRule(item), ...item}; });
    const signModalOption = {
      merchantName,
      handleCancel: this.handleSignCancel,
    };
    return (<div>
        <Table className="index-message-table" bordered columns={this.columns}
           dataSource={tableData}
           pagination={pagination}
           loading={loading}
           onChange={this.onTableChange}
           rowKey={r => r.id}
        />
        { visibleSignModal ? <ApplySignModal {...signModalOption}/> : null }
  </div>);
  },
});

export default Index;
