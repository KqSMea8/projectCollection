import React, {PropTypes} from 'react';
import { Modal, Row, Col } from 'antd';
import { DetailTable } from 'hermes-react';

const BargainView = React.createClass({
  propTypes: {
    discountForm: PropTypes.object,
  },

  getInitialState() {
    return {
      showGoodsIds: false,
      showShops: false,
      showReduces: false,
    };
  },

  /*eslint-disable */
  render() {
    const { discountForm } = this.props;
    const randomReduceOrBuyASendA = discountForm.type === 'RANDOM_REDUCE' || discountForm.itemDiscountType === 'BUY_A_SEND_A';
    const modalCombinations = discountForm.itemDiscountType === 'BUY_A_SEND_B' && (
      <div>
        <a onClick={() => {
          this.setState({
            showGoodsIds: true,
          });
        }}>{`${discountForm.buyGiveGoods.length}个组合`}</a>
        <Modal title={'购买及赠送商品组合'}
          visible={this.state.showGoodsIds}
          onCancel={() => {
            this.setState({
              showGoodsIds: false,
            });
          }}
          footer={[]}>
          <div style={{ maxHeight: 300, overflowX: 'hidden', color: '#999' }}>
            <ul>
              {
                discountForm.buyGiveGoods.map((good, i) => {
                  return (
                    <li key={i} style={{ marginBottom: 10 }}>
                      <Row gutter={16}>
                        <Col span={3}>组合{i + 1}</Col>
                        <Col span={8}>
                          买<div style={{ maxHeight: 80, overflowY: 'auto' }}>
                            {
                              good.buyGoodIds.map((id, key) => {
                                return <p key={`id${key}`}>{id}</p>;
                              })
                            }
                          </div>
                        </Col>
                        <Col span={5}>
                          送<p>{good.giveGoodId}</p>
                        </Col>
                      </Row>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </Modal>
      </div>
    );
    const modalSku = (
      <div>
        <a onClick={() => {
          this.setState({
            showGoodsIds: true,
          });
        }}>查看</a>
        <Modal title={'商品编码'}
          visible={this.state.showGoodsIds}
          onCancel={() => {
            this.setState({
              showGoodsIds: false,
            });
          }}
          footer={[]}>
          <div style={{ maxHeight: 200, overflow: 'auto' }}>
            {
              discountForm.goodsIds.map((id, i) => {
                return (
                  <p key={i}>{id}</p>
                );
              })
            }
          </div>
        </Modal>
      </div>
    );
    const showRandomReduceRanges = (
      discountForm.type === 'RANDOM_REDUCE' &&
      discountForm.vouchers &&
      discountForm.vouchers.length
    );
    const modalRanges = showRandomReduceRanges && (
      <div>
        {(discountForm.vouchers[0].reduceRanges || []).length} 个区间&nbsp;
        <a onClick={() => this.setState({ showReduces: true })}>查看</a>
        <Modal title="随机立减金额区间"
          visible={this.state.showReduces}
          onCancel={() => this.setState({ showReduces: false })}
          footer={[]}>
          <div>
            {
              (discountForm.vouchers[0].reduceRanges || []).map((r, i) =>
                <p key={i} style={{ color: '#999' }}>区间{i + 1}： {r.minRange}–{r.maxRange}元，占比{r.percentage}%</p>
              )
            }
          </div>
        </Modal>
      </div>
    );
    const goodsDataSource = [{
      label: '品牌名称',
      value: discountForm.brandName,
    }, {
      label: '品牌logo',
      value: <img src={discountForm.logoFixUrl} />,
    }, {
      label: '优惠力度',
      value: `同一件商品购满${discountForm.discountBuyNum}, 送${discountForm.discountGiveNum}件`,
      isSkipped: discountForm.itemDiscountType !== 'BUY_A_SEND_A',
    }, {
      label: '购买及赠送商品组合',
      value: modalCombinations,
      isSkipped: discountForm.itemDiscountType !== 'BUY_A_SEND_B',
    }, {
      label: '活动商品名称',
      value: discountForm.subject,
      isSkipped: !randomReduceOrBuyASendA,
    }, {
      label: '商品SKU编码',
      value: modalSku,
      isSkipped: !randomReduceOrBuyASendA,
    }, {
      label: '活动商品详情',
      value: discountForm.activityName,
      isSkipped: !randomReduceOrBuyASendA,
    }, {
      label: '购买商品名称',
      value: discountForm.subject,
      isSkipped: randomReduceOrBuyASendA,
    }, {
      label: '赠送商品名称',
      value: discountForm.giveSubject,
      isSkipped: randomReduceOrBuyASendA,
    }, {
      label: '活动商品详情',
      value: discountForm.activityName,
      isSkipped: randomReduceOrBuyASendA,
    }, {
      label: '活动商品图片',
      value: discountForm.activityImgs && discountForm.activityImgs.map((img, i) => <img key={i} src={img} />),
      colSpan: 5,
    }, {
      label: '更多商品详情',
      value: discountForm.activityLink,
      colSpan: 5,
    }];
    let minItemNum = discountForm.minItemNum;
    if (minItemNum > 0) {
      minItemNum = `购买${discountForm.minItemNum}件活动商品可享优惠`;
    } else {
      minItemNum = discountForm.minimumAmount && discountForm.minimumAmount !== '0' ? `消费满${discountForm.minimumAmount}元活动商品可享优惠` : '不限制';
    }
    const rulesDataSource = [{
      label: '随机立减金额区间',
      value: modalRanges,
      isSkipped: !showRandomReduceRanges,
    }, {
      label: '一笔订单购买商品最低限制',
      value: minItemNum,
      isSkipped: discountForm.itemDiscountType === 'BUY_A_SEND_A',
    }, {
      label: '一笔订单最多几件享受优惠',
      value: discountForm.discountGiveLimit && discountForm.discountGiveLimit !== '0' ?
        discountForm.discountGiveLimit : '不限制',
      isSkipped: discountForm.itemDiscountType !== 'BUY_A_SEND_A',
    }, {
      label: '一笔订单同一SKU商品最多送几件',
      value: discountForm.oneSKUGiveLimt || '不限制',
      isSkipped: discountForm.type === 'RANDOM_REDUCE',
    }, {
      label: '券是否需要领取',
      value: discountForm.useMode === '0' ? '需要领取' : '无需领取',
      isSkipped: discountForm.type === 'RANDOM_REDUCE',
    }, {
      label: `活动期间每人累计可${discountForm.useMode === '0' ? '领券几张' : '参与几次'}`,
      value: discountForm.receiveLimited ? `最多${discountForm.receiveLimited}次` : '不限制',
    }, {
      label: `活动期间每人每天累计可${discountForm.useMode === '0' ? '领券几张' : '参与几次'}`,
      value: discountForm.dayReceiveLimited ? `最多${discountForm.dayReceiveLimited}次` : '不限制',
    }, {
      label: '券有效期',
      value: discountForm.validTimeType === 'RELATIVE' ?
        <span>领取后{discountForm.validPeriod}日内有效</span> :
        <span>{discountForm.validTimeFrom} - {discountForm.validTimeTo}</span>,
      isSkipped: discountForm.type === 'RANDOM_REDUCE',
    }, {
      label: '券发放总量',
      value: discountForm.budgetAmount || '不限制',
    }, {
      label: discountForm.useMode === '0' ? '券是否可以转赠' : null,
      value: discountForm.useMode === '0' ? ((discountForm.donateFlag || discountForm.vouchers[0].donateFlag) ? '是' : '否') : null,
    }, {
      label: '使用说明',
      value: discountForm.descList && discountForm.descList.map((desc, i) => <p key={i}>{desc}</p>),
      colSpan: 5,
    }];
    return (
      <div>
        <p className="sub-title">活动商品设置</p>
        <DetailTable
          columnCount={6}
          dataSource={goodsDataSource}
        />

        <p className="sub-title">活动规则设置</p>
        <DetailTable dataSource={rulesDataSource} />
      </div>
    );
  },
})
;

export default BargainView;
