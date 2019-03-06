import React, {PropTypes} from 'react';
import {Icon} from 'antd';
import PhotoPickerModal, {formatUrl, formatName} from './PhotoPickerModal';

export {formatUrl, formatName};

const PhotoPicker = React.createClass({
  propTypes: {
    defaultFileList: PropTypes.array,
    modalTitle: PropTypes.string,
    exampleList: PropTypes.array,
    onChange: PropTypes.func,
  },

  getDefaultProps() {
    return {
      defaultFileList: [],
      exampleList: [],
    };
  },

  getInitialState() {
    return {
      showModal: false,
      fileList: this.props.defaultFileList,
    };
  },

  onClick() {
    this.setState({
      showModal: true,
    });
  },

  addFiles(fileList) {
    this.setState({
      fileList,
    });
    this.props.onChange(fileList.map((row) => {
      return row.sourceId;
    }));
    this.closeModal();
  },

  removeFile(sourceId) {
    const fileList = this.state.fileList.filter((row) => {
      return row.sourceId !== sourceId;
    });
    this.setState({
      fileList,
    });
    this.props.onChange(fileList.map((row) => {
      return row.sourceId;
    }));
  },

  closeModal() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    const examples = this.props.exampleList.map((row, i) => {
      return (<a key={i} href={row.url} target="_blank" className="upload-example">
        <img src={row.url}/>
        <span>{row.name}</span>
      </a>);
    });
    const files = this.state.fileList.map((row) => {
      return (<div key={row.sourceId} className="ant-upload-list ant-upload-list-picture-card">
        <div className="ant-upload-list-item ant-upload-list-item-done">
          <div className="ant-upload-list-item-info">
            <a className="ant-upload-list-item-thumbnail" href={formatUrl(row.url, '700x700')} target="_blank">
              <img src={formatUrl(row.url, '78x78')} alt="xxx.png"/>
            </a>
            {row.name && <span className="ant-upload-list-item-name">{formatName(row.name).name}</span>}
            <span>
              <a href={formatUrl(row.url, '700x700')} target="_blank">
                <i className=" anticon anticon-eye-o"></i>
              </a>
              <i className=" anticon anticon-delete" onClick={this.removeFile.bind(this, row.sourceId)}></i>
            </span>
          </div>
        </div>
      </div>);
    });
    return (<div>
      {files}
      <div className="ant-upload ant-upload-select ant-upload-select-picture-card" onClick={this.onClick}>
        <Icon type="plus" />
        <div className="ant-upload-text">选择照片</div>
      </div>
      {examples}
      {this.state.showModal ? (<PhotoPickerModal {...this.props}
        selectedFileList={this.state.fileList}
        onOk={this.addFiles}
        onCancel={this.closeModal}/>) : null}
    </div>);
  },
});

export default PhotoPicker;
