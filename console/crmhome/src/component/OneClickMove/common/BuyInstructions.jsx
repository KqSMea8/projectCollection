import React from 'react';
import { Form, Modal, Switch, Row, Col, Input, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import './BuyInstructions.less';
import componentGetter from '../common/ComponentGetter';
import {cloneDeep} from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 6, offset: 1 },
  wrapperCol: { span: 16 },
};
const SUB_FORM_ITEM_STYLE = { display: 'table-cell', verticalAlign: 'top', paddingRight: '8px' };
export default class BuyInstructions extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: React.PropTypes.string.isRequired,
    configFild: React.PropTypes.shape({
      wifi: React.PropTypes.string.isRequired,
      parking: React.PropTypes.string.isRequired,
      charge: React.PropTypes.string.isRequired,
      yuyue: React.PropTypes.string.isRequired,
      instructions: React.PropTypes.string.isRequired,
      limit: React.PropTypes.string.isRequired,
      renshu: React.PropTypes.string.isRequired,
      invoice: React.PropTypes.string.isRequired,
      invoiceType: React.PropTypes.string.isRequired,
      free: React.PropTypes.string.isRequired,
    }).isRequired,
  }
  static defaultProps = {
    defaultValue: '',
    rules: [],
  }
  state = {
    visible: false,
  }
  get getAddableInput() {
    const {moreInstructions} = this.props;
    return componentGetter({ ...formItemLayout, ...cloneDeep(moreInstructions)});
  }
  clickBuy = (e) => {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  }
  checkNum = (value, name) => {
    const {setFields} = this.form;
    if (!value) {
      setFields({
        [name]: {
          value: '',
          errors: [new Error('请输入')],
        },
      });
      return;
    } else if (value <= 0 || value.indexOf('.') >= 0) {
      setFields({
        [name]: {
          value: '',
          errors: [new Error('请输入正整数')],
        },
      });
      return;
    }
  }
  checkRequired = (value, name) => {
    const {setFields} = this.form;
    if (!value) {
      setFields({
        [name]: {
          value: '',
          errors: [new Error('请输入')],
        },
      });
      return;
    }
  }
  handleOk = () => {
    const {getFieldValue, getFieldsValue} = this.form;
    // const { wifi, parking, charge, yuyue, instructions, limit, renshu, invoice, invoiceType, free } = this.props.configFild;
    const { parking, charge, free, yuyue, instructions, limit, renshu } = this.props.configFild;
    const isParking = getFieldValue(parking);
    const isYuyue = getFieldValue(yuyue);
    const isLimit = getFieldValue(limit);
    // const isInvoice = getFieldValue(invoice);
    const values = getFieldsValue();
    if (isParking) {
      this.checkNum(values.free, free);
    }
    if (!isParking) {
      this.checkNum(values.charge, charge);
    }
    if (!isYuyue) {
      this.checkRequired(values.instructions, instructions);
    }
    if (isLimit) {
      this.checkNum(values.renshu, renshu);
    }
    // if ()
    // this.setState({
    //   visible: false,
    // });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  checkInteger = (rule, value, callback) => {
    if (!value || value && isNaN(value)) {
      callback(new Error('请输入数字'));
      return;
    }
    if (value <= 0 || value.indexOf('.') > 0) {
      callback(new Error('请输入正整数'));
      return;
    }
    callback();
  }
  render() {
    const { label, required, labelCol, wrapperCol, field, configFild } = this.props;
    const { wifi, parking, charge, yuyue, instructions, limit, renshu, invoice, invoiceType, free } = configFild;
    const {getFieldProps, getFieldValue} = this.form;
    const { visible } = this.state;
    const isParking = getFieldValue(parking);
    const isYuyue = getFieldValue(yuyue);
    const isLimit = getFieldValue(limit);
    const isInvoice = getFieldValue(invoice);
    return (
      <div className="buy-instructions">
        <FormItem
          label={label}
          required={required}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <div>
            <a href="#" onClick={this.clickBuy}>编辑须知</a>
            <div className="buy-ul">
              <ul>
                <li key="1">1</li>
                <li key="2">3</li>
                <li key="3">2</li>
              </ul>
            </div>
            <input type="hidden" {...getFieldProps(field) } />
          </div>
        </FormItem>
        <Modal title={label} visible={visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
        >
          <div className="buy-instructions-modal">
            <Row>
              <Col>
                <FormItem
                  label="是否支持免费Wi-Fi："
                  required={required}
                  labelCol={formItemLayout.labelCol}
                  wrapperCol={formItemLayout.wrapperCol}
                >
                  <Switch {...getFieldProps(wifi) } />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  label="是否免费停车："
                  required={required}
                  labelCol={formItemLayout.labelCol}
                  wrapperCol={formItemLayout.wrapperCol}
                >
                  <FormItem style={SUB_FORM_ITEM_STYLE}>
                    <Switch {...getFieldProps(parking) } />
                  </FormItem>
                  <span style={SUB_FORM_ITEM_STYLE}>{isParking ? '免费停车' : '停车收费'}</span>
                  <FormItem style={SUB_FORM_ITEM_STYLE}>
                    {isParking ? <Input style={{ width: 60 }} {...getFieldProps(free, {
                      rules: [this.checkInteger],
                    })}/> :
                    <Input style={{ width: 60 }} {...getFieldProps(charge, {
                      rules: [this.checkInteger],
                    })}/>}
                  </FormItem>
                  <span style={SUB_FORM_ITEM_STYLE}>{isParking ? '小时' : '元/小时'}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  label="是否需要预约："
                  required={required}
                  labelCol={formItemLayout.labelCol}
                  wrapperCol={formItemLayout.wrapperCol}
                >
                  <FormItem style={SUB_FORM_ITEM_STYLE}>
                    <Switch {...getFieldProps(yuyue) } />
                  </FormItem>
                  <span style={SUB_FORM_ITEM_STYLE}>{isYuyue ? '无需预约（高峰时可能需要等位）' : '预约说明'}</span>
                  {!isYuyue && <FormItem style={SUB_FORM_ITEM_STYLE}>
                    <Input {...getFieldProps(instructions, {
                      rules: [{
                        required: true, message: '请填写',
                      }],
                    })}/>
                  </FormItem>}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  label="是否限制使用人数："
                  required={required}
                  labelCol={formItemLayout.labelCol}
                  wrapperCol={formItemLayout.wrapperCol}
                >
                  <FormItem style={SUB_FORM_ITEM_STYLE}>
                    <Switch {...getFieldProps(limit) } />
                  </FormItem>
                  <span style={SUB_FORM_ITEM_STYLE}>{isLimit ? '限制使用' : '不限制使用人数'}</span>
                  {isLimit && <FormItem style={SUB_FORM_ITEM_STYLE}>
                    <Input {...getFieldProps(renshu, {
                      rules: [this.checkInteger],
                    })}/>
                  </FormItem>}
                  <span style={SUB_FORM_ITEM_STYLE}>{isLimit ? '人' : ''}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  label="是否可开具发票："
                  required={required}
                  labelCol={formItemLayout.labelCol}
                  wrapperCol={formItemLayout.wrapperCol}
                >
                  <FormItem style={SUB_FORM_ITEM_STYLE}>
                    <Switch {...getFieldProps(invoice) } />
                  </FormItem>
                  {isInvoice && <FormItem style={SUB_FORM_ITEM_STYLE}>
                    <Select style={{ width: 150 }} {...getFieldProps(invoiceType, {
                      initialValue: 'jack',
                    }) }>
                      <Option value="jack">可提供电子发票</Option>
                      <Option value="lucy">Lucy</Option>
                    </Select>
                  </FormItem>}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col style={{paddingTop: 10 }}>
                {this.getAddableInput}
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}
