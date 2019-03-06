import React, {PropTypes} from 'react';
import {Icon, Form, Modal, message, Input, Row, Col} from 'antd';
import ajax from '../../../common/ajax';
const FormItem = Form.Item;

const MobileModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    show: PropTypes.bool,
    onCancel: PropTypes.func,
    update: PropTypes.func,
    initData: PropTypes.any,
    type: PropTypes.string,
  },

  getInitialState() {
    return {
      submitLoading: false,
    };
  },

  onInputChange(key, event) {
    const { getFieldValue } = this.props.form;

    const mobile = getFieldValue('mobiles');

    mobile[key] = event.target.value;

    this.props.form.setFieldsValue({
      mobiles: mobile,
    });
  },

  removeNum(k) {
    const { form } = this.props;
    let keys = form.getFieldValue('mobiles');

    keys = keys.filter((item, key) => {
      return key !== k;
    });

    form.setFieldsValue({
      mobiles: keys,
    });
  },

  addNum() {
    const { form } = this.props;
    let keys = form.getFieldValue('mobiles');

    keys = keys.concat('');

    form.setFieldsValue({
      mobiles: keys,
    });
  },

  findSameElem(array, element) {
    const indices = [];
    let idx = array.indexOf(element);
    while (idx !== -1) {
      indices.push(idx);
      idx = array.indexOf(element, idx + 1);
    }
    return indices;
  },


  checkErrorList(list, mobiles, msg) {
    list.map((item)=>{
      const indexArray = this.findSameElem(mobiles, item);

      indexArray.map((index)=> {
        this.props.form.setFields({
          ['mobile' + index]: {
            errors: [new Error(msg)],
          },
        });
      });
    });
  },


  submitModify() {
    const self = this;
    const { form, type, initData } = self.props;

    if (type === 'check') {
      self.props.onCancel();

      return;
    }

    form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      if (values.mobiles && !values.mobiles.length) {
        message.error('请至少保留一个预警通知手机号');
        this.props.form.setFieldsValue({
          mobiles: initData,
        });
        return;
      }

      this.setState({
        submitLoading: true,
      });

      ajax({
        url: '/promo/kbsettle/warnModify.json',
        method: 'post',
        data: {
          jsonDataStr: JSON.stringify({
            receivePhones: values.mobiles.join(','),
          }),
        },
        type: 'json',
        success: (res) => {
          self.setState({
            submitLoading: false,
          }, () => {
            if (res.status === 'success') {
              const { duplicatePhoneList, invalidPhoneList } = res;
              if (duplicatePhoneList && duplicatePhoneList.length > 0) {
                self.checkErrorList(duplicatePhoneList, values.mobiles, '请不要输入相同的手机号码');
                return;
              }

              if (invalidPhoneList && invalidPhoneList.length > 0) {
                self.checkErrorList(invalidPhoneList, values.mobiles, '请输入正确的手机号码');
                return;
              }

              message.success('修改成功');
              self.props.onCancel();
              self.props.update();
            } else {
              message.error(res.errorMsg);
            }
          });
        },
        error: (res) => {
          self.setState({
            submitLoading: false,
          }, () => {
            message.error(res.errorMsg);
          });
        },
      });
    });
  },

  checkPhoneNum(rule, value, callback) {
    const reg = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);
    if ( value.length > 0 && !reg.test(value) ) {
      callback([new Error('请输入正确的手机号码')]);
      return;
    }

    callback();
  },

  cancelModal() {
    this.props.onCancel();

    this.setState({
      submitLoading: false,
    });
  },

  render() {
    const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
    const { initData, type } = this.props;

    getFieldProps('mobiles', {
      initialValue: initData || [],
    });

    const mobiles = getFieldValue('mobiles');

    const formItems = mobiles && mobiles.map((item, key) => {
      return (
        <FormItem
            label={key === 0 ? `预警通知手机号` : null }
            labelCol= {{ span: 6 }}
            wrapperCol={ key === 0 ? { span: 18 } : { span: 18, offset: 6 }}
            help={getFieldError(`mobile${key}`)}
            key={key}
        >
          <Input {...getFieldProps(`mobile${key}`, {
            initialValue: item,
            onChange: (event) => {
              this.onInputChange(key, event);
            },
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入预警通知手机号',
            },
            { validator: this.checkPhoneNum }],
          })} style={{ width: '80%', marginRight: 8 }}
          />
          <Icon type="cross" onClick={() => this.removeNum(key)}/>
        </FormItem>
      );
    });

    return (
      <Modal title={'预警通知手机号'}
             width= {500}
             visible={this.props.show}
             onCancel={this.cancelModal}
             confirmLoading={this.state.submitLoading}
             onOk={this.submitModify}
             maskClosable={false}>
        {
          type === 'modify' ? (
            <Form horizontal form={this.props.form}>
              {formItems}

              { mobiles.length < 9 && <Row>
                <Col span="18" offset="6">
                  <span className="clickable" onClick={this.addNum}>+ 添加号码</span>
                </Col>
              </Row> }
            </Form>
          ) : (
            <Row>
              <Col span="6" offset="1">
                <span style={{color: '#666'}}>预警通知手机号: </span>
              </Col>
              <Col span="15">
                <ul>
                  {
                    initData && initData.map((item, key) => {
                      return (
                        <li key={key} style={{float: 'left', marginRight: 20, marginBottom: 10 }}>
                          {item}
                        </li>
                      );
                    })
                  }
                </ul>
              </Col>
            </Row>
          )
        }
      </Modal>
    );
  },
});

export default Form.create()(MobileModal);
