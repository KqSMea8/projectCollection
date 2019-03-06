/**
 * 优惠力度
 * 每消费满 & 立减 & 最高优惠x元封顶
 */
import React, { PropTypes } from 'react';
import { Form, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import Decimal from 'decimal.js';

const FormItem = Form.Item;
const Option = Select.Option;
const SUB_FORM_ITEM_STYLE = { display: 'inline-block', verticalAlign: 'top'};
const INLINE_BLOCK = { display: 'inline-block', verticalAlign: 'top', marginRight: 5, marginLeft: 5 };
const INLINE_BLOCK_WID = {...INLINE_BLOCK, width: 90};
import './Reduce.less';

function roundUpTimes(e, tar) {
  const trimedE = e.trim();
  if (!tar) {
    return trimedE;
  }
  if (tar === '0') {
    return '0';
  }
  if (!trimedE) {
    return trimedE;
  }

  const times = new Decimal(trimedE).div(tar).floor().toString();
  if (times === '0') {
    return trimedE;
  }
  if (times === '1') {
    return new Decimal(tar).mul('2').toString();
  }
  return new Decimal(tar).mul(times).toString();
}

function isRoundUpTimes(e, tar) {
  if (!e) {
    return false;
  }
  const trimedE = e.trim();
  if (!trimedE) {
    return false;
  }
  const res = new Decimal(trimedE).div(tar);
  const resCel = res.ceil();
  const resString = res.toString();
  if (resString === '0' || resString === '1') {
    return false;
  }
  if (res.toString() === resCel.toString()) {
    return true;
  }
  return false;
}

export default class Reduce extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    rules: PropTypes.shape({
      upTo: PropTypes.array,
      reduce: PropTypes.array,
    }),
    defaultValue: PropTypes.shape({
      upTo: PropTypes.string,
      reduce: PropTypes.string,
    }),
  }
  static defaultProps = Object.assign({}, BaseFormComponent.defaultProps, {
    defaultValue: {
      upTo: undefined,
      reduce: undefined,
    },
    upToDisable: false,
    reduceDisable: false,
    rules: {
      upTo: [],
      reduce: [],
    },
  });

  state = {
    ceilingValVisible: false,
  }

  componentWillMount() {
    const { getFieldValue } = this.form;
    const { field } = this.props;
    this.setState({
      ceilingValVisible: getFieldValue(field.ceilingType) === 'specific',
    });
  }

  upToIsLargerThenReduceRule = (r, v, c) => {
    const { getFieldsValue } = this.form;
    const { field } = this.props;
    const values = getFieldsValue([field.upTo, field.reduce]);
    if (+values[field.upTo] <= +values[field.reduce]) {
      c('立减金额必须低于消费金额');
      return;
    }
    c();
  }

  ceilingValIsTimesRule = (r, v, c) => {
    const { getFieldsValue } = this.form;
    const { field } = this.props;
    const values = getFieldsValue([field.ceilingVal, field.reduce]);
    if (v && v.trim() && Number(v.trim()) < Number(values[field.reduce])) {
      c('最高优惠必须大于等于立减金额');
      return;
    }
    if (!isRoundUpTimes(v, values[field.reduce])) {
      c('最高优惠必须是立减金额大于等于2的整数倍');
      return;
    }
    if (v && v.trim() && Number(v.trim()) > 49999) {
      c('最高优惠不能超过49999元');
      return;
    }
    c();
  }

  handleSelectChange(e) {
    if (e === 'notLimit') {
      this.setState({
        ceilingValVisible: false,
      });
    } else {
      this.setState({
        ceilingValVisible: true,
      });
    }
  }

  get fieldPropsUpTo() {
    const { getFieldProps } = this.form;
    const { defaultValue, field, rules } = this.props;
    return getFieldProps(field.upTo, {
      initialValue: defaultValue.upTo,
      rules: [...rules.upTo, this.upToIsLargerThenReduceRule],
    });
  }

  get fieldPropsReduce() {
    const { getFieldProps, validateFields, getFieldValue } = this.form;
    const { defaultValue, field, rules } = this.props;
    return getFieldProps(field.reduce, {
      initialValue: defaultValue.reduce,
      rules: [...rules.reduce, (r, v, cb) => {
        if (getFieldValue(field.upTo) && getFieldValue(field.reduce)) {
          validateFields([field.upTo], { force: true });
          cb();
          return;
        }
        cb();
      }],
    });
  }

  get fieldPropsCeilingType() {
    const { getFieldProps } = this.form;
    const { defaultValue, field } = this.props;
    return getFieldProps(field.ceilingType, {
      initialValue: defaultValue.ceilingType || 'specific',
    });
  }

  get fieldPropsCeilingVal() {
    const { getFieldProps } = this.form;
    const { defaultValue, field, rules } = this.props;
    return getFieldProps(field.ceilingVal, {
      initialValue: defaultValue.ceilingVal,
      rules: [...rules.ceilingVal, this.ceilingValIsTimesRule],
      // normalize: (v) => {
      //   return roundUpTimes(v, getFieldValue(field.reduce) || 1);
      // },
    });
  }

  render() {
    const { label, required, labelCol, wrapperCol, field, disabled } = this.props;
    const {getFieldValue} = this.form;
    const {ceilingValVisible} = this.state;
    const upToProps = this.fieldPropsUpTo;
    const reduceProps = this.fieldPropsReduce;
    const ceilingType = this.fieldPropsCeilingType;
    const errors = {
      upTo: this.form.getFieldError(field.upTo),
      reduce: this.form.getFieldError(field.reduce),
      ceilingVal: this.form.getFieldError(field.ceilingVal),
    };
    let ceilingVal;
    if (ceilingValVisible) {
      ceilingVal = this.fieldPropsCeilingVal;
    }
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <div style={{height: 50}}>
        <span style={INLINE_BLOCK}>每消费满</span>
        <FormItem style={SUB_FORM_ITEM_STYLE}
          validateStatus={errors.upTo ? 'error' : 'success'}
          help={errors.upTo && errors.upTo.length && errors.upTo[0]}
        >
          <span className="ant-input-wrapper">
            <input type="text" className="ant-input ant-input-lg"
              style={INLINE_BLOCK}
              value={upToProps.value}
              onChange={(e) => {
                let value = e.target.value || '';
                if (value.charAt(0) === '.') value = '0' + value;
                if (!isNaN(value) && !(value.indexOf('.') >= 0 && value.split('.')[1].length > 2)) {
                  upToProps.onChange(value);
                }
              }}
              id={field.upTo} disabled={disabled.upTo} style={{ imeMode: 'disabled', width: 65 }} />
          </span>
          <span style={{ paddingLeft: 5, paddingRight: 5 }}>元，立减</span>
        </FormItem>
        <FormItem style={SUB_FORM_ITEM_STYLE}
            validateStatus={errors.reduce ? 'error' : 'success'}
            help={errors.reduce && errors.reduce.length && errors.reduce[0]}
          >
            <span className="ant-input-wrapper">
              <input type="text" className="ant-input ant-input-lg"
                value={reduceProps.value}
                style={INLINE_BLOCK}
                onChange={(e) => {
                  let value = e.target.value || '';
                  if (value.charAt(0) === '.') value = '0' + value;
                  if (!isNaN(value) && !(value.indexOf('.') >= 0 && value.split('.')[1].length > 2)) {
                    reduceProps.onChange(value);
                  }
                }}
                id={field.reduce} disabled={disabled.reduce} style={{ imeMode: 'disabled', width: 65 }} />
            </span>
            <span style={{ paddingLeft: 5 }}>元</span>
          </FormItem>
          </div>
          <div className="oneclickmove-reduce">
            <span style={INLINE_BLOCK}>最高优惠</span>
             <FormItem style={SUB_FORM_ITEM_STYLE}
              validateStatus={errors.ceilingVal ? 'error' : 'success'}
              help={errors.ceilingVal && errors.ceilingVal.length && errors.ceilingVal[0]}
            >
            <Select defaultValue="notLimit" style={INLINE_BLOCK_WID}
            value={ceilingType.value}
            onChange={(e) => {
              this.handleSelectChange(e);
              ceilingType.onChange(e);
            }}>
              <Option value="specific">指定金额</Option>
              <Option value="notLimit">不限制</Option>
            </Select>
            {ceilingValVisible ?
            <span><input type="text" className="ant-input ant-input-lg"
              style={INLINE_BLOCK}
              value={ceilingVal.value}
              onBlur={(e) => {
                let value = e.target.value || '';
                if (value.charAt(0) === '.') value = '0' + value;
                if (!isNaN(value) && !(value.indexOf('.') >= 0 && value.split('.')[1].length > 2)) {
                  ceilingVal.onChange(roundUpTimes(value, getFieldValue(field.reduce) || 1));
                }
              }}
              onChange={(e) => {
                let value = e.target.value || '';
                if (value.charAt(0) === '.') value = '0' + value;
                if (!isNaN(value) && !(value.indexOf('.') >= 0 && value.split('.')[1].length > 2)) {
                  ceilingVal.onChange(value);
                }
              }}
              id={field.ceilingVal} disabled={disabled.ceilingVal} style={{ imeMode: 'disabled', width: 65 }} />
              <span style={{ paddingLeft: 5 }}>元封顶</span></span> : null }
            </FormItem>
          </div>
        <p style={{ lineHeight: '16px', color: '#999', marginTop: 5 }}>
          消费金额必须大于立减金额，最高优惠金额必须不小于立减金额<br/>例：设置<span style={{ color: '#f94' }}>每消费满10元，立减5元，最高优惠10元</span>后，用户消费满50元，用户可享受最高优惠10元，实际仅需付<span style={{ color: '#f94' }}>40元</span>
        </p>
      </FormItem>
    );
  }
}
