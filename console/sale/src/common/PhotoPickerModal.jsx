import React, {PropTypes} from 'react';
import {Modal, Upload, Button, Icon, message} from 'antd';
import ajax from 'Utility/ajax';

function getCookie(key) {
  const m = new RegExp('\\b' + key + '\\=([^;]+)').exec(document.cookie);
  return m ? m[1] : '';
}

/* 由于图片中心获取的地址为了方式爬虫，所以需要去除特殊字符
 * url {Object String} url字符串
 * rest {object Boole} 是否还原图片：original，170x180
 */
export function formatUrl(url, size = '170x180') {
  const str = url.replace(/&amp;/g, '&');
  const replace = str.substr(str.indexOf('zoom'));
  return str.replace(replace, 'zoom=' + size);
}

/* 去除文件名的后缀
 * name {Object String} name字符串
 */
export function formatName(file) {
  const array = file.split('.');
  const suffix = array.pop();
  const name = array.join('.');
  const data = {
    name,
    suffix,
  };
  return data;
}

const PhotoPickerModal = React.createClass({
  propTypes: {
    pid: PropTypes.string,
    modalTitle: PropTypes.string,
    multiple: PropTypes.bool,
    min: PropTypes.number,
    selectedFileList: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  },

  getDefaultProps() {
    return {
      multiple: false,
      min: 1,
      selectedFileList: [],
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
      return selectedMap[row.sourceId];
    });
    this.props.onOk(selectedFileList);
  },

  handleChange(info) {
    const fileList = info.fileList.filter((file) => {
      if (file.response) {
        if (!file.response.success) {
          message.error('上传失败', 1);
        } else {
          message.success('上传成功', 1);
          const newData = file.response.imgModel.materialList;
          this.setState({
            data: newData.concat(this.state.data),
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

  selectPhoto(sourceId) {
    const {multiple} = this.props;
    let {selectedMap} = this.state;
    if (multiple) {
      if (selectedMap[sourceId]) {
        delete selectedMap[sourceId];
      } else {
        selectedMap[sourceId] = true;
      }
    } else {
      selectedMap = {};
      selectedMap[sourceId] = true;
    }
    this.setState({
      selectedMap,
    });
  },

  fetchData() {
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/showMaterial.json',
      data: {
        merchantPid: this.props.pid,
      },
      success: (data)=> {
        if (data.status === 'succeed') {
          const selectedMap = {};
          this.props.selectedFileList.forEach((row) => {
            selectedMap[row.sourceId] = true;
          });
          this.setState({
            data: data.materials,
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
        <div key={i} className="kb-photo-picker-list-item" onClick={this.selectPhoto.bind(this, row.sourceId)}>
          <img src={formatUrl(row.url, '90x90')}/>
          {selectedMap[row.sourceId] && (<div className="kb-photo-picker-list-item-icon">
              <Icon type="check-circle"/>
            </div>)}
        </div>);
    });
    const props = {
      action: window.APP.crmhomeUrl + '/shop/koubei/uploadMaterial.json',
      withCredentials: true,
      data: {
        merchantPid: this.props.pid,
        ctoken: getCookie('ctoken'),
      },
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
      showUploadList: false,
      multiple: true,
      fileList: this.state.fileList,
    };
    return (<Modal title={this.props.modalTitle} width={690} visible footer="" onCancel={this.props.onCancel}>
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
