import React from 'react';
import {Menu, Dropdown, Icon} from 'antd';

class Action extends React.PureComponent {
  modifyItem = (modifyData) => {
    const {record} = this.props;
    this.props.modifyItem(record, modifyData);
  }
  render() {
    const {viewStatus, leadsId, partnerId} = this.props.record;
    let items = [];
    items = items.concat(<a href={`#/goods/oneclickmove?type=detail&leadsId=${leadsId}&pid=${partnerId}`} >查看</a>);
    if (viewStatus === 'INIT' || viewStatus === 'PREPARED' ||
      viewStatus === 'REJECTED' || viewStatus === 'ON_SHELVES') {
      items = items.concat(<a href={`#/goods/oneclickmove?type=edit&leadsId=${leadsId}&pid=${partnerId}&partnerName=${encodeURIComponent(this.props.partnerName)}`}>编辑</a>);
    }
    if (viewStatus === 'PREPARED') {
      items = items.concat(<a onClick={() => this.modifyItem({viewStatus: 'UNDER_REVIEW'})}>提交上架</a>);
    }
    if (viewStatus === 'REJECTED') {
      items = items.concat(<a onClick={() => this.modifyItem({viewStatus: 'UNDER_REVIEW'})}>重新上架</a>);
    }
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
