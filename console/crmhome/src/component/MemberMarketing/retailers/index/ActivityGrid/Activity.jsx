import React, {PropTypes} from 'react';
import { Modal, Button, Icon, message } from 'antd';
import ajax from '../../../../../common/ajax';

const Activity = React.createClass({
  propTypes: {
    crowdName: PropTypes.string,
    crowdGroupId: PropTypes.string,
    delItem: PropTypes.func,
    actInfo: PropTypes.func,
    index: PropTypes.number,
    desc: PropTypes.string,
    disableDel: PropTypes.bool,
  },

  getInitialState() {
    return {
      activeInfo: {},
    };
  },

  componentDidMount() {
    this.fetchData();
  },

  fetchData() {
    const { crowdGroupId, defaultCrowd } = this.props;
    if (crowdGroupId !== '-1') {// 新人营销时不展示活动营销数量
      ajax({
        url: '/promo/merchant/memberMerchantBatchSum.json',
        method: 'get',
        data: {
          crowdGroupId: crowdGroupId,
          needStatistics: defaultCrowd,
        },
        type: 'json',
        success: (res) => {
          if (res.status === 'success') {
            if (this.props.actInfo) {
              this.props.actInfo(res.data.memberActiveCount);
            }

            this.setState({
              activeInfo: res.data,
            });
          }
        },
      });
    }
  },

  deleteActivity(event) {
    event.stopPropagation();

    const { crowdGroupId, index, delItem } = this.props;

    Modal.confirm({
      title: '确认删除该项自定义人群？',
      onOk() {
        ajax({
          url: '/promo/merchant/crowd/delete.json',
          method: 'get',
          data: {
            crowdGroupId: crowdGroupId,
          },
          type: 'json',
          success: (res) => {
            if (res.status === 'success') {
              message.success('操作成功');
              delItem(index);
            } else {
              message.error(res.errorMsg);
            }
          },
        });
      },
    });
  },

  checkItem(event) {
    event.stopPropagation();
    if (this.props.crowdGroupId === '-1') {
      return;
    }
    const { crowdGroupId, top7Brand, crowdName, defaultCrowd } = this.props;

    if ( crowdName === '生日营销' || defaultCrowd === '1') {
      return;
    }

    if (top7Brand === '1') {
      location.hash = '/marketing/retailers/top7/groups-view/' + crowdGroupId;
    } else {
      location.hash = '/marketing/retailers/groups-view/' + crowdGroupId;
    }
  },

  manage(event) {
    event.stopPropagation();

    // 销售中台账户登录，跳转地址中增加op_merchant_id参数
    const merchant = document.getElementById('J_crmhome_merchantId');
    location.href = merchant && merchant.value ? '/goods/itempromo/activityList.htm.kb?op_merchant_id=' + merchant.value : '/goods/itempromo/activityList.htm';  // eslint-disable-line no-location-assign
  },

  publish(event) {
    event.stopPropagation();
    const { crowdGroupId, crowdName } = this.props;
    let name = crowdName;
    if (crowdName === '新人营销') {
      name = '从未到该商家消费的新客';
    }
    location.hash = '/marketing/retailers/activity-create?crowdId=' + crowdGroupId + '&crowdName=' + encodeURIComponent(name);
  },

  render() {
    const { activeInfo } = this.state;
    const { crowdName, defaultCrowd, disableDel, crowdGroupId } = this.props;

    return (
      <div style={{ cursor: crowdGroupId === '-1' ? 'auto' : 'pointer' }} className="item" onClick={this.checkItem}>
        { disableDel || crowdName === '生日营销' || defaultCrowd === '1' ? null : (
          <div className="actions" onClick={this.deleteActivity}>
            <div className="action">
              <Icon type="delete" />
            </div>
          </div>
        ) }
        <p className="title" title={crowdName}>{crowdName}</p>
        <p className="count">
        {
          activeInfo.memberMerchantGroupRatio && activeInfo.memberMerchantGroupCount ? (
            <div>
              <span>{activeInfo.memberMerchantGroupCount}</span><span>{activeInfo.memberMerchantGroupRatio}</span>
            </div>
          ) : null
        }
        </p>

        <p className="desc">{this.props.desc || ''}</p>
        <Button type="primary" size="large" onClick={this.publish}>发布营销活动</Button>
        {crowdGroupId !== '-1' && (
          <p className="num">
            <span style={activeInfo && activeInfo.memberActiveCount > 0 ? {color: '#57c5f7'} : {color: '#666'}}>{activeInfo.memberActiveCount || 0}</span>
            个活动正在进行 {activeInfo.memberActiveCount > 0 ? <a onClick={this.manage}>查看</a> : ''}
          </p>
        )}
      </div>
    );
  },
});

export default Activity;
