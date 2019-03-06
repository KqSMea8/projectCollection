import React, { PropTypes } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Spin, Button } from 'antd';
import ajax from 'Utility/ajax';
import classnames from 'classnames';
import moment from 'moment';
import { ErrorMsg } from './ErrorMsg';

const createForm = Form.create;
const FormItem = Form.Item;

const FundsCreateModal = React.createClass({
  propTypes: {
    data: PropTypes.object,
    user: PropTypes.object,
    visible: PropTypes.bool,
    onAction: PropTypes.func,
  },

  getInitialState() {
    return {
      loading: false,
      securityCheckUrl: '',
      securityId: '',
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
        const params = {
          startTime: moment(values.startTime).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(values.endTime).format('YYYY-MM-DD HH:mm:ss'),
          poolName: values.poolName,
          debitAccount: this.props.user.userId,
          rechargeAmount: values.rechargeAmount,
          securityId: this.state.securityId,
        };

        ajax({
          url: '/sale/capitalpool/create.json',
          method: 'post',
          data: params,
          type: 'json',
          success: (res) => {
            if (res.status === 'succeed') {
              res.data._new = true;
              this.props.onAction('warn', 'reload', res.data);
            }
          },
          error: ({resultCode, resultMsg}) => {
            const errMsg = ErrorMsg[resultCode] || resultMsg;
            this.props.onAction('message', 'fail', {
              status: 'fail',
              title: errMsg,
            });
          },
        });
      } else {
        this.fetchSecurity();
      }
    });
  },

  validateTime(rule, value, callback) {
    if (value && value[0] && value[1]) {
      console.log(value[0]);
      if (value[0] <= new Date()) {
        callback(new Error('资金池有效期不能早期当前时间'));
      } else {
        callback();
      }
    } else {
      callback(new Error(`此处必填`));
    }

    callback();
  },

  render() {
    const { getFieldProps, getFieldError, getFieldValue, validateFields } = this.props.form;
    const { securityCheckUrl } = this.state;
    const { user } = this.props;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };

    // const disabledDate = (current) => current.getTime() <= Date.now();
    // disabledDate={disabledDate}

    const today = moment();

    return (
      <div>
        <Modal title="新建资金池" visible={this.props.visible}
          maskClosable={false}
          onCancel={() => {this.props.onAction('create', 'hide');}}
          footer={null}
        >
          <Form horizontal form={this.props.form}>
            <FormItem
              {...formItemLayout}
              label="资金池名称："
              required
            >
              <Input {...getFieldProps('poolName', {
                rules: [
                  { required: true, message: '此处必填' },
                  { max: 50, message: '最多 50 个字符' },
                ],
              })} type="text" autoComplete="off" />
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
              <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" style={{width: 160}}
                {...getFieldProps('startTime', {
                  rules: [
                    { required: true, message: '请选择活动开始时间' },
                    { validator: (rule, value, callback) => {
                      if (!getFieldValue('endTime')) {
                        callback();
                      } else {
                        const startDate = moment(value);
                        const endDate = moment(getFieldValue('endTime'));

                        // 开始时间要晚于当前时间
                        if (endDate && !startDate.isAfter(today)) {
                          callback([new Error('开始时间应该晚于当前时间')]);
                          return;
                        }

                        if (!startDate.isBefore(endDate)) {
                          callback([new Error('开始时间应该早于结束时间')]);
                          return;
                        }
                        if (endDate.isAfter(startDate.clone().add(5, 'year'))) {
                          callback(new Error('活动时间最长为5年'));
                          return;
                        }

                        if (getFieldError('endTime')) {
                          (['endTime'], {force: true});
                        }

                        callback();
                      }
                    } },
                  ],
                  initialValue: today.clone().add(1, 'day').format('YYYY-MM-DD 00:00:00'),
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

                        if (!startDate.isBefore(endDate)) {
                          callback([new Error('结束时间应该大于开始时间')]);
                          return;
                        }
                        if (endDate.isAfter(startDate.clone().add(5, 'year'))) {
                          callback(new Error('活动时间最长为5年'));
                          return;
                        }

                        if (getFieldError('startTime')) {
                          validateFields(['startTime'], {force: true});
                        }
                        callback();
                      }
                    }},
                  ],
                  initialValue: today.clone().add(3, 'month').format('YYYY-MM-DD 23:59:59'),
                })}
              />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="充值支付宝账户："
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
              })} type="text" autoComplete="off" style={{width: 200}} placeholder="请输入充值金额" min={0.01} max={999999999.99} step="0.01" />
              <span>&nbsp;&nbsp;元</span>
            </FormItem>
            <div style={{'marginLeft': '-16px'}}>
              <Spin spining={this.state.securityLoading}>
                <iframe src={securityCheckUrl} frameBorder="0" width="100%" onLoad={() => {this.setState({securityLoading: false});}}></iframe>
              </Spin>
            </div>
            <Button style={{display: 'none'}} id="formSubmit" key="submit" type="primary" size="large" onClick={this.handleSubmit}>
              新建并立即充值
            </Button>
          </Form>
        </Modal>
      </div>
    );
  },

});

export default createForm()(FundsCreateModal);
