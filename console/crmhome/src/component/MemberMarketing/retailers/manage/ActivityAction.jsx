import React, {PropTypes} from 'react';
import {message, Popconfirm} from 'antd';
import ajax from '../../../../common/ajax';

const ActivityAction = React.createClass({
  propTypes: {
    item: PropTypes.object,
    index: PropTypes.number,
    refresh: PropTypes.func,
  },

  handleOffLine() {
    const { campId } = this.props.item;

    ajax({
      url: '/promo/merchant/offline.json',
      method: 'get',
      data: {
        campaignId: campId,
      },
      type: 'json',
      success: (req) => {
        if (req.status === 'success') {
          message.success('操作成功');
          this.props.refresh();
        } else {
          message.error(req.resultMsg);
        }
      },
    });
  },

  render() {
    const { item } = this.props;
    return (
      <div>
        {
          <a href={'#/marketing/retailers/activity-view/' + item.campId}>查看</a>
        }
        {
          item.allowModify ? (<span>
            &nbsp; | &nbsp;
            <a href={'#/marketing/retailers/activity-edit/' + item.campId}>修改</a>
          </span>) : null
        }
        {
          item.allowOffline ?
          <Popconfirm title="确定要下架吗？" onConfirm={this.handleOffLine}>
            <span>
              &nbsp; | &nbsp;
              <a href="#">下架</a>
            </span>
          </Popconfirm> : null
        }
      </div>);
  },
});

export default ActivityAction;
