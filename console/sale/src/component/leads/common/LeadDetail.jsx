import React, {PropTypes} from 'react';
import {Row, Button, Spin, Tag, Alert, message, Modal} from 'antd';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import ShopTimeUtil from '../../../common/shopTimeUtil';
import { Lifecycle} from 'react-router';
import './leadDetail.less';

const payType = {
  code_scanned_pay: '商家扫码收款',
  scan_m_code_pay: '扫码付',
  sound_wave_pay: '声波支付',
  online_pay: '顾客自助买单',
};

const LeadDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
    data: PropTypes.object,
  },
  mixins: [Lifecycle],
  getInitialState() {
    return {
      data: this.props.data || {},
      modify: null,
      appealSuccess: null,
      orderId: '',
      receiveLeads: true,
      disabled: false,
    };
  },

  componentDidMount() {
    if (!this.props.data) {
      const { leadsId, orderId } = this.props.params;
      let ajaxUrl;
      if (leadsId) {
        ajaxUrl = '/sale/leads/queryDetail.json';
      } else {
        ajaxUrl = '/sale/leads/queryOrderDetail.json';
      }
      ajax({
        url: ajaxUrl,
        data: {
          leadsId,
          orderId,
        },
        success: (res) => {
          const data = res.data;
          if (data.statusDesc === '已认领') {
            if (data.isCompleted === 'true') {
              data.statusDesc = '已补全信息';
            } else if (data.isCompleted === 'false') {
              data.statusDesc = '待补全信息';
            }
          }
          this.setState({
            data,
            modify: res.modify,
          });
        },
        error: (e) => {
          message.error(e.resultMsg || '系统错误');
          window.location.back();
        },
      });
    }
  },

  getTitle() {
    const { orderId, type } = this.props.params;
    let titleInfo;
    if (type && type === 'public') {
      titleInfo = 'leads详情';
    } else if (orderId || type === 'diary') {
      titleInfo = '流水详情';
    }
    return titleInfo ? <div className="app-detail-header">
      {titleInfo}
      <div style={{float: 'right', marginTop: -10}}>
        {this.state.modify ? <Button type="primary" size="large" onClick={this.edit}>修改</Button> : null}
      </div>
    </div> : null;
  },
  // 提交申诉
  getRepresentations() {
    const {data} = this.state;
    this.setState({
      disabled: true,
    });
    ajax({
      url: '/sale/leads/appeal.json',
      method: 'post',
      data: {feedbackId: data.feedbackId},
      type: 'json',
      success: () => {
        this.setState({
          disabled: false,
        });
        const href = window.APP.antprocessUrl + '/middleground/koubei.htm#/submitted-task';
        const html = (<span>已提交申诉，请到待审批流程中<a href={href} target="_blank" style={{marginLeft: 5, fontWeight: 100}}>查看工单</a></span>);
        Modal.success({
          title: html,
          content: '大约2个工作日完成处理。',
          onOk() {
            setTimeout(()=> {
              window.location.reload();
            }, 3000);
          },
        });
      },
      error: (e) => {
        message.error(e.resultMsg || '系统错误');
        this.setState({
          disabled: false,
        });
      },
    });
  },
  // 获取多个重复：公海中已存在相同leads描述
  getStoreDescribe(list) {
    const { data } = this.state;
    let textMsg = '';
    if (list && list.length) {
      textMsg = '您创建的信息与';
      list.slice(0, 3).forEach((p, i) => {
        if (p.entityType === 'PUBLIC_LEADS') {
          textMsg += p.shopName + ',' + data.address + '(可认领)、';
        } else if (i === 2) {
          textMsg += p.shopName + ',' + data.address;
        } else {
          textMsg += p.shopName + ',' + data.address + '、';
        }
      });
      textMsg += '重复';
    }
    return textMsg;
  },
  // Alert模块
  getAlertTemplate(msg, description) {
    const alertHtml = (
      <Alert message={msg}
      description={description}
      closable
      type="warning"
      showIcon />
    );
    return alertHtml;
  },

  getServiceArray(data) {
    if (!data) return [];
    const attrsMap = {
      wifi: 'wifi',
      noSmoke: '无烟区',
      park: '停车位',
      box: '包厢',
    };
    return Object.keys(data).filter(key => data[key] === 'true')
      .map(key => attrsMap[key]);
  },

  routerWillLeave() {
    window.location.reload();
  },
  // 领取按钮
  jumpPublicLeads(id) {
    ajax({
      url: '/sale/leads/claim.json',
      method: 'post',
      data: {
        leadsId: id,
      },
      success: (res) => {
        Modal.confirm({
          title: '认领成功',
          content: '',
          okText: '查看leads详情',
          iconClassName: 'check-circle',
          cancelText: '关闭窗口',
          onOk() {
            window.location.hash = '/leads/detail/' + res.data.leadsId + '/detail';
          },
          onCancel() {
            setTimeout(()=> {
              window.location.reload();
            }, 2000);
          },
        });
      },
    });
  },

  edit() {
    const {orderId} = this.state.data;
    if (orderId) {
      window.open('?mode=modify#/leads/waited/edit/' + orderId);
    }
  },
  /*eslint-disable */
  render() {
    /*eslint-enable */
    const { data } = this.state;
    const {leadsId, orderId, type} = this.props.params;
    const kpJob = {
      SHOP_KEEPER: '店长',
      SHOP_BOSS: '老板',
      SHOP_OTHER: '其他',
    };
    if ((!permission('LEADS_QUERY_DETAIL') && leadsId) || (!permission('LEADS_QUERY_ORDER_DETAIL') && orderId) || (type && type !== 'public' && type !== 'diary')) {
      return <ErrorPage type="permission"/>;
    }

    if (!data) {
      return <Spin size="large"/>;
    }
    const coverUrl = data.cover && data.cover.url || 'https://img.alicdn.com/tps/TB17wzxLFXXXXXtXpXXXXXXXXXX-128-105.png';

    const servicesArr = this.getServiceArray(data.completedInfo && data.completedInfo.services);

    let tableContent = null;

    if (orderId && type === 'diary' && data.isCompleted === 'true') {
      tableContent = (<table className="kb-detail-table-6">
        <tbody>
        <tr>
          <td className="kb-detail-table-label">创建人</td>
          <td>{data.operatorShowName}</td>
          <td className="kb-detail-table-label">创建时间</td>
          <td>{data.createTime}</td>
          <td className="kb-detail-table-label">leads状态</td>
          <td>{data.isCompleted === 'true' ? '已补全信息' : '待补全信息'}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">经营品类</td>
          <td>{data.categoryLabel ? <span style={{color: '#f60'}}>[{data.categoryLabel}]</span> : null}{data.categoryName}</td>
          <td className="kb-detail-table-label">品牌</td>
          <td>{data.brandLevel ? <span style={{color: '#f60'}}>[{data.brandLevel}]</span> : null}{data.brandName}</td>
          <td className="kb-detail-table-label">营业时间</td>
          <td>{ShopTimeUtil.formatTimeString(data.completedInfo.businessTime)}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">是否已开通服务窗</td>
          <td>{data.completedInfo.bindingPublic === 'true' ? '开通' : '未开通'}</td>
          <td className="kb-detail-table-label">默认收款方式</td>
          <td>{payType[data.completedInfo.payType]}</td>
          <td className="kb-detail-table-label">主要联系人</td>
          <td>{data.contactsName}{data.contactsJob ? <span>({kpJob[data.contactsJob]})</span> : ''}{data.contactsKPTel}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">门店电话</td>
          <td colSpan="5">{data.contactsPhone.split(',').join('/ ')}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">品牌logo</td>
          <td colSpan="5">{(data.completedInfo.logo && [data.completedInfo.logo] || []).map((p) => {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">门店内景</td>
          <td colSpan="5">{(data.pictures || []).map((p)=> {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">机具编号</td>
          <td>{data.completedInfo.posId}</td>
          <td className="kb-detail-table-label">门店编号</td>
          <td>{data.completedInfo.outShopId}</td>
          <td className="kb-detail-table-label">城市编号</td>
          <td>{data.cityId}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">提供服务</td>
          <td>{
            servicesArr.join('、')
          }</td>
          <td className="kb-detail-table-label">更多服务</td>
          <td>{data.completedInfo.otherService}</td>
          <td className="kb-detail-table-label">人均价格(元)</td>
          <td>{data.completedInfo.perPay}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">营业执照</td>
          <td>{(data.completedInfo.licensePicture && [data.completedInfo.licensePicture] || []).map((p) => {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
          <td className="kb-detail-table-label">营业执照有效期</td>
          <td>{data.completedInfo.businessLicenseValidTime}</td>
          <td className="kb-detail-table-label">营业执照名称</td>
          <td>{data.completedInfo.licenseName}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">行业许可证</td>
          <td>{(data.completedInfo.certificatePicture && [data.completedInfo.certificatePicture] || []).map((p) => {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
          <td className="kb-detail-table-label">行业许可证有效期</td>
          <td>{data.completedInfo.businessCertificateValidTime}</td>
          <td className="kb-detail-table-label">营业执照编号</td>
          <td>{data.completedInfo.licenseSeq}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">授权函</td>
          <td>{(data.completedInfo.authorizationLetterPicture && [data.completedInfo.authorizationLetterPicture] || []).map((p) => {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
          <td className="kb-detail-table-label">其他资质证明</td>
          <td colSpan="3">{(data.completedInfo.otherAuthResources || []).map((p) => {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">竞对信息</td>
          <td colSpan="5">{data.competitionStatus}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">备注信息</td>
          <td colSpan="5">{data.memo}</td>
        </tr>
        </tbody>
      </table>);
    } else if (orderId && type === 'diary' && data.isCompleted !== 'true') {
      tableContent = (<table className="kb-detail-table-6">
        <tbody>
        <tr>
          <td className="kb-detail-table-label">创建人</td>
          <td>{data.operatorShowName}</td>
          <td className="kb-detail-table-label">创建时间</td>
          <td>{data.createTime}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">经营品类</td>
          <td>{data.categoryLabel ? <span style={{color: '#f60'}}>[{data.categoryLabel}]</span> : null}{data.categoryName}</td>
          <td className="kb-detail-table-label">品牌</td>
          <td>{data.brandLevel ? <span style={{color: '#f60'}}>[{data.brandLevel}]</span> : null}{data.brandName}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">主要联系人</td>
          <td>{data.contactsName}{data.contactsJob ? <span>({kpJob[data.contactsJob]})</span> : ''}{data.contactsKPTel}</td>
          <td className="kb-detail-table-label">公司名称</td>
          <td>{data.companyName}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">联系方式</td>
          <td>{data.contactsPhone}</td>
          <td className="kb-detail-table-label">其他联系方式</td>
          <td>{data.otherContacts}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">商户室内景照片</td>
          <td colSpan="3">
            {(data.pictures || []).map((p)=> {
              return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
            })}
          </td>
        </tr>
        </tbody>
      </table>);
    } else if (data.isCompleted === 'true') {
      tableContent = (<table className="kb-detail-table-6">
        <tbody>
        <tr>
          <td className="kb-detail-table-label">leads领取人</td>
          <td>{data.operatorShowName}</td>
          <td className="kb-detail-table-label">leads状态</td>
          <td>{data.statusDesc}</td>
          <td className="kb-detail-table-label">创建时间</td>
          <td>{data.createTime}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">经营品类</td>
          <td>{data.categoryLabel ? <span style={{color: '#f60'}}>[{data.categoryLabel}]</span> : null}{data.categoryName}</td>
          <td className="kb-detail-table-label">品牌</td>
          <td>{data.brandLevel ? <span style={{color: '#f60'}}>[{data.brandLevel}]</span> : null}{data.brandName}</td>
          <td className="kb-detail-table-label">认领时间</td>
          <td>{data.claimTime}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">是否已开通服务窗</td>
          <td>{data.completedInfo.bindingPublic === 'true' ? '开通' : '未开通'}</td>
          <td className="kb-detail-table-label">默认收款方式</td>
          <td>{payType[data.completedInfo.payType]}</td>
          <td className="kb-detail-table-label">保护期</td>
          {data.effectiveDays ? (<td>{data.effectiveDays}天</td>) : <td></td>}
        </tr>
        <tr>
          <td className="kb-detail-table-label">营业时间</td>
          <td>{ShopTimeUtil.formatTimeString(data.completedInfo.businessTime)}</td>
          <td className="kb-detail-table-label">门店电话</td>
          <td>{data.contactsPhone.split(',').join('/ ')}</td>
          <td className="kb-detail-table-label">主要联系人</td>
          <td>{data.contactsName}{data.contactsJob ? <span>({kpJob[data.contactsJob]})</span> : ''}{data.contactsKPTel}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">品牌logo</td>
          <td colSpan="5">{(data.completedInfo.logo && [data.completedInfo.logo] || []).map((p) => {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">门店内景</td>
          <td colSpan="5">{(data.pictures || []).map((p)=> {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">机具编号</td>
          <td>{data.completedInfo.posId}</td>
          <td className="kb-detail-table-label">门店编号</td>
          <td>{data.completedInfo.outShopId}</td>
          <td className="kb-detail-table-label">城市编号</td>
          <td>{data.cityId}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">提供服务</td>
          <td>{
            servicesArr.join('、')
          }</td>
          <td className="kb-detail-table-label">更多服务</td>
          <td>{data.completedInfo.otherService}</td>
          <td className="kb-detail-table-label">人均价格(元)</td>
          <td>{data.completedInfo.perPay}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">营业执照</td>
          <td>{(data.completedInfo.licensePicture && [data.completedInfo.licensePicture] || []).map((p) => {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
          <td className="kb-detail-table-label">营业执照有效期</td>
          <td>{data.completedInfo.businessLicenseValidTime}</td>
          <td className="kb-detail-table-label">营业执照名称</td>
          <td>{data.completedInfo.licenseName}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">行业许可证</td>
          <td>{(data.completedInfo.certificatePicture && [data.completedInfo.certificatePicture] || []).map((p) => {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
          <td className="kb-detail-table-label">行业许可证有效期</td>
          <td>{data.completedInfo.businessCertificateValidTime}</td>
          <td className="kb-detail-table-label">营业执照编号</td>
          <td>{data.completedInfo.licenseSeq}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">授权函</td>
          <td>{(data.completedInfo.authorizationLetterPicture && [data.completedInfo.authorizationLetterPicture] || []).map((p) => {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
          <td className="kb-detail-table-label">其他资质证明</td>
          <td colSpan="3">{(data.completedInfo.otherAuthResources || []).map((p) => {
            return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
          })}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">竞对信息</td>
          <td colSpan="5">{data.competitionStatus}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">备注信息</td>
          <td colSpan="5">{data.memo}</td>
        </tr>
        </tbody>
      </table>);
    } else {
      tableContent = (<table className="kb-detail-table-6">
        <tbody>
        <tr>
          <td className="kb-detail-table-label">leads领取人</td>
          <td>{data.operatorShowName}</td>
          <td className="kb-detail-table-label">leads状态</td>
          <td>{data.statusDesc}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">经营品类</td>
          <td>{data.categoryLabel ? <span style={{color: '#f60'}}>[{data.categoryLabel}]</span> : null}{data.categoryName}</td>
          <td className="kb-detail-table-label">品牌</td>
          <td>{data.brandLevel ? <span style={{color: '#f60'}}>[{data.brandLevel}]</span> : null}{data.brandName}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">主要联系人</td>
          <td>{data.contactsName}{data.contactsJob ? <span>({kpJob[data.contactsJob]})</span> : ''}{data.contactsKPTel}</td>
          <td className="kb-detail-table-label">创建时间</td>
          <td>{data.createTime}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">门店电话</td>
          <td>{data.contactsPhone}</td>
          <td className="kb-detail-table-label">认领时间</td>
          <td>{data.gmtClaim || data.claimTime}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">公司名称</td>
          <td>
            {data.companyName}
          </td>
          <td className="kb-detail-table-label">保护期</td>
          {data.effectiveDays ? (<td>{data.effectiveDays}天</td>) : <td></td>}
        </tr>
        <tr>
          <td className="kb-detail-table-label">内景图</td>
          <td colSpan="3">
            {(data.pictures || []).map((p)=> {
              return (<a href={p.url} target="_blank" key={p.url}><img src={p.url}/></a>);
            })}
          </td>
        </tr>
        </tbody>
      </table>);
    }

    let entityId = '';
    const duplicatedEntityDTO = data.duplicatedEntityDTO || [];
    duplicatedEntityDTO.map((p) => {
      if (p.entityType === 'PUBLIC_LEADS') {
        entityId += p.entityId;
      }
    });
    const messages = this.getStoreDescribe(duplicatedEntityDTO);
    let appealSuccess = null;
    let alertHtml = null;
    let messageTitle = null;

    if ( data.resultCode === 'LEADS_JUDGE_FAIL') {
      if (!data.processId) {
        let receiveLeads = null;
        if (entityId) {
          receiveLeads = (<span><a style={{marginRight: '10px'}} onClick={this.jumpPublicLeads.bind(this, entityId)}>认领该leads</a><span className="ant-divider"></span></span>);
          messageTitle = '公海leads中已存在相同leads';
        } else {
          messageTitle = '已存在相同leads/门店';
        }
        alertHtml = this.getAlertTemplate(messageTitle, messages);
        appealSuccess = (
          <div style={{position: 'absolute', bottom: '15px', left: '69px'}}>
            {receiveLeads}
            <a style={receiveLeads ? {marginLeft: '10px'} : {}} onClick={this.getRepresentations} disabled={this.state.disabled}>我要申诉</a>
          </div>
        );
      } else {
        messageTitle = (<div><span style={{color: '#fa0'}}>[已申诉]</span>已存在相同leads/门店</div>);
        alertHtml = this.getAlertTemplate(messageTitle, messages);
        appealSuccess = (
          <div style={{position: 'absolute', bottom: '15px', left: '69px'}}>
            <a href={window.APP.antprocessUrl + '/middleground/koubei.htm#/submitted-task'}>查询进度</a>
          </div>
        );
      }
    } else {
      alertHtml = this.getAlertTemplate(data.bizOrderCode, data.bizOrderResult);
    }
    return (<div>
      {this.getTitle()}
      <div className="kb-detail-main">
        {/* data.bizOrderCode ? <Alert message={data.bizOrderCode}
          description={data.bizOrderResult}
          closable
          type="warning"
          showIcon /> : null */}
        { data.bizOrderCode ? <div style={{position: 'relative'}} className={ data.feedbackId ? 'public-leads-alert' : ''}>
          {alertHtml}
          {appealSuccess}
        </div> : null}
        <Row style={{overflow: 'hidden', marginBottom: 20}}>
          <div style={{float: 'left', marginRight: 15}}>
            <a href={coverUrl} target="_blank"><img src={coverUrl} width="130" height="100" alt=""/></a>
          </div>
          <div>
            <div
              style={{margin: '10px 0', fontSize: 14, lineHeight: '25px'}}>{data.name}{data.branchName ? `(${data.branchName})` : null}
              <span style={{padding: '2px 5px 0', display: 'inline-block', verticalAlign: 'top'}}>
                {data.statusDesc ? <Tag color={data.statusDesc === '审核驳回' ? 'yellow' : 'green'} >{data.statusDesc}</Tag> : null }
              </span>
            </div>
            <div
              style={{margin: '10px 0'}}>{[data.provinceName, data.cityName, data.districtName].filter(c=>!!c).join('-')} {data.address}</div>
            {data.saleLabel && data.saleLabel.length > 0 ? (<div style={{display: 'inline-block', marginRight: '60px'}}>标签：{data.saleLabel.map((p, index) => {
              if (data.saleLabel.length === index + 1) {
                return (<span style={{color: '#f90'}}>{p}</span>);
              }
              return (<span><span style={{color: '#f90'}}>{p}</span><span className="ant-divider"></span></span>);
            })}</div>) : ''}
            {data.protectTime ?
              (<div style={{margin: '15px 0', display: 'inline-block'}}>
                {data.protectTime && (data.effectiveTime - Date.now() >= 0 && (data.effectiveTime - Date.now()) < 3 * 24 * 60 * 60 * 1000) ?
                  <span style={{color: 'red'}}>{data.protectTime} 到期</span> : data.protectTime + ' 到期'}
              </div>) : null}
          </div>
        </Row>
        {tableContent}
      </div>
      </div>
    );
  },
});

export default LeadDetail;
