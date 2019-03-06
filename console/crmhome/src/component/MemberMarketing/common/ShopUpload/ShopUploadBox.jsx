import React, {PropTypes} from 'react';
import UploadBusinessFile from './UploadBusinessFile';
import Progress from './Progress';
import ajax from '../../../../common/ajax';
import {message, Alert} from 'antd';

/**
 * 口碑商户报名 - 文件上传
 *
 */
let ajaxRequest = null;
let logId = null; // 文件上传的ID
let shopNum = null; // 文件上传后的门店总数

function beforeUpload(file) {
  const type = file.name.substring(file.name.lastIndexOf('.') + 1);
  if (['xls', 'xlsx'].indexOf(type) === -1) {
    message.error('文件格式错误');
    return false;
  }
  return true;
}

const ShopUploadBox = React.createClass({

  propTypes: {
    form: PropTypes.object,
    userData: PropTypes.object,
    initialData: PropTypes.object,
    onShopUploadFunction: PropTypes.func,
    orderId: PropTypes.string,
    onLogId: PropTypes.func,
  },
  getInitialState() {
    return {
      data: {},// 进度条数据
      visibleProgress: false,
      finishTime: '',
    };
  },
  /**
   * @fileNum 文件数, @response 上传服务器返回数据
   *
  */
  onProgress(fileNum, response = {}) {
    if (fileNum) {
      // 有文件正在上传
      logId = response.logId;
      setTimeout(this.keepAjax, 900);
    } else {
      // 文件没有上传
      this.setState({ visibleProgress: false});
    }
  },
  cleanProgress() {
    clearInterval(ajaxRequest);
    ajaxRequest = null;
  },

  keepAjax() {
    const _this = this;
    const {setFieldsValue} = this.props.form;
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    const opMerchantId = merchantIdInput ? merchantIdInput.value : '';
    const legal = '/goods/itempromo/downloadSfsFile.htm';
    const data = {status: 'loading'};
    if (ajaxRequest) {
      return;
    }
    ajaxRequest = setInterval(() => {
      ajax({
        url: '/goods/itempromo/queryUploadStatus.json',
        type: 'json',
        method: 'get',
        data: {logId: logId, op_merchant_id: opMerchantId},
        success: (result) => {
          if (result.status === 'succeed') {
            if (result.fileStatus === 'success') {
              // 文件解析成功
              data.status = 'success';
              data.percent = 100;
              data.message = (<span>门店文件检测通过，下载<a href={legal + '?sfsKey=' + result.fileUrl + '&op_merchant_id=' + opMerchantId }>上传门店</a></span>);
              const shopTotalCnt = result.shopTotalCnt;
              const finishTime = result.finishTime;
              this.cleanProgress();
              setFieldsValue({'uploadStatu': {hasUpload: true, shopTotalCnt, logId, finishTime}});
              this.props.onLogId(logId);
              shopNum = shopTotalCnt;
              _this.setState({ data, finishTime});
            } else if (result.fileStatus === 'error') {
              // 系统在解析文件出现出错误
              data.percent = Number(result.percent);
              data.status = 'exception';
              data.message = result.resultMsg;
              setFieldsValue({'uploadStatu': {hasUpload: false}});
              this.props.onLogId('');
              this.cleanProgress();
              _this.setState({ data, finishTime: ''});
            } else if (result.fileStatus === 'failed') {
               // 文件解析完成但是门店ID不符合业务
              data.percent = Number(result.percent);
              this.cleanProgress();
              data.status = 'exception';
              data.message = (<span>上传门店不符合条件，下载<a href={legal + '?sfsKey=' + result.fileUrl + '&op_merchant_id=' + opMerchantId }>错误门店</a></span>);
              setFieldsValue({'uploadStatu': {hasUpload: false}});
              this.props.onLogId('');
              _this.setState({ data, finishTime: '' });
            } else if (result.fileStatus === 'loading') {
              // 文件解析中
              data.message = '服务器正在检测门店数据，请稍后..';
              data.percent = Number(result.percent);
              data.status = 'loading';
              _this.setState({ data, finishTime: '' });
            }
          } else {
            data.status = 'exception';
            data.message = result.resultMsg;
            this.cleanProgress();
            setFieldsValue({'uploadStatu': {hasUpload: false, shopTotalCnt: 0}});
            this.props.onLogId(false);
            _this.setState({ data, finishTime: '' });
          }
        },
        error: ()=>{
          clearInterval(ajaxRequest);
          ajaxRequest = null;
          data.status = 'exception';
          _this.setState({ data });
        },
      });
    }, 2000);
    this.setState({ visibleProgress: true});
  },
  renderTxt() {
    return (<Alert
      message="上传门店信息"
      description="请根据全部门店模板中的信息，按照本次参与活动的门店调整后上传。"
      type="info"
      showIcon
    />);
  },
  render() {
    return (<div>
      <div style={{display: 'inline-block', width: '100%'}}>
        {this.renderTxt()}
        <div style={{marginTop: '15px', marginBottom: '15px' }} {...this.props.form.getFieldProps('uploadStatu', {
          initialValue: '',
        })}></div>
        <UploadBusinessFile
          beforeUpload={beforeUpload}
          disabled={false}
          name="fileData"
          propsName="uploadBusinessFile"
          onProgress={this.onProgress}
          action={'/goods/itempromo/uploadPromoShops.json'}
          {...this.props}/>
        {
          this.state.finishTime && <p className="ft-gray">已导入{shopNum}家门店 {this.state.finishTime}</p>
        }
        {
          this.state.visibleProgress && <Progress data={this.state.data}/>
        }
      </div>
      </div>);
  },
});

export default ShopUploadBox;
