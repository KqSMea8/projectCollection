import React from 'react';
import { Form, Modal } from 'antd';
import BaseFormComponent from '../BaseFormComponent';
import CheckRow from './CheckRow';
import './index.less';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
export default class GoodsProperty extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: React.PropTypes.string.isRequired,
  }
  static defaultProps = {
    rules: [],
    optionsArr: [],
  }
  state = {
    visible: false,
  }
  onClick = () => {
    this.setState({ visible: true });
    this.form.setFields({
      [this.props.field]: {
        value: '',
      },
    });
  }
  onChange = (field, value, custom) => {
    const { setFieldsValue } = this.form;
    setFieldsValue({
      [field]: {
        value,
        custom,
      },
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  handleOk = () => {
    const { getFieldValue, setFields } = this.form;
    const { optionsArr } = this.props;
    let isError = false;
    optionsArr.map(item => {
      const val = getFieldValue(item.field) || {};
      if (item.max === 1) {
        if (item.required && !val.value) {
          isError = true;
          setFields({
            [item.field]: {
              value: {},
              errors: [new Error(`请选择${item.label}`)],
            },
          });
        }
        if (val.value === 'custom' && !val.custom) {
          isError = true;
          setFields({
            [item.field]: {
              value: { value: 'custom' },
              errors: [new Error('请输入自定义')],
            },
          });
        }
      }
      if (item.max > 1) {
        if (!item.custom && item.required && (!val.value || !val.value.length)) {
          isError = true;
          setFields({
            [item.field]: {
              value: {},
              errors: [new Error(`请选择${item.label}`)],
            },
          });
        }
        if (item.custom && item.required && (!val.value || !val.value.length) && (!val.custom || !val.custom.join(''))) {
          isError = true;
          setFields({
            [item.field]: {
              value: {},
              errors: [new Error(`请选择${item.label}或输入自定义`)],
            },
          });
        }
        const valItem = val.value && val.value.length || 0;
        const customItem = val.custom && val.custom.length || 0;
        if (valItem + customItem > item.max) {
          isError = true;
          setFields({
            [item.field]: {
              value: {
                value: val.value,
                custom: val.custom,
              },
              errors: [new Error(`最多选择${item.max}项`)],
            },
          });
        }
      }
    });
    if (!isError) {
      this.setState({ visible: false });
    }
  }
  render() {
    const { label, required, labelCol, wrapperCol, optionsArr, field } = this.props;
    const { getFieldValue, getFieldProps } = this.form;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        style={{ paddingBottom: 25 }}
      >
        <FormItem>
          <a onClick={this.onClick}>编辑属性</a>
          <div className="property-ul" {...getFieldProps(field)}>
            <ul>
              {optionsArr.map((item, i) => {
                let value = '';
                const val = getFieldValue(item.field) || {};
                if (item.max === 1 && val && val.value) {
                  if (val.value !== 'custom') {
                    value = item.options.filter(r => r.propertyValueId === val.value)[0].propertyValueName;
                  } else {
                    value = val.custom;
                  }
                }
                if (item.max > 1) {
                  if (val && val.value && val.value.length) {
                    const objValues = val.value.map(v => item.options.filter(r => r.propertyValueId === v)[0].propertyValueName);
                    value = objValues.join('、');
                  }
                  const vals = val.custom;
                  if (vals && vals.filter(r => !!r).length) {
                    if (value) {
                      value = `${value}、${vals.join('、')}`;
                    } else {
                      value = vals.join('、');
                    }
                  }
                }
                return (<li key={i}>{`${item.label}：${value || '暂无'}`}</li>);
              })}
            </ul>
          </div>
        </FormItem>
        <Modal title="编辑属性" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          width="650"
          style={window.top !== window ? { top: window.top.scrollY } : undefined}
        >
          <div className="goods-property">
            {/* {optionsArr.map((item, i) => <CheckRow key={i} {...item} />)} */}
            {optionsArr.map((item, i) => {
              const checkValue = getFieldValue(item.field) || {};
              if (item.max > 1 && item.custom && (!checkValue.custom || !checkValue.custom.length)) {
                checkValue.custom = [''];
              }
              return (
                <FormItem key={i}
                  {...formLayout}
                  label={item.label}
                  required={item.required}
                >
                  <CheckRow {...item} {...getFieldProps(item.field)} onChange={this.onChange} checkValue={checkValue} />
                </FormItem>
              );
            })}
          </div>
        </Modal>
      </FormItem>
    );
  }
}
