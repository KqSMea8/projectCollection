import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {Modal, Form, Cascader, Input, message, Spin, Button} from 'antd';
import {Uploader, normalizeUploadValueTweenty} from '../common/Uploader';

const FormItem = Form.Item;
const ControlModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    id: PropTypes.string,
    options: PropTypes.array,
  },

  getInitialState() {
    return ({
      visible: false,
      values: [],
      value: '管控工具',
      help: '',
      submitButtonDisable: false,
    });
  },

  onOptionsChange(item) {
    const {options} = this.props;
    options.map(item1 => {
      if (item1.value === item[0]) {
        item1.children.map(item2 => {
          if (item2.value === item[1]) {
            this.setState({
              value: item2.control,
              help: item2.remind,
            });
          }
        });
      }
    });
  },
  onSubmit() {
    this.props.form.submit(() => {
      this.props.form.validateFields((errors) => {
        if (errors) {
          return;
        }
        this.setState({submitButtonDisable: true});
        const info = {...this.props.form.getFieldsValue()};
        const {options} = this.props;
        const data = this.dealData(info, options);
        ajax({
          url: '/support/control/saleCreate.json',
          method: 'post',
          data: data,
          type: 'json',
          success: (result) => {
            if (result.status === 'succeed') {
              this.setState({
                visible: false,
                submitButtonDisable: false,
              });
              message.success('提交成功', 3);
              this.props.form.resetFields();
              this.setTimeOut();
            }
          },
          error: (result) => {
            if (result.status === 'failed') {
              message.error(result.resultMsg, 2.5);
              this.handleCancel();
              this.setState({submitButtonDisable: false});
            }
          },
        });
      });
    });
  },
  setTimeOut() {
    setTimeout(()=> {
      window.location.hash = '#/shop/my';
    }, 3000);
  },
  dealData(info, options) {
    const data = {};
    data.principalId = this.props.id;
    data.categoryLevel1 = info.submitReson[0];
    data.categoryLevel2 = info.submitReson[1];
    data.memo = info.memo;
    const picArr = [];
    info.attachments.map(each => {
      picArr.push(each.resourceId);
    });
    data.attachments = picArr;
    options.map(item1 => {
      if (item1.value === info.submitReson[0]) {
        item1.children.map(item2 => {
          if (item2.value === info.submitReson[1]) {
            data.principalType = item2.principalType;
            data.toolCode = item2.toolCode;
          }
        });
      }
    });
    return data;
  },
  showModal() {
    this.setState({
      visible: true,
    });
  },
  handleCancel() {
    this.setState({
      visible: false,
      submitButtonDisable: false,
    });
    this.props.form.resetFields();
  },
  render() {
    const {getFieldProps} = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const {options} = this.props;
    return (<div style={{display: 'inline-block'}}>
      <a onClick={this.showModal}>管控</a>
      <Modal
        title="管控"
        visible={this.state.visible}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" size="large" loading={this.state.submitButtonDisable} onClick={this.onSubmit}>
            确定
          </Button>,
        ]}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="提交原因："
            help="选择对应的门店原因将有对应的管控工具"
            style={{margin: '15px 0px', overflow: 'hidden'}}>
            {options ? <Cascader options={options} {...getFieldProps('submitReson', {rules: [{required: true, type: 'array'}], onChange: this.onOptionsChange})} placeholder="选择原因" style={{width: 250}} /> : <Spin />}
          </FormItem>
          <FormItem
            {...formItemLayout}
            style={{margin: '15px 0px', overflow: 'hidden'}}
            label="管控工具："
            help={this.state.help}>
            <Input disabled value={this.state.value} style={{width: 250}} />
          </FormItem>
          <FormItem label="附件："
            style={{margin: '15px 0px', overflow: 'hidden'}}
            help="附件必须填写"
            extra={<span style={{color: '#999999', lineHeight: '20px'}}>
              <div style={{paddingTop: '5px'}}>关店/休业，非全国KA需上传近7天拜访小记截图；全国KA需上传商户申请邮件截图</div>
              <div>仅支持jpg、jpeg、png、rar、zip格式,最多可上传20个附件</div>
              <div> 图片不超过2M,压缩文件不超过20M</div>
            </span>}
            {...formItemLayout}>
            <Uploader {...getFieldProps('attachments', {
              valuePropName: 'fileList',
              normalize: normalizeUploadValueTweenty,
              rules: [{
                required: true,
                max: 20,
                type: 'array',
                message: '仅支持jpg、jpeg、png、rar、zip  格式,最多可上传20个附件，图片不超过2M，压缩文件不超过20M',
              }],
            })}/>
          </FormItem>
          <FormItem {...formItemLayout}
            style={{overflow: 'hidden'}}
            label="备注：">
            <Input {...getFieldProps('memo', {rules: [{max: 120, message: '不能超过120字'}]})} type="textarea" placeholder="请输入" rows="3"/>
          </FormItem>
        </Form>
      </Modal>
    </div>);
  },
});

export default Form.create()(ControlModal);
