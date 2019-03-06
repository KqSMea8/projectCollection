import {forIn, assign, uniqBy, cloneDeep} from 'lodash';

const TRUE = 1;
const FALSE = 0;
const INDETERMINATE = -1;
const PLUS = 'plus';
const MINUS = 'minus';

class TreeModel {
  constructor(option) {
    const {source, checked, disabled} = option;
    if (Array.isArray(source)) {
      this.database = {
        '#': {
          id: '#',
          $$degree: 0,
          $$path: '#',
          $$checkState: INDETERMINATE,
          $$disableState: INDETERMINATE,
          $$checkedCount: 0,
          $$leafCount: 0,
          $$disabledCount: 0,
        },
      };
      this.addChildren(source, '#');
      if (Array.isArray(checked)) {
        checked.forEach((id)=> {
          this.check(id);
        });
      }
      if (Array.isArray(disabled)) {
        disabled.forEach((id)=> {
          this.disable(id);
        });
      }
      const root = this.get('#');
      root.$$checkState = this.__checkState('#');
      root.$$disableState = this.__disableState('#');
      this.render();
    } else {
      this.database = source;
    }
  }


  addChildren(source, parentId) {
    const parent = this.get(parentId);
    const nodes = uniqBy(source, 'id');
    const {$$path: path} = parent;
    if (parentId === '#') {
      parent.$$degree = nodes.length;
    }
    parent.$$children = [];
    nodes.forEach((node) => {
      const {children, id, ...rest} = node;
      const $$path = `${path}/${id}`;
      const $$degree = (children || []).length;
      const $$keys = Object.keys(rest).push('id');
      parent.$$children.push(id);
      this.database[id] = {
        ...rest,
        id,
        $$path,
        $$checkState: FALSE,
        $$disableState: FALSE,
        $$checkedCount: 0,
        $$disabledCount: 0,
        $$leafCount: 0,
        $$degree,
        $$keys,
      };
      if (children) {
        this.addChildren(children, id);
      }
      if ($$degree === 0) {
        this.__dealLeafCount(id, PLUS);
      }
    });
  }

  leafs(id) {
    const children = this.children(id);
    const leafs = [];
    const loop = (nodes, container)=> {
      nodes.forEach((node)=> {
        const {id: cid, $$degree} = node;
        if ($$degree === 0) {
          container.push(node);
        } else {
          loop(this.children(cid), container);
        }
      });
    };
    loop(children, leafs);
    return leafs;
  }

  /**
   * 获取节点
   * @param id
   * @returns {*}
   */
  get(id) {
    return this.database[id];
  }

  /**
   * 是否为叶子节点
   * @param id
   * @returns {boolean}
   */
  isLeaf(id) {
    return this.degree(id) === 0;
  }

  /**
   * 获取节点的度
   * @returns {*|number}
   */
  degree(id) {
    return this.get(id).$$degree;
  }

  /**
   * 获取节点的层次
   * @param id
   * @returns {Number}
   */
  level(id) {
    const {$$path} = this.get(id);
    return $$path.split('/').length;
  }

  /**
   * 获取父节点
   * @param id
   * @returns {*}
   */
  parent(id) {
    const parentId = this.parentId(id);
    return this.get(parentId);
  }

  ancestors(id) {
    const {$$path} = this.get(id);
    let ancestors = [];
    const arr = $$path.split('/').reverse();
    if (arr.length > 1) {
      arr.slice(1).forEach((aid)=> {
        const node = this.get(aid);
        ancestors.push(node);
      });
    } else {
      ancestors = null;
    }
    return ancestors;
  }

  /**
   *
   * @param id
   * @returns {string}
   */
  parentId(id) {
    const {$$path} = this.get(id);
    const tmp = $$path.split('/');
    const {length} = tmp;
    return tmp[length - 2];
  }

  /**
   * 获取子节点
   * @param id
   * @returns {*}
   */
  children(id) {
    let rtn = [];
    const {$$children, $$degree} = this.get(id);
    if ($$degree === 0) {
      rtn = null;
    } else {
      if ($$children) {
        $$children.forEach((cid)=> {
          const child = this.get(cid);
          if (child) {
            rtn.push(child);
          }
        });
      }
    }
    return rtn;
  }

  /**
   * 获取节点的选中状态
   * @param id
   * @returns {*}
   */
  checkState(id) {
    return this.get(id).$$checkState;
  }

  /**
   * 返回节点的可用状态
   * @param id
   * @returns {number|TreeModel.disableState}
   */
  disableState(id) {
    return this.get(id).$$disableState;
  }


