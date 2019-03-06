import React, {PropTypes} from 'react';
import { Modal, Button, Icon, message } from 'antd';
import ajax from '../../../../../common/ajax';

const Activity = React.createClass({
  propTypes: {
    crowdName: PropTypes.string,
    crowdGroupId: PropTypes.string,
    delItem: PropTypes.func,
    index: PropTypes.number,
    desc: PropTypes.string,
  },

  getInitialState() {
    return {
      activeCount: 0,
    };
  },

  componentDidMount() {
    this.fetchActiveCount();
  },

  fetchActiveCount() {
    ajax({
      url: '/promo/common/memberActiveCount.json',
      method: 'get',
      data: {
        crowdGroupId: this.props.crowdGroupId,
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            activeCount: res.memberActiveCount,
          });
        }
      },
    });
  },
  deleteActivity(event) {
    event.stopPropagation();
    const { crowdGroupId, index, delItem } = this.props;

    Modal.confirm({
      title: '确认删除该项自定义人群？',
      onOk() {
        ajax({
          url: 'promo/brand/crowd/delete.json',
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

  checkItem() {
    const { history, crowdGroupId } = this.props;
    history.pushState(null, '/marketing/brands/groups-view/' + crowdGroupId);
  },

  publish(event) {
    event.stopPropagation();
    const { crowdGroupId: crowdId, crowdName, history } = this.props;
    history.pushState(null, `/marketing/brands/activity-create`, { crowdId, crowdName });
  },

  render() {
    return (
      <div className="item" onClick={this.checkItem}>
        <div className="actions" onClick={this.deleteActivity}>
          <div className="action">
            <Icon type="delete" />
          </div>
        </div>
        <p className="title">{this.props.crowdName}</p>
        <p className="desc" style={{marginTop: 30}}>{this.props.desc}</p>
        <Button type="primary" size="large" onClick={this.publish}>发布营销活动</Button>
        <p className="num">
          <span style={this.state.activeCount > 0 ? {color: '#57c5f7'} : {color: '#666'}}>
            {this.state.activeCount}
          </span>个活动正在进行 {this.state.activeCount > 0 ? <a href="#marketing/brands/manage">查看</a> : ''}
        </p>
      </div>
    );
  },
});

export default Activity;
