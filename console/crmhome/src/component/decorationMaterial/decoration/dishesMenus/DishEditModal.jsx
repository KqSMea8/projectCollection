import React, {PropTypes} from 'react';
import {message, Modal, Spin} from 'antd';
import ajax from '../../../../common/ajax';
import DishEditForm from './DishSingleEditForm';
import {getMerchantId} from '../../common/utils';

const DishEditModal = React.createClass({
  propTypes: {
    hideModal: PropTypes.func,
    dishId: PropTypes.string,
    refresh: PropTypes.func,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      loading: true,
      saveLoading: false,
      getValue: 0,
      data: {},
      dishTagSet: [],
    };
  },
  componentDidMount() {
    const {dishId} = this.props;
    const params = {
      dishIds: dishId,
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbdish/queryByIds.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            loading: false,
            data: result.data[0],
            dishTagSet: result.dishTagSet,
          });
        } else {
          message.error(result.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  onOk() {
    this.setState({
      getValue: Math.random() + 1,
    });
  },
  getValueCallBack(formData) {
    this.save(formData);
  },
  save(formData) {
    this.setState({
      saveLoading: true,
    });
    const {refresh, hideModal} = this.props;
    const params = {
      goodsId: formData.dishId,
      goodsType: 'DISH',
      list: JSON.stringify([{name: formData.dishName, fileId: formData.fileId}]),
      shopIds: formData.shopIds.join(','),
      name: formData.dishName,
      desc: formData.desc,
      price: formData.price,
      tagString: JSON.stringify(formData.dishTagList),
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/modifyShopGoodsPics.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('保存成功');
          hideModal();
          refresh();
        } else {
          message.error(result.resultMsg);
        }
        this.setState({
          saveLoading: false,
        });
      },
      error: (_, msg) => {
        message.error(msg);
        this.setState({
          saveLoading: false,
        });
      },
    });
  },
  render() {
    const {hideModal, dishId} = this.props;
    const {getValue, data, dishTagSet, loading, saveLoading} = this.state;
    return (<Modal className="dish-edit-modal" title="修改" visible onOk={this.onOk} onCancel={hideModal} confirmLoading={saveLoading}>
      {loading ? <Spin /> : <DishEditForm dishId={dishId} data={data} dishTagSet={dishTagSet} getValue={getValue} getValueCallBack={this.getValueCallBack} />}
    </Modal>);
  },
});

export default DishEditModal;
