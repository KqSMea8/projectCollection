import React, { PropTypes, Component } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import ClipModal from './ClipModal';
import ajax from '../../../../common/ajax';

const merchantIdInput = document.getElementById('J_crmhome_merchantId');
const merchantId = merchantIdInput ? merchantIdInput.value : '';
class UploaderClip extends Component {
  static displayName = 'exchange-uploaderClip';
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    uploadUrl: PropTypes.string,    // 上传图片地址
    clipUrl: PropTypes.string,      // 截图接口地址
    aspectRatio: PropTypes.array,   // [0] width; [1] height;
  }

  static defaultProps = {
    uploadUrl: `/goods/itempromo/uploadPicture.json?op_merchant_id=${merchantId}`,
    clipUrl: `/goods/itempromo/cutPicture.json?op_merchant_id=${merchantId}`,
    aspectRatio: [231, 95],
  }

  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      isClipViewShow: false,
      previewImgUrl: null,
      clipImgUrl: null,
    };
  }

  onPreview = (file) => {
    this.setState({
      previewImgUrl: file.url,
      previewVisible: true,
    });
  }

  onUploaderChange = ({ file }) => {
    if (file.status === 'done' && file.response) {
      if (file.response.status === 'succeed') {
        this.fileType = file.response.fileType;
        this.clipImg(file.response.result);
      } else {
        message.error(file.response.status === 'deny' ? '登录超时，请重新登录并重试' : '图片上传失败，请重试');
        if (file.response.status === 'deny') {
          location.href = location.href;  // eslint-disable-line no-location-assign
        } else if (file.response.status === 'failed') {
          this.onRemove();
        }
      }
    }
  }

  onRemove = () => {
    this.props.onChange('');
  }

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
        this.props.onChange({url: res.result, id: res.fileId });
        this.setState({
          isClipViewShow: false,
        });
      } else {
        message.error(res.errorMsg || '图片截取失败');
      }
    }, (res) => {
      message.error(res.errorMsg || '图片截取失败');
    });
  }

  closePreviewModal = () => {
    this.setState({
      previewVisible: false,
    });
  }

  clipImg = (url) => {
    this.setState({
      isClipViewShow: true,
      clipImgUrl: url,
    });
  }

  fileType = null;

  get fileList() {
    const { value } = this.props;
    return this.props.value ? [{
      uid: value.id,
      status: 'done',
      url: value.url,
      thumbUrl: value.url,
    }] : [];
  }

  render() {
    const { isClipViewShow } = this.state;
    const uploadProps = {
      name: 'Filedata',
      action: this.props.uploadUrl,
      listType: 'picture-card',
      onPreview: this.onPreview,
      fileList: this.fileList,
      onChange: this.onUploaderChange,
      onRemove: this.onRemove,
      accept: ['bmp', 'png', 'jpeg', 'jpg', 'gif'].map(d => `image/${d}`).join(','),
    };

    return (<div>
      <Upload {...uploadProps}>
        {!this.props.value && [
          <Icon type="plus" key="icon" />,
          <div key="txt" className="ant-upload-text">点此上传</div>,
        ]}
      </Upload>
      <ClipModal
        show={isClipViewShow}
        aspectRatio={this.props.aspectRatio}
        onOk={this.getClipPosition}
        onCancel={() => {
          this.setState({isClipViewShow: false});
        }}
        imgUrl={this.state.clipImgUrl}
      />
      <Modal visible={this.state.previewVisible} footer={null} onCancel={this.closePreviewModal}>
        <img style={{ width: '100%' }} src={this.state.previewImgUrl} />
      </Modal>
    </div>);
  }
}

export default UploaderClip;
