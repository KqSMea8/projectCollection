import React, {PropTypes} from 'react';
import {Modal, message} from 'antd';
import { ImgPickerModal } from 'hermes-react';
import ajax from '../../../common/ajax';

const PhotoPickerModal = React.createClass({
  propTypes: {
    modalTitle: PropTypes.string, // => title
    noticeInfo: PropTypes.string, // noticeInfo => notice
    multiple: PropTypes.bool, // multiple => multiple
    min: PropTypes.number,// min => min
    max: PropTypes.number,// max => max
    selectedFileList: PropTypes.array,// selectedFileList => selected // TODO:
    onOk: PropTypes.func, // onOk => onOk
    onCancel: PropTypes.func, // onCancel => onCancel // hermes doc
    listUrl: PropTypes.string, // listUrl => this.fetchData => this.update
    listParams: PropTypes.object, // listUrl => this.fetchData => this.listParams
    transformListData: PropTypes.func, // listUrl => this.fetchData => this.transformListData
    uploadUrl: PropTypes.string, // uploadUrl => uploadUrl
    uploadParams: PropTypes.object, // uploadParams => uploadParams
    transformUploadData: PropTypes.func, // transformUploadData => uploadChange
    needUpdate: PropTypes.bool, // needUpdate => uploadUrl
    limitText: PropTypes.string, // limitText => limitInfo
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

  componentDidMount() {
    this.fetchData();
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

  handleChange(response) { // FIXME: 无网络或其他loading不消失，无提示
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
      return {success: false, silence: true};
    }
    if (response.success === 'false' || !(response.imgModel && response.imgModel.materialList && response.imgModel.materialList.length)) {
      message.error('上传图片失败'); // 当最后一次为当前的返回报错时显示提示
      return {success: false, silence: true};
    }

    return { // TODO: 选中参数及跳转效果
      data: this.transformUploadData(response).data[0],
      success: true,
      silence: true,
    };
  },

  beforeUpload(file) {
    let errorFlag = true;
    if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) < 0) {
      message.error(`${file.name}图片格式错误`);
      errorFlag = false;
    } else if (file.size > 3000000) {
      // 单个文件限制大小为20*1024*1024
      message.error(`${file.name}图片已超过2.9M`);
      errorFlag = false;
    } else if (file.size < 204800 ) {
      // 单个文件限制大小为200*1024
      message.error(`${file.name}图片小于200kb`);
      errorFlag = false;
    }
    return errorFlag;
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
          this.update(newResult.data);
        }
      },
    });
  },

  render() {
    const {selectedFileList, multiple, min, onOk, max, uploadUrl, onCancel, visible, uploadParams = {}, needUpdate, noticeInfo, modalTitle, limitText} = this.props;

    // TODO: 添加按钮提示效果
    // const picInfo = (<ul>
    //   <li>1、图片大小不低于200kb，不超过2.9M。格式为bmp、png、jpeg、jpg、gif；</li>
    //   <li>2、不得出现违反法律法规、社会公序良俗的信息，如涉黄、赌、毒等图片；</li>
    //   <li>3、上传的图片是真实拍摄，且清晰完整、无水印；</li>
    // </ul>);

    return (<ImgPickerModal
      selected={selectedFileList}
      max={max}
      min={min}
      uploadUrl={uploadUrl}
      title={modalTitle}
      limitInfo={limitText}
      notice={noticeInfo}
      multiple={multiple}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      fetch={(cb) => {
        this.update = cb;
      }}
      uploadUrl={needUpdate ? uploadUrl : ''}
      uploadParams={uploadParams}
      beforeUpload={this.beforeUpload}
      uploadChange={this.handleChange}
    />);
  },
});

export default PhotoPickerModal;
