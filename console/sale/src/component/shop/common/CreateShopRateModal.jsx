import React, {PropTypes} from 'react';
// import ajax from 'Utility/ajax';
import {Modal, Form, InputNumber, Button} from 'antd';
import { times, div } from '../../../common/utils';
import classnames from 'classnames';
const FormItem = Form.Item;
const ControlModal = React.createClass({
  propTypes: {
    pId: PropTypes.string,
    merchantPid: PropTypes.string,
    RateVisible: PropTypes.bool,
    RateData: PropTypes.object,
    submitButtonDisable: PropTypes.bool,
    formData: PropTypes.object,
  },

  getInitialState() {
    return ({
      submitButtonDisable: this.props.submitButtonDisable,
    });
  },

  componentWillMount() {
    // 费率范围
  },
  onSubmit() {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const info = {...this.props.form.getFieldsValue()};
      if (info.rate) {
        const startAE = /^\.\d+$/;
        const floatAE = /^\d+\.\d+$/;
        let rateStr = info.rate.toString();
        if (rateStr.indexOf('.') !== -1) {
          if (startAE.test(rateStr)) {
            rateStr = '0' + rateStr;
          }
          if (floatAE.test(rateStr)) {
            info.rate = info.rate && info.rate.toString().replace('.', '.00');
          }
        } else {
          info.rate = div(info.rate, 100);
        }
      }
      info.psCode = this.props.RateData.psCode;
      info.psId = this.props.RateData.psId;
      this.props.save({...this.props.formData, ...info});
    });
  },
  closeWindow() {
    window.close();
  },
  render() {
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const RateData = this.props.RateData;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const minRate = RateData.minRate && times(RateData.minRate, 100);
    const maxRate = RateData.maxRate && times(RateData.maxRate, 100);
    const rate = RateData.rate && times(RateData.rate, 100);
    return (<div style={{display: 'inline-block'}}>
      <Modal
        title="修改费率"
        visible={this.props.RateVisible}
        onCancel={this.props.handleRateCancel}
        footer={[
          <Button key="back" type="ghost" size="large" onClick={this.props.handleRateCancel}>取消</Button>,
          <Button key="submit" type="primary" size="large" onClick={this.onSubmit}>
            确定
          </Button>,
        ]}
      >
        <Form form = {this.props.form}>
          <FormItem
            {...formItemLayout}
            label="费率："
            validateStatus={
              classnames({
                error: !!getFieldError('rate'),
              })}
              help={getFieldError('rate')}
              extra={<p>根据当前门店已选品类，允许调价范围: {minRate + '%' } - { maxRate + '%'}</p>}
            style={{margin: '15px 0px', overflow: 'hidden'}}>
            <InputNumber step={0.0001} {...getFieldProps('rate', {
              rules: [{
                required: true,
                type: 'number',
                message: '此处必填',
              }, {
                max: maxRate,
                type: 'number',
                message: '费率不能高于' + maxRate + '%',
              }, {
                min: minRate,
                type: 'number',
                message: '费率不能低于于' + minRate + '%',
              }],
            })}/>%
          </FormItem>
        </Form>
        { (maxRate !== rate) && (getFieldValue('rate') > rate) && <p style={{color: '#ffbf00', marginLeft: '82px'}}>高于{rate + '%'}时，需商户同意才生效，请及时联系商户，如商户已经确认过则无需重新确认。</p>}
      </Modal>
    </div>);
  },
});

export default Form.create()(ControlModal);
