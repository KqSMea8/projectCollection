import React from 'react';
import { Form, Input, Switch, Modal, Col, InputNumber, Checkbox } from 'antd';
import { cloneDeep, debounce, omit } from 'lodash';
import { blockInvalidLetter } from '../common/commonValidate';
import BuyTips from './BuyTips';
import BuyRulesDetail from './BuyRulesDetail';
import { INVOICE_OPTIONS } from './contants';
import './BuyRulesTpl.less';

function numberToString(v) {
  return isNaN(v) ? '' : v.toString();
}

const extraBuyRulesValidators = {
  title: [{
    max: 15,
    message: '限 15 个字',
  }, blockInvalidLetter,
  ],
};

const SUB_FORM_ITEM_STYLE = { display: 'inline-block', verticalAlign: 'top', paddingLeft: '8px' };
const defaultValue = {
  freeWifi: false,
  freePark: false,
  parkFeePerHour: '',
  parkFeeUpperBoundPerDay: '',
  needReserve: false,
  reserveNote: '',
  limitUserNum: false,
  userNumLimited: undefined,
  supplyInvoice: true,
  invoiceTypes: INVOICE_OPTIONS.map(d => d.value),
};

const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

export default Form.create()(
  class BuyRulesTpl extends React.Component {
    static contextTypes = {
      form: React.PropTypes.object.isRequired,
    }

    static propTypes = {
      value: React.PropTypes.object,
      onChange: React.PropTypes.func.isRequired,
    }

    constructor(props, ctx) {
      super(props, ctx);
      this.form = ctx.form;
      this.props.form.setFieldsInitialValue({
        ...defaultValue, ...cloneDeep(props.value),
      });
    }

    componentWillMount() {
      this.props.onChange({
        ...defaultValue, ...(this.props.value || {}),
      });
    }

    componentWillUpdate(nextProps, nextState) {
      if (nextState.isModalVisible !== this.state.isModalVisible) {
        this.oldValue = cloneDeep(nextProps.value);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.resetFormValue(cloneDeep(nextProps.value));
      }
    }

    // componentDidUpdate(_, prevState) {
    //   if (prevState.isModalVisible !== this.state.isModalVisible) {
    //     this.resetFormValue(cloneDeep(this.props.value));
    //   }
    // }

    resetFormValue = value => {
      this.props.form.setFieldsValue({
        ...defaultValue, ...value,
      });
    }

    checkInvoiceType = (_, values, cb) => {
      if (this.props.form.getFieldValue('supplyInvoice') && (!values || values.length === 0)) {
        return cb('至少选择一种');
      }
      cb();
    }

    state = {
      isModalVisible: false,
    };

    handleConfirm = () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }
        // todo convert values => formvalue
        this.props.onChange(values);
        this.hideModal();
      });
    }

    showModal = debounce(() => {
      this.setState({
        isModalVisible: true,
      });
    }, 100, { leading: false, trailing: true });

    hideModal = debounce(() => {
      this.setState({
        isModalVisible: false,
      });
    }, 100, { leading: false, trailing: true });

    hideModalAndReset = () => {
      this.resetFormValue(this.oldValue);
      this.hideModal();
    }

    render() {
      const committedValue = this.props.value;
      if (!committedValue) {
        return null;
      }
      const { labelCol, wrapperCol, form } = this.props;
      const { getFieldValue, getFieldProps } = form;
      let modalTop = 120;
      if (window.top !== window) {
        modalTop = window.top.scrollY + modalTop;
      }
      return (
        <span>
          <Form.Item
            label="购买须知"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <a onClick={this.showModal}>编辑须知</a>
            <input type="hidden" {...this.form.getFieldProps('buyTips', { initialValue: [{ key: '', value: [''] }] })} />
            <BuyRulesDetail className="buy-rules-desc" value={{ buyTipsTemplate: omit(committedValue, 'buyTips'), buyTips: this.form.getFieldValue('buyTips') }} />
          </Form.Item>
          <Modal
            style={{ top: modalTop }}
            visible={this.state.isModalVisible}
            closable
            cancelText="关闭"
            okText="确定"
            maskClosable={false}
            onCancel={this.hideModalAndReset}
            width={650}
            onOk={this.handleConfirm}
          >
            <Form horizontal style={{ height: 600, overflow: 'auto', marginTop: 30 }} form={form}>
              <Form.Item
                label="是否支持免费Wi-Fi"
                required
                {...formLayout}
              >
                <Col span={4}>
                  <Switch {...getFieldProps('freeWifi', { valuePropName: 'checked' })} />
                </Col>
                <Col span={20} style={{ paddingLeft: SUB_FORM_ITEM_STYLE.paddingLeft }}>
                  {getFieldValue('freeWifi') ? '提供免费 Wi-Fi' : '不提供免费 Wi-Fi'}
                </Col>
              </Form.Item>
              <Form.Item
                label="是否免费停车"
                required
                {...formLayout}
              >
                <Col span={4} style={{ minHeight: 33 }}>
                  <Form.Item>
                    <Switch {...getFieldProps('freePark', { valuePropName: 'checked' })} />
                  </Form.Item>
                </Col>
                {form.getFieldValue('freePark') ? (
                  <Col span={20} style={{ minHeight: 33 }}>
                    <div style={SUB_FORM_ITEM_STYLE}>免费停车</div>
                    <Form.Item style={SUB_FORM_ITEM_STYLE}>
                      <InputNumber placeholder="选填" {...getFieldProps('freeParkHours')} step={1} max={24} min={0} />
                    </Form.Item>
                    <div style={SUB_FORM_ITEM_STYLE}>小时</div>
                  </Col>
                ) : (
                    <Col span={20} style={{ minHeight: 33 }}>
                      <div style={SUB_FORM_ITEM_STYLE}>停车每小时</div>
                      <Form.Item style={SUB_FORM_ITEM_STYLE}>
                        <InputNumber placeholder="选填" {...getFieldProps('parkFeePerHour', { normalize: numberToString })} step={1} max={500} min={0} />
                      </Form.Item>
                      <div style={SUB_FORM_ITEM_STYLE}>元，24小时</div>
                      <Form.Item style={SUB_FORM_ITEM_STYLE}>
                        <InputNumber placeholder="选填" {...getFieldProps('parkFeeUpperBoundPerDay', { normalize: numberToString })} step={1} min={0} max={500} />
                      </Form.Item>
                      <div style={SUB_FORM_ITEM_STYLE}>元封顶</div>
                    </Col>
                  )}
              </Form.Item>
              <Form.Item label="是否需要预约" required {...formLayout}>
                <Col span={4} style={{ minHeight: 33 }}>
                  <Switch {...getFieldProps('needReserve', { valuePropName: 'checked' })} />
                </Col>
                <Col span={20} style={{ paddingLeft: SUB_FORM_ITEM_STYLE.paddingLeft }}>
                  {
                    form.getFieldValue('needReserve') === true
                      ?
                      (
                        <span>
                          <div style={{ ...SUB_FORM_ITEM_STYLE, paddingLeft: 0 }}>预约说明</div>
                          <Form.Item style={SUB_FORM_ITEM_STYLE}>
                            <Input placeholder="必填，限20个字以内" maxLength={20} {...getFieldProps('reserveNote', {
                              rules: [{ required: true, message: '此处必填' }, { type: 'string', max: 20, message: '20字以内' }],
                            })} />
                          </Form.Item>
                        </span>
                      )
                      :
                      <span>无需预约（高峰时可能需要等位）</span>
                  }
                </Col>
              </Form.Item>
              <Form.Item label="是否限制使用人数" required {...formLayout}>
                <Col span={4} style={{ minHeight: 33 }}>
                  <Switch {...getFieldProps('limitUserNum', { valuePropName: 'checked' })} />
                </Col>
                <Col span={20} style={{ paddingLeft: SUB_FORM_ITEM_STYLE.paddingLeft }}>
                  {getFieldValue('limitUserNum') ? (
                    <span>
                      <div style={{ ...SUB_FORM_ITEM_STYLE, paddingLeft: 0 }}>使用人数</div>
                      <Form.Item style={SUB_FORM_ITEM_STYLE}>
                        <InputNumber min={0} max={100} step={1} {...getFieldProps('userNumLimited', { rules: [{ required: true, message: '此处必填' }] })} placeholad="必填，最多 100" />人（含以内）
                      </Form.Item>
                    </span>
                  ) : <span>无需预约（高峰时可能需要等位）</span>
                  }
                </Col>
              </Form.Item>
              <Form.Item
                required
                label="是否可开具发票"
                {...formLayout}
                help={this.props.form.getFieldError('invoiceTypes')
                  && this.props.form.getFieldError('invoiceTypes').join('、')
                }
                validateStatus={!!this.props.form.getFieldError('invoiceTypes') ? 'error' : undefined}
              >
                <Col span={4} style={{ minHeight: 33 }}>
                  <Switch {...getFieldProps('supplyInvoice', { valuePropName: 'checked' })} />
                </Col>
                <Col span={20} style={{ paddingLeft: SUB_FORM_ITEM_STYLE.paddingLeft }}>
                  {getFieldValue('supplyInvoice') ? (
                    <Checkbox.Group options={INVOICE_OPTIONS} {...getFieldProps('invoiceTypes', { rules: [this.checkInvoiceType], initialValue: INVOICE_OPTIONS.map(d => d.value) })} />
                  ) : '不提供发票'}
                </Col>
              </Form.Item>
              <BuyTips
                field="buyTips"
                {...formLayout}
                maxRow={1000}
                maxCol={1000}
                extra="须知内容总字数 2000 字以内"
                rules={extraBuyRulesValidators}
                value={this.form.getFieldValue('buyTips')}
                subField={{
                  title: 'key',
                  content: 'value',
                }}
              />
            </Form>
          </Modal>
          {/* )} */}
        </span>
      );
    }
  });
