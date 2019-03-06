import './index.less';
import React, {Component, PropTypes} from 'react';
import TreeModel, {TRUE, FALSE} from './model.jsx';
import {Row, Col} from 'antd';
import Node from './treenode.jsx';
import {cloneDeep, includes, without, noop, forIn} from 'lodash';
import classNames from 'classnames';

const DEFALUTNODETEXT = (node) => {
  return node.name;
};
class Tree extends Component {
  static propTypes = {
    data: PropTypes.array,
  };

  constructor(props) {
    super(props);
    const {source, checked, disabled, search, searchValue} = props;
    const model = new TreeModel({source, checked, disabled});
    this.state = {
      model: model,
      leftExpandKey: ['#'],
      rightExpandKey: ['#'],
      searchExpandKey: [],
    };
    if (searchValue) {
      const searchModel = model.iterator((node)=> {
        return search(searchValue, node);
      });
      const searchExpandKey = [];
      this.state.searchModel = searchModel;
      forIn(searchModel.database, (node)=> {
        const {$$degree, id} = node;
        if ($$degree > 0) {
          searchExpandKey.push(id);
        }
      });
      this.state.searching = true;
    }
  }

  componentWillReceiveProps(props) {
    if (props.searchValue !== this.props.searchValue) {
      const searchModel = this.state.model.iterator((node)=> {
        return props.search(props.searchValue, node);
      });
      const searchExpandKey = [];
      this.state.searchModel = searchModel;
      forIn(searchModel.database, (node)=> {
        const {$$degree, id} = node;
        if ($$degree > 0) {
          searchExpandKey.push(id);
        }
      });
      this.setState({
        searching: true,
        searchValue: props.searchValue,
        searchModel,
        searchExpandKey,
      });
    }

    if (!props.searchValue) {
      this.setState({
        searching: false,
        searchValue: null,
        searchModel: null,
      });
    }
  }

  onCheck(id, isResult) {
    const {onChange} = this.props;
    const {model, searching, searchModel} = this.state;
    if (isResult) {
      if (searching) {
        model.uncheck(id);
        if (searchModel.get(id)) {
          searchModel.uncheck(id);
        }
      } else {
        model.uncheck(id);
      }
    } else {
      if (searching) {
        const checkState = searchModel.checkState(id);
        let method = 'check';
        if (checkState === TRUE) {
          method = 'uncheck';
        }
        searchModel[method](id);
        if (searchModel.isLeaf(id)) {
          model[method](id);
        } else {
          const leafs = searchModel.leafs(id);
          leafs.forEach((leaf)=> {
            const {$$checkState, id: leafId} = leaf;
            if ($$checkState === TRUE) {
              model.check(leafId);
            }
            if ($$checkState === FALSE) {
              model.uncheck(leafId);
            }
          });
        }
      } else {
        const checkState = model.checkState(id);
        let method = 'check';
        if (checkState === TRUE) {
          method = 'uncheck';
        }
        model[method](id);
      }
    }
    (onChange || noop)(model);
    this.forceUpdate();
  }

  onExpand(id, isResult) {
    const {searchExpandKey, leftExpandKey, rightExpandKey, searching} = this.state;
    let expandKey;
    if (isResult) {
      if (includes(rightExpandKey, id)) {
        expandKey = without(rightExpandKey, id);
      } else {
        expandKey = [...rightExpandKey, id];
      }
      this.setState({
        rightExpandKey: expandKey,
      });
    } else {
      if (searching) {
        if (includes(searchExpandKey, id)) {
          expandKey = without(searchExpandKey, id);
        } else {
          expandKey = [...searchExpandKey, id];
        }
        this.setState({
          searchExpandKey: expandKey,
        });
      } else {
        if (includes(leftExpandKey, id)) {
          expandKey = without(leftExpandKey, id);
        } else {
          expandKey = [...leftExpandKey, id];
        }
        this.setState({
          leftExpandKey: expandKey,
        });
      }
    }
  }

  renderChildren(id, isResult) {
    const {model, searching, searchModel} = this.state;
    let tree;
    let rtn;
    if (searching && !isResult) {
      tree = searchModel;
    } else {
      tree = model;
    }

    if (tree.get(id)) {
      const children = tree.children(id);
      const isLeaf = tree.isLeaf(id);
      const treeCls = {
        'ant-tree': id === '#',
        'ant-tree-child-tree': id !== '#',
        'ant-tree-child-tree-open': id !== '#',
      };
      rtn = isLeaf ? '' : (
        <ul className={classNames(treeCls)}>
          {this.getNodes(children, isResult)}
        </ul>
      );
    } else {
      rtn = '';
    }

    return rtn;
  }


  getNodes(children, isResult) {
    const nodes = [];
    children.forEach((item)=> {
      const {$$checkState} = item;
      const node = this.getNode(cloneDeep(item), isResult);
      if (!(isResult && $$checkState === FALSE)) {
        nodes.push(node);
      }
    });
    return nodes.length > 0 ? nodes : '';
  }

  getNode(node, isResult) {
    const {nodeText: _nodeText} = this.props;
    const {leftExpandKey, rightExpandKey, searchExpandKey, model, searching} = this.state;
    const {id} = node;
    const onCheck = this.onCheck.bind(this, id, isResult);
    const onExpand = this.onExpand.bind(this, id, isResult);
    const nodeText = (item)=> {
      return (_nodeText || DEFALUTNODETEXT).bind(model)(item, isResult);
    };
    let expand;
    if (isResult) {
      expand = includes(rightExpandKey, id);
    } else {
      if (searching) {
        expand = includes(searchExpandKey, id);
      } else {
        expand = includes(leftExpandKey, id);
      }
    }

    let rtn = (<Node {...{node, nodeText, isResult, expand, onCheck, onExpand}}/>);
    if (expand) {
      rtn = (<li key={id}>{rtn}{this.renderChildren(id, isResult)}</li>);
    } else {
      rtn = (<li key={id}>{rtn}</li>);
    }
    return rtn;
  }


  render() {
    const {model, searchModel, searching} = this.state;
    const {max = 1000000} = this.props;
    const {$$checkedCount} = model.get('#');
    const tree = searching ? searchModel : model;
    const root = cloneDeep(tree.get('#'));
    const {$$leafCount} = root;
    const rtn = (
      <div>
        <Row>
          <Col span="12" style={{paddingRight: 10}}>
            <div className="node-container">
              <div className="header">
                <Row>
                  {$$leafCount < max ? <Col span="5">
                    <Node node={root}
                          onCheck={this.onCheck.bind(this, '#', false)}
                          nodeText={()=>{return '全选';}}/>
                  </Col> : null}
                  <Col span="16">
                    <span>共 {$$leafCount}</span>
                  </Col>
                </Row>
              </div>
              <div className="content">
                {this.renderChildren('#')}
              </div>
            </div>
          </Col>
          <Col span="12" style={{paddingLeft: 10}}>
            <div className="node-container">
              <div className="header">
                已选 {$$checkedCount}
              </div>
              <div className="content">
                {this.renderChildren('#', true)}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
    return rtn;
  }
}

export default Tree;
