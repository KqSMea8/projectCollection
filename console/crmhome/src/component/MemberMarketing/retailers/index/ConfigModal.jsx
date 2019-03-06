import React, {PropTypes} from 'react';
import {Modal, Form, Button, message, InputNumber} from 'antd';
import ajax from '../../../../common/ajax';

const FormItem = Form.Item;

const ConfigModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    type: PropTypes.string,
    allowShow: PropTypes.bool,
    refresh: PropTypes.func,
  },

  getInitialState() {
    return {
      showModal: false,
      loading: false,
      config: {
        tradeCycle: '',
        tradeAmt: '',
        tradeCnt: '',
      },
    };
  },

  onCancel() {
    this.setState({
      showModal: false,
      loading: false,
    }, ()=> {
      this.props.form.resetFields();
    });
  },

  showNewModal() {
    if (!this.props.allowShow) {
      Modal.info({
        title: '当前有活动正在进行，无法调整配置',
      });
      return;
    }

    // 获取初始化数据
    ajax({
      url: 'promo/merchant/crowd/config.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          const { tradeAmt, tradeCnt } = res.data;
          this.props.form.setFieldsValue({
            tradeCycle: 90, // 周期先写死90天
            tradeAmt: tradeAmt / 100 || '',
            tradeCnt: tradeCnt || '',
          });
        } else {
          message.error(res.errorMsg);
        }

        this.setState({
          showModal: true,
        });
      },
    });
  },

  handleSubmit(e) {
    const self = this;
    e.preventDefault();

    self.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      self.setState({
        loading: true,
      });

      ajax({
        url: 'promo/merchant/memberCrowdModify.json',
        method: 'post',
        data: Object.assign(values, { tradeAmt: values.tradeAmt * 100 }),
        type: 'json',
        success: (res) => {
          self.setState({
            loading: false,
          }, () => {
            if (res.status === 'success') {
              message.success('成功');

              self.onCancel();
              self.props.refresh();
            } else {
              message.error(res.errorMsg);
            }
          });
        },
        error: (res) => {
          self.setState({
            loading: false,
          }, () => {
            message.error(res.errorMsg);
          });
        },
      });
    });
  },

  render() {
    let formData;
    const { getFieldProps } = this.props.form;

    formData = (<Form horizontal onSubmit={this.handleSubmit} form={this.props.form}>
      <FormItem
          label="沉默顾客: "
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19, offset: 1}}
          required>
        <span className="ant-form-text">超过</span>
        <InputNumber disabled style={{ width: 100, height: 30, marginRight: 8}} min={1} max={999999999}
          {...getFieldProps('tradeCycle', {
            rules: [{
              required: true,
              type: 'number',
              message: '请输入正确的天数',
            }],
          })}
        />天无消费为沉默顾客
      </FormItem>
      <FormItem
          label="高额顾客: "
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19, offset: 1}}
          required>
        <span className="ant-form-text">累计消费金额超过</span>
        <InputNumber style={{ width: 100, height: 30, marginRight: 8}} min={1} max={999999999}
          {...getFieldProps('tradeAmt', {
            rules: [{
              required: true,
              type: 'number',
              message: '请输入正确的消费金额',
            }],
          })}
        />元
      </FormItem>
      <FormItem
        label="高频顾客: "
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19, offset: 1}}
        required>
        <span className="ant-form-text">累计消费次数超过</span>
        <InputNumber style={{ width: 100, height: 30, marginRight: 8}} min={1} max={999999999}
          {...getFieldProps('tradeCnt', {
            rules: [{
              required: true,
              type: 'number',
              message: '请输入正确的消费次数',
            }],
          })}
        />次
      </FormItem>
    </Form>);

    return (
      <div>
        <Button style={{position: 'absolute', top: 0, right: 6}}
                type="ghost"
                size="large"
                onClick={this.showNewModal}>调整配置条件</Button>

        <Modal title={'调整配置条件'}
               visible={this.state.showModal}
               onCancel={this.onCancel}
               maskClosable={false}
               footer={[<Button key="cancel" type="ghost" size="large" onClick={this.onCancel}>取消</Button>,
               <Button key="submit" type="primary" size="large" onClick={this.handleSubmit} loading={this.state.loading}>确定</Button>]}>
          {formData}
        </Modal>
      </div>
    );
  },
});

export default Form.create()(ConfigModal);
