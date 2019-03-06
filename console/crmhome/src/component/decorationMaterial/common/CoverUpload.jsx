import React, {PropTypes} from 'react';
import {Icon} from 'antd';
import PhotoPickerModal from './PhotoPickerModel';
import PicViewer from './PicViewer';
import {getMerchantId} from '../../../common/utils';

const CoverUpload = React.createClass({
  propTypes: {
    title: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      selected: this.props.value || {},
      showPicModal: false,
      showViewModal: false,
    };
  },
  onRemove() {
    this.setState({selected: {}});
    this.props.onChange(null);
  },
  showPicModal() {
    this.setState({
      showPicModal: true,
    });
  },
  closePicModal() {
    this.setState({
      showPicModal: false,
    });
  },
  showViewModal() {
    this.setState({
      showViewModal: true,
    });
  },
  hideViewModal() {
    this.setState({
      showViewModal: false,
    });
  },
  addFiles(fileList) {
    const selected = {
      picUrl: fileList[0].url,
      fileId: fileList[0].sourceId,
    };
    this.setState({
      selected,
      showPicModal: false,
    });
    this.props.onChange(selected);
  },
  render() {
    const {title} = this.props;
    const {selected, showPicModal, showViewModal} = this.state;
    return (<div>
      {selected.picUrl ? <div className="ant-upload-list ant-upload-list-picture-card">
        <div className="ant-upload-list-item ant-upload-list-item-done">
          <div className="ant-upload-list-item-info">
            <div className="kb-photo-picker-list-item">
              <img src={selected.picUrl} />
            </div>
            <span>
              <i className="anticon anticon-eye-o" onClick={this.showViewModal}></i>
              <i className="anticon anticon-delete" onClick={this.onRemove}></i>
            </span>
          </div>
        </div>
      </div> : null}
      <div className="ant-upload ant-upload-select ant-upload-select-picture-card" onClick={this.showPicModal}>
        <Icon type="plus" />
        <div className="ant-upload-text">上传{title.replace('详情页', '')}</div>
      </div>
      {showPicModal ? <PhotoPickerModal
        listParams={{op_merchant_id: this.merchantId, materialType: 'img'}}
        uploadParams={{op_merchant_id: this.merchantId}}
        visible
        modalTitle={'添加' + title}
        noticeInfo="不可有水印，不超过2.9M，格式：bmp、png、jpeg、jpg、gif。建议尺寸在2000px＊1500px以上"
        listUrl="/material/materialComponent.json"
        uploadUrl = "/material/picUpload.json"
        selectedFileList={selected.fileId ? [selected.fileId] : []}
        onOk={this.addFiles}
        onCancel={this.closePicModal}/> : null}
      {showViewModal ? <PicViewer url={'/material/view.htm?fileId=' + selected.fileId + '&zoom=original'} onClose={this.hideViewModal} /> : null}
    </div>);
  },
});

export default CoverUpload;
