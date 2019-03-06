import React, { Component, PropTypes } from 'react';
import { Modal, Select, message, Alert, Form } from 'antd';
import ajax from '@alipay/kb-ajax';
import { appendOwnerUrlIfDev } from '../../../common/utils';
const Option = Select.Option;

class AssignSupplierModal extends Component {
  static propTypes = {
    id: PropTypes.number,
    visible: PropTypes.bool,
    suppliers: PropTypes.array,
    onAssignOk: PropTypes.func,
    closeModal: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  state = {
    submitting: false,
  };

  handleCancel = () => {
    const { form, closeModal } = this.props;
    closeModal();
    form.resetFields();
  };

  handleOk = () => {
    const { validateFields, getFieldValue } = this.props.form;
    validateFields(err => {
      if (!err) {
        this.submit(getFieldValue('supplier'));
      }
    });
  };

  submit = sid => {
    const { id, suppliers, onAssignOk, form } = this.props;
    const supplier = suppliers.find( s => s.sid === sid);
    this.setState({
      submitting: true,
    });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: {
        mappingValue: 'kbasset.assignSupplier',
        id,
        targetId: supplier.sid,
        targetName: supplier.name
      },
      type: 'json',
    })
      .then( res => {
        this.setState({
          submitting: false,
        });
        if (res.status === 'succeed') {
          onAssignOk();
          form.resetFields();
        } else {
          message.error(res.resultMsg);
        }
      })
      .catch( () => {
        this.setState({
          submitting: false,
        });
        message.error('网络连接失败，请重试');
      });
  };

  render() {
    const { suppliers, visible } = this.props;
    const { submitting } = this.state;
    const { getFieldProps } = this.props.form;
    const supplierProps = getFieldProps('supplier', {
      rules: [
        {
          required: true,
          message: '请选择供应商'
        }
      ]
    });
    return (
      <Modal
        title="分配供应商"
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        confirmLoading={submitting}
      >
        <Alert message="分配之后不可更换，请谨慎操作。" type="warning" showIcon/>
        <Form>
          <Form.Item>
            <Select
              style={{width: 300}}
              placeholder="请选择供应商"
              {...supplierProps}
            >
              {suppliers.map(s => (
                <Option key={s.sid} value={s.sid} disabled={!s.enable}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}


export default Form.create({})(AssignSupplierModal);
