import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon, Modal } from 'antd';

class MyUpload extends PureComponent {
  static propTypes = {
    exampleList: PropTypes.array,
    fileList: PropTypes.array,
    initialValue: PropTypes.array,
    form: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
    };
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleCancel = () => this.setState({ previewVisible: false })
  render() {
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    return (
    <div>
      <Upload withCredentials
        action={`${window.APP.crmhomeUrl}/shop/koubei/imageUpload4Pc.json`}
        listType="picture-card" {...this.props}
        fileList={this.props.fileList}
        onPreview={this.handlePreview}>
       {this.props.fileList && this.props.fileList.length >= 5 ? null : uploadButton}
      </Upload>
      <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
      </Modal>
    </div>);
  }
}

export { MyUpload as Upload };
