import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Page } from '@alipay/kb-biz-components';
import fetch from '@alipay/kobe-fetch';
import { getSystemUrl } from '@alipay/kb-systems-config';
import { Form, Input, Row, Col, DatePicker, Button, Table, Modal, message } from 'antd';
import ajax from '@alipay/ajax';
import moment from 'moment';
import framework from '../common/framework';
import ServerHost from '../common/component/spiServerHost';
import store from './store';
import InnerUserSelect from '../common/InnerUserSelect';
import { indexType } from './prop-type';
import spmConfig from './spm.config';
import './style.less';

/* eslint-disable */
const RangePicker = DatePicker.RangePicker;
const { shape, object } = PropTypes;
const createForm = Form.create;
const FormItem = Form.Item;

@framework()
@page({ store, spmConfig })
class Index extends PureComponent {
  static propTypes = {
    initData: shape(indexType),
    list: object,
  };
  constructor(props) {
    super(props);
    const { pageInfo } = props;
    this.state = {
      pageNo: pageInfo.pageNo,// 当前页码
      pageSize: pageInfo.pageSize,// 一页几条记录
      totalItems: pageInfo.totalItems,// 总数据
      totalPages: pageInfo.totalPages,// 总页数
      visible: false,
    }
  }
  componentDidMount() {
    const { dispatch, pageInfo } = this.props;
    this.setState({
      pageNo: pageInfo.pageNo,
      pageSize: pageInfo.pageSize,
    })
    dispatch({ type: 'queryEnvCode' });
    fetch.ajax({
      url: `${getSystemUrl('buserviceUrl')}/pub/getLoginUser.json`,
      data: {
        userDefineSourceUrl: location.href,
      },
      type: 'jsonp',
    }).then(res => {
      dispatch({
        type: 'queryList',
        payload: {
          pageNo: 1,
          pageSize: 15,
          owner: res.data.operatorName,
        }
      })
    });
  }

  // 点击搜索
  handleSubmit = () => {
    const { dispatch } = this.props;
    this.setState({
      pageNo: 1,
      pageSize: 15,
    })
    this.props.form.validateFields((errors, values) => {
      dispatch({
        type: 'queryList',
        payload: {
          pageNo: 1,
          pageSize: 15,
          appName: values.appName,
          owner: values.owner ? values.owner.id : null,
          gmtModifiedStart: values.rangeDate ? values.rangeDate[0] : null,
          gmtModifiedEnd: values.rangeDate ? values.rangeDate[1] : null,
          bizType: values.bizType,
          operationType: values.operationType,
        }
      })
    });
  }

