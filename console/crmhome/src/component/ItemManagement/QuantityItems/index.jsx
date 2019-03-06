import React from 'react';
import { Upload, message, Button, Icon, Progress, Breadcrumb, Modal } from 'antd';
import ajax from '../../../common/ajax';
import './style.less';

const merchantIdInput = document.getElementById('J_crmhome_merchantId');
const merchantId = merchantIdInput ? merchantIdInput.value : '';

const query = (progressId, onChange) => {
  ajax({
    url: '/goods/ic/queryUploadProgress.json',
    data: { progressId },
    method: 'GET',
    type: 'json',
    success: response => {
      const { status, data } = response;
      if (status === 'succeed') {
        if (+data === 100) {
          onChange(100);
          message.success('添加成功', 3);
          setTimeout(() => onChange(-1), 500);
        } else {
          onChange(+data);
          setTimeout(() => query(progressId, onChange), 500);
        }
      }
    },
    error: response => {
      const {msg, errorList} = response;
      if (msg !== '') {
        message.error(msg, 3);
      } else if (errorList.length > 0) {
        Modal.error({
          title: '批量导入异常',
          content: (<div style={{height: 200, overflow: 'auto'}}>
            <ul>
              {
                errorList.map((item, key)=> {
                  return (<li key={key}>{item}</li>);
                })
              }
            </ul>
          </div>),
        });
      } else {
        message.error('系统异常', 3);
      }
      setTimeout(() => onChange(-1));
    },
  });
};

const FileUpload = ({ onChange }) => {
  const props = {
    name: 'fileData',
    action: '/goods/ic/upload.json',
    accept: 'application/zip,application/rar',
    data: {
      op_merchant_id: merchantId,
    },
    onChange(info) {
      const { status, response } = info.file;
      if (status === 'done') {
        if (response) {
          const { status: status1, msg, data } = response;
          if (status1 === 'succeed') {
            setTimeout(() => query(data, onChange), 1000);
          } else {
            message.error(msg, 3);
            onChange(-1);
          }
        }
      } else if (status === 'error') {
        message.error('文件上传失败', 3);
        onChange(-1);
      }
    },
    beforeUpload() {
      onChange(0);
    },
  };
  return (
    <label data-fileupload>
      <strong>商品文件</strong>
      <div>
        <Upload {...props}>
          <Button type="ghost">
            <Icon type="upload" /> 点击上传
          </Button>
        </Upload>
        <ol>
          <li>支持zip,rar格式的文件。</li>
          <li>请把Excel模版和对应的商品图片在同一文件夹下打包上传。</li>
          <li>注意事项请看Excel模版内容。</li>
        </ol>
        <a href="https://gw.alipayobjects.com/os/rmsportal/zYQKTuOUQhWnzEoRRFvS.xlsx">点击下载模板</a>
      </div>
    </label>
  );
};

const Progress2 = ({ progress }) => {
  return (
    <div data-progress>
      <Progress type="line" percent={progress} status="active" />
    </div>
  );
};

class ItemAdd extends React.Component {
  state = {
    progress: -1,
  };

  render() {
    const { progress } = this.state;
    return (
      <item-add>
        <div>
          <Icon type="circle-left" />
          <Breadcrumb>
            <Breadcrumb.Item>商品库</Breadcrumb.Item>
            <Breadcrumb.Item>批量添加商品</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div>
          <FileUpload onChange={value => this.setState({ progress: value })} />
          {progress >= 0 && <Progress2 progress={progress} />}
        </div>
      </item-add>
    );
  }
}

export default ItemAdd;
