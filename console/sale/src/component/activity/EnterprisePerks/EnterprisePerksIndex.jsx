import React from 'react';
import ajax from 'Utility/ajax';
import { Button } from 'antd';

const EnterprisePerksIndex = React.createClass({
  getInitialState() {
    this.params = {
      url: window.APP.crmhomeUrl + '/main.htm.kb',
      hash: '#/marketing/retailers/manage/brandType/isKbservLogin',
    };
    return {
      pid: '',
      hideCrmhomePage: true,
    };
  },

  componentDidMount() {
    ajax({
      url: '/sale/capitalpool/init.json',
      method: 'post',
      data: {},
      type: 'json',
      success: ({status, data}) => {
        if (status === 'succeed') {
          this.setState({
            pid: data.userId,
          });
        }
      },
      error: () => {},
    });
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  addPerksUrl() {
    window.open('#/activity/enterpriseperks/add');
  },

  render() {
    const url = `${window.APP.crmhomeUrl}/main.htm.kb?op_merchant_id=${this.state.pid}&ebProvider=true#/marketing/brands/manage`;

    return (
      <div>
        <div className="app-detail-header">
          口碑福利活动
          <Button type="primary" onClick={this.addPerksUrl} style={{position: 'absolute', left: 883}}>新建口碑福利活动</Button>
        </div>
        <div className="app-detail-content-padding" style={{width: 1091}}>
          {
            this.state.pid &&
            <iframe src={url} id="crmhomePage" width="100%" height="998" scrolling="no" border="0" frameBorder="0"></iframe>
          }
        </div>
      </div>
    );
  },
});

export default EnterprisePerksIndex;
