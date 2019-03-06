import React, {PropTypes} from 'react';
import {Form, Input} from 'antd';
import ajax from '../../../../common/ajax';
import ShopItem from '../../common/ShopItem';
import {getMerchantId} from '../../common/utils';

const FormItem = Form.Item;

const DishEditForm = React.createClass({
  propTypes: {
    isCreate: PropTypes.bool,
    getValue: PropTypes.number,
    getValueCallBack: PropTypes.func,
    id: PropTypes.string,
    data: PropTypes.object,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {};
  },
  componentDidMount() {
    this.props.form.validateFieldsAndScroll(['name']);
  },
  componentDidUpdate(prevProps) {
    const {isCreate, getValue, getValueCallBack, id, data} = this.props;
    if (getValue && prevProps.getValue !== getValue) {
      this.props.form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) return;
        const result = values;
        if (isCreate) {
          result.fileId = data.fileId;
        } else {
          result.id = id;
        }
        getValueCallBack(result);
      });
    }
  },
  checkEnvName(rule, value, callback) {
    const {isCreate, data, id} = this.props;
    const nameInputs = document.querySelectorAll('.name-input');
    const names = nameInputs.length ? Array.prototype.slice.call(nameInputs)
      .filter(v => v.getAttribute('data-id') !== id)
      .map(v => v.value) : [];
    if (!value.length) {
      callback(new Error('请填写环境图名称'));
    } else if (value && value.length > 12) {
      callback(new Error('已超过' + (value.length - 12) + '个字'));
    } else if (names.some(v => v === value)) {
      callback(new Error('该环境图名称已存在，请重新命名。'));
    } else if (!isCreate && value === data.name) {
      callback();
    } else {
      const params = {
        name: value,
        op_merchant_id: this.merchantId,
      };
      if (this.merchantId) params.merchantId = this.merchantId;
      ajax({
        url: '/shop/kbshopenv/checkRepeat.json',
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            if (!result.repeat) callback();
            else callback(new Error('该环境图名称已存在，请重新命名。'));
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
  render() {
    const {isCreate, data, id} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const formItemLayout = {
      labelCol: { span: '5' },
      wrapperCol: { span: '15' },
    };
    return (<div>
      <div className="img-wrap">
        <div className="kb-photo-picker-list-item">
          <img src={data.url} />
        </div>
      </div>
      <div className={'form-wrap' + (isCreate ? ' item-middle' : '')}>
        <Form form={this.props.form} horizontal>
          <FormItem label="环境图名称：" { ...formItemLayout } help={isFieldValidating('name') ? '校验中...' : getFieldError('name')} hasFeedback required>
            <Input className="name-input" data-id={id} {...getFieldProps('name', {
              initialValue: data.name,
              rules: [
                this.checkEnvName,
              ],
            })} placeholder="不超过12个字" />
          </FormItem>
          {!isCreate ? <FormItem {...formItemLayout} label="适用门店：" required>
            <ShopItem {...getFieldProps('shopIds', {
              initialValue: data.shopsInfo.length && data.shopsInfo.map(item => item.shopId),
              rules: [{
                min: 1,
                required: true,
                type: 'array',
                message: '请选择适用门店',
              }],
            })}
            envId={data.id}
            url="/shop/kbshopenv/getShops.json"
            subUrl="/shop/kbshopenv/getShopsByCity.json" />
          </FormItem> : null }
        </Form>
      </div>
    </div>);
  },
});

export default Form.create()(DishEditForm);
