import React from 'react';
import { SkuPhotoPicker} from '@alipay/xform';
import ajax from '../../../../../common/ajax';
import { message } from 'antd';
/* eslint-disable */

const merchantIdInput = document.getElementById('J_crmhome_merchantId');
const opMerchantId = merchantIdInput ? merchantIdInput.value : '';
const kbInput = document.getElementById('J_isFromKbServ');
const uploadUrl = kbInput && kbInput.value === 'true' ? `/goods/koubei/itempromo/uploadPicture.json` : `/goods/itempromo/uploadPicture.json`;
const clipUrl = kbInput && kbInput.value === 'true' ? `/goods/koubei/itempromo/cutPicture.json` : `/goods/itempromo/cutPicture.json`;

const convertFile2Photo = (file: any) => {
  return {
    uid: file.response.fileId,
    url: file.response.result,
  };
};


class SkuPhotoPickerBox extends React.Component {
  state = {
    uploadOpts: {
      action: uploadUrl + '?op_merchant_id=' + opMerchantId,
      // action: ' http://pickpost.alipay.net/mock/kb-crmhome/goods/itempromo/picUpload.json',
      uploadName: 'Filedata',
      accept: 'image/*',
      withCredentials: true,
      accept: 'image/gif,image/png,image/jpg,image/jpeg,image/bmp',
      beforeUpload: (file) => {
        if (file.size > 2 * 1024 * 1024) {
          message.error('大小不能超过2M');
          return false;
        }
        return true;
      },
    },
    current: 1,
    pageSize: 8,
    total: 0,
    loading: false,
    // data: Array(20).fill(null).map((p, idx) => ({
    //   uid: String(idx),
    //   // tslint:disable-next-line:max-line-length
    //   url: 'http://alipay-rmsdeploy-dev-image.oss-cn-hangzhou-zmf.aliyuncs.com/kbretailprod/sYkBDofhbXzUpNroWeZf.jpeg',
    // })),
    data: [],
    goodsList: null,
    maxImage: 3,
    fmProps: { 
      labelCol: this.props.layout.labelCol || {span: 7},
      wrapperCol: this.props.layout.wrapperCol || {span: 16, offset: 1},
      label: '活动商品图片',
      field: 'skuImage',
      disabled: false,
      required: true,
      // rules: [{ required: true}],
      extra: '请至少上传一张商品封面图，单张大小不超过2M，格式：bmp,png,jpeg,jpg,gif',
    },
  };

