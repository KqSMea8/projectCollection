import React, { Component, PropTypes } from 'react';
import { Modal } from 'antd';

class ImagePreview extends Component {
  static propTypes = {
    imgSrc: PropTypes.string,
    altText: PropTypes.string,
    imgTitle: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    previewStyle: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  state = {
    visible: false,
  }

  showModal(e) {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  }

  closeModal() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { imgSrc, altText, imgTitle, className, style, previewStyle } = this.props;
    const { visible } = this.state;
    return (
      <div>
        <a onClick={this.showModal}>
          <img
            src={imgSrc}
            alt={altText}
            className={className}
            style={style}
          />
        </a>
        <Modal
          visible={visible}
          title={imgTitle || altText || '图片预览'}
          footer={null}
          onCancel={this.closeModal}
        >
          <img src={imgSrc} alt={altText} style={{ ...previewStyle, maxWidth: 488 }} />
        </Modal>
      </div>
    );
  }
}

export default ImagePreview;
