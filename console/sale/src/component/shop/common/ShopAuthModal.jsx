import React, {PropTypes} from 'react';
import {Modal, Form, Checkbox} from 'antd';
import classnames from 'classnames';
import UserSelect from '../../../common/UserSelect';

const FormItem = Form.Item;

const ShopAuthModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    shopName: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  },

  onOK() {
    this.props.form.validateFields((error, values)=> {
      if (!error) {
        this.props.onOk(values);
      }
    });
  },

  render() {
    const {getFieldProps, getFieldError} = this.props.form;

    return (<Modal title="门店授权" visible onOk={this.onOK} onCancel={this.props.onCancel}>
      <Form horizontal>
        <FormItem
          label="目标门店："
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
          help>
          {this.props.shopName}
        </FormItem>
        <FormItem
          label="员工名称："
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
          validateStatus={
            classnames({
              error: !!getFieldError('user'),
            })}
          required
          help={getFieldError('user') || '默认赋予数据查询'}>
          <UserSelect searchScope="global" style={{width: 300}}
            {...getFieldProps('user', {
              rules: [{required: true, type: 'object', message: '此处必填'}],
            })}/>
        </FormItem>
        <div style={{marginLeft: 81}}>
          <label><Checkbox {...getFieldProps('authTypes')}>赋予代运营权限</Checkbox></label>
        </div>
      </Form>
    </Modal>);
  },
});

export default Form.create()(ShopAuthModal);
