import {Cascader, Modal, Form, Radio, Input, message} from 'antd';
import React, {PropTypes}from 'react';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import isEmpty from 'lodash/isEmpty';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const composeCheckActionCascaderTree = (list, type) => {
  const makeNode = item => {
    return {
      value: item.value,
      label: item.name,
      children: []
    };
  };

  const root = makeNode({value: '', name: ''});

  const typeList = list.filter(i => i.type === type);

  const grow = (node) => {
    for (let i = 0; i < typeList.length; i++) {
      if (typeList[i].parent === node.value) {
        const iNode = makeNode(typeList[i]);
        typeList.splice(i, 1);
        i--;
        node.children.push(iNode);
        grow(iNode);
      }
    }
  };

  const clean = (node) => {
    if (node.children.length === 0) {
      delete node.children;
    } else {
      node.children.forEach(n => clean(n));
    }
  };

  grow(root);

  clean(root);

  return root.children;
};

const MaterialAcceptanceCheckModal = React.createClass({
  propTypes: {
    form: PropTypes.any,
    id: PropTypes.string,
    onCancel: PropTypes.func,
    updateLabel: PropTypes.func,
  },

  getInitialState() {
    return {
      data: [],
      type: 'PASS',
      passData: [],
      notPassData: [],
      delayData: [],
    };
  },

  componentDidMount() {
    this.fetchData();
  },

  onChange(e) {
    this.setState({
      type: e.target.value,
    });
    this.props.form.setFieldsValue({
      actionDesc: '',
    });
  },
  onSelect() {
    this.props.form.resetFields(['memo']);
  },

  fetchData() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/stuffCheckActionDescJson.json'),
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            data: result.stuffCheckActionDescVOList || [],
          });
        }
      },
      error: () => {},
    });
  },

  handleOk() {
    const actionDescList = this.props.form.getFieldValue('actionDesc') || [];
    const params = {
      stuffCheckId: this.props.id,
      checkStatus: this.props.form.getFieldValue('checkStatus'),
      actionDesc: actionDescList[0],
      actionDescTwo: actionDescList[1],
      memo: this.props.form.getFieldValue('memo'),
    };

    this.props.form.validateFields((errors) => {
      if (!errors) {
        ajax({
          url: appendOwnerUrlIfDev('/sale/asset/stuffCheckAudit.json'),
          data: params,
          success: (result) => {
            if (result.status === 'succeed') {
              this.setState({
                data: result.stuffCheckStatus || [],
              });
              this.props.onCancel();
              this.props.updateLabel();
              let info;
              if (this.state.type === 'PASS') {
                info = '审核通过';
              } else if (this.state.type === 'NOT_PASS') {
                info = '审核不通过';
              } else {
                info = '待上门检查';
              }
              message.success(info, 3);
            } else {
              if (result.resultMsg) {
                message.error(result.resultMsg, 3);
              }
            }
          },
        });
      }
    });
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
  },

  limitMemo(rule, value, callback) {
    if (value && value.length > 200) {
      callback('输入的字符不能超过200');
    } else {
      callback();
    }
  },

  render() {
    const {data, type} = this.state;
    const {getFieldProps, getFieldValue} = this.props.form;
    const isMemoRequired = !isEmpty(getFieldValue('actionDesc'))
      && ['NOT_PASS_ELSE', 'PASS_ELSE', 'WAIT_CHECK_ELSE']
        .some(
          v => getFieldValue('actionDesc').some(i => i === v)
        );
    const memoProps = getFieldProps('memo', {
      rules: [
        {
          required: isMemoRequired,
          message: '请填写备注！',
        }, {
          validator: this.limitMemo,
        },
      ]},
    );

    const cascaderProps = getFieldProps('actionDesc', {
      rules: [
        { required: true, message: '请选择说明' },
      ],
      onChange: this.onSelect
    });

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <div>
        <Modal title="处理"
          onOk={this.handleOk}
          visible
          confirmLoading={this.state.confirmLoading}
          onCancel={this.props.onCancel}>
          <p>{this.state.ModalText}</p>
          <Form horizontal style={{marginTop: 20}}>
            <FormItem
              label="结果："
              required
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 18 }} >
              <RadioGroup {...getFieldProps('checkStatus', {onChange: this.onChange, initialValue: type})}>
                <Radio style={radioStyle} value="PASS">审核通过</Radio>
                <Radio style={radioStyle} value="NOT_PASS">审核不通过</Radio>
                <Radio style={{display: 'none'}} value="OFFLINE_CHECK">待上门检查</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              label="说明："
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 18 }} >
              <Cascader
                {...cascaderProps}
                placeholder="请选择说明"
                options={composeCheckActionCascaderTree(data, type)}
                style={{ width: '300px'}}
              />
            </FormItem>
            <FormItem
              label="备注："
              labelCol={{ span: 5 }}
              required={isMemoRequired}
              wrapperCol={{ span: 18 }} >
                <Input type="textarea" rows="3" placeholder="请输入" id="textarea" name="textarea" {...memoProps}/>
            </FormItem>
          </Form>
        </Modal>
      </div>
     );
  },
});

export default Form.create()(MaterialAcceptanceCheckModal);
