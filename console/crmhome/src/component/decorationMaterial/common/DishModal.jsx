import React, {PropTypes} from 'react';
import {Modal, Button, Spin} from 'antd';
import ajax from '../../../common/ajax';
import Tree from 'hermes-treeselect';
import {getMerchantId, getCategoryId} from './utils';

const DishModal = React.createClass({
  propTypes: {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
    targetKeys: PropTypes.array,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      dishData: [],
      targetKeys: this.props.targetKeys,
    };
  },
  componentDidMount() {
    const params = {};
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbdish/queryAll.json',
      method: 'get',
      data: params,
      success: (result) => {
        const { data } = result;
        if (!data.length) {
          Modal.info({
            title: '菜品库空空的',
            content: '请先去添加菜品，再来新建菜单模板哦～',
            onOk() {
              window.location.hash = '/decoration/' + getCategoryId() + '/menu/dish-create';
            },
            okText: '添加菜品',
          });
          return;
        }
        this.dataMap = {};
        data.forEach((v) => {
          v.key = v.dishId;
          this.dataMap[v.dishId] = v.dishName;
        });
        this.setState({
          dishData: data.map(item => {return {id: item.dishId, name: item.dishName};}),
        });
      },
    });
  },
  onOk() {
    const {onOk} = this.props;
    const {targetKeys} = this.state;
    onOk(targetKeys.map((v) => {
      return {
        dishId: v,
        dishName: this.dataMap[v],
      };
    }));
  },
  onChange(modal) {
    this.setState({ targetKeys: modal.checked() });
  },
  render() {
    const {visible, onCancel} = this.props;
    const {dishData, targetKeys} = this.state;
    const footer = (<div>
      <Button type="primary" size="large" onClick={this.onOk} disabled={!targetKeys.length}>确定</Button>
      <Button size="large" onClick={onCancel}>取消</Button>
    </div>);
    return (
      <Modal visible={visible} onCancel={onCancel} footer={footer} title="选择菜品" width="710px">
        {dishData ? <Tree onChange={this.onChange} treeData={dishData} checked={this.props.targetKeys} /> : <Spin />}
      </Modal>
    );
  },
});

export default DishModal;
