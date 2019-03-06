import React, {PropTypes} from 'react';
import {Button, Alert, message} from 'antd';
import BacklogShopListForm from './BacklogShopListForm';
import BacklogShopListTable from './BacklogShopListTable';
import BatchTaskModal from '../common/BatchTaskModal';

const BacklogShopList = React.createClass({
  propTypes: {
    isService: PropTypes.bool,
  },

  getInitialState() {
    return {
      batchTaskModalVisible: false,
      params: {},
    };
  },

  componentDidMount() {
    message.info('最多展示5000条数据，请尽可能细化搜索条件。');
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  showBatchModal() {
    this.setState({
      batchTaskModalVisible: true,
    });
  },

  hideBatchModal() {
    this.setState({
      batchTaskModalVisible: false,
    });
  },

  render() {
    return (
      <div>
        {window.APP.roleType !== 'MALL_MERCHANT' && <div style={{position: 'absolute', top: -52, right: 16, zIndex: 1}}>
          <Button type="primary" size="large" onClick={this.showBatchModal}>批量重开门店</Button>
        </div>}
        <BatchTaskModal
          batchTaskType="REOPEN_SHOP"
          searchParams={this.state.params}
          visible={this.state.batchTaskModalVisible}
          onFinish={this.hideBatchModal} />
        <Alert message="待开门店指：未通过口碑审核、正在审核处理中的门店，您可以在这里查看或重新开店（只有你本人提交的门店才可操作重新开店）" type="info" showIcon closable />
        <BacklogShopListForm onSearch={this.onSearch} isService={this.props.isService}/>
        <BacklogShopListTable params={this.state.params} isService={this.props.isService}/>
      </div>
    );
  },
});

export default BacklogShopList;
