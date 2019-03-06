import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Page } from '@alipay/kb-biz-components';
import { Form, Select, Input, Row, Col, Radio, Button, Modal, Alert, message } from 'antd';
import store from './store';
import framework from '../common/framework';
import ServerHost from '../common/component/spiServerHost';
import { indexType } from './prop-type';
import spmConfig from './spm.config';
import './style.less';

/* eslint-disable */
const { shape, object, string, func, array } = PropTypes;
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
@framework()
@page({ store, spmConfig })
class Index extends PureComponent {
  static propTypes = {
    initData: shape(indexType),
    list: object,
    title: string,
    form: object,
    objectEnvironmental: object,
    dispatch: func,
    detailData: object,
    name: string,
    address: string,
    serverHostKey: string,
    serverHostVal: string,
    id: string,
    serverHostData: array,
  };
  constructor(props) {
    super(props);
    this.state = {
      newApplication: false, // 新增应用
      applicationAddressVisible: false, // 修改应用地址
      checkTheApplication: false, // 查看应用
      text1: '',
      text2: '',
    };
  }

  componentDidMount() {
    const { dispatch, title } = this.props;
    dispatch({ type: 'queryEnvCode' });
    if (title !== 'add') {
      dispatch({
        type: 'queryDetail',
        payload: {
          id: title,
        },
      });
      dispatch({ type: 'getUpdateSpiConfig', payload: { id: title } });
    }
  }

  // 点击新增应用
  newApplication = (env) => {
    this.setState({
      newApplication: true,
    });
  }

  // 查看应用
  checkApplication = (id) => {
    const { dispatch, form: { getFieldProps } } = this.props;
    dispatch({ type: 'queryProxyenvGroupDetail', payload: { id, appName: { ...getFieldProps('appName') }.value } });
    this.setState({
      checkTheApplication: true,
    });
  }

  // 查看应用点确定
  checkApplicationOk = () => {
    this.setState({
      checkTheApplication: false,
    });
  }

  // 修改应用地址
  applicationAddress = (id) => {
    const { dispatch, form: { getFieldProps } } = this.props;
    dispatch({ type: 'queryProxyenvGroupDetail', payload: { id, appName: { ...getFieldProps('appName') }.value } });
    this.setState({
      applicationAddressVisible: true,
    });
  }

  // 新增应用点击确定
  newApplicationOk = () => {
    const { dispatch } = this.props;
    setTimeout(() => {
      this.setState({
        newApplication: false,
      });
      // 调用接口吧
      this.props.form.validateFields((errors, values) => {
        dispatch({ type: 'addKbProxyenvGroup',
          payload: {
            serverHostVal: this.refs.address.props.value, // 地址
            serverHostKey: values.name, // 服务器
          } });
      });
    }, 200);
  }

  // 修改应用地址点击确定
  applicationAddressOk = (env) => {
    const { dispatch, id } = this.props;
    if (env === '开发环境' || env === '测试环境') {
      this.setState({
        applicationAddressVisible: false,
      });
      // 调用接口吧
      this.props.form.validateFields((errors, values) => {
        dispatch({ type: 'updateKbProxyenvGroup',
          payload: {
            serverHostVal: values.serverHostKey, // 地址
            serverHostKey: values.serverHostVal, // 服务器
            id,
          } });
          this.props.form.setFieldsValue({ name: '' });
      });
    } else {
      Modal.warning({
        title: '修改提示',
        content: '仅开发和测试环境可以修改',
      });
    }
  }

  // 应用点击取消
  handleCancel = () => {
    this.setState({
      newApplication: false,
      applicationAddressVisible: false,
      checkTheApplication: false,
    });
    this.props.form.setFieldsValue({ name: '' });
  }


