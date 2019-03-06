import React, { PropTypes } from 'react';
import { Modal, Button, Icon, Spin } from 'antd';
import CommonTitle from 'layout/CommonTitle';
import ajax from '../../../../common/ajax';
import RepastShopListModal from './common/RepastShopListModal';
import ShopDetailsModal from './common/ShopDetailsModal';
import ModifiedCell from './tabs/ModifiedCell';
import { getImageById, formatAvailableVoucherTime, formatForbiddenVoucherTime } from '../../../../common/utils';
import BuyRulesDetail from '../../../OneClickMove/common/BuyRulesDetail';

const TYPE_MAP = {
  TRADE_VOUCHER: '在线购买商品',
  ITEM: '在线购买商品',
  MANJIAN: '每满减',
  VOUCHER: '全场代金',
  RATE: '全场折扣',
};
const CANCEL_MAP = {
  'TICKET_CODE': '券码核销',
  'USER_PAY_CODE': '付款码核销（需与口碑单品打通）',
};
const CHANNELS_MAP = {
  'ALL': '正常投放',
  'ORIENTATION': '定向投放',
};
function parseAvaila(arr) {
  if (arr && arr.length > 0) {
    return arr.map(item => {
      return {
        times: item.times,
        values: item.values,
      };
    });
  }
  return [];
}
function parseBuy(arr) {
  if (arr && arr.length > 0) {
    return arr.map(item => {
      return {
        key: item.key,
        value: item.value,
      };
    });
  }
  return [];
}
function parseContents(arr) {
  if (arr && arr.length > 0) {
    return arr.map(item => {
      return {
        itemUnits: item.itemUnits.map(v => {
          return {
            amount: v.amount,
            name: v.name,
            price: v.price,
            spec: v.spec,
            total: v.total,
            unit: v.unit,
          };
        }),
        title: item.value,
      };
    });
  }
  return [];
}
function parseDishes(arr) {
  if (arr && arr.length > 0) {
    return arr.map(item => {
      return {
        imageUrls: item.imageUrls,
        title: item.value,
        desc: item.desc,
      };
    });
  }
  return [];
}
function parseIntroductions(arr) {
  if (arr && arr.length > 0) {
    return arr.map(item => {
      return {
        imageUrls: item.imageUrls,
        title: item.value,
      };
    });
  }
  return [];
}
class TabsGoods extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {},
      loading: true,
      modifiedData: {},
      shopListModal: false,
      shopListModal2: false,
      shopDetailsModal: false,
      previewVisible: false,
      previewVisible2: false,
      previewImgUrl: '',
      previewImgShow: false,
      showDetailsGoods: false,
      goodsImgsVisible: false,
    };
  }
  componentDidMount() {
    const {itemId, smartPromoId, status} = this.props;
    ajax({
      url: '/goods/caterItem/queryLogInfo.json',
      method: 'get',
      data: {
        promId: itemId,
      },
      success: (res) => {
        if (res.status === 'succeed') {
          if (status !== 'MODIFY_WAIT_CONFIRM') {
            this.setState({
              data: res.data,
              loading: false,
            });
          } else {
            this.setState({
              data: res.data,
            });
          }
        }
      },
    });
    if (status === 'MODIFY_WAIT_CONFIRM') {
      ajax({
        url: '/goods/kbsmartplan/queryModifySmartPromo.json',
        method: 'get',
        data: {
          smartPromoId: smartPromoId,
          itemId,
        },
        success: (res) => {
          if (res.status === 'succeed') {
            this.setState({
              modifiedData: res.data,
              loading: false,
            });
          }
        },
      });
    }
  }
  mapDetailInfoDom = (data = {}) => {
    return <BuyRulesDetail className="goods-detail" value={{ buyTips: data.buyTips || [], buyTipsTemplate: data.buyTipsTemplate }} />;
  }
  showShopList = () => {
    this.setState({
      shopListModal: true,
    });
  }
  showShopList2 = () => {
    this.setState({
      shopListModal2: true,
    });
  }
  cancelShopListModal = () => {
    this.setState({
      shopListModal: false,
      shopListModal2: false,
    });
  }
  showShopDetails = () => {
    this.setState({
      shopDetailsModal: true,
    });
  }
  cancelShopDetailsModal = () => {
    this.setState({
      shopDetailsModal: false,
      showDetailsGoods: false,
    });
  }
  showModifedGoods = () => {
    this.setState({
      showDetailsGoods: true,
    });
  }
  showGoodsImgs = () => {
    this.setState({
      goodsImgsVisible: true,
    });
  }
  handlePreview = () => {
    this.setState({
      previewVisible: true,
    });
  }
  handlePreview2 = () => {
    this.setState({
      previewVisible2: true,
    });
  }
  previewCancel = () => {
    this.setState({
      previewVisible: false,
      previewVisible2: false,
      goodsImgsVisible: false,
    });
  }
  previewImageShow = (imgUrl) => () => {
    this.setState({
      previewImgUrl: imgUrl,
      previewImgShow: true,
    });
  }
  hidePreviewImage = () => {
    this.setState({
      previewImgShow: false,
    });
  }
  isGooodDetail = () => {
    const {data, modifiedData} = this.state;
    const isMod = this.props.status === 'MODIFY_WAIT_CONFIRM';
    if (isMod && modifiedData.contents) {
      const dataJson = JSON.stringify({
        contents: parseContents(data.contents),
        dishes: parseDishes(data.dishes),
        remarks: data.remarks,
        introductions: parseIntroductions(data.introductions),
        totalPrice: data.totalPrice,
      });
      const modifedJson = JSON.stringify({
        contents: parseContents(modifiedData.contents),
        dishes: parseDishes(modifiedData.dishes),
        remarks: modifiedData.remarks,
        introductions: parseIntroductions(modifiedData.introductions),
        totalPrice: modifiedData.totalPrice,
      });
      return dataJson !== modifedJson;
    }
    return false;
  }
  isItemImgs = () => {
    const {data, modifiedData} = this.state;
    const isMod = this.props.status === 'MODIFY_WAIT_CONFIRM';
    if (isMod && modifiedData.itemDetailImages) {
      return JSON.stringify(modifiedData.itemDetailImages) !== JSON.stringify(data.itemDetailImages);
    }
    return false;
  }
  isFirstImg = () => {
    const {data, modifiedData} = this.state;
    const isMod = this.props.status === 'MODIFY_WAIT_CONFIRM';
    if (isMod && modifiedData.itemImage && modifiedData.itemImage.length > 0 && data.itemImage) {
      if (data.itemImage[0] !== modifiedData.itemImage[0]) return true;
    }
    if (isMod && (data.taobaoCoverImage !== modifiedData.taobaoCoverImage) && (data.taobaoCoverImage || modifiedData.taobaoCoverImage)) {
      return true;
    }
    return false;
  }
  renderTop = (data, modifiedData) => {
    const isTitle = modifiedData.title && (modifiedData.title !== data.title);
    const isPrice = modifiedData.price && modifiedData.originPrice && (modifiedData.price !== data.price || modifiedData.originPrice !== data.originPrice);
    const isRangeTo = modifiedData.rangeTo && (modifiedData.rangeTo !== data.rangeTo);
    return (<div className="tabs-content-custom">
    <h5 className="tabs-h5-custom">
      {isTitle ? (
        <span style={{ background: '#ffffce'}}>
          {modifiedData.verifyFrequency === 'multi' ? modifiedData.verifyEnableTimes + '份' + modifiedData.title : modifiedData.title}
          <a onClick={() => Modal.info({
            title: '修改前的内容',
            content: data.title,
          })}>
            <Icon type="edit" />
          </a>
        </span>
      ) : (
        <span>{data.verifyFrequency === 'multi' ? data.verifyEnableTimes + '份' + data.title : data.title}</span>
      )}
    </h5>
      <p className="tabs-p-custom">
      {isPrice ? (
        <span style={{ background: '#ffffce'}}>
          <span>原价{modifiedData.originPrice}元，优惠价{modifiedData.price}元</span>
          <a onClick={() => Modal.info({
            title: '修改前的内容',
            content: `原价${data.originPrice}元，优惠价${data.price}元`,
          })}>
            <Icon type="edit" />
          </a>
        </span>
      ) : (
        <span>原价{data.originPrice}元，优惠价{data.price}元</span>
      )}
      </p>
      <p className="tabs-p-custom">
      {isRangeTo ? (
        <span style={{ background: '#ffffce'}}>
          <span>{`购买后${modifiedData.rangeTo}天内有效`}</span>
          <a onClick={() => Modal.info({
            title: '修改前的内容',
            content: `购买后${data.rangeTo}天内有效`,
          })}>
            <Icon type="edit" />
          </a>
        </span>
      ) : (
        <span>{`购买后${data.rangeTo}天内有效`}</span>
      )}
      </p>
    </div>);
  }
  /* eslint-disable */
  render() {
    /* eslint-enable */
    const {data, modifiedData, shopListModal, shopDetailsModal, previewVisible, previewVisible2, goodsImgsVisible, loading, showDetailsGoods} = this.state;
    const isMod = this.props.status === 'MODIFY_WAIT_CONFIRM';
    const isShop = isMod && JSON.stringify(data.shopIds) !== JSON.stringify(modifiedData.shopIds);
    if (loading) {
      return <div style={{ textAlign: 'center', marginTop: 80 }}><Spin /></div>;
    }

    let itemType = '';
    if (data.verifyFrequency === 'multi') {
      itemType = '多次核销商品';
    } else {
      itemType = TYPE_MAP[data.type];
    }

    return (<div className="content-secton">
        {this.renderTop(data, modifiedData)}
        <CommonTitle name="基本信息" />
        <table className="kb-detail-table">
          <tbody>
            <tr>
              <td className="kb-detail-table-label">商品类型</td>
              <td>{itemType}</td>
              <td className="kb-detail-table-label">商品名称</td>
              <ModifiedCell
                newVal={modifiedData.title}
                oldVal={data.title}
              />
              <td className="kb-detail-table-label">商品价格</td>
              {
                isMod && modifiedData.originPrice && modifiedData.price ? <ModifiedCell
                newVal={`原价${modifiedData.originPrice}元，优惠价${modifiedData.price}元`}
                oldVal={`原价${data.originPrice}元，优惠价${data.price}元`}
              /> : <td>原价{data.originPrice}元，优惠价{data.price}元</td>
              }
            </tr>
            <tr>
              <td className="kb-detail-table-label">适用门店</td>
              {isShop ?
              <td className="modified">
                {modifiedData.shop && modifiedData.shop.length ? modifiedData.shop.length : '0'}家门店
                {modifiedData.shop && modifiedData.shop.length && <a onClick={this.showShopList}> 查看</a>}
                <a style={{ float: 'right' }} onClick={this.showShopList2}>
                  <Icon type="edit" />
                </a>
              </td> :
              <td>
                {data.shop && data.shop.length ? data.shop.length : '0'}家门店
                {data.shop && data.shop.length && <a onClick={this.showShopList}> 查看</a>}
              </td>}
              <td className="kb-detail-table-label">商品详情</td>
              <td className={this.isGooodDetail() ? 'modified' : ''}>
                <a onClick={this.showShopDetails}>查看</a>
                {this.isGooodDetail() && <a style={{ float: 'right' }} onClick={this.showModifedGoods}>
                  <Icon type="edit" />
                </a>}
              </td>
              <td className="kb-detail-table-label">{data.verifyFrequency === 'multi' ? '包含商品数量' : ''}</td>
              <td>{data.verifyFrequency === 'multi' ? <span>{data.verifyEnableTimes}份</span> : ''} </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">所属类目</td>
              <ModifiedCell
                newVal={modifiedData.categoryPathName}
                oldVal={data.categoryPathName}
              />
              <td className="kb-detail-table-label">商品首图</td>
              <td className={this.isFirstImg() ? 'modified' : ''}>
                {this.isFirstImg() && modifiedData.itemImage && modifiedData.itemImage[0] && <a onClick={this.handlePreview}><img width="50" src={getImageById(modifiedData.itemImage[0])}/></a> }
                {!this.isFirstImg() && data.itemImage && data.itemImage[0] && <a onClick={this.handlePreview}><img width="50" src={getImageById(data.itemImage[0])}/></a> }
                {this.isFirstImg() && <a style={{ float: 'right' }} onClick={this.handlePreview2}>
                  <Icon type="edit" />
                </a>}
              </td>
              <td className="kb-detail-table-label">商品图片</td>
              <td className={this.isItemImgs() ? 'modified' : ''}>
                {!this.isItemImgs() && (data.itemDetailImages || []).map((item, i) => <a key={i} onClick={this.previewImageShow(getImageById(item))}><img width="50" src={getImageById(item)}/></a>)}
                {this.isItemImgs() && (modifiedData.itemDetailImages || []).map((item, i) => <a key={i} onClick={this.previewImageShow(getImageById(item))}><img width="50" src={getImageById(item)}/></a>)}
                {this.isItemImgs() && <a style={{ float: 'right' }} onClick={this.showGoodsImgs}>
                  <Icon type="edit" />
                </a>}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">商品 ID</td>
              <td colSpan="5">{data.itemId || ''}</td>
            </tr>
          </tbody>
        </table>
        <CommonTitle name="规则设置" />
        <table className="kb-detail-table">
          <tbody>
            <tr>
              <td className="kb-detail-table-label">商品展示渠道</td>
              <td>{data.displayChannels && CHANNELS_MAP[data.displayChannels]}</td>
              <td className="kb-detail-table-label">核销方式</td>
              <td>{data.ticketDisplayMode && CANCEL_MAP[data.ticketDisplayMode]}</td>
              <td className="kb-detail-table-label">发放总量</td>
              <ModifiedCell
                newVal={isMod ? (modifiedData.totalAmount || '不限制') : (data.totalAmount || '不限制')}
                oldVal={data.totalAmount || '不限制'}
              />
            </tr>
            <tr>
              <td className="kb-detail-table-label">有效期</td>
              {
                isMod && modifiedData.rangeTo ? <ModifiedCell
                newVal={`购买后${modifiedData.rangeTo}天内有效`}
                oldVal={`购买后${data.rangeTo}天内有效`}
              /> : <td>{`购买后${data.rangeTo}天内有效`}</td>
              }
              <td className="kb-detail-table-label">使用时段</td>
              {isMod && JSON.stringify(parseAvaila(data.availableTimes)) !== JSON.stringify(parseAvaila(modifiedData.availableTimes)) ?
                <ModifiedCell
                  newVal={modifiedData.availableTimes ? formatAvailableVoucherTime(modifiedData.availableTimes) : '不限制'}
                  oldVal={data.availableTimes ? formatAvailableVoucherTime(data.availableTimes) : '不限制'}
                /> : <td>{data.availableTimes ? formatAvailableVoucherTime(data.availableTimes) : '不限制'}</td>
              }
              <td className="kb-detail-table-label">不可用日期</td>
              {isMod && JSON.stringify(data.forbiddenDates) !== JSON.stringify(modifiedData.forbiddenDates) ?
                <ModifiedCell
                  newVal={modifiedData.forbiddenDates ? formatForbiddenVoucherTime(modifiedData.forbiddenDates) : '不限制'}
                  oldVal={data.forbiddenDates ? formatForbiddenVoucherTime(data.forbiddenDates) : '不限制'}
                /> : <td>{data.forbiddenDates ? formatForbiddenVoucherTime(data.forbiddenDates) : '不限制'}</td>
              }
            </tr>
          </tbody>
        </table>
        <CommonTitle name="其他设置" />
        <table className="kb-detail-table tabs-goods-table">
          <tbody>
            <tr>
              <td className="kb-detail-table-label">购买须知</td>
              {isMod && (JSON.stringify(parseBuy(data.buyTips)) !== JSON.stringify(parseBuy(modifiedData.buyTips)) || JSON.stringify(parseBuy(data.buyTipsTemplate)) !== JSON.stringify(parseBuy(modifiedData.buyTipsTemplate))) ?
                <ModifiedCell
                  newVal={(modifiedData.buyTips || modifiedData.buyTipsTemplate) && this.mapDetailInfoDom(modifiedData)}
                  oldVal={(data.buyTips || data.buyTipsTemplate) && this.mapDetailInfoDom(data)}
                /> : <td>{(data.buyTips || data.buyTipsTemplate) && this.mapDetailInfoDom(data)}</td>
              }
            </tr>
            <tr>
              <td className="kb-detail-table-label">备注</td>
              <ModifiedCell
                newVal={modifiedData.remark}
                oldVal={data.remark}
              />
            </tr>
            <tr>
              <td className="kb-detail-table-label">最新通知</td>
              {isMod && JSON.stringify(data.latestNotices) !== JSON.stringify(modifiedData.latestNotices) ?
                <ModifiedCell
                  newVal={modifiedData.latestNotices && modifiedData.latestNotices.map((d, i, arr) => <span key={i}>{d}{arr.length - 1 > i && <br />}</span>)}
                  oldVal={data.latestNotices && data.latestNotices.map((d, i, arr) => <span key={i}>{d}{arr.length - 1 > i && <br />}</span>)}
                /> : <td>{data.latestNotices && data.latestNotices.map((d, i, arr) => <span key={i}>{d}{arr.length - 1 > i && <br />}</span>)}</td>
              }
            </tr>
          </tbody>
        </table>
        <RepastShopListModal
          visible={shopListModal}
          shops={isShop ? modifiedData.shop : data.shop}
          hide={this.cancelShopListModal}
        />
        <RepastShopListModal
          visible={this.state.shopListModal2}
          shops={data.shop || []}
          title="修改前门店"
          hide={this.cancelShopListModal}
        />
        <ShopDetailsModal
          visible={shopDetailsModal}
          repastData={this.isGooodDetail() ? modifiedData : data}
          hide={this.cancelShopDetailsModal}
        />
        <ShopDetailsModal
          modify
          visible={showDetailsGoods}
          repastData={data}
          hide={this.cancelShopDetailsModal}
        />
        <Modal
          visible={this.state.previewImgShow}
          width={500}
          title="图片预览"
          footer={<Button type="ghost" onClick={this.hidePreviewImage}>关闭</Button>}
          maskClosable
          onCancel={this.hidePreviewImage}
          onOk={this.hidePreviewImage}
        ><img width="100%" src={this.state.previewImgUrl} /></Modal>
        <Modal
          visible={previewVisible}
          title="商品首图"
          footer={null}
          onCancel={this.previewCancel}
          width="750"
        >
          <div style={{height: '345px', marginTop: '20px'}}>
            <div style={{width: '56%', float: 'left'}}>
              <p style={{ fontSize: '16px'}}>4:3尺寸展示效果</p>
              <p>该图片将在<span style={{color: '#f60'}}>商品详情页、商品列表页</span>进行展示</p>
              {!this.isFirstImg() && data.itemImage && data.itemImage[0] && <div style={{height: '301px', overflow: 'hidden'}}><img style={{ width: '100%' }} src={getImageById(data.itemImage[0])} /></div>}
              {this.isFirstImg() && modifiedData.itemImage && modifiedData.itemImage[0] && <div style={{height: '301px', overflow: 'hidden'}}><img style={{ width: '100%' }} src={getImageById(modifiedData.itemImage[0])} /></div>}
            </div>
            <div style={{width: '44%', float: 'left', paddingLeft: '15px'}}>
              <p style={{ fontSize: '16px'}}>1:1尺寸展示效果</p>
              <p>该图片将在<span style={{color: '#f60'}}>淘抢购、聚划算、大牌抢购</span>等渠道展示</p>
            {!this.isFirstImg() && data.taobaoCoverImage && <div style={{height: '301px', overflow: 'hidden'}}><img style={{ width: '100%' }} src={getImageById(data.taobaoCoverImage)} /></div>}
            {!this.isFirstImg() && !data.taobaoCoverImage && <div style={{ textAlign: 'center', fontSize: '16px', color: '#999', paddingTop: '140px', backgroundColor: '#eee', height: '301px'}}>暂无图片</div>}
            {this.isFirstImg() && modifiedData.taobaoCoverImage && <div style={{height: '301px', overflow: 'hidden'}}><img style={{ width: '100%' }} src={getImageById(modifiedData.taobaoCoverImage)} /></div>}
            {this.isFirstImg() && !modifiedData.taobaoCoverImage && <div style={{ textAlign: 'center', fontSize: '16px', color: '#999', paddingTop: '140px', backgroundColor: '#eee', height: '301px'}}>暂无图片</div>}
            </div>
          </div>
        </Modal>
        <Modal
          visible={goodsImgsVisible}
          title="修改前商品图片"
          footer={null}
          onCancel={this.previewCancel}
          width="750"
        >
          <div>
            {(data.itemDetailImages || []).map((item, i) => {
              return <img key={i} style={{ width: '45%', margin: 10 }} src={getImageById(item)} />;
            })}
            {(!data.itemDetailImages || !data.itemDetailImages.length) && <div style={{padding: 20, textAlign: 'center'}}>
              修改前没有图片！
            </div>}
          </div>
        </Modal>
        <Modal
          visible={previewVisible2}
          title="修改前商品首图"
          footer={null}
          onCancel={this.previewCancel}
          width="750"
        >
          <div style={{height: '345px', marginTop: '20px'}}>
            <div style={{width: '56%', float: 'left'}}>
              <p style={{ fontSize: '16px'}}>4:3尺寸展示效果</p>
              <p>该图片将在<span style={{color: '#f60'}}>商品详情页、商品列表页</span>进行展示</p>
              {data.itemImage && data.itemImage[0] && <div style={{height: '301px', overflow: 'hidden'}}><img style={{ width: '100%' }} src={getImageById(data.itemImage[0])} /></div>}
            </div>
            <div style={{width: '44%', float: 'left', paddingLeft: '15px'}}>
              <p style={{ fontSize: '16px'}}>1:1尺寸展示效果</p>
              <p>该图片将在<span style={{color: '#f60'}}>淘抢购、聚划算、大牌抢购</span>等渠道展示</p>
              {data.taobaoCoverImage ? <div style={{height: '301px', overflow: 'hidden'}}><img style={{ width: '100%' }} src={getImageById(data.taobaoCoverImage)} /></div> :
              <div style={{ textAlign: 'center', fontSize: '16px', color: '#999', paddingTop: '140px', backgroundColor: '#eee', height: '301px'}}>暂无图片</div>}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
TabsGoods.propTypes = {
  itemId: PropTypes.string,
  smartPromoId: PropTypes.string,
  status: PropTypes.string,
};
export default TabsGoods;
