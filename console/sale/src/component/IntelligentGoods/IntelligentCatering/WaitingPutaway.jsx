import React, { PropTypes } from 'react';
import { Alert } from 'antd';
import TodoModule from './TodoModule';
import WaitingCateringListForm from './WaitingCateringListForm';
import WaitingCateringTable from './WaitingCateringTable';
import { cateringWaitingShelveStatus } from '../common/IntelligentGoodsConfig';

export default class WaitingPutaway extends React.Component {
  static propTypes = {
    searchParams: PropTypes.object,
    activeKey: PropTypes.string,
    location: PropTypes.object,
  }
  checkTodoItem(data) {
    const { partnerId, partnerName } = data;
    if (partnerName) {
      location.hash = `#/intelligentcatering/list/stayputaway?partnerId=${partnerId}&name=${partnerName}`;
    } else {
      location.hash = `#/intelligentcatering/list/stayputaway`;
    }
  }
  render() {
    return (<div>
      <div className="app-detail-content-padding">
        {/* <Alert type="info" showIcon message={(
          <span>
          <span>口碑对齐补活动进行中，已有40万门店参与，请尽快提交您所负责的商户待上架活动。</span>
          <a href="#" target="_blank">查看活动详情</a>
          </span>)} />*/}
        <Alert
          message="商品上架后，15天内不可修改商品名称、适用门店、原价、现价、库存。"
          // message="商品上架后，15天内不可修改商品名称、适用门店、原价、现价、库存。如果leads当前信息和竞对不一致，请“反馈报错”，系统将更新leads信息"
          type="warning"
          showIcon />
        <div className="todo-panel">
          <TodoModule isCatering="catering" location={this.props.location} checkTodoItem={this.checkTodoItem} />
        </div>
        <div className="activity-panel">
          <div className="padleft-blue"><p>活动商品列表</p></div>
          <div className="activity_wrapper">
            <WaitingCateringListForm statusOptions={cateringWaitingShelveStatus} {...this.props.searchParams} />
            <WaitingCateringTable isCatering="catering" {...this.props.searchParams} activeKey={this.props.activeKey} />
          </div>
        </div>
      </div>
    </div>
    );
  }
}
