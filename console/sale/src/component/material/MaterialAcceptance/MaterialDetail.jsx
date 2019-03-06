import React, {PropTypes} from 'react';
import {Breadcrumb, Button, Tabs, message, Tag} from 'antd';
import OperationLog from './OperationLog';
import ajax from 'Utility/ajax';
import MaterialAcceptanceCheckLabel from './MaterialAcceptanceCheckLabel';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import {format} from '../../../common/dateUtils';

const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;

const MaterialDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      data: {
        'stuffCheckDetailVO': {
          'stuffCheckVO': {
            checkEnable: '0',
          },
        },
      },
      loading: true,
      visible: false,
    };
  },

  componentDidMount() {
    this.fetch();
  },

  fetch() {
    const params = {
      stuffCheckId: this.props.params.stuffCheckId,
    };

    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/stuffCheckDetail.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.setState({
            loading: false,
            data: result,
          });
        } else {
          this.setState({loading: false});
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
    });
  },

  renderRuleAndValidity() {
    const {stuffTemplateDto} = this.state.data.stuffCheckDetailVO;
    if (stuffTemplateDto && (
      stuffTemplateDto.gmtStuffStart ||
      stuffTemplateDto.gmtStuffEnd || (
        stuffTemplateDto.ext &&
        stuffTemplateDto.ext.expression &&
        stuffTemplateDto.ext.picNum
      )
    )) {
      let text = null;
      if (stuffTemplateDto.ext) {
        text = stuffTemplateDto.ext.expression === '0' ? `固定${stuffTemplateDto.ext.picNum}张物料图片` : `至少${stuffTemplateDto.ext.picNum}张物料图片`;
      }
      return (
        <tr>
          <td className="kb-detail-table-label">活动物料有效期</td>
          <td>{(stuffTemplateDto.gmtStuffStart && stuffTemplateDto.gmtStuffEnd) ? (`${format(new Date(stuffTemplateDto.gmtStuffStart))} - ${format(new Date(stuffTemplateDto.gmtStuffEnd))}`) : null}</td>
          <td className="kb-detail-table-label">物料验收规则</td>
          <td>{text}</td>
        </tr>
      );
    }
    return null;
  },

  render() {
    const {data, loading} = this.state;
    const {stuffCheckDetailVO} = data;
    const {stuffCheckVO, stuffTemplateDto} = stuffCheckDetailVO;

    let channelTxt = '';
    switch (stuffCheckVO.channel) {
    case 'DINGDING': {
      channelTxt = '集团钉钉客户端';
      break;
    }
    case 'MERCHANT_APP': {
      channelTxt = '口碑掌柜';
      break;
    }
    case 'PC': {
      channelTxt = '销售工作台';
      break;
    }
    default: {
      channelTxt = '销售工作台';
      break;
    }
    }

    return (<div className="kb-detail-main">
      <div className="app-detail-content-padding">
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="#/material/acceptance">物料验收</Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="验收详情" key="1">
          <ButtonGroup style={{position: 'absolute', top: -52, right: 16, zIndex: 1}}>
            <MaterialAcceptanceCheckLabel checkEnable={stuffCheckVO.checkEnable} id={this.props.params.stuffCheckId}/>
          </ButtonGroup>
          {
            !loading && (
              <div>
                <div style={{backgroundColor: '#f9f9f9', paddingTop: '20px', paddingLeft: '20px'}}>
                  <div style={{color: '#666', fontSize: '14px', paddingBottom: '5px'}}>验收ID:{stuffCheckVO.stuffCheckId}</div>
                  {stuffCheckVO.auditOperatorName && [<div style={{color: '#999', paddingBottom: '5px'}}>验收人：{stuffCheckVO.auditOperatorName}</div>]}
                  {stuffCheckVO.checkReason && <div style={{color: '#999', paddingBottom: '5px'}}>{stuffCheckVO.checkReason}</div>}
                  {stuffCheckVO.checkMemo && <div style={{color: '#999', paddingBottom: '10px'}}>{stuffCheckVO.checkMemo}</div>}
                  {(stuffCheckVO.statusName === '审核不通过') && <Tag color="red">{stuffCheckVO.statusName}</Tag>}
                  {(stuffCheckVO.statusName !== '审核不通过') && <Tag color="green">{stuffCheckVO.statusName}</Tag>}
                  {data.hasDual12Label && <Tag color="red">1212</Tag>}
                </div>
                <h3 className="kb-page-sub-title">门店信息</h3>
                <table className="kb-detail-table-6">
                  <tbody>
                    <tr>
                      <td className="kb-detail-table-label">城市</td>
                      <td>{stuffCheckVO.cityName}</td>
                      <td className="kb-detail-table-label">门店名称</td>
                      <td>{stuffCheckVO.targetName}</td>
                      <td className="kb-detail-table-label">门店ID</td>
                      <td>{stuffCheckVO.targetId}</td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">门店地址</td>
                      <td colSpan="5">{stuffCheckDetailVO.shopAddress}</td>
                    </tr>
                  </tbody>
                </table>
                <h3 className="kb-page-sub-title">物料铺设拜访小记信息</h3>
                <table className="kb-detail-table-6">
                  <tbody>
                    <tr>
                      <td className="kb-detail-table-label">铺设人</td>
                      <td>{stuffCheckVO.paveCreatorName}</td>
                      <td className="kb-detail-table-label">铺设人身份</td>
                      <td>{stuffCheckVO.paveCreatorTypeName}</td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">铺设时间</td>
                      <td>{format(new Date(stuffCheckVO.paveTime))}</td>
                      <td className="kb-detail-table-label">物料属性</td>
                      <td>{stuffCheckVO.stuffTypeName}</td>
                    </tr>
                    {(stuffTemplateDto && (stuffTemplateDto.activeName ||
                      stuffTemplateDto.startTime ||
                      stuffTemplateDto.endTime)) ? (
                        <tr>
                          <td className="kb-detail-table-label">活动名称</td>
                          <td>{stuffTemplateDto.activeName || ''}</td>
                          <td className="kb-detail-table-label">活动时间</td>
                          <td>{(stuffTemplateDto.startTime && stuffTemplateDto.endTime) ? (`${format(new Date(stuffTemplateDto.startTime))} - ${format(new Date(stuffTemplateDto.endTime))}`) : null}</td>
                        </tr>
                      ) : null}
                    {this.renderRuleAndValidity()}
                    {(stuffCheckVO.channel) ? (
                        <tr>
                          <td className="kb-detail-table-label">图片来源</td>
                          <td colSpan="3">{channelTxt}</td>
                        </tr>
                      ) : null}
                    <tr>
                      <td className="kb-detail-table-label">拜访照片</td>
                      <td colSpan="3">
                        {
                          (stuffCheckDetailVO.stuffImgs || []).map((p) => {
                            return <a target="_blank" href={p.urlParam.replace(/&amp;/g, '&')}><img src={p.urlParam.replace(/&amp;/g, '&')} className="kb-detail-img"/></a>;
                          })
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          }
        </TabPane>
        <TabPane tab="操作记录" key="2">
          <OperationLog bizOrders={stuffCheckDetailVO.bizOrders}/>
        </TabPane>
      </Tabs>
    </div>);
  },
});
export default MaterialDetail;
