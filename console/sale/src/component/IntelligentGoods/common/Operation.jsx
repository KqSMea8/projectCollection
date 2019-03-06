import React from 'react';

const ITEM_MAP = {
  ITEM: '在线购买商品详情',
  MANJIAN: '全场每满减详情',
  VOUCHER: '全场代金券详情',
  RATE: '全场折扣券详情',
};
class Operation extends React.PureComponent {
  modifyItem = (modifyData) => {
    const { record } = this.props;
    this.props.modifyItem(record, modifyData);
  }
  handleChange = (actionType) => {
    this.props.handleChange(this.props.record, actionType);
  }
  handleOnline = () => {
    this.props.handleOnline(this.props.record);
  }
  render() {
    const { itemId = '', bizId = '', operationMap, itemType } = this.props.record;
    if (operationMap === null) {
      return null;
    }
    const partnerId = this.props.partnerId;
    let items = [];
    const subbreadcrumb = encodeURIComponent(ITEM_MAP[itemType]);
    const viewStatus = operationMap;
    let extraUrl = `&fromUrl=${encodeURIComponent(location.href)}&breadcrumb=${encodeURIComponent('智能商品库')}`;
    if (subbreadcrumb) {
      extraUrl += `&subbreadcrumb=${subbreadcrumb}`;
    }

    Object.keys(operationMap).forEach((statusIndex) => {
      const statusName = operationMap[statusIndex];
      // 商品按钮
      if (statusName === '查看' && itemType === 'ITEM') {
        items = items.concat(<a key={statusIndex} href={`#/catering/detail?sequenceId=${bizId}&pid=${partnerId}&itemId=${itemId}&itemType=${itemType}${extraUrl}`}>查看</a>);
      } else if (statusName === '查看' && itemType !== 'ITEM') {
        // 券按钮
        items = items.concat(<a key={statusIndex} href={`#/catering/detail?campid=${bizId}&pid=${partnerId}&itemId=${itemId}&itemType=${itemType}${extraUrl}`}>查看</a>);
      }

      if (statusName === '处理异动') {
        items = items.concat(<a key={statusIndex} onClick={() => this.handleChange('handle')}>处理异动</a>);
      }

      if (statusName === '查看异动') {
        items = items.concat(<a key={statusIndex} onClick={() => this.handleChange('check')}>查看异动</a>);
      }

      if (statusName === '编辑' && itemType) {
        items = items.concat(<a key={statusIndex} href={`#/catering/edit?sequenceId=${bizId}&itemId=${itemId}&pid=${partnerId}&itemType=${itemType}${extraUrl}`}>编辑</a>);
      }

      if (statusIndex === '10') {
        items = items.concat(<a key={statusIndex} onClick={() => this.handleOnline()}>上架</a>);
      }
    });
    return (<div className="table-actions">
      {items}{JSON.stringify(viewStatus) === '{}' && '-'}
    </div>);
  }
}

export default Operation;