  // 点击提交
  handleSubmit = (env) => {
    const { title, dispatch } = this.props;
    this.props.form.validateFields((errors, values) => {
      if(!values.appName) {
        this.props.form.setFields({
          'appName': {
            value: '',
            errors: ['不能为空'],
          }
        })
      }
      if(!values.operationType) {
        this.props.form.setFields({
          'operationType': {
            value: '',
            errors: ['不能为空'],
          }
        })
      } else {
        const reg = /^[a-zA-Z]+(\.[a-zA-Z0-9]+)+(#[a-zA-Z0-9]+){1,2}$/;
        if (values.operationType && !reg.test(values.operationType)) {
          this.props.form.setFields({
            'operationType': {
              value: values.operationType,
              errors: ['请输入正确的接口名称'],
            }
          })
        }
      }
      // 判断校验是否通过
      if (errors) {
        message.error('提交失败');
        const getFieldError = this.props.form.getFieldError;
        const errMsgs = Object.keys(errors).map(key => getFieldError(key) && getFieldError(key)[0]);
        Modal.error({
          title: '提交失败',
          content: `失败原因：${errMsgs.join('、')}`,
        });
        return;
      } else {
        console.log(222);
        if (title === 'add') {
          // 新增页面
          dispatch({ type: 'addSpiConfig', payload: values });
        } else {
          // 修改页面
          if (env === '生产环境') { // eslint-disable-line
            confirm({
              title: '修改提示',
              content: '请确认修改无误，否则可能造成线上故障，是否继续？',
              onOk() {
                dispatch({ type: 'updateSpiConfig', payload: values });
              },
            });
          } else {
            dispatch({ type: 'updateSpiConfig', payload: values });
          }
        }
      }
    });
  }

  // 点击取消
  handleReset = () => {
    // 跳回列表页
    this.props.history.push('/spi');
  }

  checkConfirm = (rule, value, callback) => {
    const reg = /^[a-zA-Z]+(\.[a-zA-Z0-9]+)+(#[a-zA-Z0-9]+){1,2}$/;
    if (value && !reg.test(value)) {
      callback('请输入正确的接口名称');
    }
    callback();
  }
  checkAppName = (rule, value, callback) => {
    if (!value || value === undefined) {
      callback('请选择应用名');
    }
    callback();
  }


  render() {
    let breadcrumb;
    const { applicationAddressVisible, checkTheApplication, newApplication } = this.state;
    const { form: { getFieldProps }, title, detailData, objectEnvironmental: { env, col },
      serverHostKey, serverHostVal, serverHostData } = this.props;
    let titles;
    if (title === 'add') {
      titles = '新增SPI';
      breadcrumb = [
        {
          title: 'SPI列表',
          link: '#/spi',
        },
        {
          title: '新增SPI',
        },
      ];
    } else {
      titles = '修改SPI';
      breadcrumb = [
        {
          title: 'SPI列表',
          link: '#/spi',
        },
        {
          title: '修改SPI',
        },
      ];
    }
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 } };

    const otherFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };

    const styleMargin = { marginLeft: 8 };

    const provinceData = ['OR', 'AND'];

    const provinceOptions = provinceData.map(province => (
      <Option key={province}> {province}</Option>
    ));

