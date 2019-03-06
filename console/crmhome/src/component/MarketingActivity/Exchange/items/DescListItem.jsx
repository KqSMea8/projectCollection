import React from 'react';
import { Form, Input } from 'antd';
import FormItemBase from './FormItemBase';
import { List } from 'immutable';
import classnames from 'classnames';

const FormItem = Form.Item;
const FIELD_NAME = 'descList';

class DescListItem extends FormItemBase {
  static displayName = 'exchange-desc-list';
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      currentValues: new List(this.initialValue),
      errorTip: null,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.initialData !== this.props.initialData) {
      this.setState({ currentValues: new List(this.initialValue) });
    }
  }
  onChange = (i, e) => {
    const tar = e.target;
    const index = i;
    this.setState({
      currentValues: this.state.currentValues.set(index, tar.value),
    }, this.updateFormValue);
  }

  static fieldName = FIELD_NAME;

  add = () => {
    this.setState({
      currentValues: this.state.currentValues.push(''),
    }, this.updateFormValue);
  }
  del = (i) => {
    this.setState({
      currentValues: this.state.currentValues.splice(i, 1),
    }, this.updateFormValue);
  }
  updateFormValue() {
    this.props.form.setFieldsValue({
      descList: this.state.currentValues.toJSON(),
    });
  }
  get initialValue() {
    return this.props.initialData && this.props.initialData[FIELD_NAME] || [''];
  }
  get renderRows() {
    const values = this.state.currentValues;
    return values.map((value, i) => (
      <div key={i} style={{ marginBottom: 10 }}>
        <Input ref={`input-ref-${i}`} value={value} onChange={this.onChange.bind(this, i)} style={{ width: '70%', marginRight: 10 }} />
        <span style={{ width: 40, padding: '0 3px', display: 'inline-block'}}>{ values.size >= 2 && <a onClick={this.del.bind(this, i)}>删除</a> }</span>
        <span style={{ width: 40, padding: '0 3px', display: 'inline-block'}}>{ values.size === i + 1 && <a onClick={this.add}>增加</a> }</span>
      </div>
    ));
  }
  render() {
    return (
      <FormItem {...this.itemLayout}
        label="使用须知"
        validateStatus={classnames({error: !!this.state.errorTip})}
        help={this.state.errorTip}
      >
        { this.renderRows }
      </FormItem>
    );
  }
}

export default DescListItem;
