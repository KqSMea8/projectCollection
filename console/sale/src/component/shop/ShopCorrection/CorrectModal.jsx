import React, { PropTypes } from 'react';
import { Button, Modal, Upload, Icon, Alert, message } from 'antd';

const Dragger = Upload.Dragger;

const CorrectModal = React.createClass({
  propTypes: {
    correctType: PropTypes.string,
    correctLabel: PropTypes.string,
    correctApi: PropTypes.string,
    closeModalAndrefresh: PropTypes.func,
  },

  getInitialState() {
    return {
      uploadModalVisible: true,
      failModalVisible: false,
      successDescription: '',
      failureCause: '',
    };
  },

  showUploadModal() {
    this.setState({
      successModalVisible: false,
      failModalVisible: false,
      uploadModalVisible: true,
    });
  },

  showSuccessModal() {
    this.setState({
      successModalVisible: true,
      failModalVisible: false,
      uploadModalVisible: false,
    });
  },

  showFailModal() {
    this.setState({
      successModalVisible: false,
      failModalVisible: true,
      uploadModalVisible: false,
    });
  },

  render() {
    const {correctType, correctLabel, correctApi, closeCorrectModal, closeModalAndrefresh} = this.props;
    return (<div>
      <Modal
        title={correctLabel}
        visible={this.state.uploadModalVisible}
        onCancel={closeCorrectModal}
        footer={null}>
        <p>
          初次使用请先&nbsp;
          <a href={`/sale/dataCorrectionTemplateDownload.json?bizType=${correctType}`}>下载模板</a>
          &nbsp;，一次最多导入2000条记录。注意上传格式为xls。
        </p>
        <div style={{margin: '32px auto', width: '80%'}}>
          <Dragger
            name="filename"
            showUploadList={false}
            action={`/sale/${correctApi}?bizType=${correctType}`}
            beforeUpload={(file) => {
              const isExl = /\.xls$/.test(file.name);
              if (!isExl) {
                message.error('格式有误，重新上传');
              }
              return isExl;
            }}
            onChange={(info) => {
              if (info.file.status === 'uploading') {
                message.warn('正在解析格式，请勿关闭窗口...', 0);
              } else if (info.file.status === 'done' && info.file.response.status === 'succeed') {
                message.destroy();
                this.setState({
                  successDescription: '你提交的文档中数据较多，系统在后台中努力上传，你可在结果页中查看上传进度',
                });
                this.showSuccessModal();
              } else {
                message.destroy();
                this.setState({
                  failureCause: info.file.response && info.file.response.resultMsg
                                ? info.file.response.resultMsg
                                : '出现未知错误，请尝试重新上传',
                });
                this.showFailModal();
              }
            }}>
            <p className="ant-upload-drag-icon">
              <Icon type="cloud-upload-o" />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p className="ant-upload-hint">支持扩展名：xls</p>
          </Dragger>
        </div>
      </Modal>

      <Modal
        title="上传结束"
        visible={this.state.successModalVisible}
        onCancel={closeModalAndrefresh}
        footer={<div>
          <Button type="primary" onClick={closeModalAndrefresh}>查看进度</Button>
          <Button type="ghost" onClick={this.showUploadModal}>重新上传</Button>
        </div>}
        >
        <Alert message="格式正确"
          description={this.state.successDescription}
          type="success"
          showIcon
        />
      </Modal>

      <Modal
        title="上传结束"
        visible={this.state.failModalVisible}
        onCancel={closeModalAndrefresh}
        footer={<div>
          <Button type="primary" onClick={closeModalAndrefresh}>查看进度</Button>
        </div>}
        >
        <Alert
          message="上传失败"
          description={this.state.failureCause}
          type="error"
          showIcon
        />
      </Modal>
    </div>);
  },
});

export default CorrectModal;
