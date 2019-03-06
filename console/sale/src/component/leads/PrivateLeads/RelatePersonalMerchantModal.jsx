import {Modal, Form, Input, message} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
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
          this.queryLoginRoleAndSubmit(values);
        }
      });
    });
  },

  // 查询费率
  queryLoginRoleAndSubmit(requestData) {
    this.setState({ confirmLoading: true });
    const data = {
      categoryId: this.state.categoryId,
      type: 'CREATE_SHOP',
    };
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/queryStandardRate.json',
      method: 'get',
      data: data,
      type: 'json',
      success: (result) => {
        this.setState({ confirmLoading: false });
        if (result.status === 'succeed') {
          if (!result.data.needShowRate) {
            this.doSubmitRelatePerson(requestData);
          } else {
            this.setState({
              RateData: result.data,
              RateVisible: true,
              requestData: requestData,
              visible: false,
            });
          }
        }
      },
      error: (result) => {
        this.setState({ confirmLoading: false });
        if (result && result.status === 'failed') {
          message.error(result.resultMsg, 2.5);
          // this.handleCancel();
          // this.setState({submitButtonDisable: false});
        } else {
          message.error('费率接口查询失败', 2.5);
        }
      },
    });
  },

  handleRateCancel() {
    this.setState({
      RateVisible: false,
    });
  },


  doSubmitRelatePerson(requestData) {
    this.setState({
      RateConfirmLoading: true,
      confirmLoading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/relationPrivateMerchant.json',
      type: 'json',
      method: 'post',
      data: requestData,
      success: (result) => {
        if (result && result.status === 'succeed') {
          this.setState({
            RateVisible: false,
            visible: false,
          });
          message.success('关联已提交，等待商户确认');
          this.props.refreshParent();
        }
      },
      error: (result) => {
        message.error(result && result.resultMsg || '请求出错');
      },
      complete: () => {
        this.setState({
          RateConfirmLoading: false,
          confirmLoading: false,
        });
      },
    });
  },

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div style={{display: 'inline'}}>
        <div type="primary" onClick={this.showModal} >个人开店</div>
        <Modal ref="modal"
          zIndex={899}
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          title="个人开店" onOk={this.handleOk} onCancel={this.handleCancel}>
           <Form horizontal>
            <FormItem
              label="支付账号商户："
              required
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              help="请输入商家用于开店的支付宝账户，并确认真实身份无误"
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
          </Form>
        </Modal>
        <CreateLeadsRateModal
          categoryId={this.props.categoryId}
          formData={this.state.requestData}
          RateData={this.state.RateData}
          handleRateCancel={this.handleRateCancel}
          RateVisible={this.state.RateVisible}
          doSubmitRelate={this.doSubmitRelatePerson}
          RateConfirmLoading={this.state.RateConfirmLoading}/>
      </div>
    );
  },
});

export default Form.create()(RelateMerchantModal);
