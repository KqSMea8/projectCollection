import React, {PropTypes} from 'react';
import { Menu, Dropdown, Icon} from 'antd';
import GoodsOfflineModal from '../GoodsDetail/GoodsOfflineModal';
import permission from '@alipay/kb-framework/framework/permission';
import ActionMixin from '../common/ActionMixin';
import SupportModal from '../common/SupportModal';

const MoreAction = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  mixins: [ActionMixin],
  componentWillMount() {
    const {allowOffLine, allowModifyVisibility, allowModify, allowResume, allowPause} = this.props.params;
    const items = [];
    if (permission('ITEM_OFFLINE') && allowOffLine) {
      items.push(<Menu.Item key="GOODS_OFFLINE">商品下架</Menu.Item>);
    }

    if (permission('ITEM_TEST_ONLINE') && allowModifyVisibility) {
      items.push(<Menu.Item key="GOODS_ONLINE">正式上架</Menu.Item>);
    }

    if (permission('ITEM_MODIFY') && allowModify) {
      items.push(<Menu.Item key="GOODS_MODIFY">修改商品</Menu.Item>);
    }
    if ( permission('ITEM_RESUME') && allowResume) {
      items.push(<Menu.Item key="RESUME">恢复</Menu.Item>);
    }
    if ( permission('ITEM_PAUSE') && allowPause) {
      items.push(<Menu.Item key="PAUSE">暂停</Menu.Item>);
    }
    this.menu = (items.length && <Menu onClick={this.onClick}>{items}</Menu>);
    this.showMenu = items.length > 0;
  },

  onClick({key}) {
    const {itemId, opMerchantId, type} = this.props.params;
    if (key === 'GOODS_ONLINE') {
      this.makeGoodsOnline({itemId: itemId, op_merchant_id: opMerchantId});
    } else if (key === 'GOODS_OFFLINE') {
      this.setState({
        showOfflineModal: true,
      });
    } else if (key === 'GOODS_MODIFY') {
      window.open('index.htm#goods/modify/' + itemId + '/' + opMerchantId + '/' + type);
    } else if (key === 'RESUME') {
      this.onSupportModalShow('RESUME');
    } else if (key === 'PAUSE') {
      this.onSupportModalShow('PAUSE');
    }
  },

  onSupportModalShow(key) {
    let title = '恢复';
    if ( key === 'PAUSE') {
      title = '暂停';
    }
    this.setState({
      title: title,
      visible: true,
    });
  },

  onSupportModalCancel() {
    this.setState({
      visible: false,
    });
  },

  render() {
    return (<span>
      {this.showMenu && (<span><span className="ant-divider"></span><Dropdown overlay={this.menu} trigger={['click']}>
        <a className="ant-dropdown-link">
          更多 <Icon type="down"/>
        </a>
      </Dropdown></span>)}
      {this.state.showOfflineModal ? <GoodsOfflineModal onOk={this.onOK} onCancel={this.onCancel}/> : null}
      <SupportModal params={this.props.params} title={this.state.title} visible={this.state.visible} onCancel={this.onSupportModalCancel}/>
      </span>);
  },
});

export default MoreAction;
