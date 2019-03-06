import React, { PropTypes } from 'react';
import { Icon, Modal, Button } from 'antd';
import { get, set } from 'lodash';
import { getImageById } from '../../../../common/utils';

export default class ImageUploader extends React.Component {
  static propTypes = {
    ratio: PropTypes.oneOf(['1:1', '4:3']).isRequired,
    form: PropTypes.object.isRequired,
    style: PropTypes.object,
    field: PropTypes.array.isRequired,
    onUpload: PropTypes.func.isRequired,
  }

  static defaultProps = {
    imageType: 'jpg',
  }

  state = {
    isPreviewShow: false,
  };

  onClick = () => {
    this.props.onUpload(this.props.ratio);
  }

  handlePreview = () => {
    this.setState({
      isPreviewShow: true,
    });
  }

  handleDelete = () => {
    if (!this.props.isDisabled) {
      const form = this.props.form;
      const field = this.props.field;
      const currentValue = form.getFieldValue(field[0]);
      const newValue = { ...set(currentValue, field.slice(1), undefined) };
      this.props.form.setFieldsValue({ [field[0]]: newValue });
    }
  }

  closeCropModal = () => {
    this.setState({
      isCropShow: false,
    });
  }

  closePreviewModal = () => {
    this.setState({
      isPreviewShow: false,
    });
  }

  render() {
    const { ratio, form, field } = this.props;
    const { isPreviewShow } = this.state;
    const fileId = get(form.getFieldsValue(), field);
    const imageUrl = fileId ? getImageById(fileId) : null;
    return (
      <span>
        {
          imageUrl ? (
            <div className="ant-upload-list ant-upload-list-picture-card">
              <div className="ant-upload-list-item ant-upload-list-item-done">
                <div className="ant-upload-list-item-info">
                  <a className="ant-upload-list-item-thumbnail">
                    <img src={imageUrl} />
                  </a>
                  <span>
                    <a onClick={this.handlePreview}>
                      <i className=" anticon anticon-eye-o" />
                    </a>
                    <i className=" anticon anticon-delete" onClick={this.handleDelete}></i>
                  </span>
                </div>
              </div>
            </div>
          ) : (
              <div className="ant-upload ant-upload-select ant-upload-select-picture-card" onClick={this.onClick}>
                <span className="rc-upload"><Icon type="plus" /></span>
                <div className="ant-upload-text">上传 {ratio} 图片</div>
              </div>
            )
        }
        <Modal
          visible={isPreviewShow}
          closable
          maskClosable
          width={432}
          footer={<Button type="ghost" onClick={this.closePreviewModal}>关闭</Button>}
          onCancel={this.closePreviewModal}
        >
          <div>
            <p style={{ fontSize: '16px' }}>{ratio}尺寸展示效果</p>
            <p style={{ marginBottom: '10px' }}>该图片将在<span style={{ color: '#f60' }}>{ratio === '4:3' ? '商品详情页、商品列表页' : '淘抢购、聚划算、大牌抢购'}</span>等渠道展示</p>
            <div
              style={{
                width: '400px',
                backgroundImage: `url(${imageUrl})`,
                backgroundColor: 'transparent',
                backgroundSize: 'contain',
                height: ratio === '1:1' ? '400px' : '300px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50% 50%',
                border: '1px solid #eee',
              }}
            />
          </div>
        </Modal>
      </span>
    );
  }
}
