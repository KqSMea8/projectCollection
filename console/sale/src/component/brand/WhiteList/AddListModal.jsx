import React, {PropTypes} from 'react';
import {Form, Select, Input, Modal, message, Button} from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import ajax from 'Utility/ajax';

const FormItem = Form.Item;
const Option = Select.Option;

const AddListModal = React.createClass({
  propTypes: {
    onRefresh: PropTypes.func,
    onSearch: PropTypes.func,
    form: PropTypes.object,
    data: PropTypes.object,
    type: PropTypes.string,
  },

  getInitialState() {
    return {
      industryName: [],
      isTrue: true,
      visible: false,
    };
  },

  getIndustryName() {
    ajax({
      type: 'json',
      url: '/sale/brandRetailer/queryBrandRetailerCategory.json',
      method: 'get',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            industryName: res.data,
          });
        }
      },
    });
  },

  getIndustry() {
    this.getIndustryName();
  },

  // 添加或者更改信息的方法
  handleOk() {
    if (permission('BRANDRETAILE_MANAGER')) {
      this.props.form.validateFields((error, values) => {
        if (!!error) {
          return;
        }
        const {type} = this.props;
        const data = values;
        if (data.selectIndustryName || data.addIndustryName) {
          data.industryName = (data.selectIndustryName || data.addIndustryName);
        }

        delete data.selectIndustryName;
        delete data.addIndustryName;

        let url;
        if (type === 'editor') {
          url = '/sale/brandRetailer/updateBrandRetailer.json';
        } else if (type === 'add') {
          url = '/sale/brandRetailer/addBrandRetailer.json';
        }
        ajax({
          url: url,
          method: 'get',
          data: data,
          type: 'json',
          success: (res) => {
            if (res.status === true || res.status === 'succeed' ) {
              const code = this.props.type === 'add' ? '添加成功' : '修改成功';
              this.handleCancel();
              this.setState({isTrue: true});
              if (this.props.type === 'add') {
                this.props.onSearch({});
              } else {
                this.props.onRefresh();
              }
              message.success(code);
            } else {
              message.error(res.resultMsg);
              this.handleCancel();
            }
            this.getIndustryName();
          },
          error: res => {
            message.error(res.resultMsg);
            this.handleCancel();
          },
        });
      });
    } else {
      message.error('无权限操作');
    }
  },

  // 手机号的输入校验
  phoneName(rule, value, callback) {
    if (value) {
      const reg = /^[\d]+$/;
      if (!reg.test(value)) {
        callback([new Error('请输入数字')]);
      }

      if (value.length !== 11) {
        callback([new Error('手机号码必须是 11 位')]);
      }
      callback();
    }
    callback();
  },

  // pid的输入校验
  pid(rule, value, callback) {
    if (!value) {
      callback([new Error('此处必填')]);
    }
    if (value) {
      const reg = /^[\d]+$/;
      if (!reg.test(value)) {
        callback([new Error('请输入数字')]);
      }
      callback();
    }
    callback();
  },

  // 打开模态框，立即执行获取行业的数据，以便实时更新
  showAddListModal() {
    this.setState({visible: true});
    if (permission('BRANDRETAILE_QUERY')) {
      this.getIndustryName();
    }
  },

  // 关掉模态框并重置表单
  handleCancel() {
    this.setState({visible: false});
    this.props.form.resetFields();
  },

  // 更改添加行业的方法
  addndustry() {
    this.setState({ isTrue: !this.state.isTrue });
  },

  render() {
    const {getFieldProps} = this.props.form;
    const {isTrue, industryName, visible} = this.state;
    const {type, data} = this.props;
    const Options = industryName && industryName.map((item, i) => {
      return (<Option value={item} key={i}>{item}</Option>);
    });
    return (
      <span>
        {
          this.props.type === 'add' && <Button style={{float: 'right'}} type="primary" onClick={this.showAddListModal}>添加名单</Button>
        }

        {
          this.props.type === 'editor' && <a onClick={this.showAddListModal}> 编辑 </a>
        }

        <Modal
          title={this.props.type === 'add' ? '添加商户名单' : '编辑商户名单'}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form horizontal className="advanced-search-form" style={{padding: 16}}>
            <FormItem
              label="零售商pid："
              required
              labelCol={{span: 4}}
              wrapperCol={{span: 16}}>
              <Input
                disabled={type === 'editor'}
                {...getFieldProps('pid', {
                  rules: [
                    {validator: this.pid},
                  ],
                  initialValue: data && data.pid || '',
                })}/>
            </FormItem>

            <FormItem
              label="商户名称："
              labelCol={{span: 4}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('displayName', {
                rules: [
                  {required: true, message: '此处必填'},
                ],
                initialValue: data && data.displayName || '',
              })} placeholder="请输入"/>
            </FormItem>

            <FormItem
              label="城市名称："
              labelCol={{span: 4}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('cityName', {
                initialValue: data && data.cityName || '',
              })} placeholder="请输入"/>
            </FormItem>

            <div onClick={this.getIndustry}>
              <FormItem
                label="行业名称 ："
                labelCol={{span: 4}}
                wrapperCol={{span: 16}}
              >
                {
                  isTrue ?
                    (<Select
                      style={{width: 200}}
                      placeholder="全部"
                      {...getFieldProps('selectIndustryName', {
                        initialValue: data && data.industryName || '',
                        rules: [
                          {required: true, message: '此处必填'},
                        ],
                      })}>
                      {Options}
                    </Select>)
                    :
                    (<Input
                      style={{width: 200}}
                      placeholder="请输入"
                      {...getFieldProps('addIndustryName', {
                        initialValue: data && data.industryName || '',
                        rules: [
                          {required: true, message: '此处必填'},
                        ],
                      })}/>)
                }

                <a style={{ marginLeft: 20 }} onClick={this.addndustry}>{isTrue ? '新增行业' : '返回选择'}</a>
              </FormItem>
            </div>

            <FormItem
              label="联系方式："
              labelCol={{span: 4}}
              wrapperCol={{span: 16}}>
              <Input placeholder="请输入" {...getFieldProps('phone', {
                rules: [
                  {validator: this.phoneName},
                ],
                initialValue: data && data.phone || '',
              })}/>

            </FormItem>

          </Form>
        </Modal>
      </span>
    );
  },
});

export default Form.create()(AddListModal);
