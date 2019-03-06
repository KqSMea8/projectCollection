import React, {PropTypes} from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import LeadsAllocModal from '../common/LeadsAllocModal';
import ReleaseModal from './ReleaseModal';
import ActionMixin from '../common/ActionMixin';

const MoreAction = React.createClass({
  propTypes: {
    id: PropTypes.any,
    power: PropTypes.array,
    refresh: PropTypes.func,
    isBd: PropTypes.bool,
  },

  mixins: [ActionMixin],

  componentWillMount() {
    const items = [];
    const {power, isBd} = this.props;
    if (power.indexOf('LEADS_RELEASE') !== -1) {
      items.push(<Menu.Item key="release">
         释放
       </Menu.Item>);
    }
    if (power.indexOf('LEADS_MODIFY') !== -1) {
      items.push(<Menu.Item key="modify">
        修改
      </Menu.Item>);
    }
    if (power.indexOf('LEADS_ALLOCATE') !== -1) {
      items.push(<Menu.Item key="alloc">
        分配
      </Menu.Item>);
    }
    if (isBd && permission('VISITRECORD_QUERY_PC')) {
      items.push(<Menu.Item key="xiaoji">
            <a target="_blank" href={'#/record/leads?leadsId=' + this.props.id}>拜访小记</a>
          </Menu.Item>);
    }
    this.menu = (<Menu onClick={this.onClick}>
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
      {this.state.showReleaseModal ? <ReleaseModal onOk={this.onReleaseOk} onCancel={this.onCancel}/> : null}
      </span>);
  },
});

export default MoreAction;
