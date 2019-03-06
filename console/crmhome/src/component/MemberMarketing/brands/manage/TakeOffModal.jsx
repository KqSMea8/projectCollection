import React, {PropTypes} from 'react';
import {Icon, Form, Modal, Button, message, Input} from 'antd';
import ajax from '../../../../common/ajax';
const FormItem = Form.Item;

const TakeOffModal = React.createClass({
  propTypes: {
    item: PropTypes.object,
    form: PropTypes.object,
    show: PropTypes.bool,
    onCancel: PropTypes.func,
    refresh: PropTypes.func,
  },

  getInitialState() {
    return {
      loading: false,
    };
  },

  submitDown() {
    const self = this;
    const { planId, activityId, activityType} = this.props.item;

    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      self.setState({
        loading: true,
      });

      // 如果是口碑福利，在销售中台内嵌打开，接口为ebProvider
      if (activityType !== 'RANDOM_REDUCE') {
        const isInIframe = (location.href.indexOf('ebProvider=true') >= 0);
        const url = isInIframe ? '/promo/ebProvider/offline.json' : '/promo/brand/offline.json';

        ajax({
          url: url,
          method: 'post',
          data: Object.assign({planId: planId, activityId: activityId}, values),
          type: 'json',
          success: (res) => {
            self.setState({
              loading: false,
            }, () => {
              if (res.status === 'success') {
                message.success('下架成功');

                self.props.onCancel();

                // 直接触发refresh会导致 modal隐藏样式问题，故设置延迟
                setTimeout(() => {
                  self.props.refresh();
                }, 100);
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
      } else {
        ajax({
          url: window.APP.kbretailprod + '/gateway.htm?biz=supermarket.brand&action=/activity/offline',
          method: 'get',
          data: {
            data: JSON.stringify({planId: planId, activityId: activityId, ...values}),
          },
          type: 'json',
          success: (res) => {
            self.setState({
              loading: false,
            }, () => {
              if (res.success === true) {
                message.success('下架成功');

                self.props.onCancel();

                // 直接触发refresh会导致 modal隐藏样式问题，故设置延迟
                setTimeout(() => {
                  self.props.refresh();
                }, 100);
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
      }
    });
  },

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <Modal title={'下架'}
             width= {600}
             visible={this.props.show}
             onCancel={this.props.onCancel}
             maskClosable={false}
             footer={[<Button key="cancel" type="ghost" size="large" onClick={this.props.onCancel}>取消</Button>,
             <Button key="confirm" type="primary" size="large" onClick={this.submitDown} loading={this.state.loading}>确定</Button>]}>

        <p style={{marginBottom: 20, fontSize: 16}}>
          <Icon type="exclamation-circle" style={{color: '#0ae', fontSize: 16}}/> 下架后活动将立即停止，已确认的商户将被取消参加活动的资格。确认下架？
        </p>
        <Form horizontal form={this.props.form} onSubmit={this.submitDown}>
          <FormItem
            label="下架原因："
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            required>
            <Input type="textarea" placeholder="请输入下架原因，最多400个字符"
              {...getFieldProps('offlineReason', { rules: [
                { required: true, message: '请输入下架原因' },
                { max: 400, message: '下架原因最多不超过400个字' },
              ],
              })} />
          </FormItem>
        </Form>
      </Modal>
    );
  },
});

export default Form.create()(TakeOffModal);
