import React, {PropTypes} from 'react';
import {Form, Button} from 'antd';
import classnames from 'classnames';
import PidSelect from '../../../common/PidSelect';
import {formOption} from '../../../common/formOption';
import {remoteLog} from '../../../common/utils';

const FormItem = Form.Item;

const SelectMerchant = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onOk: PropTypes.func,
    visible: PropTypes.bool,
    defaultData: PropTypes.object,
  },

  componentWillMount() {
    this.props.form.setFieldsInitialValue(this.props.defaultData);
  },

  onOk() {
    remoteLog('SHOP_NEW_NEXT1');
    this.props.form.validateFieldsAndScroll(this.props.onOk);
  },

  render() {
    const rootStyle = this.props.visible ? {} : {display: 'none'};
    const {getFieldError} = this.props.form;
    return (
      <div style={rootStyle}>
        <div style={{padding: '48px 0', minHeight: 200}}>
          <Form horizontal>
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
              <PidSelect form={this.props.form}/>
            </FormItem>
          </Form>
        </div>
        <div style={{padding: '24px 0 48px 237px', margin: '0 -16px', borderTop: '1px solid #e4e4e4'}}>
          <Button type="primary" size="large" style={{marginRight: 12}} onClick={this.onOk}>下一步</Button>
        </div>
      </div>
    );
  },
});

export default Form.create(formOption)(SelectMerchant);
