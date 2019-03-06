import React, {PropTypes} from 'react';
import {Modal, Form, Input, message} from 'antd';
import ajax from 'Utility/ajax';
// import permission from '@alipay/opbase-biz-kb-framework/framework/permission';
import {appendOwnerUrlIfDev} from '../../../common/utils';

const FormItem = Form.Item;

const AddAccountBillModal = React.createClass({
  propTypes: {
    form: PropTypes.any,
    instId: PropTypes.string,
    visible: PropTypes.bool,
    onAddOk: PropTypes.func,
    onCancel: PropTypes.func,
    billData: PropTypes.any,
  },

  getInitialState() {
    return {
      loading: false,
      validateStatus: {},
    };
  },

  handleCancel() {
    this.props.form.resetFields();
    this.setState(this.getInitialState());
    this.props.onCancel();
  },

  handleOk() {
    const { form, onAddOk } = this.props;
    const { getFieldValue, submit, validateFields, resetFields } = form;
    const billData = this.props.billData;
    const params = {
      billNos: getFieldValue('billNo'),
    };
    submit(() => {
      validateFields((errors)=> {
        if (!errors) {
          this.setState({
            loading: true,
          });
          ajax({
            url: appendOwnerUrlIfDev('/sale/rebate/merchantRebateBillByBillNos.json'),
            type: 'json',
            data: params,
            method: 'get',
            success: (result) => {
              this.setState({
                loading: false,
              });
              if (result.status === 'succeed') {
                //  如果返回的是空,则提示'请输入正确的账单号'
                if (result.data[0] === null || result.data[0] === '') {
                  this.setState({
                    validateStatus: {
                      validateStatus: 'error',
                      help: '请输入正确的账单号',
                    },
                  });
                  return;
                }
                if (this.props.instId !== result.data[0].instId) {
                  this.setState({
                    validateStatus: {
                      validateStatus: 'error',
                      help: '账单签约主体与已选择账单不同，请分开提交。',
                    },
                  });
                  return;
                }
                // 如果返回的数据在列表里已经存在或者 不是同一个服务商下的账单 都不能添加进列表
                for (let i = 0; i < billData.length; i++) {
                  if (result.data[0] !== null && billData[i].billNo === result.data[0].billNo) {
                    this.setState({
                      validateStatus: {
                        validateStatus: 'error',
                        help: '不能输入列表里已经存在的账单号',
                      },
                    });
                    return;
                  } else if (billData[i].ipRoleId !== result.data[0].ipRoleId) {
                    this.setState({
                      validateStatus: {
                        validateStatus: 'error',
                        help: '您没有权限添加该账单',
                      },
                    });
                    return;
                  }
                }
                const data = result.data[0];
                resetFields();
                onAddOk(data);
              }
            },
            error: (result) => {
              this.setState({
                loading: false,
              });
              if (result.resultMsg) {
                message.error(result.resultMsg, 3);
              }
            },
          });
        }
      });
    });
  },

  render() {
    const { getFieldProps } = this.props.form;
    const { loading, validateStatus } = this.state;
    return (
        <Modal
           visible={this.props.visible}
           title="添加账单"
           onOk={this.handleOk}
           onCancel={this.handleCancel}
           confirmLoading={loading}
        >
           <Form horizontal>
            <FormItem
              label="账单号："
              required
              {...validateStatus}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}>
              <Input
                style={{width: '300px'}}
                {...getFieldProps('billNo', {
                  rules: [
                    {
                      required: true,
                      message: '请输入正确的账单号',
                    },
                  ],
                })}
              />
             </FormItem>
          </Form>
        </Modal>
    );
  },
});

export default Form.create()(AddAccountBillModal);
