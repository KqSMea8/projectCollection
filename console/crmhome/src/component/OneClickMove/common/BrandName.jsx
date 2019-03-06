import React, { PropTypes } from 'react';
import { Input, Select, Form } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import ajax from '../../../common/ajax';
const Option = Select.Option;
const FormItem = Form.Item;

export default class BrandName extends BaseFormComponent {
  static propTypes = {
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    rules: [],
  }

  constructor(props, ctx) {
    super(props, ctx);
    this.form = ctx.form;
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    const url = '/goods/itempromo/queryShopName.json';
    ajax({
      url: url,
      method: 'POST',
      type: 'json',
      success: (res) => {
        const list = res && res.shopNames ? res.shopNames : [];
        list.push('自定义');
        this.setState({
          list,
        });
      },
      error: () => {
        this.setState({
          list: ['自定义'],
        });
      },
    });
  }

  onSelectChange = (val) => {
    this.onChange(val);
    this.setFormValue(val);
  }

  onInputChange = (e) => {
    this.setState({
      value: e.target.value,
    });

    this.onChange(e.target.value);
    this.setFormValue(e.target.value);
  }

  onChange = (val) => {
    const realVal = val === '自定义' ? '' : val;
    this.setFormValue(realVal);
  }

  setFormValue = (value) => {
    const { field } = this.props;
    const { setFieldsValue, validateFields } = this.form;
    setFieldsValue({
      [field]: value,
    });
    validateFields([field]);
  }

  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field, defaultValue } = this.props;
    const rules = [...this.props.rules];
    if (this.props.required) {
      rules.push({ required: true, type: 'string', message: '请填写品牌名' });
    }
    return getFieldProps(field, {
      initialValue: defaultValue,
      rules,
    });
  }

  render() {
    const { label, required, labelCol, wrapperCol, extra } = this.props;
    const { list } = this.state;
    const {getFieldProps, getFieldValue, getFieldError} = this.form;
    const { placeholder, field, disabled, rules } = this.props;
    const value = getFieldValue(field);

    let selectVal = '';
    let inputVal = '';

    if (list.indexOf(value) >= 0 && value !== '自定义') {
      selectVal = value;
    } else {
      selectVal = '自定义';
      inputVal = value === '自定义' ? '' : value;
    }

    return (
      <FormItem
        label={label}
        extra={extra}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        validateStatus={!!getFieldError(field) ? 'error' : 'success'}
        help={getFieldError(field)}
      >
        <input type="hidden" {...this.fieldProps} />
        <Select style={{ width: 150 }}
          placeholder="请选择"
          value={selectVal}
          onChange={this.onSelectChange}
          disabled={disabled}
          size="large"
        >
          {list.map((item, index) => <Option key={item + index} value={item}>{item}</Option>)}
        </Select>
        {
          selectVal === '自定义' &&
          <div style={{display: 'inline-block', verticalAlign: 'bottom', marginLeft: 10}}>
            <Input size="large" style={{width: 180}} placeholder={placeholder || '请输入品牌名称，40 字以内'}
              value={inputVal} disabled={disabled}
              {...getFieldProps(field + '_input', {
                initialValue: inputVal,
                onChange: this.onInputChange,
                rules,
              })}
            />
          </div>
        }
      </FormItem>
    );
  }
}
