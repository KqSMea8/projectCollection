/**
 * 原价 & 优惠价
 */
import React, { PropTypes } from 'react';
import { Form } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const SUB_FORM_ITEM_STYLE = { display: 'table-cell', verticalAlign: 'top', paddingLeft: '8px' };
const TABLE_CELL = { display: 'table-cell' };

export default class ReduceTo extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    rules: PropTypes.shape({
      origin: PropTypes.array,
      changed: PropTypes.array,
    }),
    defaultValue: PropTypes.shape({
      origin: PropTypes.string,
      changed: PropTypes.string,
    }),
    disabled: PropTypes.oneOfType([
      PropTypes.shape({
        origin: PropTypes.bool,
        changed: PropTypes.bool,
      }),
      PropTypes.bool,
    ]),
  }
  static defaultProps = Object.assign({}, BaseFormComponent.defaultProps, {
    defaultValue: {
      origin: undefined,
      changed: undefined,
    },
    disabled: false,
    discountRate: 0,
    rules: {
      origin: [],
      changed: [],
    },
  });

  originIsLargerThenReduceRule = (r, v, c) => {
    const { getFieldsValue } = this.form;
    const { field } = this.props;
    const values = getFieldsValue([field.origin, field.changed]);
    if (+values[field.origin] < +values[field.changed]) {
      c('原价必须不低于优惠价');
    }
    c();
  }

  discountRateRule = (r, v, c) => {
    if (this.props.discountRate) {
      const { getFieldsValue } = this.form;
      const { field } = this.props;
      const values = getFieldsValue([field.origin, field.changed]);
      if (+values[field.changed] / +values[field.origin] > this.props.discountRate) {
        c(`折扣力度不得低于${this.props.discountRate * 100}折`);
      }
    }

    c();
  }

  get fieldPropsOrigin() {
    const { getFieldProps } = this.form;
    const { defaultValue, field, rules } = this.props;
    return getFieldProps(field.origin, {
      initialValue: defaultValue.origin,
      rules: [...rules.origin, this.originIsLargerThenReduceRule, this.discountRateRule],
    });
  }

  get fieldPropsChanged() {
    const { getFieldProps, validateFields, getFieldValue } = this.form;
    const { defaultValue, field, rules } = this.props;
    return getFieldProps(field.changed, {
      initialValue: defaultValue.changed,
      rules: [...rules.changed, (r, v, cb) => {
        if (getFieldValue(field.origin) && getFieldValue(field.changed)) {
          validateFields([field.origin], { force: true });
        }
        cb();
      }],
    });
  }

  render() {
    const {getFieldValue} = this.form;
    const { label, required, labelCol, wrapperCol, isShow, field, extra } = this.props;
    const originProps = this.fieldPropsOrigin;
    const changedProps = this.fieldPropsChanged;
    const errors = {
      origin: this.form.getFieldError(field.origin),
      changed: this.form.getFieldError(field.changed),
    };

    let oriPriceDisable = false;
    let priceDisable = false;
    if (typeof this.props.disabled === 'boolean') {
      priceDisable = oriPriceDisable = this.props.disabled;
    } else if (typeof this.props.disabled === 'object') {
      priceDisable = this.props.disabled.changed;
      oriPriceDisable = this.props.disabled.origin;
    }

    return (
      <FormItem
        label={label}
        extra={extra}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <span style={TABLE_CELL}>商品原{getFieldValue('verifyFrequency') === 'multi' ? <span style={{color: '#f94'}}>总价</span> : '价'}</span>
        <FormItem style={SUB_FORM_ITEM_STYLE}
          validateStatus={errors.origin ? 'error' : 'success'}
          help={errors.origin}
        >
          <span className="ant-input-wrapper">
            <input type="text" className="ant-input ant-input-lg"
              value={originProps.value}
              onChange={(e) => {
                let value = e.target.value || '';
                value = value.trim();
                if (value.charAt(0) === '.') value = '0' + value;
                if (!isNaN(value) && !(value.indexOf('.') >= 0 && value.split('.')[1].length > 2)) {
                  originProps.onChange(value);
                }
              }}
              id={field.origin} disabled={oriPriceDisable} style={{ imeMode: 'disabled', width: 70 }} placeholder={getFieldValue('verifyFrequency') === 'multi' ? '单价x份数' : null}/>
          </span>
          <span style={{ paddingLeft: 5 }}>元</span>
          {isShow && <span>，优惠{getFieldValue('verifyFrequency') === 'multi' ? <span style={{color: '#f94'}}>总价</span> : '价'}</span>}
        </FormItem>
        {isShow &&
          <FormItem style={SUB_FORM_ITEM_STYLE}
            validateStatus={errors.changed ? 'error' : 'success'}
            help={errors.changed}
          >
            <span className="ant-input-wrapper">
              <input type="text" className="ant-input ant-input-lg"
                value={changedProps.value}
                onChange={(e) => {
                  let value = e.target.value || '';
                  value = value.trim();
                  if (value.charAt(0) === '.') value = '0' + value;
                  if (!isNaN(value) && !(value.indexOf('.') >= 0 && value.split('.')[1].length > 2)) {
                    changedProps.onChange(value);
                  }
                }}
                id={field.changed} disabled={priceDisable} style={{ imeMode: 'disabled', width: 70 }} placeholder={getFieldValue('verifyFrequency') === 'multi' ? '请输入' : null}/>
            </span>
            <span style={{ paddingLeft: 5 }}>元</span>
          </FormItem>}
        {!extra && (<div style={{ lineHeight: '16px', color: '#999', marginTop: 5 }}>
        {getFieldValue('verifyFrequency') === 'multi' ? (<p>总价：指商品单份价格 x 份数 <br/>
          优惠总价即为用户需付款金额，例：原总价330元，优惠总价<span style={{ color: '#f94' }}>280元</span>元，用户仅需付<span style={{ color: '#f94' }}>280元</span></p>) : (<p>优惠价即为用户需付款金额，例：原价10元，优惠价<span style={{ color: '#f94' }}>2元，</span>用户仅需付<span style={{ color: '#f94' }}>2元</span></p>)
        }</div>)
      }
      </FormItem>
    );
  }
}
