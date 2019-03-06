import React, {PropTypes} from 'react';
import classnames from 'classnames';
import { Form, Button, Input, message} from 'antd';
import PidSelect from '../../../common/PidSelect';
import ajax from 'Utility/ajax';


const FormItem = Form.Item;

const WhiteList = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  getInitialState() {
    return {
      isTxtDisabled: true,
      isSaveBtnDisabled: true,
    };
  },
  handlePidSelectChange(value) {
    if (value) {
      const merchant = {op_merchant_id: value[1]};
      this.props.form.setFieldsValue(merchant);
      this.fetchHistoryWhiteList(merchant);
    }
  },
  fetchHistoryWhiteList(params = {}) {
    const url = window.APP.crmhomeUrl + '/goods/koubei/testList.json';
    ajax({
      url: url,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result) {
          this.props.form.setFieldsValue({
            'userIds': result.historyWhiteIds.replace(/,/g, '\n'),
          });
          this.props.form.setFieldsValue({'historyWhiteId': result.historyWhiteId});
          this.setState({
            isTxtDisabled: false,
            isSaveBtnDisabled: false,
          });
        }
      },
    });
  },
  submit() {
    const params = {...this.props.form.getFieldsValue()};
    params.userIds = params.userIds.replace(/(\n)|(,+)|(，)/g, ',').replace(/(^\s+)|(\s+$)/g, '');
    delete params.partnerId;
    delete params.partnerName;
    const url = window.APP.crmhomeUrl + '/goods/itempromo/testList.json.kb';
    ajax({
      url: url,
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }

        if (result.result === 'succeed') {
          this.fetchHistoryWhiteList({'op_merchant_id': this.props.form.getFieldValue('op_merchant_id')});
          message.success('保存成功', 3);
        } else if (result.result === 'failed') {
          message.error('保存失败', 3);
        } else if (result.result === 'accountError') {
          message.warn('您输入的支付宝账号有误，请检查后重试', 3);
        }
      },
    });
  },
  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({
      isTxtDisabled: true,
      isSaveBtnDisabled: true,
    });
  },
  render() {
    const {getFieldError, getFieldProps} = this.props.form;
    getFieldProps('op_merchant_id');
    getFieldProps('historyWhiteId');
    return (
      <div>
        <div className="app-detail-header">
          测试优惠券白名单
        </div>
        <div className="app-detail-content-padding">
          <Form horizontal>
            <FormItem
                  labelCol={{span: 2}}
                  wrapperCol={{span: 8}}
                  validateStatus={
                  classnames({
                    error: !!getFieldError('partnerId'),
                  })}
                  required
                  label="选择商户：">
                  <PidSelect form={this.props.form} onChange={this.handlePidSelectChange}/>
            </FormItem>
            <div style={{marginBottom: 24}}>若输入多个支付宝测试账户,请按<span style={{color: '#f90'}}>回车键</span>进行间隔</div>
            <FormItem
              label=""
              wrapperCol={{span: 22}}>
              <Input type="textarea" rows="20" {...getFieldProps('userIds', {initialValue: '请输入测试支付宝账户，示例如下：\naa@alipay.net\n13812345678'})} disabled = {this.state.isTxtDisabled} />
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.submit} disabled = {this.state.isSaveBtnDisabled}>保存</Button>
              <Button style={{ marginLeft: 10 }} onClick={this.reset}>取消</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  },
});

export default Form.create()(WhiteList);
