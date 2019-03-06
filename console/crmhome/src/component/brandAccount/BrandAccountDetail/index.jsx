import React from 'react';
import { Breadcrumb, Button, Modal } from 'antd';
import './BrandAccountDetail.less';
import GoodsList from './GoodsList';
import ADList from './ADList';
import classnames from 'classnames';
import fetch from '@alipay/kb-fetch';
import { getImageById } from '../../../common/utils';

const ButtonGroup = Button.Group;
class BrandAccountDetail extends React.Component {
  state = {
    data: {},
    previewImgUrl: '',
    previewImgShow: false,
    defaultTab: 'goods',
    goodsNumber: '',
    adsNumber: '',
  };
  componentDidMount() {
    fetch({
      url: 'kbshopdecorate.brandShopQueryWrapperService.queryByBrandShopId',
      param: {
        brandShopId: this.props.params.shopId,
      },
    }).then(resp => {
      this.setState({
        data: resp.data,
      });
    });
  }
  changeTab = (key) => () => {
    this.setState({
      defaultTab: key,
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
  updateGoodsNumber = (number) => {
    this.setState({ goodsNumber: number });
  }
  updateADListNumber = (number) => {
    this.setState({ adsNumber: number });
  }
  render() {
    const { previewImgUrl, previewImgShow, defaultTab, data, goodsNumber, adsNumber } = this.state;
    const { shopId, brandId } = this.props.params;
    return (
      <div className="brand-account-detail">
        <div className="app-detail-header" style={{ height: 70 }}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item style={{ cursor: 'pointer' }} href="#/brand-account">品牌号</Breadcrumb.Item>
            <Breadcrumb.Item>{data.shopName || ''}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="brand-hander">
          <div className="brand-img" onClick={this.previewImageShow(getImageById(data.logo))}>
            <img src={getImageById(data.logo)} alt="LOGO" />
            <div className="img-name">LOGO</div>
          </div>
          <div className="brand-img" onClick={this.previewImageShow(getImageById(data.cover))}>
            <img src={getImageById(data.cover)} alt="首图" />
            <div className="img-name">首图</div>
          </div>
          <div className="brand-content">
            <span style={{ fontSize: 15 }}>{data.shopName}</span>
            <p>{data.shopDesc}</p>
            <span>品牌ID：{data.brandId}</span>
          </div>
        </div>
        <div className="brand-tab">
          <ButtonGroup style={{ marginBottom: 15 }}>
            <Button type="ghost" onClick={this.changeTab('goods')}
              className={classnames({ 'brand-button': true, 'button-hover': defaultTab === 'goods' })}
            >商品 {goodsNumber}</Button>
            <Button type="ghost" onClick={this.changeTab('advertising')}
              className={classnames({ 'brand-button': true, 'button-hover': defaultTab === 'advertising' })}
            >广告 {adsNumber}</Button>
          </ButtonGroup>
          {defaultTab === 'goods' && <GoodsList shopId={shopId} brandId={brandId} updateNumber={this.updateGoodsNumber}/>}
          {defaultTab === 'advertising' && <ADList brandShopId={shopId} brandId={brandId} updateNumber={this.updateADListNumber}/>}
        </div>
        <Modal
          visible={previewImgShow}
          width={500}
          title="图片预览"
          footer={<Button type="ghost" onClick={this.hidePreviewImage}>关闭</Button>}
          maskClosable
          onCancel={this.hidePreviewImage}
          onOk={this.hidePreviewImage}
        ><img width="100%" src={previewImgUrl} /></Modal>
      </div>
    );
  }
}

export default BrandAccountDetail;
