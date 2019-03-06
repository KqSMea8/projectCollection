import React, {PropTypes} from 'react';
import { Modal, Select, Form, Input, message} from 'antd';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../common/utils';
const Option = Select.Option;
const FormItem = Form.Item;
let InvalidModel = React.createClass({
  propTypes: {
    currentPage: PropTypes.any,
    id: PropTypes.any,
    changeTableData: PropTypes.func,
    visible: PropTypes.bool,
    show: PropTypes.bool,
    form: PropTypes.object,
    handleOk: PropTypes.func,
    getMemovalue: PropTypes.func,
    handleCancel: PropTypes.func,
    getChangeList: PropTypes.func,
    getFieldProps: PropTypes.object,

  },
  changerStatus() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const params = {
          templateId: this.props.id,
          memo: values.memo,
          status: 'INVALID',
          mappingValue: 'kbasset.updateStatusTemplate',
          domain: 'KOUBEI',
        };
        if (values.otherMemo) {
          params.otherMemo = values.otherMemo;
        }
        if (params.textarea === undefined || params.textarea === '') {
          delete params.textarea;
        }
        ajax({
          url: appendOwnerUrlIfDev('/proxy.json'),
          method: 'post',
          data: params,
          type: 'json',
          success: (result) => {
            if (result.status === 'succeed') {
              message.success('已失效', 3);
              this.props.handleOk();
              if (this.props.getChangeList) {
                this.props.getChangeList();
              }
              this.props.changeTableData();
            }
          },
        });
      }
    });
  },

  limitMemo(rule, value, callback) {
    if (value && value.length > 200) {
      callback('输入的字符不能超过200');
    } else {
      callback();
    }
  },

  memoSelect() {
    this.props.form.resetFields(['otherMemo']);
  },

  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    const otherMemo = getFieldProps('otherMemo', {
      rules: [
        {
          required: getFieldValue('memo') === '其他',
          message: '请输入原因',
        }, {
          validator: this.limitMemo,
        },
      ],
    });
    const memo = getFieldProps('memo', {
      rules: [
      { required: true, message: '请选择原因' },
      ],
    });

    return (
      <div>
        <Modal style={{height: '400'}} title="模版失效" visible={this.props.show}
          onOk={this.changerStatus} onCancel={this.props.handleCancel}>
            <Form horizontal>
            <FormItem
              label="原因："
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}>
              <Select {...memo} style={{ width: 200 }} onSelect={this.memoSelect}>
               <Option value="活动规则变更">活动规则变更</Option>
               <Option value="物料模板变更">物料模板变更</Option>
               <Option value="活动已结束">活动已结束</Option>
               <Option value="模板错误（图案)">模板错误（图案)</Option>
               <Option value="模板错误（文字)">模板错误（文字)</Option>
               <Option value="其他">其他</Option>
            </Select>
          </FormItem>
          {this.props.form.getFieldValue('memo') === '其他' && (<FormItem {...formItemLayout}
             label="备注：" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
             <Input type="textarea" placeholder="请输入原因" name="textarea" {...otherMemo}/>
         </FormItem>)}
         </Form>
      </Modal>
   </div>
    );
  },
});
InvalidModel = Form.create()(InvalidModel);
export default InvalidModel;
