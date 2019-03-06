import React, {PropTypes} from 'react';
import {Icon} from 'antd';
import PhotoPickerModal from './PhotoPickerModal';

const PhotoPicker = React.createClass({
  propTypes: {
    value: PropTypes.array,
    exampleList: PropTypes.array,
    onChange: PropTypes.func,
  },

  getDefaultProps() {
    return {
      exampleList: [],
    };
  },

  getInitialState() {
    return {
      showModal: false,
      fileList: this.props.value || [],
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
    this.props.onChange(fileList);
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

  closeModal() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    const examples = this.props.exampleList.map((row, i) => {
      return (<a key={i} href={row.url} target="_blank" className="upload-example">
        <img src={row.thumbUrl || row.url}/>
        <span>{row.name}</span>
      </a>);
    });
    const files = this.state.fileList.map((row) => {
      return (<div key={row.id} className="ant-upload-list ant-upload-list-picture-card">
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
