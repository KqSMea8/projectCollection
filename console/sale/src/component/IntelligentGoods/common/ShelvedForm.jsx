import React, { PropTypes } from 'react';
import { Button, Form } from 'antd';
import classnames from 'classnames';
import PidSelect from '../../../common/PidSelect';

const FormItem = Form.Item;

const ShelvedForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    waitingShelveStatus: PropTypes.object,
    shelvedStatus: PropTypes.object,
    form: PropTypes.object,
  },

  componentDidMount() {
    if (this.props.formValue.partnerId && this.props.formValue.partnerName) {
      this.handleFormValueChange(this.props.formValue);
      this.search();
    }
  },

  componentDidUpdate(prevProps) {
    if (prevProps.formValue !== this.props.formValue) {
      this.handleFormValueChange(this.props.formValue);
      this.search();
    }
  },

  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((error) => {
      if (!error) {
        // 用户点击搜索修改url触发search
        const info = { ...{ partnerId: this.props.formValue.partnerId }, ...this.props.form.getFieldsValue() };
        window.location.hash = `/intelligentgoods/list/shelved?partnerId=${info.partnerId}&partnerName=${info.partnerName}`;
        // this.search();
      }
    });
  },

  search() {
    const info = { ...{ partnerId: this.props.formValue.partnerId }, ...this.props.form.getFieldsValue() };
    this.props.onSearch(info);
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  handleFormValueChange(value) {
    this.props.form.setFieldsValue({ 'partnerName': value.partnerName, 'partnerId': value.partnerId});
  },
  handlePidSelectChange(value) {
    const oldVal = this.props.form.getFieldValue('partnerIdVal');
    if (value && (oldVal !== value[1])) {
      this.props.form.setFieldsValue({
        partnerIdVal: value[1],
      });
    }
  },
  render() {
    const { getFieldError } = this.props.form;
    return (<div className="form_wrapper">
      <Form inline onSubmit={this.onSubmit}>
        <FormItem
          validateStatus={
            classnames({
              error: !!getFieldError('partnerId'),
            })}
          required
          label="选择商户：">
          <PidSelect form={this.props.form} onChange={this.handlePidSelectChange} />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">搜索</Button>
        </FormItem>
      </Form>
    </div>);
  },
});

export default Form.create()(ShelvedForm);
