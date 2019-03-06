import React from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import ShopCorrectionForm from './ShopCorrectionForm';
import ShopCorrectionTable from './ShopCorrectionTable';
import CorrectModal from './CorrectModal';
import BatchTaskModalForKBSales from '../common/BatchTaskModalForKBSales';
import {Button, Cascader, Icon} from 'antd';

const operationType = [{
  value: '1',
  label: '门店标签',
  children: [
    {label: '通用打标去标', value: 'COMMON_LABEL_ADD_OR_REMOVE', permissionCode: 'SHOP_DATA_CORRECTION_LABEL', uploadApi: 'dataFileUpload.json'},
    {label: '优质高产标', value: 'HIGH_QUALITY', permissionCode: 'SHOP_DATA_CORRECTION_LABEL', uploadApi: 'dataFileUpload.json'},
    {label: '消费者保障标', value: 'CONSUMER_PROTECT', permissionCode: 'SHOP_DATA_CORRECTION_LABEL', uploadApi: 'dataFileUpload.json'},
    {label: '补证通知', value: 'LICENSE_NOTIFY', permissionCode: 'SHOP_DATA_CORRECTION_LICENSE_NOTIFY', uploadApi: 'dataFileUpload.json'},
    {label: '补证', value: 'NEED_LICENSE', permissionCode: 'SHOP_DATA_CORRECTION_NEED_LICENSE', uploadApi: 'dataFileUpload.json'},
    {label: '补证去标', value: 'FINISH_LICENSE', permissionCode: 'SHOP_DATA_CORRECTION_FINISH_LICENSE', uploadApi: 'dataFileUpload.json'},
    {label: '宕机小票打标', value: 'ADD_CRASH_LABEL', permissionCode: 'SHOP_DATA_CORRECTION_ADD_CRASH_LABEL', uploadApi: 'dataFileUpload.json'},
    {label: '宕机小票去标', value: 'DEL_CRASH_LABEL', permissionCode: 'SHOP_DATA_CORRECTION_DEL_CRASH_LABEL', uploadApi: 'dataFileUpload.json'},
    {label: '门店零费率打标', value: 'ADD_ZERO_RATE_LABEL', permissionCode: 'SHOP_DATA_CORRECTION_ADD_ZERO_RATE_LABEL', uploadApi: 'dataFileUpload.json'},
    {label: '门店零费率取消', value: 'CANCEL_ZERO_RATE_LABEL', permissionCode: 'SHOP_DATA_CORRECTION_CANCEL_ZERO_RATE_LABEL', uploadApi: 'dataFileUpload.json'},
    {label: '门店零费率不禁用信用卡打标', value: 'ZERO_RATE_INCLUDE_CREDIT_LABEL', permissionCode: 'ZERO_RATE_INCLUDE_CREDIT_LABEL', uploadApi: 'dataFileUpload.json'},
    {label: '门店淮海打标', value: 'ADD_SHOP_UNI_LABEL', permissionCode: 'SHOP_DATA_CORRECTION_ADD_SHOP_UNI_LABEL', uploadApi: 'dataFileUpload.json'},
    {label: 'Leads淮海打标', value: 'ADD_LEADS_UNI_LABEL', permissionCode: 'SHOP_DATA_CORRECTION_ADD_LEADS_UNI_LABEL', uploadApi: 'dataFileUpload.json'},
  ],
}, {
  value: '2',
  label: '门店信息',
  children: [
    {label: '门店类目与营业执照订正', value: 'SHOP_BACKGROUND_MODIFY_BATCH', permissionCode: 'SHOP_BACKGROUND_MODIFY_BATCH', uploadToKBSales: true},
    {label: 'Leads关闭', value: 'LEADS_CLOSE', permissionCode: 'SHOP_DATA_CORRECTION_LEADS_CLOSE', uploadApi: 'dataFileUpload.json'},
    {label: '门店支付类型', value: 'PAY_TYPE', permissionCode: 'SHOP_DATA_CORRECTION_PAY_TYPE', uploadApi: 'dataFileUpload.json'},
    {label: 'ISV 1.0更新UID', value: 'UPDATE_ISV_UID', permissionCode: 'SHOP_DATA_CORRECTION_DEL_UNI_ISV_SHOP_REL', uploadApi: 'dataFileUpload.json'},
    {label: '泛行业ISV门店人店关系释放', value: 'RELEASE_UNIVERSAL_ISV_SHOP_RELATION', permissionCode: 'SHOP_DATA_CORRECTION_DEL_UNI_ISV_SHOP_REL', uploadApi: 'dataFileUpload.json'},
    {label: '泛行业门店服务商关系释放 ', value: 'RELEASE_UNIVERSAL_PROVIDER_RELATION', permissionCode: 'SHOP_DATA_CORRECTION_DEL_UNI_PRO_REL', uploadApi: 'dataFileUpload.json'},
    {label: '修改门店品牌 ', value: 'MODIFY_SHOP_BRAND', permissionCode: 'SHOP_DATA_CORRECTION_MODIFY_SHOP_BRAND', uploadApi: 'dataFileUpload.json'},
  ],
}];
const ShopCorrection = React.createClass({
  getInitialState() {
    const defaultDateRange = this.getDefaultDateRange();
    const permissionOperationType = this.getPermissionOperationType(operationType);
    return {
      permissionOperationType,
      params: {
        beginTime: defaultDateRange[0],
        endTime: defaultDateRange[1],
      },
      showCorrectModal: false,
      correctType: '',
      correctValue: '',
      correctApi: '',
      defaultDateRange,
      forceRefresh: 0,
    };
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  getDefaultDateRange() {
    const now = Date.now();
    const startDate = new Date(now);
    const endDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 1);
    return [startDate, endDate];
  },

  getPermissionOperationType() {
    const permissionOperationType = [];
    operationType.forEach(v => {
      v.children.forEach(vv => {
        if (permission(vv.permissionCode)) {
          let index = -1;
          permissionOperationType.forEach((d, i) => {
            if (d.value === v.value) index = i;
          });
          if (index === -1) {
            permissionOperationType.push({
              ...v,
              children: [vv],
            });
          } else {
            permissionOperationType[index].children.push(vv);
          }
        }
      });
    });
    return permissionOperationType;
  },

  closeModalAndrefresh() {
    this.closeCorrectModal();
    this.setState({
      forceRefresh: Math.random(),
    });
  },

  showCorrectModal(value, selectedOptions) {
    this.setState({
      showCorrectModal: true,
      correctType: value[1],
      correctLabel: selectedOptions[1].label,
      correctApi: selectedOptions[1].uploadApi,
      uploadToKBSales: selectedOptions[1].uploadToKBSales,
    });
  },

  closeCorrectModal() {
    this.setState({
      showCorrectModal: false,
    });
  },

  render() {
    const {permissionOperationType, showCorrectModal, correctType, correctLabel, correctApi,
      uploadToKBSales, defaultDateRange, params, forceRefresh} = this.state;
    if (permission('SHOP_DATA_CORRECTION_QUERY')) {
      return (<div>
        <div className="app-detail-header">
          门店订正管理
          {permissionOperationType.length ? <Cascader options={permissionOperationType} onChange={this.showCorrectModal} expandTrigger="hover" placeholder="请选择">
            <Button style={{position: 'absolute', top: 16, right: 16, zIndex: 1}} size="large" type="primary">订正门店数据<Icon type="down" /></Button>
          </Cascader> : null}
        </div>
        <div className="kb-list-main">
          <ShopCorrectionForm onSearch={this.onSearch} defaultDateRange={defaultDateRange} />
          <ShopCorrectionTable params={params} forceRefresh={forceRefresh} operationType={operationType} defaultDateRange={defaultDateRange} />
        </div>
        {showCorrectModal && !uploadToKBSales ? <CorrectModal
          correctType={correctType}
          correctLabel={correctLabel}
          correctApi={correctApi}
          closeCorrectModal={this.closeCorrectModal}
          closeModalAndrefresh={this.closeModalAndrefresh} /> : null}
        {showCorrectModal && uploadToKBSales ? <BatchTaskModalForKBSales
          visible
          modalTitle={correctLabel}
          scene={correctType}
          maxImportCountText={1000}
          onCancel={this.closeCorrectModal}
          onFinish={this.closeCorrectModal}
        /> : null}
      </div>);
    }
    return <ErrorPage type="permission"/>;
  },
});

export default ShopCorrection;
