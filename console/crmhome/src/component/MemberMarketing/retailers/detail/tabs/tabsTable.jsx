import React, { PropTypes } from 'react';
import { Modal, message } from 'antd';
// import { Tabs, Row, Col } from 'antd';
import DetailTable from '../autoTable';
import moment from 'moment';
import {voucherType, payChannelsEnum, crowdRestrictionEnum} from '../../../common/enum';
import {formatForbiddenVoucherTime, formatAvailableVoucherTime} from '../../../../../common/utils';
import ajax from '../../../../../common/ajax';
class TabsTable extends React.Component {
  constructor() {
    super();
    this.state = {
      showShopListModal: false,
      autoHidden: false,
      shopDetail: [],
    };
  }
  hideShopList = () => {
    this.setState({ showShopListModal: false });
  }

  showShopList = (shopIds) => {
    ajax({
      url: '/goods/kbsmartplan/querySmartPlanRecommendShops.json',
      method: 'post',
      data: {shopIds: JSON.stringify(shopIds)},
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            shopDetail: res.data,
          });
        } else {
          message.error(res.resultMsg || '系统繁忙');
        }
      },
      error: (err) => {
        this.setState({
          loading: false,
        });
        message.error(err.resultMsg || '系统繁忙');
      },
    });
    this.setState({ showShopListModal: true });
  }


  render() {
    const obj = this.props.obj;
    const vouchers = this.props.obj.vouchers || [{}];
    const shopIds = this.props.obj.shopIds || [];
    const dataSource = [
      {
        label: '券种类',
        dataIndex: vouchers[0].voucherType,
        render: ()=>{
          return vouchers[0].voucherType ? voucherType[vouchers[0].voucherType] : '';
        },
      }, {
        label: '劵名称',
        dataIndex: vouchers[0].voucherName,
      }, {
        label: '品牌名称',
        dataIndex: vouchers[0].brandName,
      }, {
        label: '券LOGO',
        dataIndex: vouchers[0].voucherLogo,
        render: ()=>{
          return (<a href={vouchers[0].voucherLogo}><img src={vouchers[0].voucherLogo} style={{ maxHeight: 50, maxWidth: 50 }} /></a>);
        },
      }, {
        label: '券面额',
        dataIndex: vouchers[0].couponValue,
      }, {
        label: '使用条件',
        dataIndex: vouchers[0].ruleStartAmount,
        render: ()=>{
          return `满${vouchers[0].ruleStartAmount}元可用`;
        },
      }, {
        label: '使用方式',
        dataIndex: vouchers[0].SendTypeEnum,
        render: () =>{
          return vouchers[0].SendTypeEnum === 'PULL' ? '直领' : '直塞';
        },
      }, {
        label: '每个用户总参与',
        dataIndex: obj.personTotalAvailableNum,
        render: ()=>{
          return obj.personTotalAvailableNum === 999999999 ? '不限制' : `${obj.personTotalAvailableNum}次`;
        },
      }, {
        label: '每个用户每天参与',
        dataIndex: obj.personPeriodAvailableNum,
        render: ()=>{
          return obj.personPeriodAvailableNum === 99 ? '不限制' : `${obj.personPeriodAvailableNum}次`;
        },
      }, {
        label: '券有效期',
        dataIndex: vouchers[0].validType,
        render: ()=>{
          return vouchers[0].validType === 'RELATIVE' ? `${vouchers[0].validPeriod}天` : `${moment(vouchers[0].validFromTime).format('YYYY-MM-DD HH:mm')} ~ ${moment(vouchers[0].validEndTime).format('YYYY-MM-DD HH:mm')}`;
        },
      }, {
        label: '券适用用门店',
        dataIndex: obj.shopIds,
        render: ()=>{
          return (<div>
              {
                shopIds.length ? shopIds.length : ''
              }
              家门店&nbsp;&nbsp;
              {
                shopIds.length && <a onClick={this.showShopList.bind(this, shopIds)}>查看</a>
              }</div>);
        },
      }, {
        label: '发放总量',
        dataIndex: obj.totalAvailableNum,
      }, {
        label: '领取即时生效',
        dataIndex: vouchers[0].delayAvailableTime,
        render: ()=>{
          return Number(vouchers[0].delayAvailableTime) === 0 ? '即时生效' : `${vouchers[0].delayAvailableTime}分钟后生效`;
        },
      }, {
        label: '券可用时段',
        dataIndex: vouchers[0].availableTimes,
        render: ()=>{
          return vouchers[0].availableTimes ? formatAvailableVoucherTime(vouchers[0].availableTimes) : '不限制';
        },
      }, {
        label: '券不可用日期',
        dataIndex: vouchers[0].forbiddenDates,
        render: ()=>{
          return vouchers[0].forbiddenDates ? formatForbiddenVoucherTime(vouchers[0].forbiddenDates) : '不限制';
        },
      }, {
        label: '支付渠道限制',
        dataIndex: vouchers[0].paychannel,
        render: ()=>{
          // 空为不限制
          return vouchers[0].paychannel ? payChannelsEnum[vouchers[0].paychannel] : '不限制';
        },
      }, {
        label: '是否与其他单品优惠券叠加',
        dataIndex: vouchers[0].multiUseMode,
        render: ()=>{
          return vouchers[0].multiUseMode ? '叠加' : '不叠加';
        },
      }, {
        label: '使用人群限制',
        dataIndex: obj.crowdRestriction,
        render: ()=>{
          return obj.crowdRestriction ? crowdRestrictionEnum[obj.crowdRestriction] : '全部用户';
        },
      }, {
        label: '是否允许转增',
        dataIndex: vouchers[0].allowTransfer,
        colSpan: 5,
        render: ()=>{
          return vouchers[0].allowTransfer ? '允许转让' : '不允许';
        },
      }, {
        label: '备注',
        dataIndex: vouchers[0].voucherNote,
        colSpan: 5,
      }, {
        label: '使用说明',
        dataIndex: vouchers[0].descList,
        render: ()=>{
          const arr = vouchers[0].descList || [];
          return arr.map((v, index)=>{
            return (<p key={index}>{v}</p>);
          });
        },
        colSpan: 5,
      },
    ];
    const shopDetail = this.state.shopDetail;
    return (<div>
      <Modal title={'适用门店'}
          visible={this.state.showShopListModal}
          onCancel={this.hideShopList}
          footer={[]}
        >
          <div className="check-shop-list">
            {
              shopDetail.length && shopDetail.map((item, key) => {
                return (
                  <dl key={key}>
                    <dt>{item.cityName}</dt>
                    <dd>{item.name}</dd>
                  </dl>
                );
              })
            }
          </div>
        </Modal>
    <DetailTable
    dataSource={dataSource}
    autoHidden={this.props.autoHidden}
    columnCount={6}
    /></div>);
  }
}

TabsTable.propTypes = {
  obj: PropTypes.any,
  autoHidden: PropTypes.bool,
};

export default TabsTable;
