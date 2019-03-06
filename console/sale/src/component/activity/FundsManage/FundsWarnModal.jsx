import React, { PropTypes } from 'react';
import { Modal, Form, Input, Button, Alert, InputNumber, DatePicker } from 'antd';
import ajax from 'Utility/ajax';
import classnames from 'classnames';
import moment from 'moment';
import { ErrorMsg } from './ErrorMsg';

const createForm = Form.create;
const FormItem = Form.Item;

const FundsWarnModal = React.createClass({
  propTypes: {
    item: PropTypes.object,
    visible: PropTypes.bool,
    onAction: PropTypes.func,
  },

  getInitialState() {
    return {
      loading: false,
    };
  },

  handleSubmit() {
    const { item } = this.props;

    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.setState({loading: true});
        ajax({
          url: '/sale/capitalpool/alarm.json',
          method: 'post',
          data: {
            ...values,
            startTime: moment(values.startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(values.endTime).format('YYYY-MM-DD HH:mm:ss'),
            poolId: this.props.item.poolId,
            principalId: this.props.item.principalId,
          },
          type: 'json',
          success: (res) => {
            if (res.status === 'succeed') {
              // 如果是初次创建流程进入的预警设置，要判断下余额是否低于失效金额，引导用户去充值。
              if (item._new && (+item.balance < +values.alarmAmount || +item.balance < +values.invalidAmount)) {
                this.props.onAction('message', 'reload', {
                  status: 'warn',
                  title: '资金池当前余额低于失效／预警金额',
                  content: '请立即充值，否则活动将无法正常进行。',
                  item: {...item, ...values}, // 传递该条数据
                });
              } else {
                this.props.onAction('message', 'reload', {
                  status: 'success',
                  title: '资金池修改成功',
                  content: '',
                });
              }
            }
          },
          error: ({resultCode, resultMsg}) => {
            const errMsg = ErrorMsg[resultCode] || resultMsg || '资金池修改失败，请稍候再试';
            this.props.onAction('message', 'show', {
              status: 'fail',
              title: errMsg,
            });
          },
        });
      }
    });
  },

  validateInvalidAmount(rule, value, callback) {
    const { user } = this.props;
    const { getFieldValue, validateFields, getFieldError } = this.props.form;
    const alarmAmount = getFieldValue('alarmAmount');
    console.log(value, user.minInvalidAmount, value < user.minInvalidAmount);
    if (typeof value === 'undefined') {
      callback(new Error(`此处必填`));
    } else if (+value <= +user.minInvalidAmount) {
      callback(new Error(`失效金额必须大于${user.minInvalidAmount}元`));
    } else if (typeof alarmAmount !== 'undefined' && +value >= +alarmAmount) {
      callback(new Error(`失效金额必须小于预警金额`));
    } else if (getFieldError('alarmAmount')) {
      validateFields(['alarmAmount'], {force: true});
    }

    callback();
  },

  validateAlarmAmount(rule, value, callback) {
    const { user } = this.props;
    const { getFieldValue, validateFields, getFieldError } = this.props.form;
    const invalidAmount = getFieldValue('invalidAmount');

    if (typeof value === 'undefined') {
      callback(new Error(`此处必填`));
    } else if (+value <= +user.minAlarmAmount) {
      callback(new Error(`预警金额必须大于${user.minAlarmAmount}元`));
    } else if (typeof invalidAmount !== 'undefined' && +value <= +invalidAmount) {
      callback(new Error(`预警金额必须大于失效金额`));
    } else if (getFieldError('invalidAmount')) {
      validateFields(['invalidAmount'], {force: true});
    }

    callback();
  },

  validateReceivers(rule, value, callback) {
    if (typeof value === 'undefined') {
      callback(new Error(`此处必填`));
    }

    const reg = /^1[34578][0-9]{9}(,1[3578][0-9]{9})*$/;
    if (!reg.test(value)) {
      callback(new Error('请输入正确的手机号码，且以英文逗号间隔'));
    }

    const reg99 = /^1[34578][0-9]{9}(,1[3578][0-9]{9}){0,10}$/;
    if (!reg99.test(value)) {
      callback(new Error('最多输入10个手机号码'));
    }

    callback();
  },

  render() {
    const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
    const item = this.props.item || {};
    const { user } = this.props;
    const { loading } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const invalidAmountExtra = user.minInvalidAmount > 0 ? (
      <p className="hint_tip">资金池金额小于失效金额时，资金池对应的所有活动自动暂停，充值后活动自动恢复。
        建议失效金额大于<span style={{color: '#FF6633'}}>{user.minInvalidAmount}</span>元，支持两位小数。</p>
    ) : (
      <p className="hint_tip">资金池金额小于失效金额时，资金池对应的所有活动自动暂停，充值后活动自动恢复，支持两位小数。</p>
    );

    const alarmAmountExtra = user.minAlarmAmount > 0 ? (
      <p className="hint_tip">资金池金额小于预警金额时，系统会发送预警消息至指定手机号，请及时充值。
      建议预警金额大于<span style={{color: '#FF6633'}}>{user.minAlarmAmount}</span>元，支持两位小数。</p>
    ) : (
      <p className="hint_tip">资金池金额小于预警金额时，系统会发送预警消息至指定手机号，请及时充值，支持两位小数。</p>
    );

    const today = moment();

    return (
      <div>
        <Modal title="修改" visible={this.props.visible}
          onCancel={() => {this.props.onAction('warn', 'hide');}}
          maskClosable={false}
          footer={[
            <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleSubmit}>
              确定
            </Button>,
          ]}
        >
          {
            item._new && <Alert message="充值成功，请设置资金预警。" type="success" showIcon />
          }
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
              extra={<p className="hint_tip">建议资金有效期设置为合同有效期，有效期内账户余额不可提现</p>}
              help={getFieldError('startTime') || getFieldError('endTime') }
              validateStatus={
                classnames({
                  error: getFieldError('startTime') || getFieldError('endTime'),
                })
              }
              required
            >
              <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" style={{width: 160}} disabled
                {...getFieldProps('startTime', {
                  initialValue: item.startTime,
                })}
              />
              <span style={{ margin: '0 5px', color: '#ccc' }}>－</span>
              <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" style={{width: 160}}
                {...getFieldProps('endTime', {
                  rules: [
                    { required: true, message: '请选择活动结束时间' },
                    { validator: (rule, value, callback) => {
                      if (!getFieldValue('startTime')) {
                        callback();
                      } else {
                        const startDate = moment(getFieldValue('startTime'));
                        const endDate = moment(value);
                        const originEndDate = moment(item.endTime);

                        if (!startDate.isBefore(endDate)) {
                          callback([new Error('结束时间应该晚于开始时间')]);
                          return;
                        }

                        // 结束时间要晚于当前时间
                        if (!endDate.isAfter(today)) {
                          callback([new Error('结束时间应该晚于当前时间')]);
                          return;
                        }

                        // 结束时间要晚于修改前时间
                        if (endDate.isBefore(originEndDate)) {
                          callback([new Error('结束时间不应早于原有结束时间')]);
                          return;
                        }

                        if (endDate.isAfter(startDate.clone().add(5, 'year'))) {
                          callback(new Error('活动时间最长为5年'));
                          return;
                        }

                        callback();
                      }
                    }},
                  ],
                  initialValue: item.endTime,
                })}
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="当前余额："
              required
            >
              <p className="ant-form-text">
                <span>{item.balance}</span>
                元
              </p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="失效金额："
              required
              validateStatus={
                classnames({
                  error: !!getFieldError('invalidAmount'),
                })
              }
              help={getFieldError('invalidAmount')}
              extra={invalidAmountExtra}
            >
              <InputNumber {...getFieldProps('invalidAmount', {
                initialValue: item.invalidAmount,
                rules: [{
                  validator: this.validateInvalidAmount,
                }],
              })} type="text" autoComplete="off" style={{width: 200}} placeholder="请输入充值金额" min={0.01} max={999999999.99} step="0.01"/>
              <span>&nbsp;元</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="预警金额："
              required
              validateStatus={
                classnames({
                  error: !!getFieldError('alarmAmount'),
                })
              }
              help={getFieldError('alarmAmount')}
              extra={alarmAmountExtra}
            >
              <InputNumber {...getFieldProps('alarmAmount', {
                initialValue: item.alarmAmount,
                rules: [{
                  validator: this.validateAlarmAmount,
                }],
              })} type="text" autoComplete="off" style={{width: 200}} placeholder="请输入预警金额" min={0.01} max={999999999.99} step="0.01"/>
              <span>&nbsp;元</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="预警通知人："
              required
              extra={<p className="hint_tip">请输入通知人手机号码，多个手机之间用逗号间隔</p>}
            >
              <Input {...getFieldProps('alarmReceiver', {
                initialValue: item.alarmReceiver,
                rules: [{
                  validator: this.validateReceivers,
                }],
              })} type="text" autoComplete="off" style={{width: 320}} placeholder="请输入预警通知人手机号码"/>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  },

});

export default createForm()(FundsWarnModal);
