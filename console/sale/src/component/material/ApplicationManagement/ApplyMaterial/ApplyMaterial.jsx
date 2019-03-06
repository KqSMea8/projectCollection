import React, {PropTypes} from 'react';
import {Lifecycle, History} from 'react-router';
import {message, Table, Form, Select, Input, Button, Popconfirm, InputNumber} from 'antd';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
import GetAllAreasData from '../../common/GetAllAreasData';
import {MaterialPropertiesMap, cutStr} from '../../common/MaterialLogMap';
import ConfirmOut from '../../common/ConfirmOut';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';
import OpenAreaSelect from '../../../../common/library/OpenAreaSelect';
import './ApplyMaterial.less';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from 'Library/ErrorPage/NoPermission';
import UserSelect from '../../../../common/UserSelect';
import PageLayout, { BlockTitle } from 'Library/PageLayout';
import SelectTemplateModal from '../../common/SelectTemplateModal';
import {getRequestId, getProviderInfo} from '../../common/api';

const FormItem = Form.Item;

function validate(arr) {
  let err = false;
  arr.map((val)=>{
    if (typeof val.materialPrice === 'undefined' || val.materialPrice === 0) {
      // 没有返回材质不能提交
      err = true;
    }
  });
  return err;
}

const ApplyMaterial = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.object,
    form: PropTypes.object,
  },
  mixins: [Lifecycle, History],

  getInitialState() {
    const user = getLoginUser();
    const {userChannel} = user;
    this.user = user;
    this.isBuc = userChannel === 'BUC';// 是不是小二
    return {
      requestId: '',
      validateMaterialCode: {},
      allAreasData: {},
      businessTypeData: {
        'categoryVOs': [],
      },
      totalPrice: 0,
      applyTableData: [],
      materialCodeData: [],
      materialOptions: [],
      loading: true,
      submitting: false,
      visible: false,
      pickingTemplate: false, // 正在选择模板
      providerData: {}, // 服务商数据
      inputList: [],
      stuffClass: [],
      material: [],
      cityMonthAmountData: '0.00',
      kAOptions: [],
      // 当取消编辑的时候弹窗控制
      showOutModal: false,
      bucAsProvider: false // 用于小二代服务商申请
    };
  },

  componentDidMount() {
    this.getRequestId();
    this.getMaterialCodeData();
    this.getBusinessTypeData();
    this.setProvider(this.user);
  },

  onSelectMaterial(record, index, temId, value) {
    const {inputList} = this.state;
    const {stuffAttrId, size, templateId, stuffType} = record;
    inputList[index].materialCode = value;
    inputList[index].size = size;
    inputList[index].stuffAttrId = stuffAttrId;
    inputList[index].stuffType = stuffType;
    inputList[index].tmpAndCode = templateId + value;
    const params = {
      mappingValue: 'kbasset.queryApplyPrice',
      domain: 'KOUBEI',
      materialCode: value,
      stuffAttrId,
      sizeCode: size,
    };
    if (value) {
      ajax({
        url: appendOwnerUrlIfDev('/proxy.json'),
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status && result.status === 'succeed') {
            inputList[index].materialPrice = Number(result.data.cent);
            inputList[index].unitPrice = result.data;
            this.calTotalMoney(inputList);
          } else {
            inputList[index].materialPrice = 0;
            inputList[index].unitPrice = {};
            this.calTotalMoney(inputList);
            message.error(result.resultMsg || '服务器繁忙，请稍后再试');
          }
        },
        error: (err) => {
          inputList[index].materialPrice = 0;
          inputList[index].unitPrice = {};
          this.calTotalMoney(inputList);
          message.error(err.resultMsg || '服务器繁忙，请稍后再试');
        },
      });
    }
  },

  onClickInputQuantity(record, index, stuffAttrId) {
    const {inputList} = this.state;
    inputList[index].quantity = this.props.form.getFieldValue(stuffAttrId);
    this.calTotalMoney(inputList);
  },

  getRequestId() {
    const showError = () => message.error('加载RequestId出错，请刷新重试。');
    getRequestId()
      .then(res => {
        if (res.status === 'succeed') {
          this.setState({requestId: res.data.requestId});
        } else {
          showError();
        }
      })
      .catch(showError);
  },

  // 获取物料材质下拉选数据
  getMaterialCodeData() {
    const params = {
      mappingValue: 'kbasset.queryStuffAttribute',
      domain: 'KOUBEI',
      bizSource: 'KOUBEI_ASSET'
    };
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.getModuleTableData();
          this.getMaterialOptions(result.data);
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
    });
  },
  // 物料材质下拉选
  getMaterialOptions(data) {
    const obj1 = {};
    data.map((key) => {
      const obj = {};
      key.material.map((k) => {
        obj[k.code] = k.name;
        obj1[key.stuffAttrId] = obj;
      });
    });
    this.setState({
      materialOptions: obj1,
      materialCodeData: data,
    });
  },