    return (
      <Page id="spiNewAdd" title={titles} breadcrumb={breadcrumb}>
        <Form>
          <Row>
            <Col span={6}>
              <FormItem {...otherFormItemLayout} label="应用" required>
              <ServerHost placeholder="请输入应用"
                serverHostDatas={serverHostData || []}
                {...getFieldProps('appName', {
                  initialValue: detailData.serverHost || undefined,
                  rules: [
                    {
                      validator: this.checkAppName,
                    },
                  ],
                  onChange: (text) => {
                    this.props.form.setFieldsValue({ serverHostKey: text });
                  },
                })} />
              </FormItem>
            </Col>
            <Col span={12} push={2}>
              <Button onClick={() => this.checkApplication(detailData.id)} disabled={!{ ...getFieldProps('appName') }.value}>
                查看应用
              </Button>
              {
                env !== '生产环境' && (
                  <span>
                    <Button style={styleMargin} onClick={() => this.newApplication(env)}>新增应用</Button>
                    {
                      env !== '预发环境' && (<Button style={styleMargin} disabled={!{ ...getFieldProps('appName') }.value}
                      onClick={() => this.applicationAddress(detailData.id)}>
                      修改应用地址
                    </Button>)
                    }
                  </span>
                )
              }
            </Col>
            <Col span={6}>
              <FormItem {...otherFormItemLayout} required label="接口名称">
                <Input placeholder="请输入接口名称" {...getFieldProps('operationType', {
                  initialValue: detailData.operationType || undefined,
                  rules: [
                    {
                      required: true,
                      message: '请输入接口名称',
                    },
                    {
                      validator: this.checkConfirm,
                    },
                  ],
                  onChange: (e) => {
                    const val = e.target.value;
                    const arr = val.split('#');
                    const len = arr.length - 1;
                    if (len === 2) {
                      this.setState({
                        text1: arr[2],
                        text2: arr[1],
                      });
                    } else {
                      const text = arr[0].split('.');
                      const textLen = text.length - 1;
                      this.setState({
                        text1: `${text[textLen].substring(0, 1).toLowerCase()}${text[textLen].substring(1)}`,
                        text2: arr[1],
                      });
                    }
                  },
                })} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="业务类型" hasFeedback>
                <Input {...getFieldProps('bizType')} value={detailData.bizType ? detailData.bizType : { ...getFieldProps('appName') }.value && { ...getFieldProps('operationType') }.value ? `${{ ...getFieldProps('appName') }.value}.${this.state.text1}.${this.state.text2}` : null} disabled />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="校验登录" required>
                <RadioGroup name="isLoginVisible" {...getFieldProps('isLoginVisible', {
                  initialValue: detailData.isLoginVisible || '1',
                  rules: [
                      {
                        required: true,
                        message: '请选择是否需要登录校验',
                      },
                    ],
                })} >
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          {
            getFieldProps('isLoginVisible').value === '1' && (
              <div>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="自运营权限码" hasFeedback>
                      <Input {...getFieldProps('selfAuthCode', {
                        initialValue: detailData.selfAuthCode || undefined,
                      })} placeholder="多个以英文半角逗号分割，可为空" />
                    </FormItem>
                  </Col>
                  <Col span={7} style={styleMargin}>
                    <FormItem {...otherFormItemLayout} label="权限码关系">
                      <Select {...getFieldProps('selfAuthConj', {
                        initialValue: detailData.selfAuthConj || 'OR',
                      })} style={{ width: 90, }}>
                        {provinceOptions}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="代运营权限码" hasFeedback>
                      <Input {...getFieldProps('agentAuthCode', {
                        initialValue: detailData.agentAuthCode || undefined,
                      })} placeholder="多个以英文半角逗号分割，可为空" />
                    </FormItem>
                  </Col>
                  <Col span={7} style={styleMargin}>
                    <FormItem {...otherFormItemLayout} label="权限码关系">
                      <Select {...getFieldProps('agentAuthConj', {
                        initialValue: detailData.agentAuthConj || 'OR',
                      })}
                        style={{ width: 90, }}>
                        {provinceOptions}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              </div>
            )
          }
          <Row>
            <Col span={24} style={{ textAlign: 'right', }}>
              <Button htmlType="submit" onClick={() => this.handleSubmit(env)}>
                提交
              </Button>
              <Button style={{ marginLeft: 8, }}
                onClick={this.handleReset}>
                取消
              </Button>
            </Col>
          </Row>
          {/* 查看应用 */}
          <Modal visible={checkTheApplication} closable={false}
            onOk={this.checkApplicationOk}
            onCancel={this.handleCancel}>
            <FormItem {...formItemLayout} label="应用" hasFeedback>
              <Input {...getFieldProps('serverHostKey', {
                  initialValue: serverHostKey || undefined,
                })} disabled />
            </FormItem>
            <FormItem {...formItemLayout} label="地址" hasFeedback>
              <Input {...getFieldProps('serverHostVal', {
                  initialValue: serverHostVal || undefined,
                })} disabled />
            </FormItem>
          </Modal>
          {/* 新增应用 */}
          <Modal visible={newApplication} closable={false}
            onOk={this.newApplicationOk}
            onCancel={this.handleCancel}>
            <FormItem {...formItemLayout} label="应用" hasFeedback>
              <Input {...getFieldProps('name')} placeholder="多个以英文半角逗号分割，可为空" />
            </FormItem>
            <FormItem {...formItemLayout} label="地址" hasFeedback>
              <Input ref="address" value={{ ...getFieldProps('name') }.value ? `${{ ...getFieldProps('name') }.value}-pool.` + '${inner.domain}' : ''} placeholder="多个以英文半角逗号分割，可为空" disabled />
            </FormItem>
          </Modal>
          {/* 修改应用地址 */}
          <Modal visible={applicationAddressVisible} closable={false}
            onOk={() => {this.applicationAddressOk(env)}}
            onCancel={this.handleCancel}>
            <FormItem {...formItemLayout} label="应用" style={{ marginTop: '10px',}}>
              <Input {...getFieldProps('serverHostKey', {
                initialValue: serverHostKey || undefined,
              })} disabled />
            </FormItem>
            <FormItem {...formItemLayout} label="地址" hasFeedback>
              <Input {...getFieldProps('serverHostVal', {
                initialValue: serverHostVal || undefined,
              })} placeholder="多个以英文半角逗号分割，可为空" />
            </FormItem>
            <Alert message="友情提示"
              description="地址修改作用于该应用的所有SPI，仅供线下环境调试使用"
              type="success" />
          </Modal>
        </Form>
      </Page>
    );
  }
}

export default createForm()(Index);
