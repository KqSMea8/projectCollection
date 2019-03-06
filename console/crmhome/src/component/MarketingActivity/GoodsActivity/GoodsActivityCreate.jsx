/**
 * 商品活动创建与编辑
 */
/* eslint-disable react/sort-comp */
import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import ant, {
  Breadcrumb, Form, Row, Col, Spin, Button, InputNumber,
  Icon, Input, message, Modal, Popconfirm, Alert, Select,
  DatePicker,
} from 'antd';
import { Checkbox, decorators, Select as XFormSelect } from '@alipay/xform';
import ajax from '../../../common/ajax';
import {customLocation } from '../../../common/utils';
import { dateLaterThanToday } from '../../../common/dateUtils';
import Addgoods from './Addgoods';
import './style.less';

const startTime = moment(Date.now()).format('YYYY-MM-DD 00:00:00');
const endTime = moment(30 * 24 * 60 * 60 * 1000 + Date.now()).format('YYYY-MM-DD 23:59:59');

const CheckboxGroup = ant.Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const options = [
  { label: '创建正式活动', value: 'enableFormal' },
  { label: '创建测试活动 (测试活动仅白名单可见，只用于测试)', value: 'enableTest' },
];

const Activity = XFormSelect.config({
  label: '活动人群',
  defaultValue: 'DEFAULT',
  rules: [{ required: true, message: '请选择活动人群' }],
  options: [{
    key: 'DEFAULT',
    name: '全部用户',
  }, {
    key: 'ONLINE_NEWCOMER',
    name: '线上新客用户',
  }],
});

const Automatic = Checkbox.config({
  defaultValue: '0',
  field: 'automatic',
  label: '分发渠道',
  options: [{
    key: '0',
    name: '自动延长上架时间',
  }],
  extra: '活动时间结束时，若发放份数未销售完，则自动延期，每次延期30天',
});

// 被中台嵌入时重写 message
if (window.top !== window) {
  ['error', 'warn', 'success'].forEach(f => {
    message[f] = function iframeMessage(text) {
      window.parent.postMessage(JSON.stringify({ action: f, message: text }), '*');
    };
  });
}

class GoodsActivityCreate extends React.Component {
  state = {
    isEdit: !!this.props.params.id, // 是否是编辑页
    campaignStart: false, // 活动是否开始
    current: 1,
    showSizeChanger: 10,
    visible: false,
    formMode: 'create',
    goodsData: [],
    modalLoading: false,
    loading: false,
    dataLoading: false,
    total: 0,
    memo: '',
    enableFormal: false,
    enableTest: false,
    submitModalVisible: false,
    nameExtra: true,
    initData: {}, // 编辑时的接口初始数据
    selectedRowKeys: [], // 选中的商品Ids
    tempSelectedRowKeys: [], // 临时选中的商品Ids（为弹层展示用）
    goodsItemMap: {}, // 全局商品通过 itemId 获取商品对象。
    submiting: false,// 提交中
  };

  componentDidMount() {
    if (this.props.params.id) {
      this.getDetail();
    } else {
      this.props.form.setFieldsValue({
        'name': '',
        startTime,
        endTime,
        'totalLimitType': 'nolimit',
        'perDayLimitType': 'nolimit',
        'crowd': 'DEFAULT',
        'deductAmount': '',
        'autoRenewal': '0',
        'perUserLimitType': 'limit',
        'perUserPerDayLimitType': 'limit',
        'perUser': 1,
        'perUserPerDay': 1,
        // 'total': '',
        // 'perDay': '',
      });
    }
  }

