import React, {PropTypes} from 'react';
import objectAssign from 'object-assign';
import {Icon} from 'antd';
// import PhotoPicker from '@alipay/hermes-photo-picker';
import { ImgPickerModal } from 'hermes-react';
import ajax from '../../../common/ajax';

function getCookie(key) {
  const m = new RegExp('\\b' + key + '\\=([^;]+)').exec(document.cookie);
  return m ? m[1] : '';
}

export function formatUrl(url, size = '170x180') {
  const str = url.replace(/&amp;/g, '&');
  const replace = str.substr(str.indexOf('zoom'));
  return str.replace(replace, 'zoom=' + size);
}

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

function transformListData(data) {
  if (data.materialVOList) {
    data.data = data.materialVOList.map((row) => {
      return {
        id: row.sourceId,
        thumbUrl: formatUrl(row.url, '90x90'),
        url: formatUrl(row.url, '700x700'),
      };
    });
  }
  return data;
}

function noop() {}

const ImagePicker = React.createClass({
  propTypes: {
    value: PropTypes.array,
    exampleList: PropTypes.array,
    onChange: PropTypes.func,
    max: PropTypes.number,
  },
  getDefaultProps() {
    return {
      exampleList: [],
      max: 1000,
      onChange: noop,
    };
  },
  getInitialState() {
    return {
      data: [],
      showModal: false,
      fileList: this.props.value || [],
      key: new Date().getTime(),
    };
  },
  componentDidMount() {
    // this.getData();
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      fileList: nextProps.value || [],
    });
  },
  onClick() {
    this.setState({
      showModal: true,
    });
  },
  getData(cb) {
    const listUrl = (window.APP.ownUrl || '') + '/material/pageMaterial.json';
    ajax({
      url: listUrl,
      success: (result)=> {
        const newResult = transformListData(result);
        if (newResult.success) {
          // this.setState({
          //   data: newResult.data,
          // });
          let allData = newResult.data;
          if (this.props.value && this.props.value.length) {
            allData = allData.concat(this.props.value);
          }
          const tmpMap = {};
          allData.forEach(item => {
            tmpMap[item.id] = item;
          });
          allData = [];
          Object.keys(tmpMap).forEach((i) => {
            allData.push(tmpMap[i]);
          });
          cb(allData);
        }
      },
    });
  },
  closeModal() {
    this.setState({
      showModal: false,
    });
  },
  addFiles(fileList) {
    this.setState({
      fileList,
    });
    if (this.props.onChange) {
      this.props.onChange(fileList);
    }
    this.closeModal();
  },
  removeFile(id) {
    const fileList = this.state.fileList.filter((row) => {
      return row.id !== id;
    });
    this.setState({
      fileList,
    });
    this.props.onChange(fileList);
  },
  render() {
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    const merchantId = merchantIdInput ? merchantIdInput.value : '';
    const selected = this.state.fileList.map((item) => {
      return item.id;
    });
    const self = this;
    const props = objectAssign({
      title: '选择图片',
      fetch(cb) {
        // cb(self.state.data);
        self.getData(cb);
      },
      // fetch: self.fetchData,
      // listUrl: (window.APP.ownUrl || '') + '/material/pageMaterial.json',
      // listParams: {
      //   op_merchant_id: merchantId,
      // },
      // transformListData(data) {
      //   if (data.materialVOList) {
      //     data.data = data.materialVOList.map((row) => {
      //       return {
      //         id: row.sourceId,
      //         thumbUrl: formatUrl(row.url, '90x90'),
      //         url: formatUrl(row.url, '700x700'),
      //       };
      //     });
      //   }
      //   return data;
      // },
      uploadUrl: (window.APP.ownUrl || '') + '/material/picUpload.json',
      uploadParams: {
        op_merchant_id: merchantId,
        ctoken: getCookie('ctoken'),
      },
      uploadChange(data) {
        let newData;
        if (data.imgModel && data.imgModel.materialList) {
          newData = data.imgModel.materialList.map((row) => {
            return {
              id: row.sourceId,
              thumbUrl: formatUrl(row.url, '90x90'),
              url: formatUrl(row.url, '700x700'),
            };
          });
        }
        return {
          success: true,
          data: newData.length && newData[0],
        };
      },
    }, this.props);
    const examples = this.props.exampleList.map((row, i) => {
      return (<a key={i} href={row.url} target="_blank" className="upload-example">
        <img src={row.thumbUrl || row.url}/>
        <span>{row.name}</span>
      </a>);
    });
    const files = this.state.fileList.map((row) => {
      return (<div key={this.state.key + row.id} className="ant-upload-list ant-upload-list-picture-card">
        <div className="ant-upload-list-item ant-upload-list-item-done">
          <div className="ant-upload-list-item-info">
            <a className="ant-upload-list-item-thumbnail" href={row.url} target="_blank">
              <img src={row.thumbUrl || row.url} alt={row.name}/>
            </a>
            {row.name && <span className="ant-upload-list-item-name">{row.name}</span>}
            <span>
              <a href={row.url} target="_blank">
                <i className=" anticon anticon-eye-o"></i>
              </a>
              <i className=" anticon anticon-delete" onClick={this.removeFile.bind(this, row.id)}></i>
            </span>
          </div>
        </div>
      </div>);
    });
    return (<div key={this.state.key}>
      {files}
      {this.state.fileList.length < this.props.max && <div className="ant-upload ant-upload-select ant-upload-select-picture-card" onClick={this.onClick}>
        <Icon type="plus" />
        <div className="ant-upload-text">选择照片</div>
      </div>}
      {examples}
      {this.state.showModal ? (<ImgPickerModal {...props}
        selected={selected}
        onOk={this.addFiles}
        style={window.top !== window ? { top: window.top.scrollY } : undefined}
        onCancel={this.closeModal}/>) : null}
    </div>);
  },
});

export default ImagePicker;
