import React, {PropTypes} from 'react';
import '../common/BlackAndWhiteList.less';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import {Button, Breadcrumb, Form, message, Spin} from 'antd';
import EditIDModal from './EditIDModal';
import ErrPage from '../../../common/ErrorPage';

/**
*查看或修改页；*
*/

const data = {
  category: {
    key: '1',
    type: '品类白名单',
    display: '门店ID',
    displayCode: 'category',
    AccessCode: 'WHITE_LIST_MODIFY_CATEGORY_SHOP_ID',
    queryUrl: '/shop/koubei/whitelist/queryModifyCategoryShopIdWhiteList.json',
    addUrl: '/shop/koubei/whitelist/addModifyCategoryShopIdWhiteList.json',
    deleteUrl: '/shop/koubei/whitelist/deleteModifyCategoryShopIdWhiteList.json',
  }, serviceShop: {
    key: '2',
    type: '服务商抢单门店白名单',
    display: '门店ID',
    displayCode: 'serviceShop',
    AccessCode: 'WHITE_LIST_GRAB_SHOP_SHOP_ID',
    queryUrl: '/shop/koubei/whitelist/queryGrabShopShopIdWhiteList.json',
    addUrl: '/shop/koubei/whitelist/addGrabShopShopIdWhiteList.json',
    deleteUrl: '/shop/koubei/whitelist/deleteGrabShopShopIdWhiteList.json',
  }, judgment: {
    key: '3',
    type: '判重白名单',
    display: '商户PID',
    displayCode: 'judgment',
    AccessCode: 'WHITE_LIST_SHOP_JUDGE',
    queryUrl: '/shop/koubei/whitelist/queryShopJudgeWhiteList.json',
    addUrl: '/shop/koubei/whitelist/addShopJudgeWhiteList.json',
    deleteUrl: '/shop/koubei/whitelist/deleteShopJudgeWhiteList.json',
  }, koubei: {
    key: '4',
    type: '支付宝当面付开口碑店白名单',
    display: '商户PID',
    displayCode: 'koubei',
    AccessCode: 'WHITE_LIST_SHOP_SIGN_PID',
    queryUrl: '/shop/koubei/whitelist/queryShopSignPIDWhiteList.json',
    addUrl: '/shop/koubei/whitelist/addShopSignPIDWhiteList.json',
    deleteUrl: '/shop/koubei/whitelist/deleteShopSignPIDWhiteList.json',
  }, serviceMerchants: {
    key: '5',
    type: '服务商抢单商户黑名单',
    display: '商户PID',
    displayCode: 'serviceMerchants',
    AccessCode: 'BLACK_LIST_GRAB_SHOP_PID',
    queryUrl: '/shop/koubei/blacklist/queryGrabShopPIDBlackList.json',
    addUrl: '/shop/koubei/blacklist/addGrabShopPIDWhiteList.json',
    deleteUrl: '/shop/koubei/blacklist/deleteGrabShopPIDWhiteList.json',
  }, seviceBrand: {
    key: '6',
    type: '服务商抢单品牌黑名单',
    display: '品牌ID',
    displayCode: 'seviceBrand',
    AccessCode: 'BLACK_LIST_GRAB_BRAND_ID',
    queryUrl: '/shop/koubei/blacklist/queryGrabShopBrandIdBlackList.json',
    addUrl: '/shop/koubei/blacklist/addGrabShopBrandIdBlackList.json',
    deleteUrl: '/shop/koubei/blacklist/deleteGrabShopBrandIdBlackList.json',
  }, city: {
    key: '7',
    type: 'leads免审城市白名单',
    display: '城市名称',
    displayCode: 'city',
    AccessCode: 'WHITE_LIST_LEADS_AUDIT_CITY_ID',
    queryUrl: '/shop/koubei/whitelist/queryLeadsAuditCityIdWhiteList.json',
    addUrl: '/shop/koubei/whitelist/addLeadsAuditCityIdWhiteList.json',
    deleteUrl: '/shop/koubei/whitelist/deleteLeadsAuditCityIdWhiteList.json',
  }, importantArea: {
    key: '8',
    type: '重点区域',
    display: '区域名称',
    displayCode: 'importantArea',
    AccessCode: 'BLACK_LIST_KEY_POINT_DISTRICT_ID',
    queryUrl: '/shop/koubei/blacklist/queryKeyPointDistrictIdBlackList.json',
    addUrl: '/shop/koubei/blacklist/addKeyPointDistrictIdBlackList.json',
    deleteUrl: '/shop/koubei/blacklist/deleteKeyPointDistrictIdBlackList.json',
  }, release: {
    key: '9',
    type: '门店自动释放白名单',
    display: '门店 ID',
    displayCode: 'release',
    AccessCode: 'WHITE_LIST_AUTO_RELEASE_SHOP_ID',
    queryUrl: '/shop/koubei/whitelist/queryAutoReleaseShopIdWhiteList.json',
    addUrl: '/shop/koubei/whitelist/addAutoReleaseShopIdWhiteList.json',
    deleteUrl: '/shop/koubei/whitelist/deleteAutoReleaseShopIdWhiteList.json',
  }, testShopCreatorId: {
    key: '10',
    type: '测试门店创建者白名单',
    display: '商户PID',
    displayCode: 'testShopCreatorId',
    AccessCode: 'WHITE_LIST_TEST_SHOP_CREATOR_ID',
    queryUrl: '/shop/koubei/whitelist/queryTestShopCreatorWhiteList.json',
    addUrl: '/shop/koubei/whitelist/addTestShopCreatorWhiteList.json',
    deleteUrl: '/shop/koubei/whitelist/deleteTestShopCreatorWhiteList.json',
  }, testShopUserId: {
    key: '11',
    type: '测试门店C端白名单',
    display: '用户PID',
    displayCode: 'testShopUserId',
    AccessCode: 'WHITE_LIST_TEST_SHOP_USER_ID',
    queryUrl: '/shop/koubei/whitelist/queryTestShopUserWhiteList.json',
    addUrl: '/shop/koubei/whitelist/addTestShopUserWhiteList.json',
    deleteUrl: '/shop/koubei/whitelist/deleteTestShopUserWhiteList.json',
  }, shopNameQuality: {
    key: '12',
    type: '主店名质量白名单',
    display: '主店名',
    displayCode: 'shopNameQuality',
    AccessCode: 'WHITE_LIST_SHOP_NAME_QUALITY',
    queryUrl: '/shop/koubei/whitelist/queryShopNameQualityWhiteList.json',
    addUrl: '/shop/koubei/whitelist/addShopNameQualityWhiteList.json',
    deleteUrl: '/shop/koubei/whitelist/deleteShopNameQualityWhiteList.json',
  }, isvRateWhiteList: {
    key: '13',
    type: 'ISV费率白名单',
    display: '商户PID',
    displayCode: 'isvRateWhiteList',
    AccessCode: 'SHOP_ISV_PID_WHITE_LIST',
    queryUrl: '/shop/koubei/whitelist/queryShopISVPIDWhiteList.json',
    addUrl: '/shop/koubei/whitelist/addShopISVPIDWhiteList.json',
    deleteUrl: '/shop/koubei/whitelist/deleteShopISVPIDWhiteList.json',
  },
};
const NewNameList = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },
  getInitialState() {
    return {
      modalOptions: {}, // 添加、删除公用modal，配置不同参数区分；
      showModal: false,
      initialValues: [],
      inputValues: '',
      confirmLoading: false,
      loading: false,
    };
  },
  componentDidMount() {
    const type = this.props.params.displayCode;
    this.fetch(type);
  },
  fetch(kind) {
    const AccessCode = data[kind].AccessCode; //  每个类目的权限码；
    const url = window.APP.crmhomeUrl + data[kind].queryUrl;  //  每个类目初始化查询对应的接口url；入参为空；
    this.setState({
      loading: true,
    });
    if (permission(AccessCode)) {
      ajax({
        url: url,
        method: 'get',
        data: '',
        type: 'json',
        success: (result) => {
          if (!result) {
            return;
          }
          if (result.status && result.status === 'succeed') {
            this.setState({
              loading: false,
              initialValues: result.data || [],
            });
          }
        },
      });
    } else {
      this.setState({
        loading: false,
      });
      message.warn('你没有查询操作权限', 3);
    }
  },
  invalidOk(kind, values) {
    const params = {};
    const url = window.APP.crmhomeUrl + data[kind].addUrl;  //  每个类目添加接口url；
    const self = this;
    const type = this.props.params.displayCode;
    if (values.inputID) {
      params.bizIds = this.transformData(values.inputID);
    } else if (values.city) {
      if (type === 'city') {
        params.bizIds = values.city[1];
      }
      if (type === 'importantArea') {
        params.bizIds = values.city[2];
      }
    }
    if (params.bizIds) {
      this.setState({
        loading: true,
        confirmLoading: true,
      });
      ajax({
        url: url,
        method: 'post',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status === 'all_succeed') {
            message.success('操作成功', 3);
            this.setState({
              showModal: false,
              loading: false,
              confirmLoading: false,
              inputValues: '',
            });
            self.fetch(type);
          } else if (result.status === 'partial_succeed') {
            this.dealFailure(result, kind);
            self.fetch(type);
          } else if (result.status === 'all_failed') {
            this.dealFailure(result, kind);
          }
        },
        error: () => {
          this.setState({
            loading: false,
            confirmLoading: false,
          });
          message.error('请求错误');
        }
      });
    } else {
      message.warn('输入框内容不能为空！', 5);
    }
  },
  invalidDelete(kind, values) {
    const params = {};
    const url = window.APP.crmhomeUrl + data[kind].deleteUrl;  //  每个类目删除接口url；
    const self = this;
    const type = this.props.params.displayCode;
    if (values.inputID) {
      params.bizIds = this.transformData(values.inputID);
    } else if (values.city) {
      if (type === 'city') {
        params.bizIds = values.city[1];
      }
      if (type === 'importantArea') {
        params.bizIds = values.city[2];
      }
    }
    if (params.bizIds) {
      this.setState({
        loading: true,
        confirmLoading: true,
      });
      ajax({
        url: url,
        method: 'post',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status === 'all_succeed') {
            message.success('操作成功', 3);
            this.setState({
              showModal: false,
              loading: false,
              confirmLoading: false,
              inputValues: '',
            });
            self.fetch(type);
          } else if (result.status === 'partial_succeed') {
            this.dealFailure(result);
            self.fetch(type);
          } else if (result.status === 'all_failed') {
            this.dealFailure(result);
          }
        },
      });
    } else {
      message.warn('输入框内容不能为空！', 5);
    }
  },
  showAddModal() {
    const type = this.props.params.displayCode;
    this.setState({
      modalOptions: {
        type: 'add',
        okText: '添加',
        title: '添加名单',
        displayCode: type,
      },
      showModal: true,
    });
  },
  showDeleteModal() {
    const type = this.props.params.displayCode;
    this.setState({
      modalOptions: {
        type: 'delete',
        okText: '删除',
        title: '删除名单',
        displayCode: type,
      },
      showModal: true,
    });
  },
  hideModal() {
    this.setState({
      showModal: false,
      confirmLoading: false,
      inputValues: '',
    });
  },
  transformData(values) {
    // 提交时， 转化为一串ID “,” 隔开；并且过滤掉空；
    let _temp = null;
    _temp = values.replace(/\n/g, ',').split(',');
    _temp = _temp.filter(item => item !== undefined && item !== null && item !== '');
    _temp = _temp.join(',');
    return _temp;
  },
  transformString(values) {
    // 展示为一串ID加“空格”隔开；
    let _temp = '';
    _temp = values.join(';').replace(/;/g, '\n');
    return _temp;
  },
  dealFailure(result) {
    this.setState({
      showModal: false,
    });
    message.warn('以下名单操作失败，请检查修改后重新操作！', 5);
    const _data = this.transformString(result.failed_bizIds);
    this.setState({
      showModal: true,
      loading: false,
      confirmLoading: false,
      inputValues: _data,
    });
  },
  render() {
    const type = this.props.params.displayCode;
    if (!permission(data[type].AccessCode)) {
      return <ErrPage type="permission" title="没有权限" />;
    }
    const nameListType = data[type].type;
    const display = data[type].display;
    const inputContent = this.state.inputValues;
    return (<div>
      <div className="app-detail-header">
        <Breadcrumb separator=">">
        <Breadcrumb.Item key="1" href="#/shop/NameList/old">黑白名单</Breadcrumb.Item>
        <Breadcrumb.Item key="2">查看并编辑</Breadcrumb.Item>
        <Button type="ghost" style={{float: 'right'}} onClick={this.showDeleteModal} >删除名单</Button>
        <Button type="primary" style={{float: 'right', marginRight: 20}} onClick={this.showAddModal} >添加名单</Button>
        </Breadcrumb>
      </div>
      {
        this.state.loading ? (<div style={{marginLeft: '50%'}} ><Spin /></div>) : null
      }
      <div className="app-detail-content-padding black-white-list">
        <div className="black-white-row">
          <span className="black-white-label">名单类型</span>
          <span className="black-white-item">{nameListType}</span>
        </div>
        <div className="black-white-row">
          <span className="black-white-label">{display}</span>
          <span className="black-white-item">
            {this.state.initialValues.length > 0 &&
              this.state.initialValues
                .map((v, i) => <span key={v}>{(i > 0 ? '、' : '') + v}</span>)
            }
          </span>
        </div>
      </div>
      {this.state.showModal &&
        <EditIDModal
        display={display}
        visible={this.state.showModal}
        hideModal={this.hideModal}
        handleOK={this.invalidOk.bind(this, type)}
        handleDelete={this.invalidDelete.bind(this, type)}
        inputContent={inputContent}
        modalOptions={this.state.modalOptions}
        confirmLoading={this.state.confirmLoading}/>
      }
  </div>);
  },
});

export default Form.create()(NewNameList);
