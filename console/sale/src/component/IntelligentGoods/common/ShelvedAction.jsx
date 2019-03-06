import React from 'react';
import {Menu, Dropdown, Icon} from 'antd';

class Action extends React.PureComponent {
  handleTransaction = () => {
    this.props.handleTransaction(this.props.record);
  }
  render() {
    const {viewStatus, itemId, partnerId } = this.props.record;
    let items = [];
    items = items.concat(<a href={`#/goods/oneclickmove?type=shelvedGoodsDetail&itemId=${itemId}&pid=${partnerId}`} >查看</a>);
    if (viewStatus === 'INIT') {
      items = items.concat(<a onClick={this.handleTransaction} >处理异动</a>);
    } else if (viewStatus === 'WAIT_TO_AUDIT') {
      items = items.concat(<a onClick={this.handleTransaction} >查看异动</a>);
    }
    // items = items.concat(<a href={`#/goods/oneclickmove?type=edit&leadsId=${itemId}&pid=${partnerId}&partnerName=${encodeURIComponent(this.props.partnerName)}`}>编辑</a>);
    if (items.length < 3 ) {
      return (<div className="table-actions">
        {items}
      </div>);
    }
    const menuItems = items.slice(2).map((item) => {
      return (<Menu.Item >
          {item}
        </Menu.Item>);
    });
    const menu = (<Menu>
      {menuItems}
    </Menu>);
    return (<div className="table-actions">
      {items.slice(0, 2)}
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="ant-dropdown-link">
          更多 <Icon type="down"/>
        </a>
      </Dropdown>
      </div>);
  }
}

export default Action;
