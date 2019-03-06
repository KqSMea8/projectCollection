import React from 'react';
import { Form, Button, Upload, Icon, Modal, message } from 'antd';
import AreaMap from './AreaMap';
import ajax from 'Utility/ajax';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;

const uploadUrl = `${window.APP.crmhomeUrl}/shop/koubei/territory/uploadExcel.json`;

let formParams = {
  territoryId: '', // 分区ID
  fileUrl: '', // 分区门店数据
  fileName: '', // 文件名称
  positions: [], // 分区坐标
  shopCount: 0, // 圈中门店数
  leadsCount: 0, // 圈中leads数
  shopIds: [], // 门店数据
  leadsIds: [],// leads数据
  cityCode: '', // 城市code
};

const CityAreaConfig = React.createClass({
  getInitialState() {
    return {
      visible: false,
      type: 'excel', // this.props.location.query.action === 'create' ? 'map' : 'excel',
      title: '',
      content: '',
      shopNumLimt: '',
      fileList: [],
      mapValid: false,
      isSubmiting: false,
      fileValid: false,
      showMapInfo: false,
      canClean: false,
    };
  },

  componentDidMount() {
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/getShopNumLimit.json`,
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            shopNumLimt: res.data.shopNumLimt,
          });
        }
      },
    });
  },

  componentWillUnmount() {
    formParams = {
      territoryId: '', // 分区ID
      fileUrl: '', // 分区门店数据
      fileName: '', // 文件名称
      positions: [], // 分区坐标
      shopCount: 0, // 圈中门店数
      leadsCount: 0,
      shopIds: [], // 门店数据
      cityCode: '', // 城市code
    };
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  onTypeChange(e) {
    this.setState({
      type: e.target.value,
    });
  },

  onUploadChange(info) {
    if (info.file.status === 'done') {
      if ( info.file.response.status === 'succeed') {
        const response = info.file.response;
        formParams.fileName = response.data.fileName;
        formParams.fileUrl = response.data.fileUrl;
        message.success('上传成功');
        this.setState({
          fileValid: true,
          fileList: [{
            uid: -1,
            name: response.data.fileName,
            status: 'done',
            url: response.data.fileUrl,
          }],
        });
      } else {
        message.error(info.file.response.resultMsg, 3);
        formParams.fileName = '';
        formParams.fileUrl = '';
        this.setState({
          fileValid: false,
          fileList: [],
        });
      }
    } else if (info.file.status === 'removed') {
      formParams.fileName = '';
      formParams.fileUrl = '';
      this.setState({
        fileValid: false,
        fileList: [],
      });
    }
  },

  jumpToList() {
    location.hash = '/cityarea/tabs/list';
  },

  jumpToUploadProgress(e) {
    e.preventDefault();
    this.setState({
      visible: false,
    });
    location.hash = '/cityarea/tabs/upload';
  },

  mapChange(positions) {
    if (positions.length <= 0) {
      this.setState({
        shopCount: 0,
        leadsCount: 0,
        mapValid: false,
        showMapInfo: false,
      });
      return;
    }

    const formatPositons = positions.map(item => {
      const pos = item.getPosition();
      return {
        lng: pos.lng,
        lat: pos.lat,
      };
    });
    this.setState({ canClean: true});
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/uploadPolygon.json`,
      method: 'post',
      data: {
        param: JSON.stringify({
          cityCode: this.props.location.query.citycode,
          territoryId: this.props.params.id,
          positions: formatPositons,
        }),
      },
      type: 'json',
      success: (res) => {
        if (res.status && res.status === 'succeed') {
          console.log(res);
          // 更新参数
          if (!res.data || !res.data.shopIds || !res.data.leadsIds) {
            message.error('系统异常！', 3);
            this.setState({
              mapValid: false,
              canClean: false,
            });
            return;
          }
          formParams.positions = formatPositons;
          formParams.shopIds = res.data.shopIds;
          formParams.leadsIds = res.data.leadsIds;
          this.setState({
            shopCount: formParams.shopIds.length,
            leadsCount: formParams.leadsIds.length,
            mapValid: formParams.shopIds.length > 0 || formParams.leadsIds.length > 0,
            fastConsumeLeadsCnt: res.data.fastConsumeLeadsCnt,
            fastConsumeShopCnt: res.data.fastConsumeShopCnt,
            restaurantLeadsCnt: res.data.restaurantLeadsCnt,
            restaurantShopCnt: res.data.restaurantShopCnt,
            universalLeadsCnt: res.data.universalLeadsCnt,
            universalShopCnt: res.data.universalShopCnt,
            showMapInfo: true,
            canClean: false,
          });

          if (formParams.shopIds.length <= 0 && formParams.leadsIds.length <= 0) {
            message.warn('您当前所选区域无符合岗位业务约束的门店或leads', 3);
          }
        } else {
          this.setState({
            mapValid: false,
            canClean: false,
          });
        }
      },
      error: ({resultMsg}) => {
        this.setState({
          isSaveBtnDisabled: true,
          canClean: false,
        });
        if (resultMsg) {
          message.error(resultMsg);
        }
      },
    });
  },

  downloadTemplate() {
    window.open(`${window.APP.crmhomeUrl}/shop/koubei/territory/downloadTemplate.htm?_input_charset=ISO8859-1`);
  },

  saveMapInfo() {
    const { areaName } = this.props.location.query;
    const data = {
      cityCode: formParams.cityCode,
      territoryId: formParams.territoryId,
      positions: formParams.positions,
      shopIds: formParams.shopIds,
      leadsIds: formParams.leadsIds,
      territoryName: areaName,
    };

    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/submitPolygonShopInfo.json`,
      method: 'post',
      data: { param: JSON.stringify(data) },
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const mapResult = (<div>你提交的文档中数据较多，系统在后台中努力上传，请及时<a href="#" onClick={this.jumpToUploadProgress}>查看进度</a>，如有上传失败的，请下载结果列表，根据报错原因订正后再上传</div>);
          this.setState({
            title: '操作成功',
            content: mapResult,
            isSubmiting: false,
            visible: true,
          });
        } else {
          this.setState({ isSubmiting: false });
          message.error('操作失败，请重试');
        }
      },
      error: (results) =>{
        if (results.resultMsg) {
          this.setState({ isSubmiting: false });
          message.error(results.resultMsg);
        }
      },
    });
  },

  saveExcelInfo() {
    const { action } = this.props.location.query;

    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/submitExcelShopInfo.json`,
      method: 'post',
      data: {
        territoryId: formParams.territoryId,
        fileUrl: formParams.fileUrl,
        fileName: formParams.fileName,
        isFirst: action === 'create',
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const excelResult = (<div>你提交的文档中数据较多，系统在后台中努力上传，请及时<a href="#" onClick={this.jumpToUploadProgress}>查看进度</a>，如有上传失败的，请下载结果列表，根据报错原因订正后再上传</div>);
          this.setState({
            title: '操作成功，稍后生效',
            content: excelResult,
            visible: true,
            isSubmiting: false,
          });
        } else {
          this.setState({ isSubmiting: false });
          message.error('操作失败，请重试');
        }
      },
      error: (results) =>{
        if (results.resultMsg) {
          this.setState({ isSubmiting: false });
          message.error(results.resultMsg);
        }
      },
    });
  },

  submit() {
    const { type } = this.state;

    this.setState({
      isSubmiting: true,
    });
    if (type === 'map') {
      this.saveMapInfo();
    } else {
      this.saveExcelInfo();
    }
  },


  render() {
    formParams.cityCode = this.props.location.query.citycode;
    formParams.territoryId = this.props.params.id;
    const { areaName, cityName } = this.props.location.query;
    const { type, showMapInfo, shopCount, leadsCount, title, content,
      shopNumLimt, isSubmiting, mapValid, fileValid, canClean,
      fastConsumeLeadsCnt, fastConsumeShopCnt, restaurantLeadsCnt,
       restaurantShopCnt, universalLeadsCnt, universalShopCnt } = this.state;
    const submitAble = (type === 'map' && mapValid) || (type === 'excel' && fileValid);

    return (
      <div>
        <div className="app-detail-header">
          <a href="#/cityarea/tabs/list">城市网格化</a> &gt;
          网格配置
        </div>
        <div className="app-detail-content-padding">
          <Form horizontal>
            <FormItem
              labelCol={{span: 4}}
              wrapperCol={{span: 8}}
              required
              label="网格名称：">
              <p className="ant-form-text" id="areaname" name="areaname">{areaName}</p>
            </FormItem>
            <FormItem
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}
              required
              label="适用门店和leads："
            >
              <div>
                <div className="uploadZone" style={{display: type === 'excel' ? 'block' : 'none'}}>
                  <p>
                    请先<a href="#" onClick={(e) => {e.preventDefault(); this.downloadTemplate();}}>下载门店列表模版</a>，一次最多导入{shopNumLimt || 3000}条记录。注意上传格式为xls。
                  </p>
                  <div style={{ minHeight: 180 }}>
                    <Dragger
                      name="fileName"
                      action={uploadUrl}
                      withCredentials
                      beforeUpload={(file) => {
                        const isExl = /\.xls$/.test(file.name);
                        if (!isExl) {
                          message.error('格式有误，重新上传', 3);
                        }
                        if (formParams.fileName) {
                          message.error('最多只能上传一个文件', 3);
                        }

                        return isExl && !formParams.fileName;
                      }}
                      onChange={this.onUploadChange}>
                      <p className="ant-upload-drag-icon">
                        <Icon type="cloud-upload-o" />
                      </p>
                      <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                      <p className="ant-upload-hint">支持扩展名：xls</p>
                    </Dragger>
                  </div>
                </div>

                <div className="mapZone" style={{display: type === 'map' ? 'block' : 'none'}}>
                    <p>
                      <div>网格的门店加leads的上限为<strong style={{color: 'red'}}>{shopNumLimt || 10000}</strong>，超过则圈店失败；</div>
                      <span style={{color: 'red'}}>只有在新功能发布后，通过地图圈店的方式创建的网格才能在城市地图上展示。</span>
                    </p>
                  <AreaMap
                    cityName={cityName} onChange={this.mapChange} fastConsumeLeadsCnt={fastConsumeLeadsCnt}
                    fastConsumeShopCnt={fastConsumeShopCnt} restaurantLeadsCnt={restaurantLeadsCnt}
                    restaurantShopCnt={restaurantShopCnt} universalLeadsCnt={universalLeadsCnt}
                    universalShopCnt={universalShopCnt} shopCount={shopCount} leadsCount={leadsCount}
                    showMapInfo={showMapInfo} cityCode={formParams.cityCode} canClean={canClean} />
                </div>
              </div>
            </FormItem>
            <FormItem wrapperCol={{span: 8, offset: 4}}>
              <Button type="primary" onClick={this.submit} loading={isSubmiting} disabled={!submitAble}>提交</Button>
            </FormItem>
          </Form>
        </div>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          footer={''}
          width={416}
          className={'ant-confirm'}
          closable={false}
        >
          <div style={{zoom: 1, overflow: 'hidden'}}>
            <div className="ant-confirm-body">
              <Icon type="check-circle" />
              <span className="ant-confirm-title">{title}</span>
              <div className="ant-confirm-content">{content}</div>
            </div>
            <div className="ant-confirm-btns">
              <Button type="primary" onClick={this.jumpToList}>知道了</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
});

export default CityAreaConfig;
