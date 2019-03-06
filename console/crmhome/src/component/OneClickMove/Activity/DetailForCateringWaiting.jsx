import React, { PropTypes } from 'react';
import { Breadcrumb, message, Modal, /* Row, Col, */Spin } from 'antd';
import { DetailTable } from 'hermes-react';
import ajax from '../../../common/ajax';
import { formatForbiddenVoucherTime, getUriParam, getImageById, numberToChinese } from '../../../common/utils';
import { retailersDeliveryChannels } from '../../MemberMarketing/config/AllStatus';
import allFieldsLabelMap from './allFieldsLabelMap';



const itemTypeMap = {
  VOUCHER: '全场代金',
  RATE: '全场折扣',
  MANJIAN: '每满减',
};
const payChannelMap = {
  '1': '不限制',
  '2': '限储值卡付款可享',
  '3': '储值卡付款不可享',
};
const roundMap = {
  '0': '不自动抹零',
  '1': '自动抹零到元',
  '2': '自动抹零到角',
  '3': '四舍五入到元',
  '4': '四舍五入到角',
};
const groupMap = {
  '0': '全部用户',
  '1': '学生用户',
  '2': '生日用户',
};

// 餐饮一键搬家 待上架 leads 专用
export default class DetailForCateringWaiting extends React.Component {
  static propTypes = {
    location: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showPreviewModal: false,
      showShopListModal: false,
      detail: null, // 优惠券数据
      isFetchLoading: true,
      leadsId: getUriParam('leadsId', props.location.search),
    };
  }

  componentWillMount() {
    this.fetch();
    if (window.top !== window) {
      window.top.postMessage(JSON.stringify({ action: 'scrollTop', scrollTop: 0 }), '*');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.fetch();
    }
  }

  onCancel = () => {
    this.setState({
      showShopListModal: false,
    });
  }

  fetch = () => {
    if (!this.state.leadsId) {
      return;
    }
    this.setState({
      isFetchLoading: true,
    });
    ajax({
      url: '/goods/koubei/queryMovehomeDetail.json',
      // url: 'http://pickpost.alipay.net/mock/tuanjie.test/goods/koubei/queryMovehomeDetail.json',
      method: 'POST',
      data: {
        leadsId: this.state.leadsId,
      },
      type: 'json',
      success: (res) => {
        this.setState({
          isFetchLoading: false,
        });
        if (res.status === 'succeed') {
          this.setState({
            detail: { ...res.data, itemType: res.type },
          });
        } else {
          message.error(res && res.resultMsg || '获取券信息失败');
        }
      },
      error: err => {
        message.error(err && err.resultMsg || '系统异常');
        this.setState({
          isFetchLoading: false,
        });
      },
    });
  }

  showPreview = (event) => {
    event.preventDefault();
    this.setState({
      showPreviewModal: true,
    });
  }

  closePreview = () => {
    this.setState({
      showPreviewModal: false,
    });
  }

  showShopList = () => {
    this.setState({
      showShopListModal: true,
    });
  }

  get crowdName() {
    return ({
      '0': '不限人群',
      '1': '学生用户',
      '2': '生日用户',
    })[this.state.detail.allowUseUserGroup || '0'];
  }

  /* eslint-disable complexity */
  get dataSourceBase() {
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY;
    }
    const detail = this.state.detail || {};
    return ['券类型', '券名称', '折扣力度', '抹零规则',
      '品牌名称', '券 logo', '适用门店', '发放总量',
      '上架时间', '使用方式', '券有效期', '自动续期']
      .map(label => {
        const rtn = { label };
        if (label === '券类型') {
          rtn.value = itemTypeMap[detail.itemType];
        } else if (label === '折扣力度') {
          if (detail.itemType === 'RATE') {
            rtn.value = `${detail.rate} 折`;
          } else if (detail.itemType === 'VOUCHER') {
            rtn.label = '券面额';
            rtn.value = `${detail.couponValue} 元`;
          } else if (detail.itemType === 'MANJIAN') {
            const tmp = [];
            if (detail.perConsumeAmount) tmp.push(`每满 ${detail.perConsumeAmount} 元`);
            if (detail.perDiscountAmount) tmp.push(`减 ${detail.perDiscountAmount}`);
            if (detail.maxDiscountAmount) tmp.push(`封顶${detail.maxDiscountAmount} 元`);
            rtn.value = tmp.join('，');
          }
        } else if (label === '抹零规则') {
          rtn.value = roundMap[detail.roundingMode || '0'];
          rtn.isSkipped = detail.itemType !== 'RATE';
        } else if (label === '券 logo' && detail.logoFileId) {
          rtn.value = <img src={getImageById(detail.logoFileId)} />;
        } else if (label === '发放总量') {
          rtn.value = detail.budgetAmount === '999999999' ? '不限制' : detail.budgetAmount;
        } else if (label === '适用门店') {
          rtn.value = (
            <div>
              {detail.shop.length}家门店
              <span onClick={this.showShopList} style={{ color: '#2db7f5', marginLeft: 10, cursor: 'pointer' }}>查看</span>
              <Modal title={'券适用门店'}
                style={{ top: modalTop }}
                visible={this.state.showShopListModal}
                onCancel={this.onCancel}
                footer={[]}>
                <div className="check-shop-list">
                  {
                    detail.cityShop.map((item, key) => {
                      return (
                        <dl key={`city${key}`}>
                          <dt>{item.cityName}</dt>
                          {
                            item.shops.map((shop, i) => {
                              return (
                                <dd key={`shop${i}`}>{shop.name}</dd>
                              );
                            })
                          }
                        </dl>
                      );
                    })
                  }
                </div>
              </Modal>
            </div>
          );
        } else if (label === '上架时间') {
          if (detail.startTime && detail.endTime) {
            rtn.value = `${detail.startTime} 至 ${detail.endTime}`;
          }
        } else if (label === '使用方式') {
          rtn.value = detail.useMode === '1' ? '无需用户领取' : '需要用户领取';
        } else if (label === '券有效期') {
          if (detail.useMode === '1') {
            rtn.isSkipped = true;
          } else if (detail.useMode === '0') {
            rtn.value = detail.validTimeType === 'FIXED' ? `${detail.validTimeFrom} 至 ${detail.validTimeTo}`
              : `领取后 ${detail.validPeriod} 天有效`;
          }
        } else if (label === '自动续期') {
          rtn.value = detail.renewMode === '0' ? '不续期' : '自动续期';
        } else {
          const field = allFieldsLabelMap[label];
          rtn.value = detail[field] || '';
        }
        return rtn;
      });
  }

  get dataSourceRule() {
    const detail = this.state.detail || {};
    return ['使用时段', '不可用日期', '领取限制', '每日领取限制',
      '最低消费', '最高优惠', '领取人群限制', '支付渠道限制',
      '是否允许转赠', '是否在口碑门店露出', '商品售卖时间']
      .map(label => {
        const rtn = { label };
        if (label === '使用时段') {
          if (detail.availableTimeType === '1' || !detail.availableTimeType) {
            rtn.value = '不限制';
          } else if (detail.availableTimes) {
            rtn.value = detail.availableTimes.map((d, i) => {
              return (
                <div key={i}>
                  <span>{d.times && d.times.replace(',', ' - ')}</span>
                  <span>{detail.availableTimeType === '2' ? '星期' : '每月'} {
                    detail.availableTimeType === '2' && d.values ? d.values.split(',').map(v => numberToChinese(v)).join('，') : d.values
                  }</span>
                </div>
              );
            });
          }
        } else if (label === '不可用日期') {
          rtn.value = !detail.forbiddenTime ? '不限制'
            : formatForbiddenVoucherTime(detail.forbiddenTime);
        } else if (label === '领取限制') {
          if (detail.useMode === '1') {
            rtn.isSkipped = false;
          }
          rtn.value = detail.receiveLimited || '不限制';
        } else if (label === '每日领取限制') {
          if (detail.useMode === '1') {
            rtn.isSkipped = false;
          }
          rtn.value = detail.dayReceiveLimited || '不限制';
        } else if (label === '最低消费') {
          if (detail.itemType === 'MANJIAN') {
            rtn.isSkipped = true;
          }
          rtn.value = detail.minimumAmount || '不限制';
        } else if (label === '最高优惠') {
          if (detail.itemType === 'RATE') {
            rtn.value = detail.displayAmount || '不限制';
          } else {
            rtn.value = detail.maxDiscountAmount || '不限制';
          }
        } else if (label === '领取人群限制') {
          rtn.value = groupMap[detail.allowUseUserGroup || '0'];
        } else if (label === '支付渠道限制') {
          rtn.value = payChannelMap[detail.payChannel || '1'];
        } else if (label === '是否允许转赠') {
          rtn.value = detail.donateFlag === '0' ? '否' : '是';
        } else if (label === '是否在口碑门店露出') {
          rtn.value = (detail.deliveryChannels || []).indexOf('SHOP_DETAIL') !== -1 ? '是' : '否';
        } else if (label === '商品售卖时间') {
          rtn.value = detail.salesPeriodStart && detail.salesPeriodEnd ? `${detail.salesPeriodStart} 至 ${detail.salesPeriodEnd}` : '暂无';
        }
        return rtn;
      });
  }

  get dataSourceOther() {
    const detail = this.state.detail;
    return [
      '备注', '使用须知',
    ].map(label => {
      const rtn = { label, colSpan: 5 };
      if (label === '备注') {
        rtn.value = detail.name || '';
      } else if (label === '使用须知') {
        rtn.value = (detail.descList || []).map((d, i) => <div key={i}>{d}</div>);
      }
      return rtn;
    });
  }

  get dataSourceChannel() {
    const detail = this.state.detail;
    /*
    const filteredChannels = (detail.deliveryChannels || []).filter((item) => retailersDeliveryChannels[item] &&
      retailersDeliveryChannels[item].img !== '' ||
      (item === 'QR_CODE' && detail.deliveryResult && detail.deliveryResult[item]) ||
      (item === 'SHORT_LINK' && detail.deliveryResult && detail.deliveryResult[item])
    ); // 投放渠道预览需要展示 img，所以在这里排除掉 img 没有的渠道。
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY;
    }
    */
    return [{
      label: '投放渠道',
      value: (
        <div>
          {
            detail.deliveryChannels && detail.deliveryChannels.map((item, i) => {
              return (
                <span key={`chanel${i}`}>{retailersDeliveryChannels[item] && retailersDeliveryChannels[item].label}
                  {retailersDeliveryChannels[item] && i !== detail.deliveryChannels.length - 1 ? ', ' : null}
                </span>
              );
            })
          }
          {/*
            filteredChannels.length > 0 ?
              <div style={{ display: 'inline-block', marginLeft: 10 }}>
                {
                  filteredChannels.every((item) => {
                    return item === 'SHOP_DETAIL';
                  }) ? null : <a href="#" onClick={this.showPreview}>预览</a>
                }
                <Modal ref="modal"
                  visible={this.state.showPreviewModal}
                  onCancel={this.closePreview}
                  title="投放渠道预览"
                  width="800"
                  style={{ top: modalTop }}
                  footer={[]}>
                  <Row type="flex" justify="space-between">
                    {
                      detail.deliveryChannels.map((item, index) => {
                        if (retailersDeliveryChannels[item] && retailersDeliveryChannels[item].img !== '') {
                          return (<Col key={`delivery${index}`} span="7">
                            {retailersDeliveryChannels[item].label}
                            <img width="100%" src={retailersDeliveryChannels[item].img} />
                          </Col>);
                        }
                        return (<Col key={`delivery${index}`} span="7">
                          {retailersDeliveryChannels[item] && retailersDeliveryChannels[item].label}
                        </Col>);
                      })
                    }
                  </Row>
                </Modal>
              </div> : null
          */}
        </div>
      ),
      colSpan: 5,
    }];
  }

  /* eslint-disable complexity */
  render() {
    /* eslint-disable complexity */
    const { detail, isFetchLoading } = this.state;
    if (isFetchLoading) {
      return (
        <div style={{ paddingTop: '100px', textAlign: 'center' }}>
          <Spin />
        </div>
      );
    }
    if (detail) {
      return (
        <div className="kb-groups-view">
          {window.top === window && <h2 className="kb-page-title">营销管理</h2>}
          <div className="app-detail-content-padding">
            {window.top === window && (
              <Breadcrumb separator=">">
                <Breadcrumb.Item>管理</Breadcrumb.Item>
                <Breadcrumb.Item>查看营销活动</Breadcrumb.Item>
              </Breadcrumb>
            )}
            <div className="kb-detail-main">
              <div className="coupon-info">
                <div className="coupon-detail">
                  <h4>{detail.subject} <span className="status"></span></h4>
                  {detail.startTime && detail.endTime && <p>{detail.startTime} ~ {detail.endTime}</p>}
                  {detail.renewMode === '1' && <p>已设置自动续期</p>}
                  {/* <p style={{ marginTop: 10 }}>
                    <span style={{ color: '#ff6600', fontWeight: 'bold' }}>{this.crowdName}</span>
                  </p>*/}
                </div>
              </div>

              <p className="sub-title">基本信息</p>
              <DetailTable
                columnCount={6}
                dataSource={this.dataSourceBase}
                labelCellClassName="kb-detail-table-label"
                valueCellClassName="kb-detail-table-value"
                emptyCellClassName="kb-detail-table-empty"
              />

              <p className="sub-title">规则设置</p>
              <DetailTable
                columnCount={6}
                dataSource={this.dataSourceRule}
                labelCellClassName="kb-detail-table-label"
                valueCellClassName="kb-detail-table-value"
                emptyCellClassName="kb-detail-table-empty"
              />

              <p className="sub-title">其他设置</p>
              <DetailTable
                columnCount={6}
                dataSource={this.dataSourceOther}
                labelCellClassName="kb-detail-table-label"
                valueCellClassName="kb-detail-table-value"
                emptyCellClassName="kb-detail-table-empty"
              />

              <p className="sub-title">投放渠道</p>
              <DetailTable
                columnCount={6}
                dataSource={this.dataSourceChannel}
                labelCellClassName="kb-detail-table-label"
                valueCellClassName="kb-detail-table-value"
                emptyCellClassName="kb-detail-table-empty"
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}
