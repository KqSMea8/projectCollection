import React, { Component } from 'react';
import { Form, Radio, Checkbox, Input, Icon } from 'antd';
import './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const SUB_FORM_ITEM_STYLE = { display: 'table-cell', verticalAlign: 'top', paddingLeft: 8 };
const TABLE_CELL = { display: 'table-cell', paddingTop: 10 };

export default class CheckRow extends Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }
  static defaultProps = {
    // rules: [],
    // optionsArr: [],
  }
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checkValue.custom && props.checkValue.custom[0],
    };
  }
  changeRadiu = (e) => {
    const value = e.target.value;
    const { field } = this.props;
    this.props.onChange(field, value);
  }
  changeCustom = (e) => {
    const custom = e.target.value;
    const { field, checkValue, customizeNameLength } = this.props;
    if (customizeNameLength && custom.length > customizeNameLength) return;
    this.props.onChange(field, checkValue.value, custom);
  }
  changeCheckbox = (checkedValues) => {
    const { field, checkValue } = this.props;
    this.props.onChange(field, checkedValues, checkValue.custom);
  }
  changeChecked = (e) => {
    const { field, checkValue } = this.props;
    this.setState({ checked: e.target.checked });
    if (!e.target.checked) {
      this.props.onChange(field, checkValue.value, ['']);
    }
  }
  changeCheckboxCustom = (i) => (e) => {
    const { customizeNameLength, field, checkValue } = this.props;
    const custom = checkValue.custom || [''];
    if (customizeNameLength && e.target.value.length > customizeNameLength) return;
    custom[i] = e.target.value;
    this.props.onChange(field, checkValue.value, custom);
  }
  deleteCol = (i) => () => {
    const { field, checkValue } = this.props;
    let { custom } = checkValue;
    if (custom.length > 1) {
      custom.splice(i, 1);
    } else {
      custom = [''];
    }
    this.props.onChange(field, checkValue.value, custom);
  }
  addCol = () => {
    const { field, checkValue } = this.props;
    const { custom } = checkValue;
    custom.push('');
    this.props.onChange(field, checkValue.value, custom);
  }
  renderCustom = () => {
    const { max, customizeNameLength, checkValue } = this.props;
    const { checked } = this.state;
    let placeholder = '请输入';
    if (customizeNameLength) {
      placeholder = `限${customizeNameLength}个字`;
    }
    return (<FormItem style={{ display: 'table-cell' }}>
      <Checkbox style={{ display: 'table-cell' }} checked={checked} onChange={this.changeChecked}>自定义</Checkbox>
      {(checkValue.custom || ['']).map((item, index) => {
        return (
          <FormItem style={{ display: 'table-cell', paddingRight: 10 }} key={index} className="check-box-custom">
            <Input placeholder={placeholder} disabled={!checked} className="custom-input" value={item} onChange={this.changeCheckboxCustom(index)} />
            {checked && <Icon type="minus-circle" className="icon-circle" onClick={this.deleteCol(index)} />}
          </FormItem>
        );
      })}
      {checkValue.custom.length < max && checked && <Icon type="plus-circle" className="icon-plus-circle" onClick={this.addCol} />}
    </FormItem>);
  }
  renderItem = () => {
    const { options, checkValue, custom, max, customizeNameLength } = this.props;
    if (max === 1) {
      let placeholder = '请输入';
      if (customizeNameLength) {
        placeholder = `限${customizeNameLength}个字`;
      }
      const ops = options.map((item, key) => <Radio key={key} value={item.propertyValueId}>{item.propertyValueName}</Radio>);
      if (custom) {
        ops.push(<br />);
        ops.push(
          <Radio value="custom"><span style={TABLE_CELL}>自定义</span>
            <FormItem style={SUB_FORM_ITEM_STYLE}>
              <Input placeholder={placeholder} disabled={checkValue.value !== 'custom'} className="custom-input" value={checkValue.custom} onChange={this.changeCustom} />
            </FormItem>
          </Radio>
        );
      }
      return (
        <RadioGroup value={checkValue.value} onChange={this.changeRadiu}>{ops}</RadioGroup>
      );
    }
    const plainOptions = options.map(item => {
      const val = {
        label: item.propertyValueName,
        value: item.propertyValueId,
      };
      return val;
    });
    return (
      <FormItem style={{ display: 'table-cell' }}>
        <CheckboxGroup options={plainOptions} value={checkValue.value} onChange={this.changeCheckbox} />
        {custom && this.renderCustom()}
      </FormItem>
    );
  }
  render() {
    const { options, checkValue, custom, max, customizeNameLength } = this.props;
    if (max === 1) {
      let placeholder = '请输入';
      if (customizeNameLength) {
        placeholder = `限${customizeNameLength}个字`;
      }
      const ops = options.map((item, key) => <Radio key={key} value={item.propertyValueId}>{item.propertyValueName}</Radio>);
      if (custom) {
        ops.push(<br />);
        ops.push(
          <Radio value="custom"><span style={TABLE_CELL}>自定义</span>
            <FormItem style={SUB_FORM_ITEM_STYLE}>
              <Input placeholder={placeholder} disabled={checkValue.value !== 'custom'} className="custom-input" value={checkValue.custom} onChange={this.changeCustom} />
            </FormItem>
          </Radio>
        );
      }
      return (
        <RadioGroup value={checkValue.value} onChange={this.changeRadiu}>{ops}</RadioGroup>
      );
    }
    const plainOptions = options.map(item => {
      const val = {
        label: item.propertyValueName,
        value: item.propertyValueId,
      };
      return val;
    });
    return (
      <FormItem style={{ display: 'table-cell' }}>
        <CheckboxGroup options={plainOptions} value={checkValue.value} onChange={this.changeCheckbox} />
        {custom && this.renderCustom()}
      </FormItem>
    );
  }
}
