import React, { Component, PropTypes } from 'react';
import { Modal, Row, Col, Button, Input, Form, message } from 'antd';
import Tree from 'hermes-tree-select';
import NodeContent from './NodeContent';
import { flatten } from '../../../../common/utils';
import { ISV_IMPORT_LIMIT } from '../common/enums';
import { noop, includes } from 'lodash';

const { MULTI_SHOP_MAX_TABLE_COUNT, SINGLE_SHOP_MAX_TABLE_COUNT, SHOW_TABLE_MAX_SHOP_COUNT} = ISV_IMPORT_LIMIT;

function formatter(e, dep) {
  return { value: { dep, id: e.id, children: e.children, pid: e.pid }, array: e.children };
}

function getDisabledArray(arr = []) {
  const allChildren = flatten(arr, formatter, 2);
  const noTableDistricts = allChildren.filter(d => d.dep === 1 && (!d.children || d.children.length === 0)).map(d => d.id);
  const noTableCity = noTableDistricts.filter(d => d.dep === 0 && (
    !d.children || d.children.length === 0 || d.children.every(_d => includes(noTableDistricts, _d.id)))).map(d => d.id);
  return [...noTableCity, ...noTableDistricts];
}

function notFoundContent() {
  return <div style={{ textAlign: 'center' }}>暂无数据</div>;
}

function stringNormalizer(value) {
  return (value + '').trim();
}

function renderNodeText(node, isRight) {
  let rtn = null;
  if (node) {
    const children = node.children();
    if (node.id === '#' && isRight) {
      rtn = <span>已选门店({node.checked().length || '0'})</span>;
    } else if (node.id !== '#' && node.model.tableCnt > 0) {
      rtn = <NodeContent {...node.model} />;
    } else if (node.id === '#' && !isRight) {
      rtn = <span>全选</span>;
    } else if (node.depth() === 2 && (!children || children.length === 0)) {
      // 某区域桌数为 0
      rtn = <span style={{ display: 'inline' }}>{node.model.name}<br /><span style={{ color: '#ccc', marginLeft: '19px' }}>该区域的门店均没有桌号信息</span></span>;
    } else {
      rtn = <span>{node.model.name}</span>;
    }
  } else if (node === null) {
    rtn = <span>搜索结果为空</span>;
  }
  return rtn;
}

class SelectTableModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    checked: PropTypes.array,
    submitting: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    shopList: PropTypes.array,
  }

  static defaultProps = {
    submitting: false,
    visible: false,
    checked: [],
    onOk: noop,
    onCancel: noop,
  }

  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      searchValue: '',
      checked: this.props.checked,
      shopList: [],
      checkedTableCnt: 0,
    };
  }

  onChange = (ids, model) => {
    const checkedTableCnt = ids.reduce((prev, id) => prev + (model.get(id).model.tableCnt || 0), 0);
    if (checkedTableCnt > MULTI_SHOP_MAX_TABLE_COUNT && ids.length > 1) {
      message.warn(`最多只能为 ${MULTI_SHOP_MAX_TABLE_COUNT} 桌生成万能码`, 3);
    }
    this.setState({
      checkedTableCnt,
      checked: ids,
    });
  }

  onOk = () => {
    const { checked, checkedTableCnt } = this.state;
    if (checked.length === 1 && checkedTableCnt > SINGLE_SHOP_MAX_TABLE_COUNT) {
      Modal.info({
        title: '桌数过多',
        content: `应用服务导入的方式，单个门店只支持 ${SINGLE_SHOP_MAX_TABLE_COUNT} 桌以下。请改用Excel表格方式导入，按模板填写后上传。`,
      });
      return;
    }
    this.props.onOk({
      shopIds: checked,
      tableCnt: checkedTableCnt,
    });
  }

  enterHandler = e => {
    if (e.keyCode === 13) {
      this.search();
    }
  }

  search = () => {
    const { getFieldsValue } = this.props.form;
    this.setState({
      searchValue: getFieldsValue(['pid', 'shopName']),
    });
  }

  searchTree(value, item) {
    const { pid, shopName } = value;
    const filters = [];
    if (pid) {
      filters.push(model => model.pid && model.pid.indexOf(pid) !== -1);
    }
    if (shopName) {
      filters.push(model =>
        model.name && model.name.indexOf(shopName) !== -1
      );
    }
    return filters.length === 0 || filters.every(fn => fn(item.model));
  }

  // 判断归属的门店数是否超过阈值，超过则收起城市，不超过则展开到门店
  get ifExpandTree() {
    let cnt = 0;
    JSON.stringify(this.state.shopList, (k, v) => {
      if (typeof v === 'object' && v.tableCnt > 0) {
        cnt++;
      }
      return v;
    });
    return cnt <= SHOW_TABLE_MAX_SHOP_COUNT;
  }

  get footer() {
    const { checkedTableCnt, checked } = this.state;
    const okButtonDisabled =
      checkedTableCnt === 0 ||  // 未选中门店
      checkedTableCnt > MULTI_SHOP_MAX_TABLE_COUNT && checked.length > 1;  // 选中门店多于1家，且桌数超过限制
    return (
      <div>
        <Button onClick={this.props.onCancel}>取 消</Button>
        <Button
          disabled={okButtonDisabled}
          onClick={this.onOk}
          type="primary"
        >
          确 定 ({this.state.checkedTableCnt})
        </Button>
      </div>
    );
  }

  render() {
    const { visible, submitting, shopList } = this.props;
    const { checked, searchValue, checkedTableCnt } = this.state;
    const { getFieldProps } = this.props.form;
    const disabledNodeArr = getDisabledArray(shopList);
    return (
      <div>
        <Modal
          width="700"
          visible={visible}
          title="选择门店-有桌号信息的门店"
          cancelText="取消"
          onOk={this.onOk}
          onCancel={this.onCancel}
          okText={`确定(${checkedTableCnt})`}
          footer={this.footer}
          closable={false}
          confirmLoading={submitting}
        >
          <Form form={this.props.form}>
            <Row>
              <Col span="7">
                <Form.Item>
                  <Input
                    onKeyPress={this.enterHandler}
                    type="text"
                    placeholder="输入商户 pid"
                    {...getFieldProps('pid', {
                      normalize: stringNormalizer,
                      initialValue: '',
                    }) }
                  />
                </Form.Item>
              </Col>
              <Col span="12" style={{ marginLeft: '15px' }}>
                <Form.Item>
                  <Input
                    type="text"
                    placeholder="输入门店名称"
                    {...getFieldProps('shopName', {
                      normalize: stringNormalizer,
                      initialValue: '',
                    }) }
                  />
                </Form.Item>
              </Col>
              <Col span="3" style={{ marginLeft: '15px', lineHeight: '32px' }}>
                <Button onClick={this.search} type="primary">搜 索</Button>
              </Col>
            </Row>
          </Form>
          <Row>
            <Tree
              disabled={disabledNodeArr}
              defaultExpandLevel={this.ifExpandTree ? 2 : 0}
              notFoundContent={notFoundContent}
              treeData={shopList}
              checked={checked}
              onChange={this.onChange}
              searchValue={searchValue}
              search={this.searchTree}
              nodeText={renderNodeText}
            />
          </Row>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(SelectTableModal);
