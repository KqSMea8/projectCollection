import React from 'react';
import { Alert, message } from 'antd';
import MyShopListForm from './MyShopListForm';
import MyShopListTable from './MyShopListTable';
import BatchTaskButtons from '../common/BatchTaskButtons';

const MyShopList = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {
    message.info('最多展示5000条数据，请尽可能细化搜索条件。');
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  render() {
    return (
      <div>
        <BatchTaskButtons style={{position: 'absolute', top: -52, right: 16, zIndex: 1}}
          searchForm={this.state.params} />
        <Alert message="已开门店指：已通过口碑审核的门店，您可以在这里查看或修改门店详情。" type="info" showIcon closable />
        <MyShopListForm onSearch={this.onSearch}/>
        <MyShopListTable params={this.state.params}/>
      </div>
    );
  },
});

export default MyShopList;
