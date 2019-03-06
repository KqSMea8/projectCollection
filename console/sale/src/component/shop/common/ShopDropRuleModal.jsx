import React, { PropTypes } from 'react';
import { Modal, Form, Radio, message } from 'antd';
import ajax from '../../../common/utility/ajax';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class DropRuleModal extends React.Component {
  static propTypes = {
    onCancelRule: PropTypes.func,
    cityCode: PropTypes.array,
    form: PropTypes.object,
    initFallRuleData: PropTypes.object,
    initFallRule: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      noTrade: null,
      noVisit: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initFallRuleData !== nextProps.initFallRuleData) {
      this.props.form.setFieldsValue({
        noTrade: nextProps.initFallRuleData.noTrade,
        noVisit: nextProps.initFallRuleData.noVisit,
      });
    }
  }

  handleOk = (initFallRuleData, cityCode) => {
    const { noTrade, noVisit } = this.state;
    ajax({
      url: `${window.APP.kbsalesUrl}/shop/fallRuleConfig.json`,
      method: 'post',
      data: {
        cityCode: cityCode[1],
        noTrade: noTrade ? noTrade : initFallRuleData.noTrade,
        noVisit: noVisit ? noVisit : initFallRuleData.noVisit
      },
      success: (result) => {
        if (result.status === 'succeed') {
          this.props.initFallRule(cityCode[1]);
        }
      },
      error: (result) => {
        message.error(result && result.resultMsg || '系统异常');
      },
    });
    this.props.onCancelRule();
  }

  handleCancel = () => {
    this.props.onCancelRule();
  }

  tradeChange = (e) => {
    this.setState({
      noTrade: e.target.value,
    });
  }

  visitChange = (e) => {
    this.setState({
      noVisit: e.target.value,
    });
  }

  render() {
    const {getFieldProps} = this.props.form;
    const { ruleShow, initFallRuleData, cityCode } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };
    return (
      <Modal
        title="编辑规则"
        visible= {ruleShow}
        onOk={this.handleOk.bind(this, initFallRuleData, cityCode)}
        onCancel={this.handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form>
          <FormItem
            {...formItemLayout}
            required
            label="无动销门店掉落规则"
          >
            <RadioGroup
              {...getFieldProps('noTrade', {
                onChange: this.tradeChange,
              })}>
              <Radio value="NONE">不掉落</Radio>
              <Radio value="30">30天掉落</Radio>
              <Radio value="60">60天掉落</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            {...formItemLayout}
            required
            label="无拜访门店掉落规则"
          >
            <RadioGroup
              {...getFieldProps('noVisit', {
                onChange: this.visitChange,
              })}>
              <Radio value="NONE">不掉落</Radio>
              <Radio value="30">30天掉落</Radio>
              <Radio value="60">60天掉落</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(DropRuleModal);
