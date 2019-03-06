import React, {PropTypes} from 'react';
import {Form, Input, Button, Upload, message, Icon, InputNumber, Popover} from 'antd';
import ajax from 'Utility/ajax';
import Table from '../../../common/Table';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import InboundedQuantityDetail from './InboundedQuantityDetail';
import ConfirmOut from '../common/ConfirmOut';
import './quote.less';
import {Lifecycle, History } from 'react-router';

const FormItem = Form.Item;
const storageTypeMap = {
  'CITY': '城市',
  'KA': 'KA',
  'YUNZONG': '云纵',
};
const InboundBasicInfoForm = React.createClass({
  propTypes: {
    params: PropTypes.object,
    form: PropTypes.object,
    value: PropTypes.object,
  },
  mixins: [Lifecycle, History],

  getInitialState() {
    const { getFieldProps} = this.props.form;
    this.columns = [
    {title: '模版ID/名称', width: 150, dataIndex: 'templateId', key: 'templateId',
      render: (_, r) => {
        return (<span>{r.templateId}/{r.tempalteName}</span>);
      },
    },
    {title: '物料属性', width: 80, dataIndex: 'stuffType', key: 'stuffType'},
    {title: '物料类型', width: 80, dataIndex: 'stuffAttrName', key: 'stuffAttrName'},
    {title: '物料材质', width: 80, dataIndex: 'material', key: 'material'},
    {title: '规格尺寸', width: 80, dataIndex: 'size', key: 'size'},
    {title: '采购PO单号', width: 100, dataIndex: 'poNo', key: 'poNo'},
    {title: '供应商名称', width: 100, dataIndex: 'supplier', key: 'supplier'},
    {title: '采购员', width: 110, dataIndex: 'purchaserName', key: 'purchaserName'},
    {title: '申请数量', width: 90, dataIndex: 'applyQuantity', key: 'applyQuantity'},
    {title: '采购数量', width: 90, key: 'purchaseQuantity', dataIndex: 'purchaseQuantity'},
    {title: '本批已入库数量', width: 100, dataIndex: '', key: 'curBatchQuantity',
      render: (_, r, i) => {
        return (<span>
          <Popover content={<div><InboundedQuantityDetail id={this.props.params.id} index={i}/></div>} placement="bottom" title="已入库数量" trigger="hover">
             <a>{r.curBatchQuantity}件</a>
          </Popover>
        </span>);
      },
    },
    {title: '本次入库数量(件)', width: 110, key: 'InboundQuantity', dataIndex: 'inboundQuantity',
      render: (_, r, i) => {
        return (
          <FormItem style={{marginBottom: 0, backgroundColor: '#eaf8fe'}}>
            <InputNumber {...getFieldProps('inbound' + i, {rules: [{required: true, message: '入库数量必填', type: 'number'}, {validator: this.checkInboundQuantity.bind(this, r.purchaseQuantity, r.curBatchQuantity)}]})} min={0} placeholder="请输入"/>
          </FormItem>
        );
      },
    },
    {title: '本次报损数量(件)', width: 110, key: 'scrapQuantity', dataIndex: 'scrapQuantity',
      render: (_, r, i) => {
        return (
          <FormItem style={{marginBottom: 0}} >
            <InputNumber {...getFieldProps('scrap' + i, {rules: [this.checkScrapQuantity.bind(this, r.purchaseQuantity)]})} min={0} placeholder="请输入"/>
          </FormItem>
        );
      },
    }];
    return ({
      checkerOperatorId: '',
      scrapOperatorId: '',
      loading: true,
      data: [],
      inputList: [],
      scrapQuantity: {},
      hasScrper: '',
      disabled: false,
      showOutModel: false,
      flag: 0,
    });
  },
  componentDidMount() {
    this.fetchData();
  },

  checkInboundQuantity(purchase, cur, rule, value, callback) {
    if (value + cur > purchase) {
      callback(new Error('入库数量总和超过采购数量'));
    } else {
      callback();
    }
  },
  checkScrapQuantity(purchase, rule, value, callback) {
    if (value > purchase) {
      callback(new Error('报损数量超过采购数量'));
    }
    const values = this.props.form.getFieldsValue();
    Object.keys(values).forEach(item => {
      if (!/scrap/.test(item)) {
        delete values[item];
      }
    });
    this.setState({
      scrapQuantity: values,
      hasScrper: value,
    });
    callback();
  },
  handleInbound(e) {
    e.preventDefault();
    this.props.form.submit(() => {
      this.props.form.validateFields((errors) => {
        if (errors) {
          return;
        }
        const self = this;
        const inboundInfo = {};
        inboundInfo.orderId = this.props.params.id;
        const info = {...this.props.form.getFieldsValue()};
        inboundInfo.logisticOrderNo = info.logisticOrderNo;
        if (info.remark) {
          inboundInfo.remark = info.remark;
        }

        inboundInfo.checkOperatorId = this.state.checkerOperatorId;
        inboundInfo.checkOepratorName = info.deliveryChecker;
        if (info.scrapDutyman) {
          inboundInfo.damageOwnerId = this.state.scrapOperatorId;
          inboundInfo.damageOwnerName = info.scrapDutyman;
        }
        const itemList = [];
        info.attachment.map((item) => {
          itemList.push({...item}.fileId);
        });
        inboundInfo.fileIdList = itemList.join(',');
        const inbound = this.props.form.getFieldsValue();
        Object.keys(inbound).forEach(item => {
          if (!/inbound/.test(item) && !/scrap/.test(item) ) {
            delete inbound[item];
          }
        });
        const inStockItemList = Object.keys(this.state.data.stuffInStockSummaryVoList).map(item => {
          const objArr = {};
          objArr.curQuantity = inbound['inbound' + item] || 0;
          objArr.damageQuantity = inbound['scrap' + item] || 0;
          objArr.summaryId = this.state.data.stuffInStockSummaryVoList[item].id;
          return objArr;
        });
        inboundInfo.inStockItem = JSON.stringify(inStockItemList);
        ajax({
          url: '/sale/asset/stuffStockActionInStock.json',
          method: 'post',
          data: inboundInfo,
          type: 'json',
          success: (result) => {
            if (result.status === 'succeed') {
              message.success('提交成功', 3);
              self.isCreateSuccess = 'hidenModel';
              // location.hash = '#/material/applicationManagement';
              this.setState({
                disabled: true,
              });
              setTimeout(()=> {
                window.location.hash = '/material/applicationManagement/applicationRecord/koubei';
              }, 3000);
            }
          },
          error: (result) => {
            if (result.status === 'failed') {
              message.error(result.resultMsg);
            }
          },
        });
      });
    });
  },
  validateDeliveryChecker(rule, value, callback) {
    if (value) {
      ajax({
        url: '/sale/asset/queryOperator.json',
        method: 'get',
        data: {operatorName: value},
        type: 'json',
        success: (result) => {
          if (result.operatorId) {
            this.setState({
              checkerOperatorId: result.operatorId[0],
            });
          }
        },
      });
    }
    callback();
  },
  validateScrapDutyman(rule, value, callback) {
    if (value) {
      ajax({
        url: '/sale/asset/queryOperator.json',
        method: 'get',
        data: {operatorName: value},
        type: 'json',
        success: (result) => {
          if (result.operatorId) {
            this.setState({
              scrapOperatorId: result.operatorId[0],
            });
          }
        },
      });
    }
    callback();
  },
  // 二次确认框,
  hideOutModel() {
    this.setState({showOutModel: false});
  },
  goToNxet() {
    this.forceGoto = true;
    window.location.hash = this.nextPath;
  },
  routerWillLeave(nextLocation) {
    this.nextPath = nextLocation.pathname;
    if (this.isCreateSuccess !== 'hidenModel') {
      this.setState({showOutModel: !this.forceGoto});
      return !!this.forceGoto;
    }
  },
  normalizeUploadValueTwenty(info) {
    return this.normalizeUploadValue(info, 10);
  },
  normalizeUploadValue(info) {
    if (Array.isArray(info)) {
      return info;
    }
    if (!info) {
      return [];
    }
    let fileList = info.fileList;
    const event = info.event;
    // 2. 读取远程路径并显示链接
    fileList = fileList.map((file) => {
      if (typeof file.response === 'string') {
        file.response = JSON.parse(file.response);
      }
      if (file.response) {
        // 组件会将 file.url 作为链接进行展示
        file.fileUrl = file.response.fileUrl;
        file.fileId = file.response.fileId;
      }
      return file;
    });
    // // 3. 按照服务器返回信息筛选成功上传的文件
    if (info.file.length === undefined) {
      if (event === undefined ) {
        fileList = fileList.filter((file, index) => {
          if (index > 9) {
            message.error('不能超过10个附件');
            return false;
          }
          if (file.response) {
            if (file.response.status === 'failed') {
              message.error(file.response.resultMsg || '上传失败，请稍后再试', 2);
              return false;
            }
            if (file.response && file.response.exceptionCode) {
              message.error('上传失败');
              return false;
            }
            if (file.response.status === 'succeed') {
              if (fileList.length < this.state.flag) {
                message.success('文件删除成功');
              } else {
                message.success('文件上传成功');
              }
            }
            if (file.response.buserviceErrorCode === 'USER_NOT_LOGIN') {
              message.error('请重新登录');
              return false;
            }
            return file.response.status === 'succeed';
          }
          if (file.type && file.type.indexOf('image') !== -1 && file.size > 20 * 1024 * 1024) {
            message.error('图片最大20M');
            return false;
          }

          if (file.type && file.type.indexOf('image') === -1 && file.size > 500 * 1024 * 1024) {
            message.error('文件最大500M');
            return false;
          }
          if (index === 0 && fileList.length === 1) {
            message.success('文件上传成功');
          }
          return true;
        });
      }
    }
    if (fileList.length === 0 ) {
      message.success('文件删除成功');
    }

    this.setState({
      flag: fileList.length,
    });
    return fileList;
  },
  fetchData() {
    const params = {
      orderId: this.props.params.id,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/stuffStockActionSummary.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        this.setState({
          loading: true,
          data: res.stuffInStockSummary,
        });
      },
    });
  },

  render() {
    const {getFieldProps, getFieldError} = this.props.form;
    const {stuffInStockSummaryVoList = [], orderId, storageType, storageName} = this.state.data;
    const {hasScrper} = this.state;
    const props = {
      action: window.APP.ownUrl ? window.APP.ownUrl + '/sale/asset/saleFileUpload.json' : '/sale/asset/saleFileUpload.json',
      multiple: true,
      data: {
        bizId: '0',
        bizType: 'OUT_STOCK',
      },
      beforeUpload: (file) => {
        if (['JPG', 'jpg'].indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) === -1) {
          message.error('文件格式错误');
          return false;
        }
        return true;
      },
    };
    return (
      <div style={{borderRight: '1px solid #ddd'}}>
        <div className="app-detail-header quote-header">采购入库 > <a>入库登记</a></div>
        <div className="app-detail-content-padding">
          <Form horizontal className="inbound-form">
            <h3 className="kb-page-sub-title kb-title-border-nomargin">订单内容</h3>
            <table className="approval-content">
              <tbody>
                <tr key={1}>
                  <td>申请单号</td>
                  <td>{orderId}</td>
                  <td>仓库类型</td>
                  <td>{storageTypeMap[storageType]}</td>
                  <td>申请城市</td>
                  <td>{storageName}</td>
                </tr>
              </tbody>
            </table>
            <h3 className="kb-page-sub-title kb-title-border-nomargin">入库物料信息</h3>
            <Table columns={this.columns}
               className="approval-content-table"
               dataSource={stuffInStockSummaryVoList}
               rowKey={r=>r.orderId}
               pagination={false}
               bordered
            />
            <h3 className="kb-page-sub-title kb-title-border-nomargin">入库基本信息</h3>
                <FormItem
                  labelCol={{span: 2}}
                  wrapperCol={{span: 6}}
                  help={getFieldError('logisticOrderNo')}
                  label="到货物流单号"
                >
                  <Input {...getFieldProps('logisticOrderNo', {initialValue: '', validateFirst: true, rules: [{required: true, message: '请输入发货物流单号'}, {max: 40, message: '限40个字符'}] })} type="text" placeholder="请输入" />
                </FormItem>
                 <FormItem
                  labelCol={{span: 2}}
                  wrapperCol={{span: 6}}
                  label="验收人"
                  classNames="change-help-color">
                  <Input placeholder="请输入花名/真名"
                  {...getFieldProps('deliveryChecker', {
                    initialValue: '',
                    validateFirst: true,
                    rules: [{
                      required: true,
                      message: '请输入请输入花名/真名',
                    }, {
                      max: 20,
                      message: '限20个字符',
                    }, {
                      validator: this.validateDeliveryChecker,
                    } ],
                    validateTrigger: 'onBlur',
                  })}
                  />
                </FormItem>
                <FormItem
                  labelCol={{span: 2}}
                  wrapperCol={{span: 6}}
                  label="报损责任人"
                  extra="当报损数量不为0时必填"
                  classNames="change-help-color">
                  <Input placeholder="请输入花名/真名"
                  {...getFieldProps('scrapDutyman', {
                    rules: hasScrper ? [{
                      required: true,
                      message: '请填写责任人',
                    }, {
                      max: 20,
                      message: '限20个字符',
                    }, {
                      validator: this.validateScrapDutyman,
                    }] : [{
                      max: 20,
                      message: '限20个字符',
                    }],
                    validateTrigger: 'onBlur',
                  })}
                  />
                </FormItem>
                <FormItem
                  labelCol={{span: 2}}
                  wrapperCol={{span: 6}}
                  label="备注"
                >
                  <Input {...getFieldProps('remark', {rules: hasScrper ? [{required: true, message: '请填写备注信息'}, {max: 300, message: '限300个字符'}] : [{max: 300, message: '限300个字符'}] })} type="textarea" placeholder="当报损数量不为0时必填" row="2"/>
                </FormItem>
                <FormItem
                  labelCol={{span: 2}}
                  wrapperCol={{span: 10}}
                  label="附件"
                  extra="支持扩展名.jpg">
                  <Upload {...props}
                    {...getFieldProps('attachment', {
                      valuePropName: 'fileList',
                      normalize: this.normalizeUploadValueTwenty,
                      rules: [{
                        required: true,
                        type: 'array',
                        message: '附件必填',
                      }],
                    })}>
                    <Button type="ghost">
                      <Icon type="upload" /> 上传文件
                    </Button>
                  </Upload>
                </FormItem>
                <div style={{borderTop: '1px solid #e9e9e9', paddingTop: 20, paddingBottom: 20, margin: -17}}>
                  <div style={{marginLeft: 40}}>
                    <Button type="primary" size="large" style={{marginRight: 20}} onClick={this.handleInbound} disabled={this.state.disabled}>入库</Button>
                  </div>
                </div>
          </Form>
          {this.state.showOutModel ? <ConfirmOut onCancel={this.hideOutModel} onOk={this.goToNxet}/> : null}
        </div>
      </div>
    );
  },
});

export default Form.create()(InboundBasicInfoForm);