  // 清除条件
  conditionsRemoval = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  }

  // 新增
  newAddClick = (informationPrompt, env) => {
    if (informationPrompt === '') {
      // dev环境或者未知环境
      this.props.history.push('/spi/spiNewAdd/add');
    } else {
      if (env === '生产环境') {
        Modal.confirm({
          title: '新增',
          content: informationPrompt.replace('修改', '新增'),
          okText: '确定',
          cancelText: '取消',
        });
      } else {
        Modal.confirm({
          title: '新增',
          content: informationPrompt.replace('修改', '新增'),
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            // 跳到新增页面
            this.props.history.push('/spi/spiNewAdd/add');
          },
        });
      }
    }
  };

  onRangeDateChange = (value) => {
    const { dispatch } = this.props;
    const [gmtModifiedStart, gmtModifiedEnd] = value;
    dispatch({ type: 'setState', payload: {
      gmtModifiedStart: gmtModifiedStart && moment(gmtModifiedStart.getTime()).format('YYYY-MM-DD'),
      gmtModifiedEnd: gmtModifiedEnd && moment(gmtModifiedEnd.getTime()).format('YYYY-MM-DD'),
    } });
  }

  // 删除
  deleteData = (record, dispatch) => {
    if (window.APP.uvUserId === record.ownerIds) {
      Modal.confirm({
        title: `删除`,
        content: '真的要删除吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          // 确定删除
          dispatch({
            type: 'delSpiConfig',
            payload: {
              id: record.id,
            }
          })
        },
        onCancel: () => {
          this.setState({ deleteLoading: false });
        },
      });
    } else {
      Modal.warning({
        title: '权限提示',
        content: '只有Owner可以管理自己的SPI',
      });
    }
  }

  // 修改
  modify = (record, informationPrompt, env) => {
    if (window.APP.uvUserId === record.ownerIds) {
      if (informationPrompt === '') {
        // dev环境
        // 跳到修改页面
        this.props.history.push(`/spi/spiNewAdd/${record.id}`);
      } else {
        if (env === '生产环境') {
          Modal.confirm({
            title: '修改',
            content: informationPrompt,
            okText: '确定',
            cancelText: '取消',
          });
        } else {
          Modal.confirm({
            title: '修改',
            content: informationPrompt,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              // 跳到修改页面
              this.props.history.push(`/spi/spiNewAdd/${record.id}`);
            },
          });
        }
      }
    } else {
      Modal.warning({
        title: '权限提示',
        content: '只有Owner可以管理自己的SPI',
      });
    }
  }

  // 修改spi归属人
  modifyOwner = (record) => {
    const { dispatch } = this.props;
    if (window.APP.uvUserId === record.ownerIds) {
      dispatch({ type: 'queryDetail', payload: {id: record.id} });
      this.setState({
        visible: true,
      });
    } else {
      Modal.warning({
        title: '权限提示',
        content: '只有Owner可以管理自己的SPI',
      });
    }
  }

  // 确认修改spi归属人
  modifyOwnerOk = (id) => {
    const { dispatch } = this.props;
    this.props.form.validateFields((errors, values) => {
      dispatch({ type: 'updateSpiOwner', payload: {id, owner: values.ownerNames.id}})
      this.setState({
        visible: false,
      });
    });
  }

  // 取消修改归属人
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  // 查看
  findDetail = (id) => {
    this.props.history.push(`/spi/spiDetail/${id}`);
  }

  // 同步
  SynchronizeToTestEnvironment = (record, env) => {
    if (window.APP.uvUserId === record.ownerIds) {
      if (env === '预发环境') {
        Modal.confirm({
          title: '同步',
          content: '请在预发验证无误后再同步到生产环境，客官已确定？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.synchronize(record);
          },
        });
      } else {
        // 判断权限
        this.synchronize(record);
      }
    } else {
      Modal.warning({
        title: '权限提示',
        content: '只有Owner可以管理自己的SPI',
      });
    }
  }

  // 同步接口
  synchronize = (record) => {
    ajax({
      url: '/confreg/spi/syncSpiConf.json',
      method: 'get',
      type: 'json',
      data: {
        id: record.id,
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
  }

  render() {
    const { visible } = this.state;
    const { form: {getFieldProps}, gmtModifiedStart, gmtModifiedEnd, pageInfo, tableData, dispatch, objectEnvironmental: {
      env,
      col,
      informationPrompt,
    }, detailData } = this.props;
    const columns = [
      {
        title: '应用名',
        width: '150',
        dataIndex: 'serverHost',
      },
      {
        title: '业务类型',
        dataIndex: 'bizType',
      },
      {
        title: '接口名称',
        dataIndex: 'operationType',
      },
      {
        title: '修改时间',
        width: '150',
        dataIndex: 'gmtModified',
        render: (text) => (
          <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
      },
      {
        title: 'Owner',
        width: '150',
        dataIndex: 'ownerNames',
      },
      {
        title: '操作',
        width: '350',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <span>
              <a className="ant-dropdown-link" onClick={() => {
                this.findDetail(record.id);
              }}>
                查看
              </a>
              {
                env !== '生产环境' && (<span>
                <a className="ant-dropdown-link" onClick={() => {
                  this.modify(record, informationPrompt, env);}}>
                  修改
                </a>
                <a className="ant-dropdown-link" onClick={() => { this.modifyOwner(record) }}>
                  修改Owner
                </a>
                <a className="ant-dropdown-link" onClick={() => {
                  this.deleteData(record, dispatch);
                }}>
                  删除
                </a>
                <a className="ant-dropdown-link" onClick={() => {this.SynchronizeToTestEnvironment(record, env)}}>
                  {env === '开发环境' ? '同步到测试环境' : env === '测试环境' ? '同步到预发环境' : env === '预发环境' ? '同步到生产环境' : ''}
                </a>
              </span>)}
          </span>
          )
        }
      },
    ];

    const pagination = {
      total: pageInfo.totalItems,
      showTotal: (total) => `共${total}条数据`,
      defaultCurrent: 1,
      current: this.state.pageNo ? this.state.pageNo : 1,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      // showQuickJumper: true,
      pageSizeOptions: ['15', '30', '45', '60'],
      onChange: current => {
        this.setState({
            pageNo: current,
          },() => {
            dispatch({
              type: 'queryList',
              payload: {
                pageNo: this.state.pageNo,
                pageSize: this.state.pageSize,
                owner: {...getFieldProps('owner')}.value ? {...getFieldProps('owner')}.value.id : null,
              }
            })
          }
        );
      },
      onShowSizeChange: (current, pageSize) => {
        this.setState({
          pageNo: current,
          pageSize,
        },() => {
          dispatch({
            type: 'queryList',
            payload: {
              pageNo: this.state.pageNo,
              pageSize: this.state.pageSize,
              owner: {...getFieldProps('owner')}.value ? {...getFieldProps('owner')}.value.id : null,
            }
          })
        }
      );
      }
    };
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const formOwnerLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const testHeader = (
      <div style={{ color: 'red', textAlign: 'left',}}>友情提示：同步到预发环境时，请以自己的域账号登录，以免后续没有权限同步到线上。</div>
    );
    const pretestHeader = (
      <div style={{ color: 'red', textAlign: 'left',}}>友情提示：同步到生产环境时，请确保已充分测试，含权限码。目前暂不支持同步（修改）生产环境已存在的配置。</div>
    );
    return (
      <Page id="spi" title="SPI列表" header={env === '测试环境' ? testHeader : env === '预发环境' && pretestHeader}>
        <Form>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label="应用" hasFeedback>
                <ServerHost placeholder="请输入应用名" {...getFieldProps('appName')} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="业务类型">
                <Input {...getFieldProps('bizType')} placeholder="请输入业务类型" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="接口名称">
                <Input {...getFieldProps('operationType')} placeholder="请输入接口名称" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label="修改时间">
                <RangePicker
                  {...getFieldProps('rangeDate', {
                    onChange: this.onRangeDateChange,
                  })} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="Owner">
                <InnerUserSelect {...getFieldProps('owner')}
                style={{ width: 250, }} />
              </FormItem>
            </Col>
            <Col span={8} />
          </Row>
          <Row className="clearSearch">
            <Col span={24} style={{ textAlign: 'right',}}>
              <Button size="large" onClick={this.handleSubmit}>
                搜索
              </Button>
              <Button style={{ marginLeft: 8, }} size="large" onClick={this.conditionsRemoval}>
                清除条件
              </Button>
            </Col>
          </Row>
          {
            env !== '生产环境' && (<Row className="newAddButton">
            <Col span={24} style={{ textAlign: 'right', }}>
              <Button onClick={() => {this.newAddClick(informationPrompt, env)}}>
                新增
              </Button>
            </Col>
          </Row>)
          }
          <Row>
            <Col>
              <Table
                columns={columns}
                dataSource={tableData}
                bordered
                pagination={pagination} />
            </Col>
          </Row>
          {/* 修改SPI归属人 */}
          <Modal visible={visible} closable={false}
            onOk={() => { this.modifyOwnerOk(detailData.id) }}
            onCancel={this.handleCancel}>
            <FormItem {...formOwnerLayout} label="业务类型" style={{ marginTop: '10px', }}>
              <Input value={detailData.bizType} disabled placeholder="多个以英文半角逗号分割，可为空" />
            </FormItem>
            <FormItem {...formOwnerLayout} label="Owner">
              <InnerUserSelect {...getFieldProps('ownerNames', {
                initialValue: detailData.ownerNames || undefined,
              })}
                placeholder="多个以英文半角逗号分割，可为空"
                style={{ width: 150, }} />
            </FormItem>
          </Modal>
        </Form>
      </Page>
    );
  }
}

export default createForm()(Index);
