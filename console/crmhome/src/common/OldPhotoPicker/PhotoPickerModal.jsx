import React, {PropTypes} from 'react';
import {Modal, Upload, Button, Icon, message} from 'antd';
import ajax from '../ajax';

const PhotoPickerModal = React.createClass({
  propTypes: {
    modalTitle: PropTypes.string,
    multiple: PropTypes.bool,
    min: PropTypes.number,
    selectedFileList: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    listUrl: PropTypes.string,
    listParams: PropTypes.object,
    transformListData: PropTypes.func,
    uploadUrl: PropTypes.string,
    uploadParams: PropTypes.object,
    transformUploadData: PropTypes.func,
  },

  getDefaultProps() {
    return {
      modalTitle: '',
      multiple: false,
      min: 1,
      selectedFileList: [],
      listParams: {},
      transformListData: () => {},
      uploadParams: {},
      transformUploadData: () => {},
    };
  },

  getInitialState() {
    return {
      data: [],
      fileList: [],
      selectedMap: {},
      loading: false,
    };
  },

  componentWillMount() {
    this.fetchData();
  },

  onOk() {
    const {selectedMap, data} = this.state;
    const selectedFileList = data.filter((row) => {
      return selectedMap[row.id];
    });
    this.props.onOk(selectedFileList);
  },

  handleChange(info) {
    const fileList = info.fileList.filter((file) => {
      if (file.response) {
        const result = this.props.transformUploadData(file.response);
        if (!result.success) {
          message.error('上传失败', 1);
        } else {
          message.success('上传成功', 1);
          this.setState({
            data: result.data.concat(this.state.data),
            loading: false,
          });
        }
        return false;
      }
      return true;
    });
    this.setState({
      fileList,
    });
  },

  beforeUpload(file) {
    if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) < 0) {
      message.error('图片格式错误');
      return false;
    }
    // 单个文件限制大小为10*1024*1024
    if (file.size > 10485760) {
      message.error('图片已超过10M');
      return false;
    }
    this.setState({
      loading: true,
    });
    return true;
  },

  selectPhoto(id) {
    const {multiple} = this.props;
    let {selectedMap} = this.state;
    if (multiple) {
      if (selectedMap[id]) {
        delete selectedMap[id];
      } else {
        selectedMap[id] = true;
      }
    } else {
      selectedMap = {};
      selectedMap[id] = true;
    }
    this.setState({
      selectedMap,
    });
  },

  fetchData() {
    ajax({
      url: this.props.listUrl,
      data: this.props.listParams,
      success: (result)=> {
        const newResult = this.props.transformListData(result);
        if (newResult.success) {
          const selectedMap = {};
          this.props.selectedFileList.forEach((row) => {
            selectedMap[row.id] = true;
          });
          this.setState({
            data: newResult.data,
            selectedMap,
          });
        }
      },
    });
  },

  render() {
    const {multiple, min} = this.props;
    const {data, loading, selectedMap} = this.state;
    const selectedCount = Object.keys(selectedMap).length;
    const files = data.map((row, i) => {
      return (
        <div key={i} className="kb-photo-picker-list-item" onClick={this.selectPhoto.bind(this, row.id)}>
          <img src={row.thumbUrl || row.url}/>
          {selectedMap[row.id] && (<div className="kb-photo-picker-list-item-icon">
              <Icon type="check-circle"/>
            </div>)}
        </div>);
    });
    const props = {
      action: this.props.uploadUrl,
      withCredentials: true,
      data: this.props.uploadParams,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
      showUploadList: false,
      multiple: true,
      fileList: this.state.fileList,
    };
    return (<Modal title={this.props.modalTitle} width={690} zIndex={1000} visible footer="" onCancel={this.props.onCancel}>
      <div className="kb-photo-picker-list">
        {files}
      </div>
      <div className="kb-photo-picker-footer">
        <div className="kb-photo-picker-upload">
          <Upload {...props}>
            <Button size="large" type="ghost" loading={loading}>上传新图片</Button>
          </Upload>
        </div>
        <Button size="large" type="primary" onClick={this.onOk}
          disabled={selectedCount === 0 || multiple && selectedCount < min}>
          确定({selectedCount})
        </Button>
      </div>
    </Modal>);
  },
});

export default PhotoPickerModal;
