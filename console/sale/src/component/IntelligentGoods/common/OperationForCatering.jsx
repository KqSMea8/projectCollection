import React from 'react';

const ITEM_MAP = {
  ITEM: '在线购买商品',
  MANJIAN: '全场每满减',
  VOUCHER: '全场代金券',
  RATE: '全场折扣券',
};

class Operation extends React.PureComponent {
  modifyItem = () => {
    const { record } = this.props;
    this.props.modifyItem(record);
  }
  render() {
    const { leadsId, itemStatus, itemType, editFlag = 1 } = this.props.record;
    const partnerId = this.props.partnerId;
    let items = [];
    const viewStatus = itemStatus;
    const subbreadcrumb = ITEM_MAP[itemType];
    items = items.concat(<a key="1" href={`#/catering/oneclickmove?type=detail&leadsId=${leadsId}&pid=${partnerId}&itemType=${itemType}&subbreadcrumb=${encodeURIComponent(subbreadcrumb + '详情')}`}>查看</a>);
    // 如果 -1 禁用其他所有操作
    if (editFlag !== -1) {
      if (viewStatus === 'INIT' || viewStatus === 'PENDING' || viewStatus === 'RETURNED' || viewStatus === 'ONLINE' || viewStatus === 'OFFLINE' || viewStatus === 'FAILED_ONLINE') {
        items = items.concat(<a key="2" href={`#/catering/oneclickmove?type=edit&leadsId=${leadsId}&pid=${partnerId}&itemType=${itemType}&subbreadcrumb=${encodeURIComponent(subbreadcrumb)}&status=${itemStatus}`}>编辑</a>);
      }
      if (viewStatus === 'PENDING' || viewStatus === 'FAILED_ONLINE') {
        items = items.concat(<a key="3" onClick={this.modifyItem}>提交上架</a>);
      }
      if (viewStatus === 'RETURNED') {
        items = items.concat(<a key="4" onClick={this.modifyItem}>重新上架</a>);
      }
    }
    return (<div className="table-actions">
      {items}
    </div>);
  }
}

export default Operation;
