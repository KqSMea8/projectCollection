import React, {PropTypes} from 'react';
import ShopsSetting from './ShopsSetting';
import TimesSetting from './TimesSetting';
import ajax from '../../../common/ajax';
import {Form, Button, Row, Col, Modal, message} from 'antd';
import './huabei.less';

const loop = (data = []) => {
  return [...data].map(item => {
    const {cityCode, shopName, shopId, cityName, shops = [], shopCount = 0} = item;
    return {
      shopCount,
      id: shopId || cityCode,
      name: shopName || cityName,
      children: loop(shops),
    };
  });
};

const batchStatusMap = {
  processing: ['配置中...', '花呗分期正在处理中'],
  succeed: ['配置成功', '花呗分期配置成功'],
  failed: ['配置失败', '花呗分期配置失败，请下载查看失败门店信息'],
  statusFailed: ['配置失败', '花呗分期配置发生网络异常，请重试'],
};
const alertTypeMap = {
  processing: 'warning',
  succeed: 'success',
  failed: 'error',
};
const Huabei = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      loading: false,
      treeData: [],
      showSpin: true,
      prviousRateData: [],
      previousShopID: [],
      previousShopNames: [],
      rateData: [],
      previousStatus: false,
      alertMessage: '',
      type: 'info',
      disabled: false,
      downLoadButton: null,
      shopInfos: [],
      submitLoading: false,
    };
  },
  componentDidMount() {
    this.getPreviousSettingStatus();
  },
  onSubmit() {
    this.props.form.validateFields((err, options) => {
      if (!err && !this.state.submitLoading) {
        this.setState({submitLoading: true});
        const data = {'jsons': {'huabeiInstallmentFormList': [], shopIds: []}};
        const list = data.jsons;
        list.shopIds = options.choosedShops.map(item => item.id);
        Object.keys(options).forEach(item => {
          if (!isNaN(Number(item))) {
            list.huabeiInstallmentFormList.push({
              freeRate: options[item],
              installmentNum: item,
            });
          }
        });
        data.jsons = JSON.stringify(data.jsons);
        this.postSettings(data);
      }
    });
  },
  getPreviousSettingStatus() {
    ajax({
      url: '/shop/huabei/queryBatchResult.json',
      success: (result) => {
        this.setState({loading: false});
        if (result.status !== undefined) {
          if (result.status === 'succeed') {
            this.checkBatchStatus(result);
          } else {
            this.setAlertInfo(result, 'statusFailed', 'failed');
          }
        } else {
          setTimeout(() => {
            this.getPreviousTimeSettingAndShopSetting();
          }, 2000);
          this.getRateData();
        }
      },
      error: (res) => {
        if (res.redirectURL && res.redirectURL !== null && res.redirectURL !== '') {
          this.setState({loading: true});
          window.location.href = res.redirectURL.replace(/&amp;/g, '&');  // eslint-disable-line no-location-assign
        } else {
          message.error(res.resultMsg);
        }
      },
    });
  },
  setAlertInfo(result, status, alertType) {
    this.setState({
      previousStatus: true,
      alertMessage: batchStatusMap[status][0] + ' ' + result.optTime + ' ' + batchStatusMap[status][1],
      type: alertTypeMap[alertType],
    });
  },
  getPreviousTimeSettingAndShopSetting(result) {
    ajax({
      url: '/goods/itempromo/getHuabeiShops.json',
      success: (res) => {
        if (result) {
          this.setAlertInfo(result, result.batchStatus, result.batchStatus);
        }
        if (res.huabeiFreeNum) {
          this.setState({
            prviousRateData: (res.huabeiFreeNum).split(','),
          });
        }
        if (res.selectedShopCountGroupByCityVO) {
          const previousShops = this.getPreviousShops(res.selectedShopCountGroupByCityVO);
          const shopIds = previousShops.shopIds;
          const shopNames = previousShops.shopNames;
          const shopInfos = [];
          shopIds.forEach((item, i) => {
            shopInfos.push({id: shopIds[i], name: shopNames[i].name});
          });
          this.setState({
            previousShopID: shopIds,
            previousShopNames: shopNames,
            shopInfos: shopInfos,
          });
          this.props.form.setFieldsValue({'choosedShops': shopInfos});
        }
        const data = loop(res.shopCountGroupByCityVO);
        this.setState({
          disabled: false,
          treeData: data,
          showSpin: data.length !== 0,
        });
      },
    });
  },
  getRateData() {
    ajax({
      url: '/shop/huabei/interestQuery.json',
      success: (result) => {
        this.setState({
          rateData: result.result,
        });
      },
    });
  },
  getPreviousShops(data) {
    const shops = {shopIds: [], shopNames: []};
    data.map(each => {
      each.shops.map(item => {
        shops.shopIds.push(item.shopId);
        shops.shopNames.push({name: item.shopName});
      });
    });
    return shops;
  },
  checkBatchStatus(result) {
    if (result.batchStatus) {
      if (result.batchStatus === 'processing') {
        this.setState({
          disabled: true,
        });
        setTimeout(this.getPreviousSettingStatus, 2000);
        this.setAlertInfo(result, result.batchStatus, result.batchStatus);
      } else {
        if (result.batchStatus === 'failed') {
          this.setState({
            downLoadButton: <span> (<a href="/shop/huabei/downloadErrorFile.json">立即下载</a>)</span>,
          });
        }
        this.getRateData();
        // 沙宙要求要2s后请求
        setTimeout(() => {
          this.getPreviousTimeSettingAndShopSetting(result);
        }, 2000 );
      }
    }
  },
  postSettings(data) {
    ajax({
      url: '/shop/huabei/interestSave.json',
      data: data,
      method: 'post',
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({loading: false});
          Modal.success({
            title: '处理中',
            content: '花呗分期配置处理中',
            onOk: () => {
              this.setState({submitLoading: false, downLoadButton: true, previousStatus: false, prviousRateData: []}, this.getPreviousSettingStatus);
            },
          });
        }
      },
      error: (res) => {
        message.error(res.resultMsg);
        this.setState({loading: false, submitLoading: false});
      },
    });
  },
  render() {
    const {loading = false, submitLoading, treeData, previousShopID, previousShopNames, prviousRateData, alertMessage, type, previousStatus, rateData, disabled, downLoadButton, shopInfos, showSpin} = this.state;
    return (<div className="kb-groups-view">
      {!loading ?
        <div><h2 className="kb-page-title">花呗分期</h2>
          <div className="app-detail-content-padding">
            <div className="huabei-table-header">花呗分期设置</div>
            <div className="huabei-table-container">
              <TimesSetting form={this.props.form} rateData={rateData} prviousRateData={prviousRateData} previousStatus={previousStatus} alertMessage={alertMessage} type={type} downLoadButton={downLoadButton}/>
              <ShopsSetting loading={disabled} form={this.props.form} treeData={treeData} previousShopID={previousShopID} previousShopNames={previousShopNames} shopInfos={shopInfos} showSpin={showSpin}/>
            </div>
            <Row>
              <Col span="10" offset="2">
                <Button loading={submitLoading} type="primary" style={{margin: 16}} onClick={this.onSubmit} disabled={disabled}> 设置并发布 </Button>
              </Col>
            </Row>
          </div>
       </div>
      : <div></div>}
    </div>);
  },
});

export default Form.create()(Huabei);
