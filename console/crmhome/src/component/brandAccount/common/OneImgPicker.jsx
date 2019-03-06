import React, {PropTypes} from 'react';
import {Icon, message} from 'antd';
import PhotoPickerModal from '../common/PhotoPickerModal';

import {formatName} from '../../../common/PhotoPicker';

export function formatUrl(url, size = '170x180') {
  const str = url.replace(/&amp;/g, '&');
  if (str.indexOf('zoom') === -1) return str;
  const replace = str.substr(str.indexOf('zoom'));
  return str.replace(replace, 'zoom=' + size);
}

const OneImgPicker = React.createClass({
  propTypes: {
    value: PropTypes.any,
    onChange: PropTypes.func,
    exampleUrl: PropTypes.string,
    uploadTip: PropTypes.any,
    modalTitle: PropTypes.string,
    modalUploadTip: PropTypes.any,
    fileSizeLimit: PropTypes.number,
  },

  defaultProps: {
    fileSizeLimit: 2 * 1024 * 1024, // 2M
  },

  getInitialState() {
    return { showModal: false };
  },

  onClick() {
    this.setState({ showModal: true });
  },

  chooseFile(files) {
    this.props.onChange(files[0]);
    this.closeModal();
  },

  removeFile() {
    this.props.onChange(null);
  },

  closeModal() {
    this.setState({ showModal: false });
  },

  beforeUpload(file) {
    return new Promise((resolve, reject) => {
      if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) < 0) {
        message.error(`${file.name}图片格式错误`);
        reject(`${file.name}图片格式错误`);
      } else if (file.size > this.props.fileSizeLimit) {
        const numM = this.props.fileSizeLimit / (1024 * 1024).toFixed(1);
        message.error(`图片大小不超过${numM}M`);
        reject(`图片大小不超过${numM}M`);
      } else {
        resolve();
      }
    });
  },
  render() {
    const { value, exampleUrl, uploadTip, modalTitle, modalUploadTip } = this.props;
    const fileDom = value && (<div className="ant-upload-list ant-upload-list-picture-card">
      <div className="ant-upload-list-item ant-upload-list-item-done">
        <div className="ant-upload-list-item-info">
          <a className="ant-upload-list-item-thumbnail" href={formatUrl(value.url, '700x700')} target="_blank">
            <img style={{ objectFit: 'contain' }} src={formatUrl(value.url, '200x200')} alt="image"/>
          </a>
          {value.name && <span className="ant-upload-list-item-name">{formatName(value.name).name}</span>}
          <span>
              <a href={formatUrl(value.url, '700x700')} target="_blank">
                <i className=" anticon anticon-eye-o"/>
              </a>
              <i className=" anticon anticon-delete" onClick={this.removeFile}/>
            </span>
        </div>
      </div>
    </div>);
    const upBtn = (<div className="ant-upload ant-upload-select ant-upload-select-picture-card" onClick={this.onClick}>
      <Icon type="plus" />
      <div className="ant-upload-text">上传图片</div>
    </div>);
    return (<div>
      {fileDom || upBtn}
      <a href={exampleUrl} target="_blank" className="upload-example">
        <img style={{ objectFit: 'contain' }} src={exampleUrl} />
        <span>查看示例</span>
      </a>
      {uploadTip && <div style={{ lineHeight: 1.4 }}>
        {uploadTip}
      </div>}
      {this.state.showModal && <PhotoPickerModal
        modalTitle={modalTitle}
        listUrl="/material/materialComponent.json"
        uploadUrl="/material/picUpload.json"
        listParams={{materialType: 'img'}}
        noticeInfo={modalUploadTip}
        beforeUpload={this.beforeUpload.bind(this)}
        multiple={false}
        visible
        selectedFileList={value ? [value] : []}
        onOk={this.chooseFile}
        onCancel={this.closeModal} />}
    </div>);
  },
});

export default OneImgPicker;
