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

const exampleUrl = 'https://gw.alipayobjects.com/zos/rmsportal/RLGGeTPTVTmGMFpfXrca.png';

const ADImgPicker = React.createClass({
  propTypes: {
    value: PropTypes.any,
    onChange: PropTypes.func,
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
      } else if (file.size > 5 * 1024 * 1024) {
        message.error('图片大小不超过5M');
        reject('图片大小不超过5M');
      } else {
        resolve();
      }
    });
  },
  render() {
    const { value } = this.props;
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
      <div style={{ lineHeight: 1.4 }}>
        要求：1242x470像素；限2MB以内；支持bmp、png、jpg、jpeg<br />
        重点：请传无水印、非透明底的图片
      </div>
      {this.state.showModal && <PhotoPickerModal
        modalTitle="添加广告"
        listUrl="/material/materialComponent.json"
        uploadUrl="/material/picUpload.json"
        listParams={{materialType: 'img'}}
        noticeInfo="要求：1242x470像素；限2MB以内；支持bmp、png、jpg、jpeg"
        multiple={false}
        visible
        selectedFileList={value ? [value] : []}
        onOk={this.chooseFile}
        onCancel={this.closeModal} />}
    </div>);
  },
});

export default ADImgPicker;
