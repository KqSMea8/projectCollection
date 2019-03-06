import React, { PropTypes } from 'react';
import { Spin, Row, Tag } from 'antd';
// import ajax from 'Utility/ajax';
import fetch from '@alipay/kb-fetch';
import { PageNoAuth } from '@alipay/kb-framework-components';
import permission from '@alipay/kb-framework/framework/permission';
import { Page, Block } from '@alipay/kb-biz-components';
import './PosLeadDetail.less';
// import ReleaseModal from '../PrivateLeads/ReleaseModal';
import { ShopConfig, defaultLogoPic, JumpLeadsUrl, ShowBreadLnkText } from './PosLeadsConstant';

const PosLeadDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    const { leadsId } = this.props.params;
    const { name } = this.props.location.query;
    return {
      leadsId,
      name,
      data: {},
      loading: false,
      // showReleaseModal: false,
    };
  },

  componentDidMount() {
    const { leadsId } = this.state;
    if (leadsId) {
      this.setStatus({loading: true});
      fetch({
        url: 'kbsales.leadsQuerySpiService.querySalePosLeads',
        param: { leadsId, queryType: 'PC' },
      }).then((res) => {
        this.setState({
          data: res.data || {},
          loading: false,
        });
      }).catch(() => {
        this.setStatus({loading: false});
      });
    }
  },

  // transferPic(imageObj) {
  //   if (imageObj && imageObj.resourceUrl) {
  //     return imageObj.resourceUrl.replace(/&amp;/g, '&').replace('zoom=original', 'zoom=100x100');
  //   }
  //   return null;
  // },

  // onReleaseOk(values) {
  //   const { leadsId } = this.state;
  //   fetch.ajax({
  //     url: '/sale/leads/release.json',
  //     method: 'post',
  //     data: {
  //       ...values,
  //       leadsId,
  //     },
  //     success: () => {
  //       message.success('leads 释放成功');
  //       this.setState({
  //         showReleaseModal: false,
  //       });
  //       window.location.hash = '#/private-leads/pos';
  //     },
  //   });
  // },

  // onClickBill(e) {
  //   const { leadsId, name } = this.state;
  //   e.preventDefault();
  //   window.open(`/sale/bohIndex.htm#/managereport/addreport?posLeadsId=${leadsId}&posLeadsName=${name}`);
  // },

  setStatus(obj) {
    this.setState({
      ...obj,
    });
  },

  getImgUrl(imageObj) {
    if (imageObj && imageObj.resourceUrl) {
      return imageObj.resourceUrl;
    }
    return '';
  },

  // clickRelease(e) {
  //   e.preventDefault();
  //   this.setState({
  //   : true,
  //   });
  // },

  // claim(e) {
  //   const { leadsId } = this.state;
  //   e.preventDefault();
  //   ajax({
  //     url: '/sale/leads/claim.json',
  //     method: 'post',
  //     data: {
  //       leadsId,
  //     },
  //     success: () => {
  //       window.location.hash = '#/public-leads/pos';
  //       message.success('认领成功');
  //     },
  //   });
  // },

  // routerWillLeave() {
  //   window.location.reload();
  // },

  hasImg(imageObj) {
    if (imageObj && imageObj.resourceUrl) return true;
    return false;
  },

  renderTop() {
    const { data, leadsId } = this.state;
    const { shopInfo = {}, labels = [] } = data;
    const coverUrl = this.getImgUrl(shopInfo.logo) ? this.getImgUrl(shopInfo.logo) : defaultLogoPic;
    return (
      <Row className="kb-posleads-detail-top">
        <div className="kb-posleads-detail-img-wrapper">
          <a href={coverUrl} target="_blank"><img src={coverUrl} alt="" /></a>
        </div>
        <div>
          <p className="kb-posleads-detail-name">
            {shopInfo.shopName}{shopInfo.branchName ? `(${shopInfo.branchName})` : null}
            <span className="kb-posleads-detail-type">
              {shopInfo.statusCode ? <Tag color={shopInfo.statusCode === '' ? 'yellow' : 'green'} >{ShopConfig[shopInfo.statusCode]}</Tag> : null }
              {shopInfo.display && <Tag>{shopInfo.display}</Tag>}
            </span>
          </p>
          <p className="kb-posleads-detail-id">ID：{leadsId}</p>
          <div className="kb-posleads-detail-address">
            {[shopInfo.provinceName, shopInfo.cityName, shopInfo.districtName].filter(c=>!!c).join('-')} {shopInfo.address && `(${shopInfo.address})`}
          </div>
          {labels && labels.length > 0 ? (
            <div className="kb-posleads-detail-tag">标签：{labels.map((p, index) => {
              if (labels.length === index + 1) {
                return (<span style={{color: '#f90'}}>{p}</span>);
              }
              return (<span>
                  <span style={{color: '#f90'}}>{p}</span>
                  <span className="ant-divider"></span>
                </span>);
            })}</div>) : ''}
        </div>
      </Row>
    );
  },

  renderBaseInfo() {
    const { data } = this.state;
    const { shopInfo = {} } = data;
    const tableContent = (<table className="kb-detail-table-6">
      <tbody>
        <tr>
          <td className="kb-detail-table-label">品类</td>
          <td>
            {
              shopInfo.categoryLabel &&
              <span>
                <span style={{color: '#f60'}}>[{shopInfo.categoryLabel}]</span>
                <br />
              </span>
            }
            {shopInfo.category}
          </td>
          <td className="kb-detail-table-label">门头照</td>
          <td>
            {
              this.hasImg(shopInfo.mainImage) &&
              <a href={this.getImgUrl(shopInfo.mainImage)} target="_blank">
                <img src={this.getImgUrl(shopInfo.mainImage)} />
              </a>
            }
          </td>
          <td className="kb-detail-table-label">门店内景</td>
          <td>
            {
              (shopInfo.imageList || []).map(item => {
                return (<a href={item.resourceUrl}>
                  <img src={item.resourceUrl} />
                </a>);
              })
            }
          </td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">营业执照</td>
          <td>
            {
              this.hasImg(shopInfo.licensePicture) &&
              <a href={this.getImgUrl(shopInfo.licensePicture)} target="_blank">
                <img src={this.getImgUrl(shopInfo.licensePicture)} />
              </a>
            }
          </td>
          <td className="kb-detail-table-label">行业许可证</td>
          <td>
            {
              this.hasImg(shopInfo.certificatePicture) &&
              <a href={this.getImgUrl(shopInfo.certificatePicture)} target="_blank">
                <img src={this.getImgUrl(shopInfo.certificatePicture)} />
              </a>
            }
          </td>
          <td className="kb-detail-table-label"></td>
          <td></td>
        </tr>
      </tbody>
    </table>);

    return (
      <Block title="基本信息" key={1}>
        {tableContent}
      </Block>
    );
  },

  renderUserInfo() {
    const { data } = this.state;
    const { merchant = {} } = data;
    const tableContent = (<table className="kb-detail-table-6">
      <tbody>
        <tr>
          <td className="kb-detail-table-label">商户PID</td>
          <td>{merchant.pid}</td>
          <td className="kb-detail-table-label">商户名称</td>
          <td>{merchant.name}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">商户ID</td>
          <td>{merchant.mid}</td>
          <td className="kb-detail-table-label"></td>
          <td></td>
        </tr>
      </tbody>
    </table>);

    return (
      <Block title="商户信息" key={2}>
        {tableContent}
      </Block>
    );
  },

  render() {
    const { loading } = this.state;
    // const { leadsInfo = {} } = data;
    // const { leadsId } = this.props.params;
    const { type = 'public' } = this.props.location.query;
    // type === 'public/private/team'
    // if (!permission('LEADS_QUERY_DETAIL')) {
    if (!permission('POS_LEADS_QUERY_DETAIL')) {
      return <PageNoAuth authCodes={['POS_LEADS_QUERY_DETAIL']}/>;
    }
    if (loading) {
      return <Spin size="large"/>;
    }
    // const hasReleaseBtn = leadsInfo.range === 'PRIVATE' && leadsInfo.status !== 'CLOSED' && leadsInfo.status !== 'COMPLETE';
    // const hasBaoDanBtn = hasReleaseBtn && permission('POS_REPORT_ORDER_LEADS');
    const breadcrumb = [
      { title: ShowBreadLnkText[type], link: JumpLeadsUrl[type] },
      { title: 'POS Leads详情(普通门店)' },
    ];
    // const header = (<div className="kb-page-header-div">
    //   {
    //     leadsInfo.range === 'PUBLIC' && // 公海leads才有认领按钮
    //     <Button type="primary" className="kb-page-header-button" onClick={this.claim.bind(this)}>认领</Button>
    //   }
    //   {
    //     hasReleaseBtn && // 私海leads才可能有报单和释放按钮
    //     <Button type="primary" className="kb-page-header-button" onClick={this.clickRelease.bind(this)}>释放</Button>
    //   }
    //   {
    //     hasBaoDanBtn &&
    //     <Button type="primary" className="kb-page-header-button" onClick={this.onClickBill.bind(this)}>报单</Button>
    //   }
    // </div>);
    return (
      <Page
        title="Page"
        breadcrumb={breadcrumb}
        // header={header}
      >
        <div className="kb-detail-main kb-posleads-detail">
          {this.renderTop()}
          {this.renderBaseInfo()}
          {this.renderUserInfo()}
        </div>
      </Page>
    );
  },
});

export default PosLeadDetail;
