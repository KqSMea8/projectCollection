import React from 'react';
import {message, Tree, Spin} from 'antd';
import classnames from 'classnames';
import ajax from '../../../common/ajax';
import Search from './Search';
import './dialog.less';
const TreeNode = Tree.TreeNode;

// TODO 报错情况
class OperatorDialog extends React.Component {
  state={
    data: '',
    original: '',
    errMsg: '',
    operated: [],
  }
  componentDidMount() {
    const {operatorId, roleCode} = this.props.params;
    this.form = document.getElementById('dialog-form');
    this.permissionsInput = document.querySelector('.J_permissions');
    this.featuresInput = document.querySelector('.J_features');
    ajax({
      url: `/staff/queryPermissions.json?principalId=${operatorId}${roleCode ? `&roleCode=${roleCode}` : ''}&principalType=OPERATOR&channel=CRMHOME`,
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res && res.permissionList) {
          const {allKeys, original} = this.dealResult(res.permissionList);
          this.setState({original, allKeys, data: original});
        } else {
          this.setState({data: [], errMsg: res.resultMsg || '系统繁忙，请稍后再试'});
          message.error(res.resultMsg || '系统繁忙，请稍后再试');
        }
      },
    });
    if (window.alipay && window.alipay.security && window.alipay.security.core) {
      this.setInputValue(document.querySelectorAll('.J_operatorId'), operatorId);
      window.light.ready(() => {
        this.core = window.alipay.security.core.init({
          form: this.form, // 注：只能是原生对象，不支持jquery对象
          beforeAjaxValidate: () => {},
          afterAjaxValidate: () => {},
          block: () => {},
        });
      });
    }
  }
  setInputValue(dom, value) {
    if (dom) {
      if (dom.length) {
        const doms = Array.prototype.slice.call(dom);
        doms.forEach(domItem => {
          domItem.value = value;
        });
      } else {
        dom.value = value;
      }
    }
  }
  setChecked(selected) {
    this.setState({selected}, () => {
      this.checkedTable(selected);
    });
  }

  dealResult(data) {
    const {roleCode} = this.props.params;
    const original = data.reduce((memo, item) => {
      const children = item.children.filter(child => roleCode === 'CASHIER' ? ['000|06|04|02', '000|06|04|03'].indexOf(child.functionCode) !== -1 && !child.select : !child.select) || [];
      if (roleCode === 'CASHIER' ? children.length : (!item.select || children.length)) {
        memo.push({
          ...item,
          children,
        });
      }
      return memo;
    }, []);
    const allKeys = original.reduce((memo, item) => memo.concat(item.children ? [String(item.id), ...item.children.map(child => `${item.id}.${child.id}`)] : [String(item.id)]), []);

    return {allKeys, original};
  }
  findChoosed(items, parent) {
    return items.filter(item => item.select).map(item => `${parent.id}.${item.id}`);
  }
  searchChange = (keyword) => {
    const {original} = this.state;
    let cpData = [];
    original.forEach(item => {
      const filterChildren = item.children.filter(child => child.showName.indexOf(keyword) !== -1).map(child => `${item.id}.${child.id}`);
      if (filterChildren.length) { // 有子集筛选出不找父级
        cpData = cpData.concat([...filterChildren, item.id]);
      } else if (item.showName.indexOf(keyword) !== -1) {
        cpData.push(item.id);
      }
    });
    this.setState({filterKeys: cpData, keyword});
  }
  createNode(data, parent) {
    const {filterKeys, keyword} = this.state;
    return data.map(item => {
      const {id, showName, children} = item;
      const text = keyword ? showName.replace(keyword, `<span class="search-hightlight">${keyword}</span>`) : `<span>${showName}</span>`;
      const itemId = parent ? `${parent.id}.${id}` : id;
      const showed = !filterKeys || !keyword || filterKeys.indexOf(itemId) !== -1;
      return (children && children.length ?
      <TreeNode key={id} className={classnames({'emember_tree_item_hidden': !showed})} title={<span dangerouslySetInnerHTML={{__html: text}} />} >
          {this.createNode(item.children, item)}
      </TreeNode> : <TreeNode title={<span dangerouslySetInnerHTML={{__html: text}} />} className={classnames({'emember_tree_item_hidden': !showed})} key={itemId} />);
    });
  }
  findItem(key, data) {
    return data.find(item => String(item.id) === key);
  }
  checkedTable(selected = []) {
    const {data, operated: operatorInfo} = this.state;
    const operated = [...new Set(operatorInfo.concat(selected))];
    const features = [];
    // key中有.是子级
    const permissions = operated.map(key => {
      let findItem;
      if (key.indexOf('.') !== -1) {
        const [parentId, itemId] = key.split('.');
        const parentItem = this.findItem(parentId, data);
        findItem = this.findItem(itemId, parentItem.children);
      } else {
        findItem = this.findItem(key, data);
      }
      const {functionCode, select, store, orderCommodity, commodityId, cardNo} = findItem;
      const saveVal = {functionCode, select, endStatus: selected.indexOf(key) !== -1};
      if (orderCommodity && store && cardNo) { // 芝麻信用逻辑, 都交付了，突然出现这个逻辑。
        features.push({commodityId, cardNo, orderCommodity, ...saveVal});
        return null;
      }
      return store ? saveVal : null;
    }).filter(item => item);
    this.setInputValue(this.featuresInput, JSON.stringify(features));
    this.setInputValue(this.permissionsInput, JSON.stringify(permissions));
    this.setState({selected, operated});
  }
  submit() {
    if (this.core) {
      this.core.execute();
    } else if (this.form) {
      this.form.submit();
    }
  }
  render() {
    const { selected, keyword, data, allKeys, errMsg, filterKeys } = this.state;

    if (!data) {
      return <div className="emember-dialog-loading"><Spin /></div>;
    }

    return (
       <div>
        <div className="staff-search-bar">
          <div>
            <div className="search-bar-btn" onClick={() => { this.setChecked(allKeys); }}>全选</div>
            <div className="search-bar-btn" onClick={() => { this.setChecked([]); }}>重新选择</div>
          </div>
          <div className="search-bar-input">
            <Search style={{ width: 300 }} placeholder="产品名称/权限" onChange={(e) => { this.searchChange(e.target.value); }} />
          </div>
        </div>
        {!data.length || (keyword && !filterKeys.length) ? (<div className="emember-dialog-nores">
          {errMsg || '暂无其它权限可供添加'}
        </div>) : (<div className="search-tree-container">
          <Tree
              checkable
              defaultExpandAll
              checkedKeys={selected}
              onCheck={(keys) => { this.checkedTable(keys); }}
            >
          {this.createNode(data, null, keyword)}
        </Tree>
        <div onClick={e => { e.preventDefault(); this.submit(); }} id="form-submit" />
        </div>)}
      </div>);
  }
}

export default OperatorDialog;
