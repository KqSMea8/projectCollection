import React, {PropTypes} from 'react';
import { Form, Input} from 'antd';
import SelectGoods from './SelectGoods';
import classnames from 'classnames';

const FormItem = Form.Item;

/*
  表单字段 － 商品编码
*/

const GoodsIds = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    actionType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },
  checkGoodsIds(rule, value, callback) {
    const reg = new RegExp(/^[a-zA-Z0-9\n]+$/g);
    if ( !reg.test(value) && value !== '') {
      callback([new Error('请输入数字或英文字母')]);
      return;
    }

    if (value) {
      const arr = value.split('\n');
      if (arr.length > 500) {
        callback([new Error('最多输入500个编码')]);
        return;
      }
    }

    // 商品编码不能重复
    if (typeof value === 'string' && this.isArrayRepeated(value.split('\n'))) {
      callback(new Error('不能输入重复的商品编码'));
      return;
    }
    callback();
  },

  isArrayRepeated(arr) {
    const newArr = [];
    let repeated = false;
    for (let i = 0; i < arr.length; i++) {
      if (newArr.indexOf(arr[i]) >= 0) {
        repeated = true;
        break;
      } else {
        newArr.push(arr[i]);
      }
    }

    return repeated;
  },

  render() {
    const { getFieldProps, getFieldError} = this.props.form;
    const { initData, actionType } = this.props;

    /* if (actionType === 'edit' && !initData.goodsIds) {
      return null;
    } */

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16, offset: 1 },
    };
    return (
      <div>
        <FormItem
          style={{ marginBottom: (actionType === 'create' || actionType === 'add') ? 24 : 0 }}
          {...this.props.layout}
          required
          label="商品SKU编码："
          validateStatus={
          classnames({
            error: !!getFieldError('goodsIds'),
          })}>
          <Input
            {...getFieldProps('goodsIds', {
              rules: [
                { required: true, message: '请输入商品编码' },
                { max: 7000, message: '最多 7000 个字符' },
                this.checkGoodsIds,
              ],
              initialValue: initData.goodsIds || '',
            })}
            type="textarea"
            placeholder="最多可输入500个，若输入多个商品编码，多个商品均会享受优惠，请按回车键进行间隔" />
            <SelectGoods layout={layout} {...this.props}/>
        </FormItem>
      </div>
    );
  },
});

export default GoodsIds;
