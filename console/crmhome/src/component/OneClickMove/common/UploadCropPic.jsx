import React, { PropTypes } from 'react';
import { ImgUploadCrop, ImgCropModal } from 'hermes-react';
import { message } from 'antd';
import ajax from '../../../common/ajax';
const Preview = ImgCropModal.Preview;

/**
  *上传裁剪的图片
  柚茜
*/

const hDOM = document.getElementById('J_crmhome_merchantId');
let fileUid = 1;

const UploadCropPic = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  getDefaultProps() {
    return {
      style: { width: 500, height: 500 },
    };
  },

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
        url: '/goods/itempromo/cutPicture.json' + (hDOM ? `?op_merchant_id=${hDOM.value}` : ''),
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
            reject(res.resultMsg);
          }
        },
        error: (res) => {
          reject(res.resultMsg);
        },
      });
    });
  },


  render() {
    // 对currentView配置做一个兼容（hermes-react 1.40.0后ImgUploadCrop不支持currentView配置）
    const getPicInfo = (positionInfo) => {
      const {width, height, url} = positionInfo;
      // 裁剪后的照片，按照长的一边作为基准展示，短的一边则裁剪或两边留白
      const fillType = width > height ? 'width' : 'height';
      if (!this.props.currentViews) return (<div></div>);
      return (<div style={{display: 'inline-block', marginLeft: 30, verticalAlign: 'top'}}>
        <div style={{'marginBottom': 10}}>
          <p>您上传的图片将会展示如下</p>
          <p>请确保图片的重要内容居中完整显示，且不可有水印。</p>
        </div>
        {
          this.props.currentViews.map((item, index) => (
            <div key={index}>
              <div style={{'marginBottom': 5, 'color': '#999'}}>{item.desc}</div>
              <Preview
                url={url}
                fillType={fillType}
                style={{width: item.width, height: item.height, background: '#fff', marginBottom: 20, border: '1px solid #ccc'}}
                crop={positionInfo}
              />
            </div>
          ))
        }
      </div>);
    };

    const props = {
      action: '/goods/itempromo/uploadPicture.json' + (hDOM ? `?op_merchant_id=${hDOM.value}` : ''),
      name: 'Filedata',
      fileExt: ['image/bmp', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
      currentViewsDesc: () => {
        return (<div>
          <p>您上传的图片将会展示如下，</p>
          <p>请确保图片的重要内容居中完整显示，且不可有水印。</p>
        </div>);
      },
      getPicInfo: getPicInfo,
      ...this.props,
      uid: `${++fileUid}`,
      onUpload: this.onUpload, // 图片上传后的处理函数
      onCropPic: this.onCropPic,
      over: true, // 是否裁剪图片留白区域，如果为true则可裁剪图片以外的部分，以外的部分为负值
      style: this.props.style, // 图片所在容器的长宽,默认是500*500
    };
    return (<div>
      <ImgUploadCrop {...props} />
    </div>);
  },
});

export default UploadCropPic;
