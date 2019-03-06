import React, {PropTypes} from 'react';
import { Form, Input} from 'antd';
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
    type: PropTypes.string,
    discountType: PropTypes.string,
    getGoodList: PropTypes.func,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  getInitialState() {
    const { initData } = this.props;
    return {
      radioValue: initData && initData.voucherUploadFileKey ? 2 : 1,
      fileList: initData && initData.voucherUploadFileKey ? [{
        uid: initData.voucherUploadFileKey,
        name: initData.voucherUploadFileName,
        status: 'done',
      }] : [],
    };
  },

  onChange(e) {
    if (e.target.value === 1) {
      this.setState({
        fileList: [],
        skuCount: 0,
      });
    }
    this.setState({
      radioValue: e.target.value,
    });
  },

  getCtoken() {
    const a = document.cookie.split(';');
    const info = {};
    a.map((item, i) => {
      info[a[i].split('=')[0].replace(/\s+/g, '')] = a[i].split('=')[1];
    });
    return info.ctoken;
  },

  setFieldsV(data, name) {
    const {setFieldsValue} = this.props.form;
    const {type} = this.props;
    if ( type === 'consumeGoodsIds' ) {
      setFieldsValue({
        consumeUploadFileKey: data.fileKey,
        consumeFileName: name,
      });
    } else {
      setFieldsValue({
        batchUploadFileKey: data.fileKey,
        fileName: name,
      });
    }
  },

  checkGoodsIds(rule, value, callback) {
    const {actionType, initData, discountType, type} = this.props;
    // 每行空格处理
    let xList = [];
    if (value) {
      const oList = value.split('\n');
      oList.map((item) => {
        xList.push(item.replace(/\s+/g, ''));
      });
      xList = xList.join('\n');
      this.props.form.setFieldsValue({
        goodsIds: xList,
      });
    } else {
      xList = value;
    }

    const reg = new RegExp(/^[a-zA-Z0-9\n]+$/g);
    if ( !reg.test(xList) && xList !== '') {
      callback([new Error('请输入数字或英文字母')]);
      return;
    }
    const newInitData = (initData.vouchers && initData.vouchers[0].goodsIds) || (initData && initData.goodsIds);
    if (value && actionType === 'edit' && newInitData && discountType !== 'BUY_A_SEND_A') {
      const list = value.split('\n');
      let initValue = (initData.vouchers && initData.vouchers[0].goodsIds.split('\n')) || (initData && initData.goodsIds);
      if ( type === 'consumeGoodsIds') {
        initValue = initData.consumeGoodsIds.join('\n');
      }
      if ( list.length < 800 && initValue.length > 800) {
        callback([new Error('修改后的数据也必须是大于等于800')]);
        return;
      }
      if ( list.length > 800 && initValue.length < 800) {
        callback([new Error('修改后的数据也必须是小于800')]);
        return;
      }
    } else {
      const arr = value ? value.split('\n') : [];
      const num = discountType === 'BUY_A_SEND_A' ? 500 : 10000;
      if (arr.length > num) {
        callback([new Error('最多输入' + num + '个编码')]);
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
    const { getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const { actionType} = this.props;
    /* if (actionType === 'edit' && !initData.goodsIds) {
      return null;
    } */

    const maxRules = {};
    const placeholderText = '若输入多个商品编码，多个商品均会享受优惠，请按回车键进行间隔';
    return (
      <div style={{marginBottom: 20}}>
        <FormItem
          style={{ marginBottom: (actionType === 'create' || actionType === 'add') ? 24 : 0 }}
          {...this.props.layout}
          required
          label="商品SKU编码："
          help={getFieldError('goodsIds') || '若输入多个商品编码，多个商品均会享受优惠，请按回车键进行间隔'}
          validateStatus={
          classnames({
            error: !!getFieldError('goodsIds'),
          })}>
          <div>
            <Input
              {...getFieldProps('goodsIds', {
                rules: [
                  { required: true, message: '请输入商品编码' },
                  maxRules,
                  this.checkGoodsIds,
                ],
              })}
              type="textarea"
              placeholder={placeholderText} onKeyUp={() => {this.props.getGoodList(getFieldValue('goodsIds'));}}/><br/>
          </div>
        </FormItem>
      </div>
    );
  },
});

export default GoodsIds;