// 获取table数据
  getModuleTableData() {
    if (this.props.location.query.ids) {// 从模板页面传ids
      const params = {
        templateIds: this.props.location.query.ids.split(','),
        mappingValue: 'kbasset.batchQueryTemplate',
        bizSource: 'KOUBEI_ASSET',
        domain: 'KOUBEI',
      };
      ajax({
        url: appendOwnerUrlIfDev('/proxy.json'),
        // url: appendOwnerUrlIfDev('/sale/asset/stuffTemplateBatchQuery.json'),
        type: 'json',
        data: params,
        success: (result) => {
          if (result.status === 'succeed') {
            const applyTableData = [];
            const {inputList} = this.state;
            for (let i = 0; i < result.data.length; i++) {
              // 把需要展示在table里的数据拿到
              // applyTableData.push(result.data[i].stuffTemplateDto);
              applyTableData.push(result.data[i]);
              // 把需要提交的表单数据处理到inputList
              const json = {
                // templateId: result.data[i].stuffTemplateDto.id,
                // stuffType: result.data[i].stuffTemplateDto.stuffType,
                templateId: result.data[i].id,
                stuffType: result.data[i].stuffType,
              };
              inputList.push(json);
            }
            this.setState({
              visible: false,
              applyTableData: applyTableData,
            });
          } else {
            if (result.resultMsg) {
              message.error(result.resultMsg, 3);
            }
          }
        },
      });
    } else if (this.props.location.query.applyId) {// 设置回显用
      const params = {
        orderId: this.props.location.query.applyId,
        mappingValue: 'kbasset.queryApplyOrder',
        domain: 'KOUBEI',
      };
      ajax({
        url: appendOwnerUrlIfDev('/proxy.json'),
        type: 'json',
        data: params,
        success: (result) => {
          if (result.status === 'succeed') {
            const applyTableData = result.data.stuffApplyItemDtoList;
            const {inputList} = this.state;
            for (let i = 0; i < applyTableData.length; i++) {
              // 设置回显需要push的inputList
              const json = {
                templateId: applyTableData[i].templateId,
                materialCode: applyTableData[i].materialCode,
                stuffType: applyTableData[i].stuffType,
                quantity: applyTableData[i].applyQuantity,
              };
              inputList.push(json);
              // 设置回显需要的下拉选的值
              const materialCode = applyTableData[i].templateId + 'temId' + i;
              const obj = {};
              obj[materialCode] = applyTableData[i].materialCode;
              this.props.form.setFieldsValue(obj);
              // 设置table里的申请数量回显
              const applyQuantity = applyTableData[i].templateId + 'stuffAttrId' + i;
              const objQ = {};
              objQ[applyQuantity] = Number(applyTableData[i].applyQuantity);
              this.props.form.setFieldsValue(objQ);
            }
            // 回显其他表单的值
            // this.getAreaValue(result.stuffApplyOrderVO.storageCode);
            if (result.data.storageType === 'CITY') {
              result.data.storageCode = result.data.storageCode.split(',');
              result.data.storageCode.unshift(result.data.provinceCode);
              this.setState({
                storageCodeValue: result.data.storageCode,
              });
            }
            if (result.data.storageType === 'KA') {
              const obj = {};
              obj.merchantId = result.data.storageCode;
              obj.merchantName = result.data.storageName;
              result.data.storageCode = obj;
            }
            this.props.form.setFieldsValue(result.data);
            // 调用方法设置需要显示的已审批金额
            this.getMonthCheckedAmount(result.data.storageCode);

            this.setState({
              visible: false,
              applyTableData: applyTableData,
            });
          } else {
            if (result.resultMsg) {
              message.error(result.resultMsg, 3);
            }
          }
        },
      });
    }
  },

  getBusinessTypeData() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/category.json'),
      method: 'get',
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            businessTypeData: result,
          });
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
    });
  },

  getMonthCheckedAmount(value) {
    let cacheCode = '';
    let cacheType = '';
    if (value === 'YUNZONG') {
      cacheCode = '';
      cacheType = value;
    } else if (this.props.form.getFieldValue('storageType') === 'KA') {
      cacheCode = value.merchantId;
      cacheType = this.props.form.getFieldValue('storageType');
    } else {
      cacheCode = value;
      cacheType = this.props.form.getFieldValue('storageType');
    }
    // 这里是为了设置kaselect显示用的
    this.props.form.setFieldsValue({
      storageCode: value,
    });
    const params = {
      storageCode: cacheCode,
      storageType: cacheType,
    };
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/cityMonthAmount.json'),
      data: params,
      method: 'get',
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            cityMonthAmountData: cutStr(result.data.amount.toString()),
          });
        }
      },
    });
  },
  setProvider(user) {
    const {bucAsProvider} = this.state;

    // user为空，或小二自己申请
    if (!user || (this.isBuc && !bucAsProvider)) {
      this.setState({providerData: {}});
      return;
    }

    // 小二代服务商申请
    if (bucAsProvider) {
      this.setState({providerData: user});
      return;
    }

    // 服务商及服务商员工登录态
    if (!this.isBuc) {
      const {id} = user;
      getProviderInfo({operatorId: id})
        .then(res => {
          if (res.status === 'succeed') {
            this.setState({providerData: res.data});
          }
        });
    }
  },
  hideOutModel() {
    this.setState({showOutModal: false});
  },

  routerWillLeave(nextLocation) {
    this.nextPath = nextLocation.pathname;
    if (this.isApplySuccess !== 'hidenModel') {
      this.setState({showOutModal: !this.forceGoto});
      return !!this.forceGoto;
    }
  },

  // 相同的模板id不能出现相同的物料材质校验
  checkMaterialCode(rule, value, callback) {
    callback(new Error('相同的模版id,物料材质不能重复选择'));
  },

  checkOtherMaterialCode(rule, value, callback) {
    if (!value) {
      callback(new Error('请选择物料材质'));
    } else {
      callback();
    }
  },
  // 把下拉选里的值保存为一个对象，方便后面取用
  eachOption(obj) {
    const options = [];
    for (const val in obj) {
      if (obj.hasOwnProperty) {
        options.push(<Option key={val} value={val}>{obj[val]}</Option>);
      }
    }
    return options;
  },

  submitApply() {
    const self = this;
    const {inputList, requestId} = this.state;
    this.props.form.submit(() => {
      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          if (inputList.length === 0) {
            message.error('请至少添加一条申请明细', 3);
            return false;
          }
          const hasErr = validate(inputList);
          if (hasErr) {
            message.error('您选择了暂不支持申请的物料材质');
            return false;
          }
          const params = {
            mappingValue: 'kbasset.applyStuff',
            domain: 'KOUBEI',
            ...values,
            bizType: 'ALL',
            bizSource: 'KOUBEI_ASSET', // 后端必传字段
            channel: 'PC',// 后端必传字段
            bizTypeDesc: '全行业',
            requestId,  // 后端做 幂等检查
            applyStuffOrderItems: JSON.stringify(inputList),
          };
          if (this.isBuc) {
            // 小二
            const stuff = values.stuff || {};
            const id = stuff.hasOwnProperty('id') ? stuff.id : '';
            const chosenName = stuff.hasOwnProperty('chosenName') ? stuff.chosenName : '';
            params.storageType = 'CT';
            params.applicantId = id;
            params.applicant = chosenName;
          } else {
            // 服务商
            params.storageType = 'PROVIDER';
          }
          this.setState({submitting: true});
          ajax({
            url: appendOwnerUrlIfDev('/proxy.json'),
            method: 'get',
            data: params,
            type: 'json'
          })
            .then(res => {
              this.setState({submitting: false});
              if (res.status === 'succeed') {
                self.isApplySuccess = 'hidenModel';
                message.success('提交成功');
                this.setState({requestId: ''});
                location.hash = '#/material/applicationManagement/applicationRecord';
              } else {
                this.setState({loading: false});
              }
            })
            .catch(() => {
              this.setState({submitting: false});
            });
        }
      });
    });
  },

  addModuleData(result) {
    const {applyTableData, inputList} = this.state;
    // 设置回显需要传参用的inputList
    const json = {
      templateId: result.id,
      stuffType: result.stuffType,
    };
    inputList.push(json);
    // 把需要用到数据push到数组里，便于渲染页面
    applyTableData.push(result);
    this.setState({
      applyTableData,
    });
  },
  // 用于编辑页面是出现离开页面，二次确认
  goToNext() {
    this.forceGoto = true;
    window.location.hash = this.nextPath;
  },

  calTotalMoney(arr) {
    let all = 0;
    arr.map((obj) => {
      const quantity = obj.quantity || 0;
      const materialPrice = obj.materialPrice || 0;
      if (quantity && materialPrice) {
        all += (quantity * materialPrice) / 100;
      }
    });
    this.setState({totalPrice: all});
  },
  checkSame(templateId, rule, value, callback) {
    const inputList = this.state.inputList;
    const code = templateId + value;
    let count = 0;
    inputList.forEach((v) => {
      if (v.tmpAndCode === code) {
        count = count + 1;
      }
    });
    if (count >= 2) {
      callback(new Error('相同的模版id,物料材质不能重复选择'));
      return;
    }
    callback();
  },
  remove(record, index) {
    const {applyTableData, inputList} = this.state;
    if (applyTableData.length === 1) {
      message.error('请至少保留一条申请明细', 3);
      return false;
    }
    // 删除页面渲染数据
    applyTableData.splice(index, 1);
    this.setState({
      applyTableData,
    });
    // 删除渲染数据的同时 同步删除inputlist里的数据
    inputList.splice(index, 1);
    // 防止出现删除数据后填写的数据清空的情况  类似于回显操作
    for (let i = 0; i < inputList.length; i++) {
      // 设置回显需要的下拉选的值
      const materialCode = inputList[i].templateId + 'temId' + i;
      const obj = {};
      obj[materialCode] = inputList[i].materialCode;
      this.props.form.setFieldsValue(obj);
      // 设置table里的申请数量回显
      const applyQuantity = inputList[i].templateId + 'stuffAttrId' + i;
      const objQ = {};
      objQ[applyQuantity] = Number(isNaN(inputList[i].quantity) ? this.props.form.resetFields({applyQuantity}) : inputList[i].quantity);
      this.props.form.setFieldsValue(objQ);
    }
    // 计算总共的值
    this.calTotalMoney(inputList);
  },
  toggleShowProviderSelect() {
    const show = !this.state.bucAsProvider;
    // 点击"选择小二"时，隐藏服务商查询组件
    this.setState({bucAsProvider: show}, () => {
      if (!show) {
        this.setProvider(this.user);
      }
    });
  },
  handleClickAddTemplate() {
    this.setState({
      pickingTemplate: true
    });
  },
  renderPrice() {
    const {totalPrice} = this.state;
    if (totalPrice) {
      return (<p className="bottom-price">申请预估金额: <span
        style={{fontSize: '30', color: '#fa0'}}>{cutStr(totalPrice.toString())} 元</span></p>);
    }
    return null;
  },
  renderSinglePrice(price) {
    if (price) {
      return (<p className="single-price">预估单价{price / 100}元</p>);
    }
    return null;
  },
  render() {
    const user = this.user;
    const {requestId, submitting, loading, applyTableData, storageCodeValue, providerData,
      showOutModal, bucAsProvider, pickingTemplate} = this.state;
    const {getFieldProps} = this.props.form;
    if (!permission('STUFF_APPLY_ORDER_SUBMIT')) {
      return (<ErrorPage />);
    }
    const columns = [{
      title: '模板名称/ID',
      dataIndex: 'templateId',
      width: 210,
      render(text, record) {
        if (!text) {
          return '';
        }
        return (
          <div>
            <a target="_blank"
               href={'#/material/templatemanage/tempinfo/' + record.templateId}>{record.templateName}<br />{text}</a>
          </div>
        );
      },
    }, {
      title: '物料属性',
      dataIndex: 'stuffType',
      width: 150,
      render(stuffType) {
        return MaterialPropertiesMap[stuffType];
      },
    }, {
      title: '物料类型',
      dataIndex: 'stuffAttrName',
      width: 200,
    }, {
      title: '规格尺寸',
      dataIndex: 'sizeName',
      width: 150,
    }, {
      title: '物料材质',
      width: 150,
      render: (t, r, i) => {
        const temId = r.templateId + 'temId' + i;
        return (<div><FormItem>
            <Select placeholder="请选择" onSelect={this.onSelectMaterial.bind(this, r, i, temId)}
                    {...getFieldProps(temId, {
                      validateFirst: true,
                      rules: [{
                        message: '请选择物料材质',
                        required: true,
                      }, this.checkSame.bind(this, r.templateId)],
                    })} style={{width: 380}}>
              {this.eachOption(this.state.materialOptions[r.stuffAttrId])}
            </Select>
            {
              this.renderSinglePrice(this.state.inputList[i].materialPrice)
            }
          </FormItem></div>
        );
      },
    }, {
      title: '申请数量',
      width: 150,
      render: (t, r, i) => {
        const stuffAttrId = r.templateId + 'stuffAttrId' + i;
        return (<div><FormItem>
            <InputNumber placeholder="请输入" onBlur={this.onClickInputQuantity.bind(this, r, i, stuffAttrId)}
                         {...getFieldProps(stuffAttrId, {
                           validateFirst: true,
                           rules: [{
                             message: '请输入数量',
                             required: true,
                             type: 'number',
                           }],
                         })}
                         min={1}
                         max={100000}
            />
          </FormItem></div>
        );
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (t, r, i) => {
        return (
          <Popconfirm title="您确定要删除该条目么？" onConfirm={this.remove.bind(this, r, i)}>
            <a>删除</a>
          </Popconfirm>
        );
      },
    }];
    const limitHeight = applyTableData.length;
    const stuffTemplateTableStyle = {
      height: limitHeight > 6 ? '650px' : 'auto',
      overflow: 'auto',
      marginBottom: 10
    };
    const breadcrumb = [
      {title: '申请单管理', link: '#/material/applicationManagement/applicationRecord'},
      {title: '申请物料'}
    ];
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 6}
    };
    const footer = <Button type="primary" loading={submitting} onClick={this.submitApply}>确定申请</Button>;
    return (
      <PageLayout breadcrumb={breadcrumb} footer={footer} spinning={!requestId}>
        {
          loading && (
            <div>
              <BlockTitle title="申请明细" style={{marginTop: 0}}/>
              <Table columns={columns} style={stuffTemplateTableStyle} pagination={false} dataSource={applyTableData}/>
              {this.renderPrice()}
              <Button type="primary" onClick={this.handleClickAddTemplate}>添加模板</Button>
              <Form horizontal>
                <BlockTitle title="申请人信息"/>
                <FormItem
                  {...formItemLayout}
                  label="物料申请人：">
                  {
                    this.isBuc
                      ?
                      <div>
                          {
                            bucAsProvider
                            ?
                              <UserSelect
                                allowClear
                                searchScope="global"
                                channel="outter_user_channels"
                                {
                                  ...getFieldProps('stuff', {
                                    onChange: (u) => {
                                      this.setProvider(u);
                                    }
                                  })
                                }
                              />
                            :
                            <div style={{marginRight: 20}}>{user.nickName || user.realName}</div>
                          }
                          <Button
                            type="primary"
                            onClick={this.toggleShowProviderSelect}
                          >
                            {bucAsProvider ? '小二申请' : '代服务商申请'}
                          </Button>
                      </div>
                      :
                      <span>{user.realName}</span>
                  }
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="申请单位："
                >
                  {providerData.realName || providerData.displayName || '-'}
                </FormItem>

                {
                  this.isBuc && !bucAsProvider && <FormItem
                      {...formItemLayout}
                      label="申请城市：">
                      <GetAllAreasData
                        {...getFieldProps('storageCode', {
                          validateFirst: true,
                          initialValue: storageCodeValue || [],
                          rules: [{
                            required: true,
                            message: '此处必填',
                            type: 'array',
                          }],
                        })}
                        style={{width: '100%'}}/>
                    </FormItem>
                }

                <BlockTitle title="收货信息"/>

                <FormItem
                  {...formItemLayout}
                  label="姓名：">
                  <Input placeholder="请输入姓名"
                         {...getFieldProps('receiver', {
                           rules: [
                             {
                               required: true,
                               message: '此处必填',
                             },
                           ]}
                         )}
                  />
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="电话：">
                  <Input
                    placeholder="请输入联系方式"
                    {...getFieldProps('contactPhone', {
                      rules: [
                        {
                          required: true,
                          message: '此处必填',
                        },
                      ]
                    }
                    )}
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="地址：">
                  <OpenAreaSelect {...getFieldProps('receiverAddressCode', {
                    rules: [
                      {
                        required: true,
                        message: '此处必填',
                      },
                    ]
                  })} WithAll/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="具体街道">
                  <Input placeholder="请输入具体街道信息"
                         {...getFieldProps('receiverAddress', {
                           rules: [
                             {
                               required: true,
                               message: '此处必填',
                             },
                           ]}
                         )}
                  />
                </FormItem>
              </Form>
              {showOutModal && <ConfirmOut onCancel={this.hideOutModel} onOk={this.goToNext}/>}
            </div>
          )
        }
        <SelectTemplateModal visible={pickingTemplate} onChange={this.addModuleData} close={() => this.setState({pickingTemplate: false})}/>
      </PageLayout>
    );
  }
});
export default Form.create()(ApplyMaterial);
