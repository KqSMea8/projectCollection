import React, { PropTypes } from 'react';
import { Modal, Form, InputNumber, Spin, Button } from 'antd';
import ajax from 'Utility/ajax';
import classnames from 'classnames';
import { ErrorMsg } from './ErrorMsg';

const createForm = Form.create;
const FormItem = Form.Item;

const FundsRechargeModal = React.createClass({
  propTypes: {
    item: PropTypes.object,
    visible: PropTypes.bool,
    onAction: PropTypes.func,
  },

  getInitialState() {
    return {
      loading: false,
      securityLoading: true,
    };
  },

  componentDidMount() {
    this.fetchSecurity();
  },

  fetchSecurity() {
    ajax({
      url: '/sale/capitalpool/getSecurityPolicy.json',
      method: 'post',
      data: {},
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            securityId: res.data.securityId,
            securityCheckUrl: res.data.url,
          });
        }
      },
      error: () => {

      },
    });
  },

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        ajax({
          url: '/sale/capitalpool/recharge.json',
          method: 'post',
          data: {
            poolId: this.props.item.poolId,
            principalId: this.props.item.principalId,
            debitAccount: this.props.user.userId,
            rechargeAmount: values.rechargeAmount,
            securityId: this.state.securityId,
          },
          type: 'json',
          success: (res) => {
            if (res.status === 'succeed') {
              this.props.onAction('message', 'reload', {
                status: 'success',
                title: '充值成功',
                content: '充值金额已从您的充值账户中扣除。',
              });
            }
          },
          error: ({resultCode, resultMsg}) => {
            const errMsg = ErrorMsg[resultCode] || resultMsg || '充值失败，请稍候再试';
            this.props.onAction('message', 'show', {
              status: 'fail',
              title: errMsg,
              content: '充值金额将不会从您的充值账户中扣除。',
            });
          },
        });
      } else {
        this.fetchSecurity();
      }
    });
  },

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { securityCheckUrl } = this.state;
    const item = this.props.item || {};
    const { user } = this.props;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };

    return (
      <div>
        <Modal title="充值" visible={this.props.visible}
          onCancel={() => {this.props.onAction('recharge', 'hide');}}
          footer={null}
          maskClosable={false}
        >
          <Form horizontal form={this.props.form}>
            <FormItem
              {...formItemLayout}
              label="资金池名称："
              required
            >
              <p className="ant-form-text">{item.poolName}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资金池有效期："
              required
            >
              <p className="ant-form-text">{item.startTime} ~ {item.endTime}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="充值支付宝账户："
              required
            >
              <p className="ant-form-text" id="debitAccount" name="debitAccount">{`${user.realName || ''}（${user.logonId || ''}）`}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="充值金额："
              required
              help={getFieldError('rechargeAmount')}
              extra={<p className="hint_tip">支持两位小数</p>}
              validateStatus={
                classnames({
                  error: !!getFieldError('rechargeAmount'),
                })
              }
            >
              <InputNumber {...getFieldProps('rechargeAmount', {
                rules: [{
                  required: true, type: 'number', message: '此处必填',
                }],
              })} type="text" autoComplete="off" style={{width: 200}} placeholder="请输入充值金额" min={0.01} max={999999999.99} step="0.01"/>
              <span>&nbsp;&nbsp;元</span>
            </FormItem>
            <div style={{'marginLeft': '-16px'}}>
              <Spin spining={this.state.securityLoading}>
                <iframe src={securityCheckUrl} frameBorder="0" width="100%" onLoad={() => {this.setState({securityLoading: false});}}></iframe>
              </Spin>
            </div>
            <Button style={{display: 'none'}} id="formSubmit" key="submit" type="primary" size="large" onClick={this.handleSubmit}>
              立即充值
            </Button>
          </Form>
        </Modal>
      </div>
    );
  },

});

export default createForm()(FundsRechargeModal);
