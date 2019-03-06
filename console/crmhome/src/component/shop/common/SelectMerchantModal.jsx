import React, {PropTypes} from 'react';
import {Modal, Form, Select, message} from 'antd';
import ajax from '../../../common/ajax';

const FormItem = Form.Item;

const SelectMerchantModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    pids: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
    batchTaskType: PropTypes.string,
  },

  onOk() {
    this.props.form.validateFieldsAndScroll(() => {
      ajax({
        url: '/shop/crm/pidChoose.json',
        method: 'get',
        data: { partnerId: this.props.form.getFieldValue('partnerId') },
      }).then((response) => {
        if (response.status === 'succeed') {
          this.props.onOk(this.props.batchTaskType);
        } else {
          throw new Error(response);
        }
      }).catch((response) => {
        message.error(response.resultMsg || '提交出错');
      });
    });
  },

  render() {
    const {getFieldError, getFieldProps} = this.props.form;
    const pids = this.props.pids || [];
    const options = pids.map((partner) => {
      return (<Select.Option value={partner.partnerId} key={partner.partnerId}>
        {partner.partnerId}({partner.logonId})
      </Select.Option>);
    });
    return (
      <Modal
        title="选择商户"
        onOk={this.onOk}
        onCancel={this.props.onCancel}
        okText="下一步"
        visible={this.props.visible}>
        <Form horizontal form={this.props.form}>
          <FormItem
            label="选择商户："
            required
            help={getFieldError('partnerId')}
            labelCol={{span: 6}}
            wrapperCol={{span: 10}}>
            <Select
              {...getFieldProps('partnerId', {rules: [{
                required: true,
                message: '请选择商户',
              }]})}
              placeholder="选择商户"
              disabled={!this.props.pids}>
              {options}
            </Select>
          </FormItem>
        </Form>
      </Modal>
    );
  },
});

export default Form.create()(SelectMerchantModal);
