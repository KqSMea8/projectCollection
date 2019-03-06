import React, {PropTypes} from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import ActionMixin from '../common/ActionMixin';
import LeadsAllocModal from '../common/LeadsAllocModal';

const MoreAction = React.createClass({
  propTypes: {
    id: PropTypes.any,
    power: PropTypes.array,
    refresh: PropTypes.func,
  },

  mixins: [ActionMixin],

  componentWillMount() {
    const items = [];
    this.menu = (<Menu onClick={this.onClick}>
      <Menu.Item key="public">
        查看
      </Menu.Item>
      {items}
    </Menu>);
  },

  render() {
    return (<span>
      <Dropdown overlay={this.menu} trigger={['click']}>
        <a className="ant-dropdown-link">
          更多 <Icon type="down"/>
        </a>
      </Dropdown>
      {this.state.showAllocModal ? <LeadsAllocModal onOk={this.onAllocOk} onCancel={this.onCancel}/> : null}
      </span>);
  },
});

export default MoreAction;
