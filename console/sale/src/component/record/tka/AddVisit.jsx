import React from 'react';
import moment from 'moment';
import { Form, Button, Radio, Checkbox, message, Modal } from 'antd';
import { Page } from '@alipay/kb-framework-components/lib/layout';
import MerchantSelect from '../tka/component/MerchantSelect';
import SubCompanyInput from '../tka/component/SubCompanyInput';
import VisitWithUserSelect from '../tka/component/VisitWithUserSelect';
import VisitObjectChoose from '../tka/component/VisitObjectChoose';
import DigitalFeedback from './component/DigitalFeedback'; // 数字化程度反馈
import CountInput from '../tka/component/CountInput';
import { addVisit } from './common/api';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

/* eslint-disable */
class AddVisit extends React.Component {
  state = {
    submitting: false,
  };

  visitTime = moment().format('YYYY-MM-DD HH:mm');

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      const getFieldError = this.props.form.getFieldError;
      const errMsg =
        errors &&
        Object.keys(errors)
          .map(key => getFieldError(key) && getFieldError(key)[0])
          .join(' ');
      if (errMsg) {
        message.error(errMsg);
      } else {
        const data = {
          ...values,
          restVisitUser: values.restVisitUser && values.restVisitUser.join(','),
          visitPurpose: values.visitPurpose && values.visitPurpose.join('|'),
          visitContacts:
            values.visitContacts &&
            values.visitContacts.map(item => item.contactId).join(','),
          digitalFeedBackInfo: JSON.stringify(values.digitalFeedBack),
        };
        delete data.digitalFeedBack;
        this.setState({ submitting: true });
        addVisit(data)
          .then(() => {
            message.success('添加成功');
            this.setState({ submitting: false });
            location.href = '#/tka-record';
          })
          .catch(response => {
            this.setState({ submitting: false });
            Modal.error({
              title: '提交出错',
              content: (response && response.resultMsg) || '',
            });
          });
      }
    });
  }

  render() {
    const {
      getFieldProps,
      getFieldValue,
      getFieldError,
      validateFields,
    } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const digitalFeedBackErr = getFieldError('digitalFeedBack');
    const digitalFeedBackLen = Object.values(
      getFieldValue('digitalFeedBack') || {}
    ).filter(v => v).length;
    const errStyle = { color: digitalFeedBackLen === 0 ? '#ccc' : '#f50' };

    return (
      <Page
        breadcrumb={[
          {
            title: '拜访小记',
            link: '#/tka-record',
          },
          {
            title: '添加拜访',
          },
        ]}
      >
        <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
          <FormItem {...formItemLayout} label="拜访时间">
            <div
              {...getFieldProps('visitTime', { initialValue: this.visitTime })}
            >
              {this.visitTime.split(' ')[0].replace(/-/g, '/')}
            </div>
          </FormItem>
          <FormItem {...formItemLayout} label="拜访方式">
            <RadioGroup
              {...getFieldProps('visitWay', {
                initialValue: 'VISIT_SPEAK',
                rules: [{ required: true, message: '请选择拜访方式' }],
              })}
            >
              <RadioButton value="VISIT_SPEAK">面谈</RadioButton>
              <RadioButton value="VISIT_PHONE">电话</RadioButton>
              <RadioButton value="VISIT_MERCHANT">商户来访</RadioButton>
              <RadioButton value="VISIT_OTHER">其他</RadioButton>
            </RadioGroup>
          </FormItem>
          <FormItem {...formItemLayout} label="拜访商户">
            <MerchantSelect
              {...getFieldProps('customerId', {
                rules: [{ required: true, message: '请选择拜访商户' }],
              })}
              style={{ width: '80%' }}
            />
          </FormItem>
          <FormItem {...formItemLayout} label="拜访分公司">
            <SubCompanyInput
              {...getFieldProps('visitCompany')}
              merchantId={getFieldValue('customerId')}
            />
          </FormItem>
          <FormItem {...formItemLayout} label="陪访人">
            <VisitWithUserSelect
              {...getFieldProps('restVisitUser')}
              style={{ width: '80%' }}
            />
          </FormItem>
          <FormItem {...formItemLayout} label="拜访对象">
            <VisitObjectChoose
              merchantId={getFieldValue('customerId')}
              {...getFieldProps('visitContacts', {
                rules: [
                  { required: true, message: '请选择拜访对象' },
                  { validator: VisitObjectChoose.validator },
                ],
              })}
            />
          </FormItem>

          {/* 数字化程度反馈 */}
          <FormItem
            {...formItemLayout}
            label="数字化程度反馈"
            help="将数字化程度反馈指标添加到对应的状态中"
            required
          >
            <h3>
              <span style={errStyle}>{digitalFeedBackLen}</span>/22
            </h3>
            {getFieldError('digitalFeedBack') && (
              <span style={errStyle}>
                {getFieldError('digitalFeedBack').join(', ')}
              </span>
            )}
          </FormItem>
          <DigitalFeedback
            merchantId={getFieldValue('customerId')}
            {...getFieldProps('digitalFeedBack', {
              validateTrigger: '_', // onChange 时不触发
              onChange: () => {
                // 如果原来有错误，那么每次改变值时手动触发校验 来移除错误
                if (getFieldError('digitalFeedBack'))
                  setTimeout(() => validateFields(['digitalFeedBack']), 200);
              },
              rules: [
                { required: true, message: '请完善数字化程度反馈' },
                { validator: DigitalFeedback.validator },
              ],
            })}
          />

          <FormItem {...formItemLayout} label="拜访目的">
            <CheckboxGroup
              {...getFieldProps('visitPurpose', {
                initialValue: [],
                rules: [{ required: true, message: '请选择拜访目的' }],
              })}
              options={[
                { label: '需求&意向沟通', value: 'NEED_INTENT_TALK' },
                { label: '签约计划沟通', value: 'SIGN_PLAN_TALK' },
                { label: '活动复盘', value: 'ACTIVITY_REPLAY' },
                { label: '其他', value: 'OTHER_TKA' },
              ]}
            />
          </FormItem>

          {getFieldValue('visitPurpose').indexOf('NEED_INTENT_TALK') !== -1 && (
            <FormItem {...formItemLayout} label="需求&意向沟通-沟通结果">
              <CountInput
                type="textarea"
                rows={6}
                placeholder="至少50字，请输入拜访的沟通结果"
                {...getFieldProps('needTalkResult', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入拜访的沟通结果' },
                    { min: 50, message: '最少 50 个字' },
                    { max: 1000, message: '最多1000字' },
                  ],
                })}
              />
            </FormItem>
          )}
          {getFieldValue('visitPurpose').indexOf('SIGN_PLAN_TALK') !== -1 && (
            <FormItem {...formItemLayout} label="签约计划沟通-沟通结果">
              <CountInput
                type="textarea"
                rows={6}
                placeholder="至少50字，请输入拜访的沟通结果"
                {...getFieldProps('signTalkResult', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入拜访的沟通结果' },
                    { min: 50, message: '最少 50 个字' },
                    { max: 1000, message: '最多1000字' },
                  ],
                })}
              />
            </FormItem>
          )}
          {getFieldValue('visitPurpose').indexOf('ACTIVITY_REPLAY') !== -1 && (
            <FormItem {...formItemLayout} label="活动复盘-沟通结果">
              <CountInput
                type="textarea"
                rows={6}
                placeholder="至少50字，请输入拜访的沟通结果"
                {...getFieldProps('activityTalkResult', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入拜访的沟通结果' },
                    { min: 50, message: '最少 50 个字' },
                    { max: 1000, message: '最多1000字' },
                  ],
                })}
              />
            </FormItem>
          )}
          {getFieldValue('visitPurpose').indexOf('OTHER_TKA') !== -1 && (
            <FormItem {...formItemLayout} label="其他-沟通结果">
              <CountInput
                type="textarea"
                rows={6}
                placeholder="至少50字，请输入拜访的沟通结果"
                {...getFieldProps('otherTalkResult', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入拜访的沟通结果' },
                    { min: 50, message: '最少 50 个字' },
                    { max: 1000, message: '最多1000字' },
                  ],
                })}
              />
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="下一步计划">
            <CountInput
              type="textarea"
              rows={6}
              placeholder="至少50字，请输入对当前拜访对象的下一步工作计划"
              {...getFieldProps('followPlan', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                    message: '请输入对当前拜访对象的下一步工作计划',
                  },
                  { min: 50, message: '最少 50 个字' },
                  { max: 1000, message: '最多1000字' },
                ],
              })}
            />
          </FormItem>
          <FormItem {...formItemLayout} label="其他备注">
            <CountInput
              type="textarea"
              rows={6}
              placeholder="最多1000字，商户最新动态、商户在竞对的营销/服务情况"
              {...getFieldProps('visitDesc', {
                rules: [{ max: 1000, message: '最多1000字' }],
              })}
            />
          </FormItem>
          <FormItem
            wrapperCol={{ span: 16, offset: 6 }}
            style={{ marginTop: 24 }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={this.state.submitting}
            >
              提 交
            </Button>
          </FormItem>
        </Form>
      </Page>
    );
  }
}

export default Form.create()(AddVisit);
