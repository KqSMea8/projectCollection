import React, { PropTypes, Component } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import ClipModal from './ClipModal';
import ajax from '../../../common/ajax';

// 销售中台账户登录，需要获取merchantId，图片上传中增加op_merchant_id参数
const merchantIdInput = document.getElementById('J_crmhome_merchantId');
const merchantId = merchantIdInput ? merchantIdInput.value : '';

class UploaderClip extends Component {
  static displayName = 'exchange-uploaderClip';
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    uploadUrl: PropTypes.string,    // 上传图片地址
    clipUrl: PropTypes.string,      // 截图接口地址
    aspectRatio: PropTypes.any,   // [0] width; [1] height;  || 'auto' 不裁剪
    uploadText: PropTypes.string,
    resultUrl: PropTypes.func,
  };

  static defaultProps = {
    uploadUrl: `/goods/itempromo/uploadPicture.json`,
    clipUrl: `/goods/itempromo/cutPicture.json`,
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

  onUploaderChange = (info) => {
    const { file } = info;

    if (file.status === 'done' && file.response) {
      if (file.response.status === 'succeed') {
        this.fileType = file.response.fileType;

        if (Array.isArray(this.props.aspectRatio)) {
          this.clipImg(file.response.result);
        } else {
          window.setTimeout(() => {
            this.props.onChange(file.response.fileId);
            if (this.props.resultUrl) {
              this.props.resultUrl({});
            }
          });
        }
      } else {
        message.error(file.response.status === 'deny' ? '登录超时，请重新登录并重试' : '图片上传失败，请重试');
        if (file.response.status === 'deny') {
          location.reload();
        }
        this.props.resultUrl({});
        if (this.props.resultUrl) {
          this.props.resultUrl({});
        }
      }
    }
  };

  onRemove = () => {
    this.setState({
      clipImgUrl: null,
      previewImgUrl: null,
    });
    this.props.onChange('');
    if (this.props.resultUrl) {
      this.props.resultUrl({});
    }
  };

  getClipPosition = (pos) => {
    const { X, Y, height, width, orgHeight, orgWidth, url } = pos;
    ajax({
      url: this.props.clipUrl,
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
      thumbUrl: `http://dl.django.t.taobao.com/rest/1.0/image?fileIds=${value}&zoom=100x100`,
    }] : [];
  }

  render() {
    const { isClipViewShow } = this.state;
    const { uploadText = '点击上传', aspectRatio } = this.props;
    const sizeLimitText = aspectRatio ? `${aspectRatio[0]}px*${aspectRatio[1]}px` : '不限尺寸';

    const uploadProps = {
      name: 'Filedata',
      action: this.props.uploadUrl,
      listType: 'picture-card',
      data: {
        op_merchant_id: merchantId,
      },
      beforeUpload: this.beforeUpload,
      onPreview: this.onPreview,
      fileList: this.fileList,
      onChange: this.onUploaderChange,
      onRemove: this.onRemove,
      accept: 'image/jpeg, image/bmp, image/png, image/gif',
    };

    return (<div style={{float: 'left', height: 100}}>
      <Upload {...uploadProps}>
        {(!this.props.value) && [
          <Icon type="plus" key="icon" />,
          <div key="txt" className="ant-upload-text">{uploadText}<br />({sizeLimitText})</div>,
        ]}
      </Upload>
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
        <img style={{ width: '100%', paddingTop: 20 }} src={this.state.previewImgUrl} />
      </Modal>
    </div>);
  }
}

export default UploaderClip;