  componentWillMount() {
    this.props.form.setFieldsValue({
      [this.state.fmProps.field]: {
        mainImage: '',
        images: '',
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.goodsList !== this.props.goodsList) {
      this.fetchGoodsList();
    }
  }

  getPhotoInfo = (info) => {
    this.fileType = info.response.fileType;
    return {
      uid: info.response.fileId,
      url: info.response.result,
    };
  }

  fetchGoodsList = () => {
    const skus = this.props.goodsList ? this.props.goodsList.replace(/\n+/g, ',').replace(/,$/g, '') : '';
    if (!skus) {
      this.setState({
        goodsList: null, // 设置为null标识用户为输入商品编码
      });
      return;
    }
    ajax({
      url: window.APP.kbretailprod + '/gateway.htm?biz=supermarket.extitem&action=/skuExist/list',
      data: {
        op_merchant_id: opMerchantId,
        data: JSON.stringify({skus}),
      },
      method: 'POST',
      type: 'json',
      success: (res) => {
        const goodsList = [];
        if (res.success) {
          if (res.data) {
            res.data.map((item) => {
              goodsList.push({sku: item.itemCode, name: item.title || '--'})
            })
          }
          this.setState({
            goodsList,
          });
        } else {
          message.error(res.errorMsg || '网络繁忙，请稍后重试');
        }
      },
      error: (err) => {
        message.error(err.errorMsg || '网络繁忙，请稍后重试');
      },
    });
  }

  onCutList = (info, next) => {
    if (info.cropInfo) {
      const { X, Y, height, width, imgHeight, imgWidth, url } = info.cropInfo;
      ajax({
        url: clipUrl,
        method: 'post',
        type: 'json',
        data: {
          xx: X,
          yy: Y,
          x2: X + width,
          y2: Y + height,
          width,
          height,
          orgWidth: imgWidth,
          orgHeight: imgHeight,
          avatarImage: info.selectPhoto.url,
          fileType: this.fileType || 'jpeg',
        },
      }).then((res) => {
        if (res.status === 'succeed') {
          next({
            uid: res.fileId,
            url: res.result,
          });
        } else {
          message.error(res.errorMsg || '图片截取失败');
        }
      }, (res) => {
        message.error(res.errorMsg || '图片截取失败');
      });
    } else {
      next(info.selectPhoto);
    }
  };

  onPageChange = (page, selectGoods) => {
    this.setState({
      current: page,
      loading: true,
    });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 500);
  }

  onSearchChange = (selectGoods) => {
    this.setState({
      loading: true,
      current: 1,
    });
    ajax({
      url: window.APP.kbretailprod + '/gateway.htm?biz=supermarket.extitem&action=/skuPhoto/list',
      data: {
        op_merchant_id: opMerchantId,
        data: JSON.stringify({itemCode: selectGoods.sku}),
      },
      method: 'POST',
      type: 'json',
      success: (res) => {
        if (res.success) {
          const obj = [];
          res.skuPhotoInfoList.map((p) => {
            obj.push({
              uid: p.fileId,
              url: p.url,
            });
          });
          this.setState({
            data: obj,
            total: obj.length,
            loading: false,
          });
        } else {
          message.error(res.errorMsg || '系统繁忙');
          this.setState({
            data: [],
            total: 0,
            loading: false,
          });
        }
      },
      error: (err) => {
        if (!err.success) {
          message.error(err.errorMsg || '系统繁忙');
          this.setState({
            data: [],
            total: 0,
            loading: false,
          });
        }
        // message.error(err.errorMsg || '操作失败');
      },
    });
  }

  render() {
    window._f = this.props.form;
    const { uploadOpts, current, pageSize, total, loading, data, goodsList, maxImage, fmProps} = this.state;

    const previews = [{
      style: { width: 240, height: 180 },
      title: <span>展示在<span style={{color: '#2baee9', cursor: 'pointer'}} onClick={()=> {this.props.showPreviewModal('douponDetail')}}>券详情页</span></span>,
    }, {
      style: { width: 120, height: 90 },
      title: <span>展示在<span style={{color: '#2baee9', cursor: 'pointer'}} onClick={()=> {this.props.showPreviewModal('shopDetail')}}>店铺详情页</span></span>,
    }];

    const offset = (current - 1) * pageSize;
    return (
      <div>
        <SkuPhotoPicker
          {...fmProps}
          uploadOpts={uploadOpts}
          listOpts={{ current, pageSize, total, loading, data: data.slice(offset, offset + pageSize)  }}
          onPageChange={this.onPageChange}
          onSearchChange={this.onSearchChange}
          goodsList={goodsList}
          previews={previews}
          convertFile2Photo={convertFile2Photo}
          onCut={this.onCutList}
          needMain={true}
          maxImage={maxImage}
          mainText={'商品封面图(2000px*1500px)'}
          detailText={'商品详情图(不限尺寸)'}
          mainUploadTip={'尺寸2000px*1500px，大小不超过2M'}
          detailUploadTip={'大小不超过2M'}
          convertFile2Photo={this.getPhotoInfo}
          detailPreviewTitle={<span>展示在券详情的<span style={{color: '#2baee9', cursor: 'pointer'}} onClick={()=> {this.props.showPreviewModal('goodDetail')}}>商品详情页</span></span>}
        />
      </div>
    );
  }
}

export default SkuPhotoPickerBox;
