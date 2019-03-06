import React, {PropTypes} from 'react';
import './tempmanage.less';
import ajax from 'Utility/ajax';
import {MaterialPropertiesMap} from '../common/MaterialLogMap';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import {format, formatTimeHm} from '../../../common/dateUtils';
import { Tabs, Table, Breadcrumb, Tag} from 'antd';
import AlipayMoreDown from './AlipayMoreDown';
import TemplateImgModal from '../common/TemplateImgModal';

const TabPane = Tabs.TabPane;

const columns = [{
  title: '状态变更',
  dataIndex: 'type',
  render(type) {
    const changerStatus = {
      STUFF_CHECK_AUDIT: '线上审核',
      STUFF_PURCHASE: '物料采购',
      STUFF_QUOTEPRICE: '物料申请报价',
      APPLY_STUFF: '物料申请',
      STUFF_APPLY_ORDER_AUDIT_PASS: '审批通过',
      STUFF_APPLY_ORDER_AUDIT_REJECT: '审批驳回',
      FINISH_STOCK: '结束入库',
      IN_STOCK: '物料入库',
      OUT_STOCK: '物料出库',
      STUFF_DELIVER: '物料发货',
      STUFF_TEMPLATE_ADD: '物料模版新增',
      STUFF_TEMPLATE_COPY: '物料模版复制',
      STUFF_TEMPLATE_UP: '物料模版更新',
      STUFF_TEMPLATE_EFFECTIVE: '物料模版生效',
      STUFF_TEMPLATE_INVALID: '物料模版失效',
    };
    return <span href="#">{changerStatus[type]}</span>;
  },
}, {
  title: '变更时间',
  dataIndex: 'gmtCreate',
  key: 'age',
  render(gmtCreate) {
    return <span href="#">{format(new Date(gmtCreate))} {formatTimeHm(new Date(gmtCreate))}</span>;
  },
}, {
  title: '原因',
  dataIndex: 'memo',
}];
const AlipayTempDetail = React.createClass({
  propTypes: {
    location: PropTypes.object,
    params: PropTypes.any,
  },
  getInitialState() {
    return {
      isShowButton: 1,
      resourceId: [],
      status: '',
      tempInfo: '',
      show: false,
      visible: false,
      data: [],
      changerdata: [], // 操作日志数据
      picInfo: {},
      id: '',
    };
  },

  componentDidMount() {
    this.changeTableData();
    this.getChangeList();
    this.getPicData();
  },

  // 返回头部图片展示，如果为多图，展示第一张可展示图片，如果没有可以展示格式的图片，则只展示文字信息。
  getHeaderPIc(d) {
    let num = 0;
    const imgList = this.state.picInfo.length > 0 && this.state.picInfo.map((key) => {
      const isPic = key.resourceId.indexOf('=jpg&') > 0 || key.resourceId.indexOf('=jpeg&') > 0 || key.resourceId.indexOf('=png&') > 0;
      if (isPic && num < d) {
        num ++;
        return [
          <span>
            <span className="tempInfo-imglist">
              <img src={appendOwnerUrlIfDev('/sale/asset/saleFileDownload.resource?resourceId=' + encodeURIComponent(key.resourceId) + '&name=' + encodeURIComponent(key.attaName))} />
              </span>
          </span>];
      }
    });
    return imgList;
  },

  // 返回物料设计图  图片格式可支持查看的，点击查看图片，图片格式不支持查看的，点击下载文件。
  getFilelist() {
    // 把可以查看的图片给另存起来供后面实现走马灯效果
    const {picInfo} = this.state;
    const picsArr = []; // 筛选出属于图片类型的保存起来
    const filesArr = []; // 筛选出属于非图片类型的保存起来
    if (picInfo && picInfo.length > 0) {
      for (let i = 0; i < picInfo.length; i++) {
        const isPic = picInfo[i].resourceId.indexOf('=jpg&') > 0 || picInfo[i].resourceId.indexOf('=png&') > 0 || picInfo[i].resourceId.indexOf('=jpeg&') > 0;
        const picsObj = {};
        const filesObj = {};
        if (isPic) {
          picsObj.url = appendOwnerUrlIfDev('/sale/asset/saleFileDownload.resource?resourceId=' + encodeURIComponent(picInfo[i].resourceId) + '&name=' + encodeURIComponent(picInfo[i].attaName));
          picsObj.name = picInfo[i].attaName;
          picsArr.push(picsObj);
        } else {
          filesObj.url = appendOwnerUrlIfDev('/sale/asset/saleFileDownload.resource?resourceId=' + encodeURIComponent(picInfo[i].resourceId) + '&name=' + encodeURIComponent(picInfo[i].attaName));
          filesObj.name = picInfo[i].attaName;
          filesArr.push(filesObj);
        }
      }
      if (picsArr.length > 0 || filesArr.length > 0) {
        return <TemplateImgModal picsArr={picsArr} filesArr={filesArr}/>;
      }
    }
  },

  // 获取操作日志数据
  getChangeList() {
    const params = {
      mappingValue: 'kbasset.queryBizLog',
      domain: 'ALIPAY',
      bizId: this.props.params.id,
      bizType: 'STUFF_TEMPLATE',
    };
    ajax({
      // url: appendOwnerUrlIfDev('/sale/asset/stuffBizLog.json'),
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        result.data = result.data || {};
        this.setState({
          changerdata: result.data,
        });
      },
    });
  },

  // 获取图片信息 供展示用
  getPicData() {
    const params = {
      mappingValue: 'kbasset.queryAttachFile',
      domain: 'ALIPAY',
      bizId: this.props.params.id,
      bizType: 'STUFF_TEMPLATE',
    };
    ajax({
      // url: appendOwnerUrlIfDev('/sale/asset/saleFileQuery.json'),
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            picInfo: result.data,
          });
        }
      },
    });
  },
  changeTableData() {
    const params = {
      mappingValue: 'kbasset.detailQueryTemplate',
      domain: 'ALIPAY',
      templateId: this.props.params.id,
    };
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        result.data = result.data || {};
        this.setState({
          tempInfo: result.data || {},
        });
      },
    });
  },
  showModalP() {
    this.setState({
      show: true,
    });
  },
  isShowButton(value) {
    this.setState({
      isShowButton: value,
    });
  },

  render() {
    const TempStatus = {
      EFFECTIVE: '生效中',
      INVALID: '已失效',
    };
    const BUSINESSORIGIN = {
      ISV_STUFF: 'ISV物料',
      TRANSFER_CODE: '支付宝转账码',
    };

    const id = this.props.params.id;
    const {tempInfo, changerdata} = this.state;
    return (<div>
      <div className="temp-detail-header">
        <Breadcrumb separator=">" style={{padding: '16px 0'}}>
            <Breadcrumb.Item href="#/material/TemplateManage/alipay">支付宝物料模版</Breadcrumb.Item>
            <Breadcrumb.Item>模板详情</Breadcrumb.Item>
        </Breadcrumb>
        {this.state.isShowButton !== '2' && <AlipayMoreDown id = {id} status={tempInfo.status} currentPage ="tempInfo" getChangeList={this.getChangeList} changeTableData={this.changeTableData}/>}
      </div>
      <Tabs defaultActiveKey="1" onTabClick= {this.isShowButton}>
          <TabPane tab="模板详情" key="1">
          <div className="app-detail-content-padding" style={{position: 'relative'}}>
            <div className="app-detail-content-padding" style={{background: '#f4f4f4', overflow: 'hidden'}}>
              <div style={{float: 'left'}}>
                <div style={{padding: '8'}} >
                  <div className="tempInfoimgsize">
                    {this.getHeaderPIc(1)}
                  </div>
                </div>
              </div>
              <div className="tempInfo-title">
                <div>{tempInfo.name}</div>
                <div style={{fontSize: 16}}>模板ID: {tempInfo.id}</div>
                <div><Tag color={tempInfo.status === 'EFFECTIVE' ? 'green' : 'red'}>{TempStatus[tempInfo.status]}</Tag></div>
              </div>
            </div>
            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon"></div>
              <span className="kb-form-sub-title-text">模板详细信息</span>
              <div className="kb-form-sub-title-line"></div>
            </h3>
            <table className="kb-detail-table-6">
              <tbody>
                <tr>
                  <td className="kb-detail-table-label">模板创建时间</td>
                  <td>{tempInfo.gmtCreate && format(new Date(tempInfo.gmtCreate))} {tempInfo.gmtCreate && formatTimeHm(new Date(tempInfo.gmtCreate))}</td>
                  <td className="kb-detail-table-label">模板创建人</td>
                  <td>{tempInfo.creatorName}</td>
                  <td className="kb-detail-table-label">物料审批单号</td>
                  <td>{tempInfo.activeProcessNo}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">物料属性</td>
                  <td>{MaterialPropertiesMap[tempInfo.stuffType]}</td>
                  <td className="kb-detail-table-label">物料类型</td>
                  <td>{tempInfo.stuffAttrName}</td>
                  <td className="kb-detail-table-label">规格尺寸</td>
                  <td>{tempInfo.sizeName}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">模版归属</td>
                  <td>支付宝物料模版</td>
                  <td className="kb-detail-table-label">业务来源</td>
                  <td>{BUSINESSORIGIN[tempInfo.bizSource]}</td>
                  <td className="kb-detail-table-label">模板别名</td>
                  <td>{tempInfo.nickName}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">模板说明</td>
                  <td colSpan="5">{tempInfo.memo}</td>
                </tr>
              </tbody>
            </table>
            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon"></div>
              <span className="kb-form-sub-title-text">物料设计图</span>
              <div className="kb-form-sub-title-line"></div>
            </h3>
            <div className="app-detail-content-padding">
              {this.getFilelist(3)}
            </div>
          </div>
          </TabPane>
          <TabPane tab="操作记录" key="2">
            <div className="app-detail-content-padding" style={{position: 'relative'}}>
              <Table
                rowKey={r => r.processTime}
                columns={columns}
                dataSource={changerdata}
                pagination={false}/>
            </div>
            </TabPane>
        </Tabs>
      </div>);
  },
});

export default AlipayTempDetail;
