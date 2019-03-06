import React, {PropTypes} from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import { Menu, Dropdown, Icon, Popconfirm } from 'antd';
import ReleaseModal from './ReleaseModal';
import RelateModal from './RelateModal';
import LeadsAllocModal from '../common/LeadsAllocModal';
import ActionMixin from '../common/ActionMixin';
import RelateMerchantModal from './RelateMerchantModal';
import RelatePersonalMerchantModal from './RelatePersonalMerchantModal';

const MoreAction = React.createClass({
  propTypes: {
    id: PropTypes.any,
    power: PropTypes.array,
    refresh: PropTypes.func,
    isCompleted: PropTypes.bool,
    isBd: PropTypes.bool,
  },

  mixins: [ActionMixin],

  componentWillMount() {
    const items = [];
    const { power, isCompleted, isBd } = this.props;
    const relateMerchant = permission('ENTENPRISE_RELATION_MERCHANT');
    if (power.indexOf('LEADS_RELEASE') !== -1) {
      items.push(<Menu.Item key="release">
        释放
      </Menu.Item>);
    }
    if (power.indexOf('LEADS_MODIFY') !== -1) {
      if (isCompleted) {
        items.push(<Menu.Item key="complete">
          修改
        </Menu.Item>);
      } else {
        items.push(<Menu.Item key="modify">
          修改
        </Menu.Item>);
        items.push(<Menu.Item key="complete">
          补全
        </Menu.Item>);
      }
    }
    if (power.indexOf('LEADS_ALLOCATE') !== -1) {
      items.push(<Menu.Item key="alloc">
        分配
      </Menu.Item>);
    }
    if (isCompleted && relateMerchant) {
      items.push(<Menu.Item key="relateMerchant">
        <RelateMerchantModal categoryId={this.state.categoryId} refreshParent={this.props.refresh} leadsId={this.props.id}/>
        </Menu.Item>);
    }
    if (isCompleted && permission('SHOP_CREATE')) {
      items.push(<Menu.Item key="SHOP_CREATE">
        <RelatePersonalMerchantModal categoryId={this.state.categoryId} refreshParent={this.props.refresh} leadsId={this.props.id}/>
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
  componentWillUpdate(nextProps) {
    if (this.props.categoryId !== nextProps.categoryId) {
      this.setState({
        categoryId: nextProps.categoryId,
      });
    }
  },

  hideConfirm() {
    this.setState({showPopConfirm: false});
  },
  render() {
    return (<span>
        <Popconfirm visible={this.state.showPopConfirm} placement="bottomRight" title="leads修改审核中，无法操作" okText="知道了" onCancel={this.hideConfirm} onConfirm={this.hideConfirm}>
          <Dropdown overlay={this.menu} trigger={['click']}>
            <a className="ant-dropdown-link">
              更多 <Icon type="down"/>
            </a>
          </Dropdown>
        </Popconfirm>
        {this.state.showReleaseModal ? <ReleaseModal onOk={this.onReleaseOk} onCancel={this.onCancel}/> : null}
        {this.state.showRelateModal ? <RelateModal onOk={this.onRelateOk} onCancel={this.onCancel}/> : null}
        {this.state.showAllocModal ? <LeadsAllocModal onOk={this.onAllocOk} onCancel={this.onCancel}/> : null}
      </span>);
  },
});

export default MoreAction;
