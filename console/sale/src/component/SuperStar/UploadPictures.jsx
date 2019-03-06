import React, {PropTypes, Component} from 'react';
import {Form, message, Modal} from 'antd';
import ajax from '@alipay/kb-framework/framework/ajax';
const FormItem = Form.Item;
import { ImgUploadCrop } from 'hermes-react';
import classnames from 'classnames';

class ThrowCoverPic extends Component {
  static propTypes = {
    initData: PropTypes.object,
    form: PropTypes.object,
    throwCoverImgList: PropTypes.array,
    label: PropTypes.string,
    introduce: PropTypes.string,
    size: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      fileNameUrl: '',
      visible: false,
    };
  }

  onCropPic = (positionInfo) => {
    const {width, height, orgWidth, orgHeight} = positionInfo;
    const cutParams = {
      xx: positionInfo.X,
      yy: positionInfo.Y,
      width,
      height,
      orgWidth,
      orgHeight,
      avatarImage: positionInfo.url,
      fileType: ['png', 'jpg'],
    };
    return new Promise((resolve, reject) => {
      ajax({
        url: '/content/cutPic.json',
        method: 'post',
        type: 'json',
        data: cutParams,
        success: (res) => {
          if (res.fileId) {
            resolve({
              id: res.fileId,
              url: res.accessUrl,
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
  }

  onUpload = (result) => {
    if (result && result.status === 'failed') {
      message.warning(result.errorMessage || '网络繁忙，请稍后重试');
      return null;
    }
    // return result.fileNameUrl;
  }

  onPreview = (file) => {
    const {throwCoverImgList} = this.props.throwCoverPicProps;
    if (file && file.response) {
      this.setState({
        fileNameUrl: file.response.url,
        visible: true,
      });
    } else {
      this.setState({
        fileNameUrl: throwCoverImgList[0].url,
        visible: true,
      });
    }
  }

  handleCancel = () => {
    this.setState({visible: false});
  }

  render() {
    const {throwCoverImgList, label, introduce, size, FileId} = this.props.throwCoverPicProps;
    const {getFieldProps, getFieldError} = this.props.form;
    const {fileNameUrl} = this.state;
    const layout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16, offset: 1},
    };
    const throwCoverProps = Object.assign({
      name: 'file',
      data: {type: 'ACTIVITY'},
      onUpload: this.onUpload,
      onPreview: this.onPreview,
    }, this.props.throwCoverPicProps.throwCoverProps);
    return (
      <div>
        <FormItem
          {...layout}
          label={label}
          help={getFieldError(FileId)}
          required={this.props.required === 'bannerUrl' ? false : true}
          validateStatus={
            classnames({
              error: !!(getFieldError(FileId)),
            })
          }
        >
          <div className="imgContainer" onClick={this.handClick}>
            <ImgUploadCrop
              className="_modal"
              {...getFieldProps(FileId, {
                rules: [
                  this.props.required === 'bannerUrl' ? {required: false} : {required: true, message: `请上传${label}`}
                ],
                initialValue: throwCoverImgList && throwCoverImgList.length && [{
                  url: throwCoverImgList ? throwCoverImgList[0].url : '',
                  uid: -1,
                  status: 'done',
                }] || [],
              })}
              {...throwCoverProps}
              style={{width: 390, height: 400}}
              init={{X: 0, Y: 0, width: 540, height: 540}}/>
          </div>
          <p className="exampleCover-explain">{introduce}<br/>  建议尺寸<span style={{color: 'red'}}>{`${size[0]}*${size[1]}`}</span>。</p>
          <Modal
            footer={null}
            width="390"
            visible={this.state.visible}
            onCancel={this.handleCancel}
          >
            <img src={fileNameUrl} style={{height: 'auto', width: '100%'}} alt=""/>
          </Modal>
        </FormItem>
      </div>
    );
  }
}

export default ThrowCoverPic;
