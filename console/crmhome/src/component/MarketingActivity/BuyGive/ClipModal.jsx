import React, { PropTypes, Component } from 'react';
import { ImgCropModal } from 'hermes-react';

class ClipModal extends Component {
  static displayName = 'exchange-uploadClip-clipModal';
  static propTypes = {
    show: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    imgUrl: PropTypes.string,
    aspectRatio: PropTypes.array, // [0] width; [1] height;
  }

  static defaultProps = {
    show: false,
  }

  render() {
    const { aspectRatio, onOk, onCancel, show, imgUrl } = this.props;
    if (!imgUrl) return null;
    const props = {
      url: imgUrl,
      onOk,
      onCancel,
      visible: !!show && !!imgUrl,
    };
    if (aspectRatio) {
      props.minW = aspectRatio[0];
      props.minH = aspectRatio[1];
    }

    return (
      <ImgCropModal
        {...props}
        url={this.props.imgUrl}
        onOk={this.props.onOk}
      />
    );
  }

}

export default ClipModal;
