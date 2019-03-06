import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Page } from '@alipay/kb-biz-components';
import { Form, Select, Input, Row, Col, Button, Modal, message, Radio } from 'antd';
import ajax from '@alipay/ajax';
import store from './store';
import framework from '../common/framework';
import ServerHost from '../common/component/spiServerHost';
import { indexType } from './prop-type';
import spmConfig from './spm.config';
import './style.less';

/* eslint-disable */
const { shape, object, string, func } = PropTypes;
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
@framework()
@page({ store, spmConfig })
class Index extends PureComponent {
  static propTypes = {
    initData: shape(indexType),
    list: object,
    id: string,
    dispatch: func,
    detailData: object,
    form: object,
    objectEnvironmental: object,
  };

  componentDidMount() {
    const { dispatch, id } = this.props;
    dispatch({ type: 'queryEnvCode' });
    dispatch({
      type: 'queryDetail',
      payload: {
        id,
      },
    });
  }

  // 同步
  synchronizeToTestEnvironment = (detailData) => {
    if (window.APP.uvUserId === detailData.ownerIds) {
      // 判断权限
      ajax({
        url: '/confreg/spi/syncSpiConf.json',
        method: 'get',
        type: 'json',
        data: {
          id: detailData.id,
        },
        success: (res) => {
          // 请求成功
          if (res.status === 'succeed') {
            message.success('同步成功');
          } else {
            message.error(`${res.resultMsg}`, 3);
          }
        },
        error: () => {
          // 请求失败
          message.error('请求服务超时，请重试！', 3);
        },
      });
    } else {
      Modal.warning({
        title: '权限提示',
        content: '只有Owner可以管理自己的SPI',
      });
    }
  }

  render() {
    const { id, form: { getFieldProps }, detailData, objectEnvironmental: { env, col } } = this.props;
    const breadcrumb = [
      {
        title: 'SPI列表',
        link: '#/spi',
      },
      {
        title: 'SPI详情',
      },
    ];
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    const otherFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };

    const OwnerLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 4 },
    };

    const styleMargin = { marginLeft: 8 };

    const provinceData = ['OR', 'AND'];

    const provinceOptions = provinceData.map(province => (
      <Option key={province}> {province}</Option>
    ));
    const header = (<Button style={{ marginRight: 15 }} onClick={() => {this.props.history.push(`/detail/spiOperationLog/${id}`)}}>操作日志</Button>)

    return (
      <Page id="spiDetail" title="SPI详情" header={header} breadcrumb={breadcrumb}>
        <Form>
          <Row>
            <Col span={8}>
              <FormItem {...otherFormItemLayout} label="应用">
                <ServerHost placeholder="请输入品牌"
                  {...getFieldProps('brandId', {
                    initialValue: detailData.serverHost || undefined,
                    rules: [
                      {
                        message: '请输入品牌',
                      },
                    ],
                  })} disabled />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...otherFormItemLayout} label="接口名称">
                <Input value={detailData.operationType} disabled />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="业务类型">
                <Input value={detailData.bizType} disabled />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="校验登录">
                <RadioGroup name="isLoginVisible" {...getFieldProps('isLoginVisible', {
                  initialValue: detailData.isLoginVisible || undefined,
                })} >
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          {
            detailData.isLoginVisible === '1' &&
            (<div>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="自运营权限码">
                      <Input {...getFieldProps('selfAuthCode', {
                        initialValue: detailData.selfAuthCode || undefined,
                      })} disabled />
                    </FormItem>
                  </Col>
                  <Col span={7} style={styleMargin}>
                    <FormItem {...otherFormItemLayout} label="权限码关系">
                      <Select {...getFieldProps('selfAuthConj', {
                          initialValue: detailData.selfAuthConj || undefined,
                        })} disabled
                        style={{ width: 90, }}>
                        {provinceOptions}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="代运营权限码">
                      <Input {...getFieldProps('agentAuthCode', {
                        initialValue: detailData.agentAuthCode || undefined,
                      })} disabled />
                    </FormItem>
                  </Col>
                  <Col span={7} style={styleMargin}>
                    <FormItem {...otherFormItemLayout} label="权限码关系">
                      <Select {...getFieldProps('agentAuthConj', {
                          initialValue: detailData.agentAuthConj || undefined,
                        })} disabled
                        style={{ width: 90, }}>
                        {provinceOptions}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              </div>)
          }
          <Row>
            <Col span={12}>
              <FormItem {...OwnerLayout} label="Owner">
                <Input value={detailData.ownerNames || undefined} disabled style={{ width: 250, }} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right', }}>
              {
                env !== '生产环境' && <Button htmlType="submit" onClick={() => this.synchronizeToTestEnvironment(detailData)}>
                {{ 开发环境: '同步到测试环境', 测试环境: '同步到预发环境', 预发环境: '同步到生产环境' }[env] || ''}
              </Button>
              }
            </Col>
          </Row>
        </Form>
      </Page>
    );
  }
}

export default createForm()(Index);
