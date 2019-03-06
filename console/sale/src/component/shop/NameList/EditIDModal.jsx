import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Modal} from 'antd';
import CitySelect from './CitySelect';
/**
*查看或编辑页-添加或删除模块*
*/
const FormItem = Form.Item;

const EditIDModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
    children: PropTypes.any,
    display: PropTypes.string,
    visible: PropTypes.bool,
    hideModal: PropTypes.func,
    handleOK: PropTypes.func,
    handleDelete: PropTypes.func,
    inputContent: PropTypes.any,
    confirmLoading: PropTypes.bool,
    modalOptions: PropTypes.object,
  },
  getInitialState() {
    return {
      length: 0,
      collapsed: true,
      treeValue: '',
      defaultDate: [],
    };
  },
  onOk() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      if (this.props.modalOptions.type === 'add') {
        this.props.handleOK(values);
      }
      if (this.props.modalOptions.type === 'delete') {
        this.props.handleDelete(values);
      }
    });
  },
  countLength(rule, value, callback) {
    // 实时计算输入的ID个数；
    let _temp = '';
    if (value) {
      _temp = value.replace(/\n/g, ',').split(',');
      _temp = _temp.filter(item => item !== undefined && item !== null && item !== '');
    }
    this.setState({
      length: _temp.length,
    });
    callback();
  },
  render() {
    const {displayCode} = this.props.modalOptions;
    const {getFieldProps} = this.props.form;
    const display = this.props.display;
    const addModalOptions = {
      visible: this.props.visible,
      okText: this.props.modalOptions.okText,
      title: this.props.modalOptions.title,
      onOk: this.onOk,
      onCancel: this.props.hideModal,
      confirmLoading: this.props.confirmLoading,
      maskClosable: false,
    };
    return (<div>
        <Modal {...addModalOptions} >
        <Form horizontal>
          <Row>
            <Col>
            {
              display !== '城市名称' && displayCode !== 'importantArea' && display !== '主店名' &&
              <FormItem
              required
              extra={<div className="ft-gray"><div>已输入{this.state.length}个ID</div></div>}
              >
                <Input
                type="textarea"
                rows="16"
                placeholder="请输入对应的ID，多个则用换行隔开"
                {...getFieldProps('inputID', {
                  initialValue: this.props.inputContent || '',
                  rules: [
                    {
                      required: true,
                      pattern: /^[\d\n]+$/,
                      message: '仅支持纯数字输入,不支持特殊符号,请输入正确的ID,多个则用换行隔开',
                    }, this.countLength],
                })}
                />
              </FormItem>
            }
            {
              display === '主店名' && <FormItem
              required
              extra={<div className="ft-gray"><div>已输入{this.state.length}个</div></div>}
              >
                <Input
                type="textarea"
                rows="16"
                placeholder={`请输入对应的${display}，多个则用换行隔开`}
                {...getFieldProps('inputID', {
                  initialValue: this.props.inputContent || '',
                  rules: [this.countLength],
                })}
                />
              </FormItem>
            }
            {
              display === '城市名称' && displayCode === 'city' &&
              <FormItem
              required
              >
                <CitySelect {...getFieldProps('city')} />
              </FormItem>
            }
            {
              display === '区域名称' && displayCode === 'importantArea' &&
              <FormItem
              required
              >
                <CitySelect {...getFieldProps('city')} showDistrict/>
              </FormItem>
            }
            </Col>
          </Row>
        </Form>
        </Modal>
    </div>);
  },
});

export default Form.create()(EditIDModal);
