import React, {PropTypes} from 'react';
import {Form, Button, Select, message} from 'antd';
import classnames from 'classnames';
import ajax from '../../../common/ajax';
import {formOption} from '../common/formOption';
import {remoteLog} from '../common/utils';

const FormItem = Form.Item;

const SelectMerchant = React.createClass({
  propTypes: {
    form: PropTypes.object,
    pids: PropTypes.array,
    onOk: PropTypes.func,
    visible: PropTypes.bool,
    defaultData: PropTypes.object,
  },

  componentWillMount() {
    this.props.form.setFieldsInitialValue(this.props.defaultData);
  },

  onOk() {
    remoteLog('SHOP_NEW_NEXT1');
    this.props.form.validateFieldsAndScroll((errors, values) => {
      ajax({
        url: '/shop/crm/pidChoose.json',
        method: 'get',
        data: { partnerId: this.props.form.getFieldValue('partnerId') },
      }).then((response) => {
        if (response.status === 'succeed') {
          this.props.onOk(errors, values);
        } else {
          message.error(response.resultMsg || '提交出错');
        }
      }).catch((response) => {
        message.error(response.resultMsg || '提交出错');
      });
    });
  },

  render() {
    const rootStyle = this.props.visible ? {} : {display: 'none'};
    const {getFieldError, getFieldProps, getFieldValue} = this.props.form;
    const options = this.props.pids.map((partner) => {
      return (<Select.Option value={partner.partnerId} key={partner.partnerId}>
        {partner.partnerId}({partner.logonId})
      </Select.Option>);
    });
    return (
      <div style={rootStyle}>
        <div style={{padding: '48px 0', minHeight: 200}}>
          <Form horizontal form={this.props.form}>
            <FormItem
              label="选择商户："
              validateStatus={
                classnames({
                  error: !!getFieldError('partnerId'),
                })}
              required
              help={getFieldError('partnerId')}
              labelCol={{span: 6}}
              wrapperCol={{span: 10}}>
              <Select
                {...getFieldProps('partnerId')}
                placeholder="选择商户"
                disabled={!this.props.pids}>
                {options}
              </Select>
            </FormItem>
          </Form>
        </div>
        <div style={{padding: '24px 0 48px 237px', margin: '0 -16px', borderTop: '1px solid #e4e4e4'}}>
          <Button type="primary" size="large" style={{marginRight: 12}} onClick={this.onOk} disabled={!getFieldValue('partnerId')}>下一步</Button>
        </div>
      </div>
    );
  },
});

export default Form.create(formOption)(SelectMerchant);