  /**
   * 选中节点
   * @param id
   * @param down
   */
  check(id, down) {
    const node = this.get(id);
    if (node === undefined) {
      return;
    }
    const {$$checkState, $$disableState, $$degree} = node;
    if ($$checkState === TRUE || $$disableState === TRUE) {
      return;
    }
    node.$$checkState = TRUE;
    if ($$degree > 0) {
      const children = this.children(id);
      children.forEach((item)=> {
        this.check(item.id, true);
      });
    } else {
      this.__dealCheckedCount(id, PLUS);
    }
    if (id === '#' || down) {
      return;
    }
    const parentId = this.parentId(id);
    this.__judgeCheckState(parentId);
  }

  /**
   * 取消选中节点
   * @param id
   * @param down
   */
  uncheck(id, down) {
    const node = this.get(id);
    if (node === undefined) {
      return;
    }
    const {$$checkState, $$disableState, $$degree} = node;
    if ($$checkState === FALSE || $$disableState === TRUE) {
      return;
    }
    node.$$checkState = FALSE;
    if ($$degree > 0) {
      const children = this.children(id);
      children.forEach((item)=> {
        this.uncheck(item.id, true);
      });
    } else {
      this.__dealCheckedCount(id, MINUS);
    }

    if (id === '#' || down) {
      return;
    }
    const parentId = this.parentId(id);
    this.__judgeCheckState(parentId);
  }

  /**
   * 禁用节点
   * @param id
   * @param down
   */
  disable(id, down) {
    const node = this.get(id);
    if (node === undefined) {
      return;
    }
    const {$$checkState, $$disableState, $$degree} = node;
    if ($$disableState === TRUE) {
      return;
    }
    node.$$disableState = TRUE;
    if ($$degree > 0) {
      const children = this.children(id);
      children.forEach((item)=> {
        this.disable(item.id, true);
      });
    } else {
      if ($$checkState === TRUE) {
        this.__dealCheckedCount(id, MINUS);
      }
      this.__dealLeafCount(id, MINUS);
      this.__dealDisabledCount(id, PLUS);
    }
    if (id === '#' || down) {
      return;
    }
    const parentId = this.parentId(id);
    this.__judgeDisableState(parentId);
    this.__judgeCheckState(parentId);
  }

  /**
   * 启用节点
   * @param id
   * @param down
   */
  enable(id, down) {
    const node = this.get(id);
    if (node === undefined) {
      return;
    }
    const {$$checkState, $$disableState, $$degree} = node;
    if ($$disableState === FALSE) {
      return;
    }
    node.$$disableState = FALSE;
    if ($$degree > 0) {
      const children = this.children(id);
      children.forEach((item)=> {
        this.enable(item.id);
      });
    } else {
      if ($$checkState === true) {
        this.__dealCheckedCount(id, PLUS);
      }
      this.__dealLeafCount(id, PLUS);
      this.__dealDisabledCount(id, MINUS);
    }

    if (id === '#' || down) {
      return;
    }
    const parentId = this.parentId(id);
    this.__judgeDisableState(parentId);
    this.__judgeCheckState(parentId);
  }

  render() {
    const {database} = this;
    const keys = ['checkState', 'disableState', 'leafCount', 'checkedCount', 'disabledCount'];
    forIn(database, (node)=> {
      forIn(keys, (key)=> {
        node[key] = node[`$$${key}`];
      });
    });
  }

  reset() {
    const {database} = this;
    const keys = ['checkState', 'disableState', 'leafCount', 'checkedCount', 'disabledCount'];
    forIn(database, (node)=> {
      forIn(keys, (key)=> {
        node[`$$${key}`] = node[key];
      });
    });
  }


  __signCheck(id) {
    const $$checkState = this.checkState(id);
    if ($$checkState === INDETERMINATE) {
      return;
    }
    const node = this.get(id);
    node.$$checkState = INDETERMINATE;
    if (id === '#') {
      return;
    }
    const parentId = this.parentId(id);
    this.__signCheck(parentId);
  }

  __signDisable(id) {
    const $$disableState = this.disableState(id);
    if ($$disableState === INDETERMINATE) {
      return;
    }
    const node = this.get(id);
    node.$$disableState = INDETERMINATE;
    if (id === '#') {
      return;
    }
    const parentId = this.parentId(id);
    this.__signDisable(parentId);
  }


  __judgeCheckState(id) {
    const $$checkState = this.__checkState(id);
    if ($$checkState === TRUE) {
      this.check(id);
    }
    if ($$checkState === FALSE) {
      this.uncheck(id);
    }
    if ($$checkState === INDETERMINATE) {
      this.__signCheck(id);
    }
  }

  __judgeDisableState(id) {
    const $$disableState = this.__disableState(id);
    if ($$disableState === TRUE) {
      this.disable(id);
    }
    if ($$disableState === FALSE) {
      this.enable(id);
    }
    if ($$disableState === INDETERMINATE) {
      this.__signDisable(id);
    }
  }

  /**
   * 根据子节点 确定该节点的状态
   * @param id
   * @returns {number}
   * @private
   */

