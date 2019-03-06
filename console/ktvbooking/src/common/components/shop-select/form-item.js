import React from 'react';
import { object, string, bool, func } from 'prop-types';
import { Form } from 'antd';

import { getStorage, setStorage, getQueryStrVal } from '../../utils';
import ShopSelect from './index';

const validator = function validator(rule, value, callback) {
  if (!value || !value.cityCode) {
    callback('请选择省/市');
  } else if (!value.shopId) {
    callback('请选择门店');
  }
  callback();
};

export default function FormItem(props) {
  const { form, fieldName, required, onChange, ...otherProps } = props;

  const fieldError = form.getFieldError(fieldName);
  let initialValue = null;
  const [cityCode, shopId] = [getQueryStrVal(window.location.hash, 'cityCode'), getQueryStrVal(window.location.hash, 'shopId')];
  if (cityCode && shopId) {
    setStorage('checkShop', { cityCode, shopId });
  }
  let storageCheckShop = null;
  if (props.value) {
    initialValue = props.value;
  } else {
    storageCheckShop = getStorage('checkShop');
    initialValue = storageCheckShop || { cityCode: '', shopId: '' };
  }
  const fieldProps = form.getFieldProps(fieldName, {
    rules: required ? [{
      validator,
    }] : [],
    initialValue,
    onChange: (value) => {
      if (value.shopId && onChange) {
        setTimeout(() => { // 确保onChange的值已经同步到rc-form中
          onChange(value.shopId);
        }, 0);
      }
      setStorage('checkShop', value);
    },
  });
  if (required) {
    Object.assign(otherProps, {
      validateStatus: fieldError ? 'error' : 'success',
      help: fieldError,
    });
  }
  let showTip = false;
  if (!storageCheckShop) {
    showTip = true;
  }
  return (
    <Form.Item label="门店名称" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}
      required={required} {...otherProps}>
      <ShopSelect {...fieldProps} />
      {showTip && (
        <div style={{ position: 'absolute', left: 0, top: 130, zIndex: 9, width: '100%', height: 150, paddingLeft: 215, backgroundColor: '#fff', fontSize: 20 }}>请先选择门店，才能查看相关信息</div>
      )}
    </Form.Item>
  );
}

FormItem.propTypes = {
  form: object.isRequired, // rc-form
  fieldName: string, // 表单项名称
  required: bool, // 是否必须
  value: object, // { cityCode, shopId }
  onChange: func, // 当改变选择门店 (shopId): void
};

FormItem.defaultProps = {
  fieldName: 'checkShop',
  required: true,
};
