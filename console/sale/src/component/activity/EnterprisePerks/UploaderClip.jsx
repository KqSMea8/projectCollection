import React, { PropTypes, Component } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import ClipModal from './ClipModal';
import ajax from 'Utility/ajax';

class UploaderClip extends Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    aspectRatio: PropTypes.any,   // [0] width; [1] height;  || 'auto' 不裁剪
    uploadText: PropTypes.string,
  };

  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      isClipViewShow: false,
      previewImgUrl: null,
      clipImgUrl: null,
      isUploading: false,
    };
  }

  onPreview = (file) => {
    this.setState({
      previewImgUrl: file.url,
      previewVisible: true,
    });
  };

  onUploaderChange = ({ file }) => {
    // console.log('change', file);
    if (file.status === 'done' && file.response) {
      if (file.response.status === 'succeed') {
        this.fileType = file.response.fileType;

        if (Array.isArray(this.props.aspectRatio)) {
          this.clipImg(file.response.result);
        } else {
          window.setTimeout(() => {
            this.props.onChange(file.response.fileId);
          });
        }
      } else {
        message.error(file.response.status === 'deny' ? '登录超时，请重新登录并重试' : '图片上传失败，请重试');
        if (file.response.status === 'deny') {
          location.href = location.href;
        }
      }
    } else if (file.status === 'removed') {
      // console.log('remove');
      this.props.onChange('');
      this.setState({
        clipImgUrl: null,
      });
    }
  };

  getClipPosition = (pos) => {
    const { X, Y, height, width, orgHeight, orgWidth, url } = pos;
    ajax({
      url: window.APP.crmhomeUrl + `/goods/koubei/itempromo/cutPicture.json?op_merchant_id=${this.props.merchantId}`,
      method: 'post',
      type: 'json',
      data: {
        xx: X,
        yy: Y,
        x2: X + width,
        y2: Y + height,
        width,
        height,
        orgWidth,
        orgHeight,
        avatarImage: url,
        fileType: this.fileType,
      },
    }).then((res) => {
      if (res.status === 'succeed') {
        this.props.onChange(res.fileId);
        this.setState({
          isClipViewShow: false,
        });
      } else {
        message.error(res.errorMsg || '图片截取失败');
      }
    }, (res) => {
      message.error(res.errorMsg || '图片截取失败');
    });
  };

  beforeUpload = (file) => {
    const isTooLarge = file.size > 2 * 1024 * 1024;
    const arr = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
    const isImg = arr.indexOf(file.type) !== -1;

    if (isTooLarge) {
      message.error('图片不能超过2M');
    }

    if (!isImg) {
      message.error('请上传 bmp, png, jpg, gif 格式的文件');
    }

    return !isTooLarge && isImg;
  };

  closePreviewModal = () => {
    this.setState({
      previewVisible: false,
    });
  };

  clipImg = (url) => {
    this.setState({
      isClipViewShow: true,
      clipImgUrl: url,
    });
  };

  fileType = null;

  get fileList() {
    const { value } = this.props;
    return this.props.value ? [{
      uid: value,
      status: 'done',
      url: `http://dl.django.t.taobao.com/rest/1.0/image?fileIds=${value}`,
      thumbUrl: `http://dl.django.t.taobao.com/rest/1.0/image?fileIds=${value}`,
    }] : [];
  }

  render() {
    // console.log('props', this.props);

    const { isClipViewShow } = this.state;
    const { uploadText = '点击上传', aspectRatio, disabled, merchantId } = this.props;
    const sizeLimitText = aspectRatio ? `${aspectRatio[0]}px*${aspectRatio[1]}px` : '不限尺寸';

    // kb请求crmhome的图片上传接口，需要在url中包含koubei，这样才能通过鉴权。。
    const uploadProps = {
      name: 'Filedata',
      action: window.APP.crmhomeUrl + `/goods/koubei/itempromo/uploadPicture.json?op_merchant_id=${merchantId}`,
      listType: 'picture-card',
      data: {
        op_merchant_id: merchantId,
      },
      beforeUpload: this.beforeUpload,
      onPreview: this.onPreview,
      fileList: this.fileList,
      onChange: this.onUploaderChange,
      // onRemove: this.onRemove,  // antd 0.12没有这个api
      accept: 'image/jpeg, image/bmp, image/png, image/gif',
      disabled: disabled,
      withCredentials: true,
    };

    // console.log('this.props.value', this.props.value);

    return (<div style={{float: 'left'}}>
      {
        !uploadProps.disabled ?
          <Upload {...uploadProps}>
            {(!this.props.value) && [
              <Icon type="plus" key="icon"/>,
              <div key="txt" className="ant-upload-text">{uploadText}<br />({sizeLimitText})</div>,
            ]}
          </Upload>
          :
          <div>
            {
              uploadProps.fileList && uploadProps.fileList.map(img =>
                <a key={img.thumbUrl} href={img.thumbUrl} target="_blank" rel="noopener noreferrer" className="upload-viewer">
                  <img alt="" src={img.thumbUrl} />
                </a>
              )
            }
          </div>
      }
      {
        isClipViewShow && <ClipModal
            show={isClipViewShow}
            aspectRatio={aspectRatio}
            onOk={this.getClipPosition}
            onCancel={() => {
              this.setState({isClipViewShow: false});
            }}
            imgUrl={this.state.clipImgUrl}
        />
      }

      <Modal visible={this.state.previewVisible} footer={null} onCancel={this.closePreviewModal}>
        <img style={{ width: '100%' }} src={this.state.previewImgUrl} />
      </Modal>
    </div>);
  }
}

export default UploaderClip;
