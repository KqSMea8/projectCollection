import React, {PropTypes} from 'react';
import {Menu, Dropdown, Icon} from 'antd';

const ListAction = React.createClass({
  propTypes: {
    actionList: PropTypes.array,
    onMenuClick: PropTypes.func,
  },

  render() {
    const {actionList} = this.props;
    const menuItems = [];
    for (let i = 1; i < actionList.length; i++) {
      menuItems.push(actionList[i].menu);
    }
    const menu = <Menu onClick={this.props.onMenuClick}>{menuItems}</Menu>;
    return (<span>
      {actionList.length > 0 && actionList[0].link}
      {actionList.length > 1 && <span className="ant-divider"></span>}
      {actionList.length === 2 && actionList[1].link}
      {actionList.length > 2 && (<Dropdown overlay={menu} trigger={['click']}>
        <a className="ant-dropdown-link">
          更多 <Icon type="down"/>
        </a>
      </Dropdown>)}
      </span>);
  },
});

export default ListAction;