  __disableState(id) {
    const children = this.children(id);
    let $$state = INDETERMINATE;
    const allIsTrue = children.every(item => {
      return item.$$disableState === TRUE;
    });
    const allIsFalse = children.every(item => {
      return item.$$disableState === FALSE;
    });
    if (allIsTrue) {
      $$state = TRUE;
    }
    if (allIsFalse) {
      $$state = FALSE;
    }
    return $$state;
  }

  __checkState(id) {
    const children = this.children(id);
    let $$state = INDETERMINATE;
    const allisDisabled = this.__disableState(id) === TRUE;
    const allIsTrue = children.every(item => {
      const {$$checkState, $$disableState} = item;
      let rtn;
      if (allisDisabled) {
        rtn = $$checkState === TRUE;
      } else {
        rtn = $$checkState === TRUE || $$disableState === TRUE;
      }
      return rtn;
    });
    const allIsFalse = children.every(item => {
      const {$$checkState, $$disableState} = item;
      let rtn;
      if (allisDisabled) {
        rtn = $$checkState === FALSE;
      } else {
        rtn = $$checkState === FALSE || $$disableState === TRUE;
      }
      return rtn;
    });
    if (allIsTrue) {
      $$state = TRUE;
    }
    if (allIsFalse) {
      $$state = FALSE;
    }
    return $$state;
  }

  __dealCheckedCount(id, operator) {
    const ancestors = this.ancestors(id);
    ancestors.forEach((node)=> {
      if (operator === PLUS) {
        node.$$checkedCount += 1;
      }

      if (operator === MINUS) {
        node.$$checkedCount -= 1;
      }
    });
  }

  __dealDisabledCount(id, operator) {
    const ancestors = this.ancestors(id);
    ancestors.forEach((node)=> {
      if (operator === PLUS) {
        node.$$disabledCount += 1;
      }

      if (operator === MINUS) {
        node.$$disabledCount -= 1;
      }
    });
  }

  __dealLeafCount(id, operator) {
    const ancestors = this.ancestors(id);
    ancestors.forEach((node)=> {
      if (operator === PLUS) {
        node.$$leafCount += 1;
      }

      if (operator === MINUS) {
        node.$$leafCount -= 1;
      }
    });
  }

  iterator(filter) {
    const result = [];
    const source = {};
    forIn(this.database, (item) => {
      if (item.id !== '#') {
        if (filter(cloneDeep(item), this)) {
          result.push(item);
        }
      }
    });
    const reset = {
      $$checkState: FALSE,
      $$disableState: FALSE,
      $$checkedCount: 0,
      $$leafCount: 0,
      $$disabledCount: 0,
    };
    const dealChildren = (nodes, container)=> {
      nodes.forEach((child)=> {
        const {id, $$degree} = child;
        container[id] = {...cloneDeep(child), ...reset};
        if ($$degree > 0) {
          const children = this.children(id);
          dealChildren(children, container);
        }
      });
    };
    const dealAncestors = (ancestors, container)=> {
      ancestors.forEach((ancestor)=> {
        const {id} = ancestor;
        container[id] = {...cloneDeep(ancestor), ...reset};
      });
    };
    result.forEach((item)=> {
      const {id, $$degree} = item;
      source[id] = {...cloneDeep(item), ...reset};
      if ($$degree > 0) {
        const children = this.children(id);
        dealChildren(children, source);
      }
      const ancestors = this.ancestors(id);
      dealAncestors(ancestors, source);
    });
    if (result.length === 0) {
      source['#'] = cloneDeep(this.get('#'));
    }
    const checked = this.checked();
    const disabled = this.disabled();
    const rtn = new TreeModel({source});
    rtn.__correct();
    checked.forEach((id)=> {
      rtn.check(id);
    });
    disabled.forEach((id)=> {
      rtn.disable(id);
    });
    rtn.render();
    return rtn;
  }

  __correct() {
    const {database} = this;
    forIn(database, (node)=> {
      const {$$degree, id} = node;
      if ($$degree > 0) {
        const children = this.children(id);
        node.$$degree = children.length;
        node.$$children = children.map((child)=> {
          return child.id;
        });
      } else {
        this.__dealLeafCount(id, PLUS);
      }
    });
  }

  checked() {
    const ids = [];
    forIn(this.database, (node)=> {
      const {$$degree, $$checkState, id} = node;
      if ($$degree === 0 && $$checkState === TRUE) {
        ids.push(id);
      }
    });
    return ids;
  }

  disabled() {
    const ids = [];
    forIn(this.database, (node)=> {
      const {$$disableState, $$degree, id} = node;
      if ($$degree === 0 && $$disableState === TRUE) {
        ids.push(id);
      }
    });
    return ids;
  }
}

assign(TreeModel, {TRUE, FALSE, INDETERMINATE});
export default TreeModel;
