import {Modal, Form, Input, message} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import CategoryChangeSignUtil from '../../../common/AreaCategory/categoryChangeSignUtil';
import CreateLeadsRateModal from '../common/CreateLeadsRateModal';

const FormItem = Form.Item;

const RelateMerchantModal = React.createClass({
  propTypes: {
    form: PropTypes.any,
    leadsId: PropTypes.any,
    refreshParent: PropTypes.func,
  },

  getInitialState() {
    return {
      data: [],
      validateStatus: {},
      confirmLoading: false,
      requestData: {},
      RateVisible: false,   // 控制费率
      RateConfirmLoading: false,
      categoryId: this.props.categoryId,
    };
  },

  componentWillUpdate(nextProps) {
    if (this.props.categoryId !== nextProps.categoryId) {
      this.setState({
        categoryId: nextProps.categoryId,
      });
    }
  },
  showModal() {
    this.setState({
      visible: true,
    });
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
  },

  handleOk() {
    this.props.form.submit(() => {
      this.props.form.validateFields((errors, values)=> {
        if (!errors) {
          values.leadsId = this.props.leadsId;
          this.checkChangeSignValidateAndSubmit(values);
        }
      });
    });
  },

  /**
   * 提交前检查改签校验
   */
  checkChangeSignValidateAndSubmit(requestData) {
    this.setState({
      confirmLoading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/enterpriseSignValidate.json',
      type: 'json',
      method: 'post',
      data: requestData,
      success: (result) => {
        this.setState({ validateStatus: {} });
        switch (result.data && result.data.signType) {
        case 'SIGN_MODIFY_TO_KOUBEI': // 商家需要改签
          CategoryChangeSignUtil.showShouldChangeSignConfirm({
            okText: '确定并提交',
            okCallback: () => {
              requestData.signType = result.data.signType;
              requestData.orderNum = result.data.orderNum;
              requestData.alipayAccount = result.data.alipayAccount;
              // 费率
              this.setState({
                requestData: requestData,
                visible: false,
              });
              this.queryLoginRole(requestData);
              // this.doSubmitRelate(requestData);
            },
            cancelCallback: () => {
              this.setState({
                validateStatus: {
                  validateStatus: 'error',
                  help: '当前品类需改签，请联系口碑小二改签',
                },
              });
            },
          });
          break;
        case 'MERCHANT_CAN_NOT_SIGN_KOUBEI': // 商家自己不能改签
          CategoryChangeSignUtil.showCantChangeSignAlert();
          break;
        case 'SIGN': // 无需签约 / 已改签
        // 费率
          this.setState({
            requestData: requestData,
            visible: false,
          });
          this.queryLoginRole(requestData);
        // this.doSubmitRelate(requestData);
          break;
        default:
          this.setState({
            validateStatus: {
              validateStatus: 'error',
              help: '改签校验接口异常',
            },
          });
        }
      },
      error: (result, errorMsg) => {
        this.setState({
          validateStatus: {
            validateStatus: 'error',
            help: errorMsg || '改签校验接口异常',
          },
        });
      },
      complete: () => {
        this.setState({
          confirmLoading: false,
        });
      },
    });
  },

  // 查询费率
  queryLoginRole(requestData) {
    const data = {
      merchantAccount: requestData.merchantAccount,
      merchantName: requestData.merchantName,
      categoryId: this.state.categoryId,
      type: 'CREATE_SHOP',
    };
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/queryStandardRate.json',
      method: 'get',
      data: data,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            RateData: result.data,
            RateVisible: result.data.needShowRate,
          });
          if (!result.data.needShowRate) {
          //   formData.rate = this.rate;
            this.doSubmitRelate(requestData);
          }
        }
      },
      error: (result) => {
        if (result.status === 'failed') {
          message.error(result.resultMsg, 2.5);
          // this.handleCancel();
          // this.setState({submitButtonDisable: false});
        }
      },
    });
  },

  handleRateCancel() {
    this.setState({
      RateVisible: false,
    });
  },


  doSubmitRelate(requestData) {
    this.setState({
      RateConfirmLoading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/relationMerchant.json',
      type: 'json',
      method: 'post',
      data: requestData,
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.setState({
            RateVisible: false,
          });
          this.props.refreshParent();
        }
      },
      error: (result) => {
        if (result && result.resultMsg) {
          this.setState({
            RateVisible: false,
          });
          message.error(result.resultMsg);

          // this.setState({
          //   validateStatus: {
          //     validateStatus: 'error',
          //     help: result.resultMsg,
          //   },
          // });
        }
      },
      complete: () => {
        this.setState({
          RateConfirmLoading: false,
        });
      },
    });
  },

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div style={{display: 'inline'}}>
        <div type="primary" onClick={this.showModal} >企业开店</div>
        <Modal ref="modal"
          zIndex={899}
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          title="企业开店" onOk={this.handleOk} onCancel={this.handleCancel}>
           <Form horizontal>
            <FormItem
              label="支付宝企业账号："
              required
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              help="请输入商家用于签约的支付宝账户，并确认真实身份无误"
              >
              <Input
              placeholder="请输入"
              {...getFieldProps('merchantAccount', {
                rules: [{
                  required: true,
                  message: '必填项',
                }],
              })}
              />
             </FormItem>
             <FormItem
              label="企业名称："
              required
              {...this.state.validateStatus}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}>
              <Input
              placeholder="请输入"
              {...getFieldProps('merchantName', {
                rules: [
                  {
                    required: true,
                    message: '必填项',
                  },
                ],
              })}
              />
             </FormItem>
          </Form>
        </Modal>
        <CreateLeadsRateModal
          categoryId={this.props.categoryId}
          formData={this.state.requestData}
          RateData={this.state.RateData}
          handleRateCancel={this.handleRateCancel}
          RateVisible={this.state.RateVisible}
          doSubmitRelate={this.doSubmitRelate}
          RateConfirmLoading={this.state.RateConfirmLoading}/>
      </div>
    );
  },
});

export default Form.create()(RelateMerchantModal);
