import React, {PropTypes} from 'react';
import { Breadcrumb, message } from 'antd';
import CreateForm from './CreateForm';
import ajax from '../../../../common/ajax';

const ActivityEdit = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.object,
  },

  getInitialState() {
    return {
      allData: null,
      formData: null,
    };
  },

  componentWillMount() {
    if (this.props.params.id) {
      this.fetch();
    }
  },

  fetch() {
    ajax({
      // url: 'http://crmhome.d3637.alipay.net/member/brand/modifyView.json',
      url: '/promo/brand/detail.json',
      method: 'get',
      type: 'json',
      data: {
        activityId: this.props.params.id,
      },
      success: (res) => {
        if (res.status === 'success') {
          const goodsIds = res.discountForm.goodsIds;
          if ( goodsIds && goodsIds.length ) {
            res.discountForm.goodsIds = goodsIds.join('\n');
          }
          this.setState({
            allData: res,
            formData: res.discountForm,
          });
        } else {
          message.error(res.resultMsg || '操作失败');
        }
      },
    });
  },

  render() {
    const { allData, formData } = this.state;

    return (
      <div className="kb-activity-create">
        <h2 className="kb-page-title">管理</h2>
        <div className="kb-detail-main">

          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="#marketing/brands/manage">管理</a></Breadcrumb.Item>
            <Breadcrumb.Item>编辑营销活动</Breadcrumb.Item>
          </Breadcrumb>

          {
            formData && <CreateForm roleType="brand" actionType="edit" allData={allData} initData={formData} query={this.props.location.query} params={this.props.params} />
          }
        </div>
      </div>
    );
  },
});

export default ActivityEdit;
