import React, { PropTypes } from 'react';
import { Form, Modal, Input, message, Radio } from 'antd';
import { telephone } from '../../../../common/validatorUtils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class VisitObjectEditModal extends React.Component {

  static propTypes = {
    visible: PropTypes.bool,
    confirmLoading: PropTypes.bool,
    onOk: PropTypes.func, // 确定回调
    onCancel: PropTypes.func, // 确定回调
    initData: PropTypes.any, // {name, tel, position, otherPosition} 初始化数据
  };

  componentDidUpdate(prevProps) {
    const { initData } = this.props;
    const { setFieldsValue } = this.props.form;
    const dataChange = initData !== prevProps.initData;
    const modalGoHidden = !this.props.visible && prevProps.visible;
    if (dataChange || modalGoHidden) {
      setFieldsValue({
        name: initData && initData.name,
        tel: initData && initData.tel,
        position: (initData && initData.position),
        otherPosition: initData && initData.otherPosition,
      });
    }
  }

  onOk() {
    this.props.form.validateFields((errors, values) => {
      if (errors && Object.keys(errors).length) {
        const getFieldError = this.props.form.getFieldError;
        const errMsgs = Object.keys(errors).map((key) => getFieldError(key) && getFieldError(key)[0]);
        message.error(errMsgs);
      } else {
        this.props.onOk(values);
      }
    });
  }

  render() {
    const { visible, confirmLoading, onCancel, initData } = this.props;
    const { getFieldProps, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    return (<Modal
      title={initData ? '编辑拜访对象' : '新增拜访对象'}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={this.onOk.bind(this)}
      onCancel={onCancel}
    >
      <Form horizontal>
        <FormItem
          label="姓名"
          {...formItemLayout}>
          <Input placeholder="请输入" {...getFieldProps('name', {
            initialValue: initData && initData.name,
            rules: [
              { required: true, message: '请输入姓名' },
              { max: 10, message: '不能超过10个字', type: 'string' },
            ],
          })}/>
        </FormItem>
        <FormItem
          label="电话/手机"
          {...formItemLayout}>
          <Input placeholder="请输入" {...getFieldProps('tel', {
            initialValue: initData && initData.tel,
            rules: [telephone],
            validateTrigger: 'onBlur',
          })} />
        </FormItem>
        <FormItem
          label="职务"
          {...formItemLayout}>
          <RadioGroup {...getFieldProps('position', {
            initialValue: initData && initData.position,
            rules: [{ required: true, message: '请选择职务' }],
          })}>
            <Radio key="CEO" value="CEO">CEO</Radio>
            <Radio key="STAY_DIRECTOR" value="STAY_DIRECTOR">运营总监</Radio>
            <Radio key="MARKET_DIRECTOR" value="MARKET_DIRECTOR">市场总监</Radio>
            <Radio key="WIDE_DIRECTOR" value="WIDE_DIRECTOR">推广总监</Radio>
            <Radio key="OTHER" value="OTHER">其他</Radio>
          </RadioGroup>
        </FormItem>
        {getFieldValue('position') === 'OTHER' && (<FormItem
          label="其他职务"
          {...formItemLayout}>
          <Input placeholder="请输入" {...getFieldProps('otherPosition', {
            initialValue: initData && initData.otherPosition,
            rules: [{ required: true, message: '请输入其他职务' }],
          })} />
        </FormItem>)}
      </Form>
    </Modal>);
  }
}

export default Form.create()(VisitObjectEditModal);
