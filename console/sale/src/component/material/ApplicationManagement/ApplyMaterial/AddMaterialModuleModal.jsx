import {Modal, Button, Form, message, InputNumber} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../../common/utils';

const FormItem = Form.Item;

const AddMaterialModuleModal = React.createClass({
  propTypes: {
    form: PropTypes.any,
    ids: PropTypes.array,
    callbackParent: PropTypes.func,
  },

  getInitialState() {
    return {
      data: [],
      validateStatus: {},
      confirmLoading: false,
    };
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
    const params = {
      templateIds: this.props.form.getFieldValue('templateIds'),
      mappingValue: 'kbasset.batchQueryTemplate',
      bizSource: 'KOUBEI_ASSET', // 后端必传字段
      domain: 'KOUBEI',
    };
    this.props.form.submit(() => {
      this.props.form.validateFields((errors)=> {
        if (!errors) {
          this.setState({
            confirmLoading: true,
          });
          ajax({
            // url: appendOwnerUrlIfDev('/sale/asset/stuffTemplateBatchQuery.json'),
            url: appendOwnerUrlIfDev('/proxy.json'),
            type: 'json',
            data: params,
            success: (result) => {
              if (result.status === 'succeed') {
                if (result.data[0] === null || result.data[0] === '') {
                  this.setState({
                    confirmLoading: false,
                    validateStatus: {
                      validateStatus: 'error',
                      help: '请输入正确的模版ID',
                    },
                  });
                }
                // const data = result.data[0].stuffTemplateDto;
                const data = result.data[0];
                this.setState({
                  confirmLoading: false,
                  visible: false,
                });
                this.props.callbackParent(data);
              } else {
                this.setState({
                  confirmLoading: false,
                });
              }
            },
            error: (result) => {
              if (result.resultMsg) {
                message.error(result.resultMsg, 3);
              }
              this.setState({
                confirmLoading: false,
              });
            },
          });
        }
      });
    });
  },

  fetchData() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/'),
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            data: result.data || [],
          });
        }
      },
      error: () => {},
    });
  },

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div style={{display: 'inline'}}>
        <Button type="primary" onClick={this.showModal} >
          添加模版
        </Button>
        <Modal ref="modal"
           visible={this.state.visible}
           confirmLoading={this.state.confirmLoading}
           title="添加模版" onOk={this.handleOk} onCancel={this.handleCancel}>
           <Form horizontal>
            <FormItem
              label="模版："
              required
              {...this.state.validateStatus}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}>
              <InputNumber style={{width: '300px'}}
              {...getFieldProps('templateIds', {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的模版ID',
                    type: 'number',
                  },
                ],
              })}
              />
             </FormItem>
          </Form>
        </Modal>
      </div>
    );
  },
});

export default Form.create()(AddMaterialModuleModal);
