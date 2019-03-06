import React, { PropTypes } from 'react';
import { Select, Button, Form } from 'antd';
import classnames from 'classnames';
import PidSelect from '../../../common/PidSelect';
// import permission from '@alipay/kb-framework/framework/permission';

const Option = Select.Option;
const FormItem = Form.Item;

class WaitingPutawayForm extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    name: PropTypes.string,
    partnerId: PropTypes.string,
    status: PropTypes.string,
  }
  componentDidMount() {
    this.props.form.setFieldsValue({
      partnerId: this.props.partnerId,
      partnerName: this.props.name,
      status: this.props.status || '',
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.name !== this.props.name || prevProps.status !== this.props.status) {
      this.props.form.setFieldsValue({
        partnerId: this.props.partnerId,
        partnerName: this.props.name,
        status: this.props.status || '',
      });
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!values.partnerId) return;
      this.search();
    });
  }

  search = () => {
    const { getFieldValue } = this.props.form;
    const partnerId = getFieldValue('partnerId');
    const name = getFieldValue('partnerName');
    const status = getFieldValue('status');
    setTimeout(
      // 避免 iframe window.location 污染
      () => {location.hash = `#/intelligentcatering/list/putaway?partnerId=${partnerId}&name=${encodeURIComponent(name)}&status=${status}`;}
    );
  }
  reset = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  }
  render() {
    window._f = this.props.form;
    const { status, name: partnerName, partnerId, getFieldProps, getFieldError, setFieldsInitialValue } = this.props.form;
    setFieldsInitialValue({
      partnerId,
      partnerName,
      status
    });
    const statusOptions = this.props.statusOptions.map(d => <Option key={d.value}>{d.text}</Option>);
    return (<div className="form_wrapper">
      <Form inline onSubmit={this.onSubmit}>
        <FormItem
          validateStatus={
            classnames({
              error: !!getFieldError('partnerId'),
            })}
          required
          label="选择商户：">
          <PidSelect form={this.props.form} required={false}/>
        </FormItem>
        <FormItem label="活动状态:">
          <Select
            style={{ width: '150px' }}
            {...getFieldProps('status', {
              initialValue: '',
            }) }>
            <Option value="">全部状态</Option>
            {statusOptions}
          </Select>
        </FormItem>
        <FormItem style={{float: 'right'}}>
          <Button type="primary" htmlType="submit" style={{marginRight: 10}}>搜索</Button>
          <Button type="ghost" onClick={this.reset}>清除</Button>
        </FormItem>
      </Form>
    </div>);
  }
}

export default Form.create()(WaitingPutawayForm);
