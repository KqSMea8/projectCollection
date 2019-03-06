import React from 'react';
import { Spin } from 'antd';
import './ChooseAGoods.less';
import AddGoodsModal from './AddGoodsModal';
import { formattingData } from './GoodsList';
import fetch from '@alipay/kb-fetch';
import { getImageById } from '../../../common/utils';

/**
 * 组件：选一个商品
 */
export default class extends React.Component {

  static propTypes = {
    value: React.PropTypes.any, // 选中的商品
    onChange: React.PropTypes.func,
    brandShopId: React.PropTypes.string.isRequired, // 品牌门店id
    brandId: React.PropTypes.string.isRequired, // 品牌id
  };

  constructor(props) {
    super(props);
    this.state = {
      loadingGoodsDetail: false,
      goodsDetail: typeof this.props.value === 'object' && this.props.value,
      isChooseAGoods: false,
    };
  }

  componentDidMount() {
    if (this.props.value && typeof this.props.value === 'string') {
      this.loadGoodsDetail(this.props.value).then(result => {
        if (this.props.onChange) {
          this.props.onChange(result);
        }
      });
    }
  }

  openChooseModal() {
    this.setState({ isChooseAGoods: true });
  }

  // 选中了一个商品
  chooseAGoods = (goodsItem) => {
    this.setState({
      isChooseAGoods: false,
      goodsDetail: goodsItem,
    });
    if (this.props.onChange) {
      this.props.onChange(goodsItem);
    }
  }

  // 关闭商品选择框
  cancelGoods = () => {
    this.setState({ isChooseAGoods: false });
  }
  // 加载商品详情
  loadGoodsDetail(itemId = this.props.value) {
    this.setState({ loadingGoodsDetail: true });
    return fetch({
      url: 'kbshopdecorate.brandItemQueryWrapperService.queryItemByItemId',
      param: {
        itemId,
      },
    }).then(result => {
      this.setState({
        goodsDetail: result.data,
        loadingGoodsDetail: false,
      });
      return result.data;
    });
  }
  // 获取商品列表
  fetchGoodsList = () => fetch({
    url: 'kbshopdecorate.brandItemQueryWrapperService.queryAllItemByBrandId',
    param: {
      brandId: this.props.brandId,
      brandShopId: this.props.brandShopId,
    },
  }).then(result => formattingData(result.data.dataList));

  openGoodsDetail() {
    const url = `#/catering/detail?itemId=${this.state.goodsDetail.itemId}`;
    window.open(url);
  }

  render() {
    const { loadingGoodsDetail, goodsDetail, isChooseAGoods } = this.state;

    const addGoodsModal = isChooseAGoods && (<AddGoodsModal
        selectAGoods={item => this.chooseAGoods(item)}
        cancelGoods={this.cancelGoods}
        isChooseAGoods
        max={1}
        fetchGoodsList={this.fetchGoodsList}
      />);

    if (!this.props.value) {
      return (<div>
        <a onClick={() => this.openChooseModal()}>请选择</a>
        {addGoodsModal}
      </div>);
    }

    return (<div className="brand-account-choose-a-goods">
      <a onClick={() => this.openChooseModal()}>重选</a><span style={{ marginLeft: 12 }}>最多选择一个优惠券或一个商品</span>
      <div className="choose-goods-detail">
        {loadingGoodsDetail && (<div>
          <Spin />
          <a style={{ float: 'right' }} onClick={() => this.openGoodsDetail()}>查看</a>
        </div>)}
        {!loadingGoodsDetail && goodsDetail && <div className="choose-goods-detail-content">
          <img src={getImageById(goodsDetail.logo)} />
          <div className="name-price-info">
            <div>{goodsDetail.itemName}</div>
            <div>
              <span className="price">{goodsDetail.price}</span>
              <span className="origin-price">原价{goodsDetail.originalPrice}</span>
            </div>
          </div>
          <a onClick={() => this.openGoodsDetail()}>查看</a>
        </div>}
      </div>
      {addGoodsModal}
    </div>);
  }
}