  // 获取详情
  getDetail() {
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.kbservindustryprodUrl + `/merchantactivity/online/getActivityDetail.json`,
      method: 'get',
      data: {activityId: this.props.params.id.toString()},
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed' && res.data) {
          const {name, gmtStart, gmtEnd, countLimit, deductAmount, items, autoRenewal, crowd, campaignStart} = res.data.currentActivity;

          const initData = {
            'name': name,
            'startTime': moment(gmtStart).format('YYYY-MM-DD HH:mm:ss'),
            'endTime': moment(gmtEnd).format('YYYY-MM-DD HH:mm:ss'),
            'totalLimitType': +countLimit.total > 0 ? 'limit' : 'nolimit',
            'perDayLimitType': +countLimit.perDay > 0 ? 'limit' : 'nolimit',
            'crowd': crowd,
            'deductAmount': parseFloat(deductAmount, 10) || '',
            'autoRenewal': autoRenewal ? '0' : '',
            'perUserLimitType': +countLimit.perUser > 0 ? 'limit' : 'nolimit',
            'perUserPerDayLimitType': +countLimit.perUserPerDay > 0 ? 'limit' : 'nolimit',
            'total': +countLimit.total,
            'perDay': +countLimit.perDay,
            'perUser': +countLimit.perUser,
            'perUserPerDay': +countLimit.perUserPerDay,
          };

          this.props.form.setFieldsValue({
            'name': initData.name,
            'startTime': initData.startTime,
            'endTime': initData.endTime,
            'totalLimitType': initData.totalLimitType,
            'perDayLimitType': initData.perDayLimitType,
            'crowd': initData.crowd,
            'deductAmount': initData.deductAmount,
            'autoRenewal': initData.autoRenewal,
            'perUserLimitType': initData.perUserLimitType,
            'perUserPerDayLimitType': initData.perUserPerDayLimitType,
          });

          // Hack RC-Form 需要先 getFieldPorps 才能 setFieldsValue
          this.props.form.setFieldsValue({
            'total': initData.total,
            'perDay': initData.perDay,
            'perUser': initData.perUser,
            'perUserPerDay': initData.perUserPerDay,
          });

          const goodsItemMap = {};
          const selectedRowKeys = [];

          (items || []).forEach(item => {
            goodsItemMap[item.itemId] = item;
            selectedRowKeys.push(item.itemId);
          });

          this.setState({
            loading: false,
            selectedRowKeys,
            goodsItemMap,
            campaignStart, // 活动是否开始
            initData,
          });
        } else {
          message.error(res.resultMsg || '系统错误', 2);
        }
      },
      error: (res) => {
        message.error(res.resultMsg || '查询商品信息失败', 2);
      },
    });
  }

  getGoods = ({current = this.state.current, showSizeChanger = this.state.showSizeChanger})=>{
    this.setState({
      modalLoading: true,
      visible: true,
      current: current,
      showSizeChanger: showSizeChanger,
    });
    const params = {pageNo: current, pageSize: showSizeChanger};
    const { goodsItemMap } = this.state;
    ajax({
      url: window.APP.kbservindustryprodUrl + `/merchantactivity/item/queryItemList.json`,
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const {data, page} = result;
          // 更新全局商品map数据。
          (data || []).forEach(item => {
            if (item && item.itemId) {
              goodsItemMap[item.itemId] = item;
            }
          });

          this.setState({
            goodsItemMap,
            goodsData: data,
            modalLoading: false,
            total: page.totalSize,
          });
        } else {
          this.setState({
            modalLoading: false,
          });
          message.error(result.resultMsg || '系统错误', 2);
        }
      },
      error: (result) => {
        this.setState({
          modalLoading: false,
        });
        message.error(result.resultMsg || '系统错误', 2);
      },
    });
  }

  // 移除商品，直接主主数据上操作
  deleteActive = (itemId) => {
    const { selectedRowKeys } = this.state;
    const idx = selectedRowKeys.indexOf(itemId);
    selectedRowKeys.splice(idx, 1);
    this.setState({
      selectedRowKeys,
    });
  }

  showAddGoods = ()=>{
    const { selectedRowKeys, showSizeChanger } = this.state;
    this.setState({
      tempSelectedRowKeys: [...selectedRowKeys], // 把已选中的赋值给临时的选中数据
      visible: true,
    });

    this.getGoods(1, showSizeChanger);
  }

  onCancel = ()=>{
    this.setState({
      visible: false,
    });
  }

  setGoods = () =>{
    const { tempSelectedRowKeys } = this.state;
    this.setState({
      selectedRowKeys: [...tempSelectedRowKeys],
    });
  }

  onSelectChange(tempSelectedRowKeys) {
    this.setState({
      tempSelectedRowKeys,
    });
  }

  gotoGoodsDetailPage(itemId, industryType) {
    if (industryType === 'CATERING') {
      window.open(`#/catering/detail?itemId=${itemId}`);
    } else if (industryType === 'SERV_INDUSTRY') {
      window.open(`#/stuff/order`);
    }
  }

  memo = (e)=>{
    if (e.target.value.length <= 200) {
      this.setState({
        memo: e.target.value,
      });
    } else {
      message.error('备注内容最多可输入200字');
      e.target.value = this.state.memo;
    }
  }

  activity=(checkedValues)=>{
    this.setState({
      enableFormal: checkedValues.indexOf('enableFormal') !== -1,
      enableTest: checkedValues.indexOf('enableTest') !== -1,
    });
  }

  submitModalClose = ()=> {
    this.setState({
      submitModalVisible: false,
    });
  }

  enterSubmit = ()=>{
    this.props.form.validateFieldsAndScroll((errors, values) => {
      const { selectedRowKeys, goodsItemMap } = this.state;

      if (selectedRowKeys.length === 0) {
        message.error('请选择商品', 1.5);
        return;
      }

      if (!!errors) {
        return;
      }

      const selectedGoods = selectedRowKeys.map(itemId => goodsItemMap[itemId]);
      selectedGoods.sort((a, b) => {
        if (parseFloat(a.price, 10) < parseFloat(b.price, 10)) {
          return -1;
        }
        if (parseFloat(a.price, 10) > parseFloat(b.price, 10)) {
          return 1;
        }

        return 0;
      });

      if (values.deductAmount > parseFloat(selectedGoods[0].price, 10)) {
        message.error('立减金额必须在已选定的商品范围内，不能高于已选商品的最小值。', 2);
        return;
      }

      if (this.props.params.id) {
        this.postData(values);
      } else {
        this.setState({
          submitModalVisible: true,
        });
      }
    });
  }

  submit = ()=> {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      this.setState({
        submitModalVisible: false,
      });
      this.postData(values);
    });
  }

  postData(v) {
    this.setState({submiting: true});
    const { selectedRowKeys, memo, enableFormal, enableTest} = this.state;
    const postParams = {
      itemIds: [...selectedRowKeys],
      name: v.name,
      gmtStartStr: typeof(v.startTime) === 'string' ? v.startTime : moment(v.startTime).format('YYYY-MM-DD HH:mm:ss'),
      gmtEndStr: typeof(v.endTime) === 'string' ? v.endTime : moment(v.endTime).format('YYYY-MM-DD HH:mm:ss'),
      crowd: v.crowd,
      countLimit: JSON.stringify({
        total: v.totalLimitType === 'nolimit' ? '0' : v.total,
        perDay: v.perDayLimitType === 'nolimit' ? '0' : v.perDay,
        perUser: v.perUserLimitType === 'nolimit' ? '0' : v.perUser,
        perUserPerDay: v.perUserPerDayLimitType === 'nolimit' ? '0' : v.perUserPerDay,
      }),
      memo: memo,
      enableFormal: enableFormal,
      enableTest: enableTest,
      promoType: 'DEDUCT',
      deductAmount: v.deductAmount,
      autoRenewal: v.autoRenewal === '0',
    };
    let url = '/merchantactivity/online/createActivity.json';// 创建
    if (this.props.params.id) {
      postParams.ompActivityId = this.props.params.id;
      url = '/merchantactivity/online/editActivity.json';// 修改
    }
    ajax({
      url: window.APP.kbservindustryprodUrl + url,
      method: 'post',
      data: postParams,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          message.success('提交成功', 1.5);
          setTimeout(()=>{
            customLocation('/goods/itempromo/activityList.htm');
          }, 1500);
          this.setState({submiting: false});
        } else {
          message.error(res.resultMsg || '系统错误', 2);
        }
      },
      error: (res) => {
        message.error(res.resultMsg || '系统错误', 2);
        this.setState({submiting: false});
      },
    });
  }

  render() {
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }

    const formLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 10,
      },
    };

    const { getFieldProps, getFieldValue, getFieldError, validateFields } = this.props.form;
    const {
      visible, goodsData, modalLoading, total,
      enableFormal, enableTest, submitModalVisible,
      dataLoading, nameExtra, isEdit, initData, campaignStart,
      selectedRowKeys, tempSelectedRowKeys, goodsItemMap, submiting,
    } = this.state;

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys: tempSelectedRowKeys,
      onChange: this.onSelectChange.bind(this),
      getCheckboxProps: (item) => ({disabled: !item.canSelect}),
    };

    // 修改规则：活动未开始，都能修改，活动已开始限制修改
    const isDisabledEdit = isEdit; // 禁止修改
    let isLimitedEdit = false; // 限制修改
    if (isEdit && campaignStart) {// 此处的campaignStart为true表示活动已开始
      isLimitedEdit = true;
    }
    const today = moment();
    const startTimeProps = getFieldProps('startTime', {
      rules: [
        { required: true, message: '请选择活动开始时间' },
        { validator: (rule, value, callback) => {
          if (!getFieldValue('endTime')) {
            callback();
          } else {
            const startDate = moment(value);
            const endDate = moment(getFieldValue('endTime'));

            if (!startDate.isBefore(endDate)) {
              callback([new Error('开始时间应该早于结束时间')]);
              return;
            }
            if (!endDate.isBefore(startDate.clone().add(10, 'years'))) {
              callback(new Error('活动时间最长为 10 年'));
              return;
            }

            if (getFieldError('endTime')) {
              validateFields(['endTime'], {force: true});
            }

            callback();
          }
        }},
      ],
      initialValue: today.clone().format('YYYY-MM-DD 00:00:00'),
      getValueFromEvent: (date, dateString) => dateString,
    });

    const endTimeProps = getFieldProps('endTime', {
      rules: [
        { required: true, message: '请选择活动结束时间' },
        { validator: (rule, value, callback) => {
          if (!getFieldValue('startTime')) {
            callback();
          } else {
            const startDate = moment(getFieldValue('startTime'));
            const endDate = moment(value);

            if (!startDate.isBefore(endDate)) {
              callback([new Error('结束时间应该大于开始时间')]);
              return;
            }
            if (endDate.isAfter(startDate.clone().add(10, 'years'))) {
              callback(new Error('活动时间最长为 10 年'));
              return;
            }

            // 如果已上架，时间只能后延
            if (isLimitedEdit) {
              if (endDate.isBefore(moment(initData.endTime))) {
                callback([new Error('活动结束时间只可后延')]);
                return;
              }
            }

            if (getFieldError('startTime')) {
              validateFields(['startTime'], {force: true});
            }
            callback();
          }
        }},
      ],
      initialValue: today.clone().add(1, 'month').format('YYYY-MM-DD 23:59:59'),
      getValueFromEvent: (date, dateString) => dateString,
    });

    return (
      <div className="goodsActivityCreate">
        <div className="app-detail-header">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>通用营销</Breadcrumb.Item>
            <Breadcrumb.Item>商品立减</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Spin spinning={dataLoading}>
          <div className="goodsActivityCreate-body">
            <Form horizontal form={this.props.form}>
              <div className="head-title">
                第1步：选择要参与活动的商品
              </div>
              <div className="addgoods">
                {
                  selectedRowKeys.map(itemId=>{
                    return (
                      <div className="goods" key={itemId}>
                        <div className="img">
                          <img src={goodsItemMap[itemId].imageUrl} />
                        </div>
                        <p>
                          {goodsItemMap[itemId].itemName}
                        </p>
                        <div className="text">
                          原价：{goodsItemMap[itemId].originalPrice}<br />
                          现价：{goodsItemMap[itemId].price}<br />
                          库存：{goodsItemMap[itemId].inventory}
                        </div>
                        <div className="operation">
                          {
                            (goodsItemMap[itemId].industryType && ['SERV_INDUSTRY', 'CATERING'].indexOf(goodsItemMap[itemId].industryType) >= 0) && (
                              <Icon type="eye-o" onClick={()=>this.gotoGoodsDetailPage(goodsItemMap[itemId].itemId, goodsItemMap[itemId].industryType)}>
                                查看
                              </Icon>
                            )
                          }
                          <Popconfirm
                            placement="top"
                            title="确定移除该商品？"
                            onConfirm={()=>this.deleteActive(itemId)}>
                            <Icon type="delete">
                              移除
                            </Icon>
                          </Popconfirm>
                        </div>
                      </div>
                    );
                  })
                }
              <div className="addbtn" onClick={this.showAddGoods}>
                <Icon type="plus" size="50" />
                <br />
                添加商品
              </div>
              </div>
              <div className="head-title">
                第2步：设置活动信息
              </div>
              <div className="title">
                基本信息
              </div>
              <FormItem
                {...formLayout}
                label="活动名称"
                required
                extra={nameExtra ? '活动名称不会展示给用户，最多输入20个字' : ''}
              >
                <Input
                  placeholder="请输入"
                  {...getFieldProps('name', {
                    validateTrigger: 'onBlur',
                    rules: [{
                      validator: (rule, value, callback) => {
                        if (!value) {
                          callback('请输入');
                        }
                        if (value.length > 20) {
                          this.setState({
                            nameExtra: false,
                          });
                          callback('活动名称不会展示给用户，最多输入20个字');
                        } else {
                          this.setState({
                            nameExtra: true,
                          });
                        }
                        callback();
                      },
                    }],
                  })}/>
              </FormItem>

              <FormItem label="活动时间：" {...formLayout} required
                        help={getFieldError('startTime') || getFieldError('endTime')}
                        validateStatus={
                          classnames({
                            error: !!(getFieldError('startTime') || getFieldError('endTime')),
                          })
                        }
              >
                <DatePicker {...startTimeProps} showTime format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间"
                            disabledDate={dateLaterThanToday} disabled={isLimitedEdit} />
                <span style={{ margin: '0 5px', color: '#ccc' }}>－</span>
                <DatePicker {...endTimeProps} showTime format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间"
                            disabledDate={dateLaterThanToday} />
              </FormItem>
              <FormItem
                {...formLayout}
                label="立减金额"
                required
              >
                <InputNumber
                  min={0.01}
                  max={4999.99}
                  step={0.01}
                  disabled={isDisabledEdit}
                  {...getFieldProps('deductAmount', {
                    rules: [{
                      required: true,
                      message: '请填写【立减金额】',
                    }],
                  })} /><span>元</span>
              </FormItem>
              <div className="title">
                发放规则
              </div>
              <FormItem
                label="总份数"
                {...formLayout}
                required
                help={getFieldValue('totalLimitType') === 'limit' && getFieldError('total')}
                validateStatus={
                  classnames({
                    error: getFieldValue('totalLimitType') === 'limit' && !!getFieldError('total'),
                  })
                }
              >
                <Row>
                  <Col span="7">
                    <Select
                      placeholder="请选择"
                      disabled={isDisabledEdit && initData.totalLimitType === 'nolimit'}
                      {...getFieldProps('totalLimitType', {
                        rules: [
                          {
                            required: getFieldValue('totalLimitType') === 'limit',
                          },
                        ],
                        initialValue: 'nolimit',
                      })}
                    >
                      <Option value="nolimit">不限制</Option>
                      <Option value="limit">设置份数</Option>
                    </Select>
                  </Col>
                  <Col span="17">
                    {
                      getFieldValue('totalLimitType') === 'limit' &&
                      <div style={{ marginLeft: 10, display: 'inline-block' }}>
                        <InputNumber
                          min={1}
                          max={999999998}
                          step="1"
                          {...getFieldProps('total', {
                            rules: [
                              {
                                validator: (rule, value, callback) => {
                                  const totalValue = value;
                                  const perDayValue = getFieldValue('perDay');
                                  const perUserValue = getFieldValue('perUser');
                                  const perUserPerDayValue = getFieldValue('perUserPerDay');

                                  if (!value) {
                                    callback('请输入总份数');
                                    return;
                                  }

                                  if (perDayValue && (totalValue < perDayValue)) {
                                    callback('总份数要大于每日发放份数');
                                    return;
                                  }

                                  if (perUserValue && (totalValue < perUserValue)) {
                                    callback('总份数要大于单用户活动期间可享优惠份数');
                                    return;
                                  }

                                  if (perUserPerDayValue && (totalValue < perUserPerDayValue)) {
                                    callback('总份数要大于单用户每天可享优惠份数');
                                    return;
                                  }

                                  if (isDisabledEdit && +totalValue < +initData.total) {
                                    callback('份数只能增加');
                                    return;
                                  }

                                  if (getFieldError('perDay')) {
                                    validateFields(['perDay'], {force: true});
                                  } else if (getFieldError('perUser')) {
                                    validateFields(['perUser'], {force: true});
                                  } else if (getFieldError('perUserPerDay')) {
                                    validateFields(['perUserPerDay'], {force: true});
                                  }

                                  callback();
                                },
                              },
                            ],
                          })}
                        /> 份
                      </div>
                    }
                  </Col>
                </Row>
              </FormItem>
              <FormItem
                label="每日发放份数"
                {...formLayout}
                required
                help={getFieldValue('perDayLimitType') === 'limit' && getFieldError('perDay')}
                validateStatus={
                  classnames({
                    error: getFieldValue('perDayLimitType') === 'limit' && !!getFieldError('perDay'),
                  })
                }
              >
                <Row>
                  <Col span="7">
                    <Select
                      placeholder="请选择"
                      disabled={isDisabledEdit && initData.perDayLimitType === 'nolimit'}
                      {...getFieldProps('perDayLimitType', {
                        rules: [
                          {
                            required: getFieldValue('perDayLimitType') === 'limit',
                          },
                        ],
                        initialValue: 'nolimit',
                      })}
                    >
                      <Option value="nolimit">不限制</Option>
                      <Option value="limit">设置份数</Option>
                    </Select>
                  </Col>
                  <Col span="17">
                    {
                      getFieldValue('perDayLimitType') === 'limit' &&
                      <div style={{ marginLeft: 10, display: 'inline-block' }}>
                        <InputNumber
                          min={1}
                          max={999999998}
                          step="1"
                          {...getFieldProps('perDay', {
                            rules: [
                              {
                                validator: (rule, value, callback) => {
                                  const perDayValue = value;
                                  const totalValue = getFieldValue('total');
                                  const perUserPerDay = getFieldValue('perUserPerDay');

                                  if (!perDayValue) {
                                    callback('请输入每日发放份数');
                                    return;
                                  }

                                  if (totalValue && (totalValue < perDayValue)) {
                                    callback('总份数要大于每日发放份数');
                                    return;
                                  }

                                  if (perUserPerDay && (perDayValue < perUserPerDay)) {
                                    callback('每日发放份数要大于当用户每天可享优惠份数');
                                    return;
                                  }

                                  if (isDisabledEdit && +perDayValue < +initData.perDay) {
                                    callback('份数只能增加');
                                    return;
                                  }

                                  if (getFieldError('total')) {
                                    validateFields(['total'], {force: true});
                                  } else if (getFieldError('perUserPerDay')) {
                                    validateFields(['perUserPerDay'], {force: true});
                                  }

                                  callback();
                                },
                              },
                            ],
                          })}
                        /> 份
                      </div>
                    }
                  </Col>
                </Row>
              </FormItem>
              <Activity
                label="活动人群"
                field="crowd"
                required
                extra={getFieldValue('crowd') === 'ONLINE_NEWCOMER' ? '没有在商户下购买过线上商品的新客用户。' : ''}
                disabled={isDisabledEdit}
                {...formLayout}
              />
              <Automatic
                label="自动续期"
                field="autoRenewal"
                {...formLayout}
              />
              <div className="title">
                使用规则
              </div>
              <FormItem
                label="单用户活动期间可享优惠份数"
                {...formLayout}
                required
                help={getFieldValue('perUserLimitType') === 'limit' && getFieldError('perUser')}
                validateStatus={
                  classnames({
                    error: getFieldValue('perUserLimitType') === 'limit' && !!getFieldError('perUser'),
                  })
                }
              >
                <Row>
                  <Col span="7">
                    <Select
                      placeholder="请选择"
                      disabled={isDisabledEdit}
                      {...getFieldProps('perUserLimitType', {
                        rules: [
                          {
                            required: getFieldValue('perUserLimitType') === 'limit',
                          },
                        ],
                        initialValue: 'limit',
                      })}
                    >
                      <Option value="nolimit">不限制</Option>
                      <Option value="limit">设置份数</Option>
                    </Select>
                  </Col>
                  <Col span="17">
                    {
                      getFieldValue('perUserLimitType') === 'limit' &&
                      <div style={{ marginLeft: 10, display: 'inline-block' }}>
                        <InputNumber
                          min={1}
                          max={99}
                          step="1"
                          disabled={isDisabledEdit}
                          {...getFieldProps('perUser', {
                            rules: [
                              {
                                validator: (rule, value, callback) => {
                                  const perUserValue = value;
                                  const perUserPerDayValue = getFieldValue('perUserPerDay');
                                  const totalValue = getFieldValue('total');

                                  if (!value) {
                                    callback('请输入单用户活动期间可享优惠份数');
                                    return;
                                  }

                                  if (perUserPerDayValue && (perUserValue < perUserPerDayValue)) {
                                    callback('单用户活动期间可享优惠份数要大于单用户每天可享优惠份数');
                                    return;
                                  }

                                  if (totalValue && (totalValue < perUserValue)) {
                                    callback('总份数必须大于单用户活动期间可享优惠份数');
                                    return;
                                  }

                                  if (isLimitedEdit && +perUserValue < +initData.perUser) {
                                    callback('份数只能增加');
                                    return;
                                  }

                                  if (getFieldError('perUserPerDay')) {
                                    validateFields(['perUserPerDay'], {force: true});
                                  } else if (getFieldError('total')) {
                                    validateFields(['total'], {force: true});
                                  }

                                  callback();
                                },
                              },
                            ],
                          })}
                        /> 份
                      </div>
                    }
                  </Col>
                </Row>
              </FormItem>
              <FormItem
                label="单用户每天可享优惠份数"
                {...formLayout}
                required
                help={getFieldValue('perUserPerDayLimitType') === 'limit' && getFieldError('perUserPerDay')}
                validateStatus={
                  classnames({
                    error: getFieldValue('perUserPerDayLimitType') === 'limit' && !!getFieldError('perUserPerDay'),
                  })
                }
              >
                <Row>
                  <Col span="7">
                    <Select
                      placeholder="请选择"
                      disabled={isDisabledEdit}
                      {...getFieldProps('perUserPerDayLimitType', {
                        rules: [
                          {
                            required: getFieldValue('perUserPerDayLimitType') === 'limit',
                          },
                        ],
                        initialValue: 'limit',
                      })}
                    >
                      <Option value="nolimit">不限制</Option>
                      <Option value="limit">设置份数</Option>
                    </Select>
                  </Col>
                  <Col span="17">
                    {
                      getFieldValue('perUserPerDayLimitType') === 'limit' &&
                      <div style={{ marginLeft: 10, display: 'inline-block' }}>
                        <InputNumber
                          min={1}
                          max={99}
                          step="1"
                          disabled={isDisabledEdit}
                          {...getFieldProps('perUserPerDay', {
                            rules: [
                              {
                                validator: (rule, value, callback) => {
                                  const perUserPerDayValue = value;
                                  const perUserValue = getFieldValue('perUser');
                                  const totalValue = getFieldValue('total');
                                  const perDayValue = getFieldValue('perDay');

                                  if (!perUserPerDayValue) {
                                    callback('请输入单用户每天可享优惠份数');
                                    return;
                                  }

                                  if (perUserValue && (perUserValue < perUserPerDayValue)) {
                                    callback('单用户活动期间可享优惠份数要大于单用户每天可享优惠份数');
                                    return;
                                  }

                                  if (totalValue && (totalValue < perUserPerDayValue)) {
                                    callback('总份数要大于单用户每天可享优惠份数');
                                    return;
                                  }

                                  if (perDayValue && (perDayValue < perUserPerDayValue)) {
                                    callback('每日发放份数要大于单用户每天可享优惠份数');
                                    return;
                                  }

                                  if (isLimitedEdit && +perUserPerDayValue < +initData.perUserPerDay) {
                                    callback('份数只能增加');
                                    return;
                                  }

                                  if (getFieldError('perUser')) {
                                    validateFields(['perUser'], {force: true});
                                  } else if (getFieldError('total')) {
                                    validateFields(['total'], {force: true});
                                  } else if (getFieldError('perDay')) {
                                    validateFields(['perDay'], {force: true});
                                  }

                                  callback();
                                },
                              },
                            ],
                          })}
                        /> 份
                      </div>
                    }
                  </Col>
                </Row>
              </FormItem>
              <Row>
                <Col offset={5}>
                  <Button loading={submiting} type="primary" onClick={this.enterSubmit}>提交</Button>
                </Col>
              </Row>
            </Form>
            <Addgoods
              getGoods={this.getGoods}
              visible={visible}
              onCancel={this.onCancel}
              data={goodsData}
              loading={modalLoading}
              total={total}
              setGoods={this.setGoods}
              rowSelection={rowSelection}
            />
            <Modal
              style={{top: modalTop}}
              visible={submitModalVisible}
              title="发布活动"
              footer={[
                <Button key="back" type="ghost" onClick={this.submitModalClose}>取消</Button>,
                <Button key="submit" type="primary" onClick={this.submit} disabled={enableFormal === false && enableTest === false}>确定</Button>,
              ]}
              onCancel={this.submitModalClose}
              className="submitModal"
            >
              <div className="enterSubmit">
                <Alert message="请仔细确认以下内容" type="info" showIcon />
                <div className="nameAndmoney">
                  <span>活动名称：</span>
                  <strong>{getFieldValue('name')}</strong>
                </div>
                <div className="nameAndmoney">
                  <span>立减金额：</span>
                  <strong>{getFieldValue('deductAmount')}元</strong>
                </div>
                <div className="prompt">提交成功后，将根据以下选择创建活动（必选，允许多选）：</div>
                <CheckboxGroup
                  onChange={this.activity}
                  options={options}
                />
                {
                  enableTest && (
                    <div className="testText">
                      您可以在活动管理页查看测试活动的详情，测试活动不影响正式上架活动，且仅白名单内的用户可见。
                      <a href="/goods/itempromo/testList.htm" target="_blank">配置白名单</a>
                      <h5>测试方法</h5>
                      <p>使用测试名单的账号打开支付宝客户端，在活动店铺页领取优惠并验证核销。</p>
                    </div>
                  )
                }
                <div style={{overflow: 'hidden'}}>
                  <Col span="4">
                    <span>备注：</span>
                  </Col>
                  <Col span="18">
                    <Input
                      size="small"
                      placeholder="仅作管理使用，不会展示给用户"
                      onChange={this.memo}
                    />
                    <div style={{color: '#999'}}>备注内容最多可输入200字</div>
                  </Col>
                </div>
              </div>
            </Modal>
          </div>
        </Spin>
      </div>
    );
  }
}

export default decorators.formDecorator({
  fieldMetaProp: '__meta',
})(GoodsActivityCreate);
