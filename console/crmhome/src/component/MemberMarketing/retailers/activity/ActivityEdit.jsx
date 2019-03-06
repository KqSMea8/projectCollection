import React, {PropTypes} from 'react';
import { Breadcrumb, message, Spin } from 'antd';
import TicketCreate from '../../common/TicketCreate/Form';
import VourchersForm from '../../../MarketingActivity/vouchers/';
import ajax from '../../../../common/ajax';

const ActivityEdit = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.object,
  },

  getInitialState() {
    return {
      initData: null,
    };
  },

  componentWillMount() {
    if (this.props.params.id) {
      this.fetch();
    }
  },

  fetch() {
    ajax({
      // url: 'http://crmhome.d3637.alipay.net/member/merchant/modifyView.json',
      url: '/promo/merchant/detail.json',
      method: 'get',
      type: 'json',
      data: {
        campaignId: this.props.params.id,
      },
      success: (res) => {
        if (res.status === 'success') {
          const goodsIds = res.discountForm.goodsIds;
          if ( goodsIds && goodsIds.length ) {
            res.discountForm.goodsIds = goodsIds.join('\n');
          }
          this.setState({
            initData: res.discountForm,
          });
        } else {
          message.error(res.resultMsg || '操作失败');
        }
      },
    });
  },

  render() {
    const {initData} = this.state;
    const props = {
      initData,
      roleType: 'merchant',
      actionType: 'edit',
      query: this.props.location.query,
      params: this.props.params,
    };

    return (
      <div className="kb-activity-create">
        <h2 className="kb-page-title">管理</h2>
        <div className="kb-detail-main">

          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="#marketing/merchant/manage">管理</a></Breadcrumb.Item>
            <Breadcrumb.Item>编辑营销活动</Breadcrumb.Item>
          </Breadcrumb>

          {
            initData ? <div>
              {initData.goodsIds && initData.goodsIds.length ? <TicketCreate {...props} /> : <VourchersForm {...props} />}
            </div> : <Spin /> }
        </div>
      </div>
    );
  },
});

export default ActivityEdit;
