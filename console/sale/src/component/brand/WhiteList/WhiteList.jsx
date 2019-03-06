import React from 'react';
// import { Button } from 'antd';
// import ajax from 'Utility/ajax';
import WhiteListForm from './WhiteListForm';
import WhiteListTable from './WhiteListTable';
import AddListModal from './AddListModal';

const WhiteList = React.createClass({
  getInitialState() {
    return {
      params: {},
      visible: false,
    };
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },


  showAddListModal() {
    this.setState({visible: true});
  },

  closeAddListModal() {
    this.setState({visible: false});
  },

  render() {
    const {params} = this.state;
    return (
      <div style={{ padding: 30 }}>
        <div style={{overflow: 'hidden', marginBottom: 30}}>
          <h5 style={{float: 'left'}}>邀约商户名单管理</h5>
          <AddListModal params={params} onSearch={this.onSearch} type="add" />
        </div>

        <WhiteListForm onSearch={this.onSearch} />
        <WhiteListTable params={params} />

      </div>
    );
  },
});

export default WhiteList;

