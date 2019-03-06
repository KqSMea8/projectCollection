// 配置门店
import React from 'react';
import { Form, Upload, Icon, Modal, message } from 'antd';
import { createBatchOrder } from '../common/api';
import './brandShopConfig.less';

const FormItem = Form.Item;
const Dragger = Upload.Dragger;
let uploadTimer = null;
let formParams = {
  fileName: '', // 文件名称
};
class BrandShopConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      scene: 'SHOP_GROUP_RELATION_BATCH_UPDATE',
      showSuccessModal: false,
      uploadModalVisible: this.props.visible,
      hrefUrl: '',
    };
  }

  componentWillUnmount() {
    formParams = {
      fileName: '', // 文件名称
    };
  }

  onBatchCreate = (fileName, ossFileKey) => {
    // 批处理创建
    const obj = {
      fileName,
      ossFileKey,
      attachments: '',
      extInfo: {
        groupId: this.props.record.groupId,
      },
      scene: this.state.scene,
    };
    createBatchOrder(obj)
      .then(res => {
        if (res.status === 'succeed') {
          this.showUploadSuccess();
        } else {
          message.error('提交失败');
          Modal.success({
            title: '提交失败',
            content: `失败原因：${res.resultMsg}`,
            okText: '知道了',
            onOk: () => {
              this.props.configShop(false);
            },
          });
        }
      })
      .catch(e => {
        this.setState({
          failureCause: e.message || '出现错误，请尝试重新上传',
        });
        Modal.error({
          title: '提交失败',
          content: `失败原因：${e.message}`,
          okText: '知道了',
          onOk: () => {
            this.props.configShop(false);
          },
        });
      });
  };

  onFileUploadChange = info => {
    // 文件上传中
    if (info.file.status === 'uploading') {
      if (!uploadTimer) {
        // 可能多次进入 uploading 状态，避免重复执行
        this.showUploadProgress();
      }
      // 文件上传完毕，后端处理文件中
    } else if (
      info.file.status === 'done' &&
      info.file.response.status === 'succeed'
    ) {
      clearInterval(uploadTimer);
      uploadTimer = null;
      this.onBatchCreate(
        info.file.response.data.fileName,
        info.file.response.data.ossFileKey
      );
      // 文件上传出错，或者上传完毕但预处理出错，同步返回错误结果
    } else {
      clearInterval(uploadTimer);
      uploadTimer = null;
      this.setState({
        failureCause:
          (info.file.response && info.file.response.resultMsg) ||
          '出现未知错误，请尝试重新上传',
      });
    }
  };

  // 跳转到进度页
  goToProgressList = () => {
    location.hash = `#/batchFileManager?scene=${encodeURIComponent(
      this.state.scene
    )}`;
    this.setState({
      successButton: false,
    });
  };

  showUploadProgress = () => {
    this.setState({
      uploadModalVisible: this.state.uploadModalVisible,
    });
  };

  showUploadModal = () => {
    this.setState({
      uploadModalVisible: true,
    });
  };

  showUploadSuccess = () => {
    this.setState({
      uploadModalVisible: false,
      showSuccessModal: true,
      successButton: true,
    });
    const modal = Modal.success({
      title: '提交成功，稍后生效',
      content: (
        <div>
          你提交的文档数据较多，正在努力上传中，请及时
          <a
            onClick={() => {
              this.goToProgressList();
              modal.destroy();
            }}
          >
            查看进度
          </a>
          ，如有上传失败，请下载结果，根据报错原因订正后重新上传
        </div>
      ),
      okText: '知道了',
      onOk: () => {
        this.props.configShop(false);
        if (this.props.getTableList !== undefined) {
          this.props.getTableList({
            operatorId: this.props.operatorId,
            pageNo: this.props.pageNo,
            pageSize: this.props.pageSize,
          });
        }
        if (this.props.getDetailData !== undefined) {
          this.props.getDetailData({
            groupId: this.props.record.groupId,
          });
        }
      },
    });
  };

  cancelUploadModal = () => {
    if (this.props.configShop) {
      this.props.configShop(false);
    }
  };

  goToBatchLogs = () => {
    location.hash = `#/batchFileManager?scene=${encodeURIComponent(
      this.state.scene
    )}`;
  };

  render() {
    const { record } = this.props;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 5 },
    };
    return (
      <div>
        <Modal
          className="brandShopConfig"
          title={this.props.modalTitle}
          visible={this.state.uploadModalVisible}
          onCancel={this.cancelUploadModal}
          footer={null}
        >
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="门店组名称">
              <p className="ant-form-text" id="userName" name="userName">
                {record.groupName}
              </p>
            </FormItem>

            <FormItem {...formItemLayout} label="适用门店" required>
              <p className="apply-stores-test">
                <a
                  className="down-load"
                  href={`${
                    window.APP.kbsalesUrl
                  }/batch/templateDownload.json?scene=SHOP_GROUP_RELATION_BATCH_UPDATE`}
                >
                  下载门店列表模板
                </a>
                最多上传1个文件，一次最多导入10000条记录
              </p>
              <Dragger
                name="shopBatchFile"
                showUploadList={false}
                multiple={false}
                action={`${window.APP.kbsalesUrl}/batch/batchFileUpload.json`}
                withCredentials
                beforeUpload={file => {
                  const isExl = /\.xls$/.test(file.name);
                  if (!isExl) {
                    message.error('格式有误，重新上传', 3);
                    Modal.error({
                      title: '上传失败',
                      content: '格式有误，重新上传',
                      okText: '知道了',
                    });
                  }
                  if (formParams.fileName) {
                    message.error('最多只能上传一个文件', 3);
                    Modal.error({
                      title: '上传失败',
                      content: '最多只能上传一个文件',
                      okText: '知道了',
                    });
                  }
                  return isExl && !formParams.fileName;
                }}
                onChange={this.onFileUploadChange}
                className="file-upload"
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                <p className="ant-upload-hint">支持扩展名：.xls</p>
              </Dragger>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default BrandShopConfig;
