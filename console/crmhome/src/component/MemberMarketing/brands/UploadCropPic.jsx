import React from 'react';
import { ImgUploadCrop } from 'hermes-react';
import { message } from 'antd';
import ajax from '../../../common/ajax';
import './UploadCropPic.less';
/**
  *上传裁剪的图片
  柚茜
*/

const UploadCropPic = React.createClass({

  onUpload(result) {
    if (result && result.status === 'failed') {
      message.warning(result.errorMessage || '网络繁忙，请稍后重试');
      return null;
    }
    return result.result;
  },

  /*
    @param: positionInfo:裁剪框参数
    @输出：成功时： 返回裁剪后图片的id,url片接的对象：eg:
                  {
                    id: res.fileId,
                    url: res.result,
                  }
    失败时：返回错误信息
  */
  onCropPic(positionInfo) {
    const cutParams = {
      xx: positionInfo.X,
      yy: positionInfo.Y,
      width: positionInfo.width,
      height: positionInfo.height,
      orgWidth: positionInfo.orgWidth,
      orgHeight: positionInfo.orgHeight,
      avatarImage: positionInfo.url,
      fileType: 'jpg',
    };
    return new Promise((resolve, reject) => {
      ajax({
        url: '/goods/itempromo/cutPicture.json',
        method: 'post',
        type: 'json',
        data: cutParams,
        success: (res) => {
          if (res.fileId) {
            resolve({
              id: res.fileId,
              url: res.result,
            });
          } else {
            reject(res.resultMsg || '裁剪失败');
          }
        },
        error: (res) => {
          reject(res.resultMsg || '裁剪失败');
        },
      });
    });
  },

  render() {
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    const opMerchantId = merchantIdInput ? merchantIdInput.value : '';

    const props = {
      action: '/goods/itempromo/uploadPicture.json?op_merchant_id=' + opMerchantId,
      name: 'Filedata',
      fileExt: ['image/bmp', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
      style: {width: 500, height: 500}, // 图片所在容器的长宽,默认是500*500
      ...this.props,
      onUpload: this.onUpload, // 图片上传后的处理函数
      onCropPic: this.onCropPic,
      over: true, // 是否裁剪图片留白区域，如果为true则可裁剪图片以外的部分，以外的部分为负值
    };
    return (<div>
        <ImgUploadCrop {...props} />
    </div>);
  },
});

export default UploadCropPic;
