import React, {PropTypes} from 'react';
import {Form, Input, InputNumber, Icon, Modal} from 'antd';
import ajax from '../../../../common/ajax';
import TagItem from '../../common/TagItem';
import {getMerchantId, getCategoryId} from '../../common/utils';
import ShopItem from '../../common/ShopItem';
const FormItem = Form.Item;

const DishSingleEditForm = React.createClass({
  propTypes: {
    isCreate: PropTypes.bool,
    getValue: PropTypes.number,
    getValueCallBack: PropTypes.func,
    dishId: PropTypes.string,
    data: PropTypes.object,
    dishTagSet: PropTypes.array,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      showModal: false,
      loadedShops: false,
    };
  },
  componentDidMount() {
    this.props.form.validateFieldsAndScroll(['dishName']);
  },
  componentDidUpdate(prevProps) {
    const {isCreate, getValue, getValueCallBack, dishId, data} = this.props;
    if (getValue && prevProps.getValue !== getValue) {
      this.props.form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) return;
        const result = values;
        if (isCreate) {
          result.fileId = data.fileId;
          result.pictureName = data.pictureName;
        } else {
          result.dishId = dishId;
        }
        getValueCallBack(result);
      });
    }
  },
  showModal() {
    this.setState({
      showModal: true,
    });
  },
  hideModal() {
    this.setState({
      showModal: false,
    });
  },
  checkDishName(rule, value, callback) {
    const {isCreate, data, dishId} = this.props;
    const dishNameInputs = document.querySelectorAll('.dish-name-input');
    const names = dishNameInputs.length ? Array.prototype.slice.call(dishNameInputs)
      .filter(v => v.getAttribute('data-dishid') !== dishId)
      .map(v => v.value) : [];
    if (!value.length) {
      callback(new Error('请填写菜品名称'));
    } else if (value.indexOf('null') > -1 || /^[0-9]*$/.test(value) || !(/^[\u4e00-\u9fa5a-zA-Z0-9()（）]+$/.test(value))) {
      callback(new Error('菜品名称格式不正确，请重新填写'));
    } else if (value && value.length > 12) {
      callback(new Error('已超过' + (value.length - 12) + '个字'));
    } else if (names.some(v => v === value)) {
      callback(new Error('菜品名称已存在，请重新命名。'));
    } else if (!isCreate && value === data.dishName) {
      callback();
    } else {
      const params = {
        dishName: value,
      };
      if (this.merchantId) params.op_merchant_id = this.merchantId;
      ajax({
        url: '/shop/kbdish/checkRepeat.json',
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            if (!result.repeat) callback();
            else callback(new Error('菜品名称已存在，请重新命名。'));
          } else {
            callback(new Error(result.resultMsg));
          }
        },
        error: (result) => {
          callback(new Error(result.resultMsg));
        },
      });
    }
  },
  checkDescription(rule, value, callback) {
    if (value && value.length > 40) {
      callback(new Error('已超过' + (value.length - 40) + '个字'));
    }
    callback();
  },
  dealData(result) {
    const { shopCountGroupByCityVO = [], selectedCityShops = [] } = result.result ? result.result : result;
    const newSelected = Object.keys(selectedCityShops).map(item => selectedCityShops[item]);
    return { shopCountGroupByCityVO, selectedCityShops: newSelected };
  },
  render() {
    const {data, dishTagSet, dishId, isCreate} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {showModal} = this.state;
    const formItemLayout = {
      labelCol: { span: '6' },
      wrapperCol: { span: '14' },
    };
    const adjustItem = (<FormItem label="适用门店：" { ...formItemLayout } >
      <ShopItem {...getFieldProps('shopIds', {
        rules: [{
          min: 1,
          required: true,
          type: 'array',
          message: '请选择适用门店',
        }],
      })}
      afterLoad={(selected) => {
        let selectedShops = [];
        selected.forEach(item => {
          selectedShops = selectedShops.concat(item.shops.map(shop => shop.shopId));
        });
        this.setState({'loadedShops': true}, () => {
          this.props.form.setFieldsValue({shopIds: selectedShops});
        });
      }}
      dealData={(result) => { return this.dealData(result); }}
      url={isCreate ? `/goods/itempromo/getShops.json?categoryId=${getCategoryId()}` : `/shop/queryGoodsDetail.json?categoryId=${getCategoryId()}&goodsId=${dishId}`}
      subUrl="/goods/itempromo/getShopsByCity.json" />
    </FormItem>);
    return (<div>
      <div className="img-wrap">
        <div className="kb-photo-picker-list-item">
          <img src={data.pictureURL} />
        </div>
      </div>
      <div className="form-wrap">
        <Form form={this.props.form} horizontal>
          <FormItem label="菜品名称：" { ...formItemLayout } help={isFieldValidating('dishName') ? '校验中...' : getFieldError('dishName')} hasFeedback required>
            <Input className="dish-name-input" data-dishid={dishId} {...getFieldProps('dishName', {
              initialValue: data.dishName,
              rules: [
                this.checkDishName,
              ],
            })} placeholder="不超过12个字" />
          </FormItem>
          {adjustItem}
          <FormItem label="价格：" { ...formItemLayout }>
            <InputNumber {...getFieldProps('price', {
              initialValue: data.price,
            })} step={0.01} />元
          </FormItem>
          <FormItem label={<span>菜品标签<a onClick={this.showModal}><Icon style={{marginLeft: 3}} type="info-circle" /></a></span>} { ...formItemLayout }>
             <TagItem {...getFieldProps('dishTagList', {
               initialValue: data.dishTagList && data.dishTagList.filter(v => v.type),
             })} dishTagSet={dishTagSet} />
          </FormItem>
          <FormItem label="菜品描述：" { ...formItemLayout }>
            <Input {...getFieldProps('desc', {
              initialValue: data.desc,
              rules: [
                this.checkDescription,
              ],
            })} type="textarea" placeholder="不超过40个字。可以描述菜品的食材来源、先进做法、口味等信息，帮助顾客更好的了解菜品哦～" />
          </FormItem>
        </Form>
      </div>
      {showModal ? <Modal width="669" title="帮助" footer={null} onCancel={this.hideModal} visible>
        <img src="https://zos.alipayobjects.com/rmsportal/TnlRRBYPqdhRRzR.jpg" width="637" height="568" />
      </Modal> : null}
    </div>);
  },
});

export default Form.create()(DishSingleEditForm);
