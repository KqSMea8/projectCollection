import React, {PropTypes} from 'react';
import {Modal, Upload, Button, Icon, message, Spin, Popover, Alert} from 'antd';
import ajax from '../../../common/ajax';
import LazyImg from './LazyImg';

const PhotoPickerModal = React.createClass({
  propTypes: {
    modalTitle: PropTypes.string,
    noticeInfo: PropTypes.string,
    noticeModalTitle: PropTypes.string,
    noticeModalContent: PropTypes.any,
    multiple: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    selectedFileList: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    listUrl: PropTypes.string,
    listParams: PropTypes.object,
    transformListData: PropTypes.func,
    uploadUrl: PropTypes.string,
    uploadParams: PropTypes.object,
    transformUploadData: PropTypes.func,
    needUpdate: PropTypes.bool,
    limitText: PropTypes.string,
  },

  getDefaultProps() {
    return {
      modalTitle: '',
      multiple: false,
      needUpdate: true,
      min: 1,
      max: 9999,
      selectedFileList: [],
      listParams: {},
      uploadParams: {},
      noticeModalTitle: '',
      noticeModalContent: null,
      limitText: '',
    };
  },

  getInitialState() {
    return {
      failed: 0,
      data: [],
      noData: false,
      picLoading: true,
      fileList: [],
      selectedMap: {},
      loading: false,
      tmpList: [],
    };
  },

  componentWillMount() {
    this.fetchData();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && this.props.visible !== nextProps.visible) {
      this.setState({
        selectedMap: {},
      });
    }
  },

  onOk() {
    const {selectedMap, data} = this.state;
    const selectedFileList = data.filter((row) => {
      return selectedMap[row.id];
    });
    this.props.onOk(selectedFileList);
  },

  transformUploadData(data) {
    data.success = true;
    data.data = data.imgModel.materialList.map((row) => {
      row.originId = row.id;
      row.id = row.sourceId;
      return row;
    });
    return data;
  },

  transformListData(data) {
    data.success = true;
    data.data = data.materials.map((row) => {
      row.originId = row.id;
      row.id = row.sourceId;
      return row;
    });
    return data;
  },

  // to new Pic Position
  toNewPicView() {
    const picContainer = this.picContainer;
    if (picContainer) {
      picContainer.scrollTop = picContainer.scrollHeight;
    }
  },

  handleChange({ fileList }) {
    const {multiple} = this.props;
    const {tmpList} = this.state;
    const filterList = fileList.filter((file) => {
      const {response} = file;
      if (response) {
        if (response.stat === 'deny') {
          const isKbInput = document.getElementById('J_isFromKbServ');
          const isParentFrame = isKbInput && isKbInput.value === 'true' && window.parent;
          Modal.confirm({
            title: '登录超时，需要立刻跳转到登录页吗？',
            onOk() {
              if (isParentFrame) {
                window.parent.location.reload();
              } else {
                location.href = response.target;  // eslint-disable-line no-location-assign
              }
            },
          });
        }
        return true;
      }
      return false;
    });

    const current = fileList.length - 1;
    let isOK = true;
    if (fileList[current] && fileList[current].response) {
      const {response} = fileList[current];
      if (response.success === 'false' || !(response.imgModel && response.imgModel.materialList && response.imgModel.materialList.length)) {
        message.error('上传图片失败'); // 当最后一次为当前的返回报错时显示提示
        isOK = false;
      }
    }

    const {data, selectedMap = {}} = this.state;
    const result = filterList.filter(file => file.response && file.response.imgModel && !~tmpList.indexOf(file.uid)).map(file => {
      const fileData = this.transformUploadData(file.response).data[0];
      tmpList.push(file.uid);
      return fileData;
    });
    if (result.length) {
      if (multiple) {
        result.forEach(fileData => selectedMap[fileData.id] = true);
      } else {
        Object.keys(selectedMap).forEach(key => delete selectedMap[key]);
        selectedMap[result[0].id] = true;
      }
    }
    this.setState({
      tmpList,
      data: data.concat(result),
      fileList, // 避免错误图片重复报错
      loading: false,
      selectedMap,
    }, () => {
      if (isOK) {
        this.toNewPicView();
      }
    });
  },

  beforeUpload(file) {
    let errorFlag = true;
    if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) < 0) {
      // message.error(`${file.name}图片格式错误`);
      errorFlag = false;
    } else if (file.size > 3000000) {
      // 单个文件限制大小为20*1024*1024
      // message.error(`${file.name}图片已超过2.9M`);
      errorFlag = false;
    } else if (file.size < 204800 ) {
      // 单个文件限制大小为200*1024
      // message.error(`${file.name}图片小于200kb`);
      errorFlag = false;
    }

    if (!errorFlag) {
      // kbScrollToTop();
      this.setState({failed: ++this.state.failed});
    } else if (!this.state.loading) {
      this.setState({
        loading: true,
      });
    }
    return errorFlag;
  },

  selectPhoto(id) {
    const {multiple, max, limitText} = this.props;
    let {selectedMap} = this.state;
    if (multiple) {
      if (selectedMap[id]) {
        delete selectedMap[id];
      } else {
        if (Object.keys(selectedMap).length < max) selectedMap[id] = true;
        else message.info(limitText);
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
    const {listParams = {}} = this.props;
    ajax({
      url: this.props.listUrl,
      type: 'json',
      data: listParams,
      success: (result)=> {
        const newResult = this.transformListData(result);
        if (newResult.success) {
          const selectedMap = {};
          this.props.selectedFileList.forEach((row) => {
            selectedMap[row.id] = true;
          });
          this.setState({
            picLoading: false,
            data: newResult.data,
            noData: !newResult.data || !newResult.data.length,
            selectedMap,
          });
        }
      },
    });
  },

  render() {
    const {multiple, min, uploadUrl, uploadParams = {}, needUpdate, noticeInfo} = this.props;
    const {data, loading, selectedMap, noData, picLoading} = this.state;
    const selectedCount = Object.keys(selectedMap).length;

    const files = data.map((row, i) => {
      return (
        <div key={i} className="kb-photo-picker-list-item" onClick={this.selectPhoto.bind(this, row.id)}>
          <LazyImg offset={50} container={this.picContainer} src={row.thumbUrl ? row.thumbUrl : row.url} />
          {selectedMap[row.id] && (<div className="kb-photo-picker-list-item-icon">
              <Icon type="check-circle"/>
            </div>)}
        </div>);
    });
    const props = {
      action: uploadUrl,
      withCredentials: true,
      data: uploadParams,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
      showUploadList: false,
      multiple: false,
      defaultFileList: data,
      fileList: this.state.fileList,
    };

    const picInfo = (<ul>
      <li>1、图片大小不低于200kb，不超过2.9M。格式为bmp、png、jpeg、jpg、gif；</li>
      <li>2、不得出现违反法律法规、社会公序良俗的信息，如涉黄、赌、毒等图片；</li>
      <li>3、上传的图片是真实拍摄，且清晰完整、无水印；</li>
    </ul>);

    return (<div>
      <Modal title={this.props.modalTitle} {...this.props} width={708} zIndex={1000} footer="" onCancel={this.props.onCancel}>
        {needUpdate ? <div className="kb-photo-picker-header" style={{lineHeight: '32px'}}>
          {this.state.failed ? <Alert message={`${this.state.failed}张图片上传失败，图片大小不低于200kb,不超过2.9M,格式为bmp、png、jpeg、jpg、gif；`} type="error" showIcon /> : null}
          <div className="kb-photo-picker-upload">
              <Upload {...props}>
                <Popover placement="topRight" content={picInfo}>
                   <Button size="large" type="ghost" loading={loading} onClick={() => { this.setState({failed: 0}); }}>上传新图片</Button>
                </Popover>
              </Upload>
          </div>
          {!multiple ? <p><Icon type="info-circle" style={{color: '#2db7f5', fontSize: '14px'}} /> 一次最多选择一张图片</p> : null}
        </div> : null}
        <div className="kb-photo-picker-list" ref={(dom) => { this.picContainer = dom; }}>
          {picLoading ? <div style={{textAlign: 'center', 'lineHeight': '280px'}}><Spin /></div> : <div>
            {noData ? <div style={{textAlign: 'center', 'lineHeight': '280px'}}>暂无图片</div> : files}
          </div>}
        </div>
        <div className="kb-photo-picker-footer">
          {noticeInfo ? <p className="notice-info">{noticeInfo}</p> : null}
          <Button size="large" type="primary" onClick={this.onOk}
            disabled={selectedCount === 0 || multiple && selectedCount < min}>
            确定({selectedCount})
          </Button>
        </div>
      </Modal>
    </div>);
  },
});

export default PhotoPickerModal;
