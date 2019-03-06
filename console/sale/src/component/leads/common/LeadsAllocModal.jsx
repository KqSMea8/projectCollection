import React, {PropTypes} from 'react';
import {Modal, Form, Row, Col, Select} from 'antd';
const Option = Select.Option;
import ajax from 'Utility/ajax';
const FormItem = Form.Item;
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
import ProviderSelect from '../../../common/ProviderSelect';

const LeadsAllocModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  },

  onOK() {
    this.props.form.validateFields((error, v)=> {
      if (!error) {
        const values = {...v};
        this.props.onOk(values);
      }
    });
  },

  onCancel() {
    this.props.onCancel();
  },

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const form = (<Form horizontal onSubmit={this.handleSubmit}>
      <FormItem
        label="分配给："
        labelCol={{span: 4}}
        wrapperCol={{span: 18}}>
        <Row>
          {window.APP.userType !== 'ALIPAY' ?
          <Col span="6">
            <Select style={{width: 120}} {...getFieldProps('userType', {
              initialValue: 'BUC',
            })}>
              <Option value="BUC">内部小二</Option>
              <Option value="ALIPAY">服务商</Option>
              <Option value="YUNZONG">云纵城市经理</Option>
            </Select>
          </Col> : null }

          {window.APP.userType !== 'ALIPAY' ?
          <Col span="15" offset="3">
            <FormItem>
              {
                getFieldValue('userType') === 'BUC' ?
                  <BuserviceUserSelect ajax={ajax}
                    notFoundContent=""
                    channel="inner_user_channels"
                    searchScope="global"
                    scopeTarget={window.APP.jobPath}
                    {...getFieldProps('bucUser', {
                      rules: [{required: true, type: 'object'}],
                    })}
                   buserviceUrl={window.APP.buserviceUrl}
                   style={{width: '100%'}}/> :
                   <ProviderSelect form={this.props.form} {...getFieldProps('alipayUser', {
                     rules: [{required: true, type: 'object'}],
                   })} userType={getFieldValue('userType')} />
              }
            </FormItem>
          </Col> : <Col span="20" offset="1">
              <FormItem>
                    <BuserviceUserSelect ajax={ajax}
                      notFoundContent=""
                      channel="outter_user_channels"
                      searchScope={window.APP.jobPath ? 'job_scope' : 'global'}
                      scopeTarget={window.APP.jobPath}
                      {...getFieldProps('bucUser', {
                        rules: [{required: true, type: 'object'}],
                      })}
                     buserviceUrl={window.APP.buserviceUrl}
                     style={{width: '100%'}}/>
              </FormItem>
            </Col> }
        </Row>
      </FormItem>
    </Form>);
    return (<Modal title="Leads 分配" visible onOk={this.onOK} onCancel={this.onCancel}>
      {form}
    </Modal>);
  },
});

export default Form.create()(LeadsAllocModal);
