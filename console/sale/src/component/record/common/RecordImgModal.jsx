import { Modal, Button, Icon} from 'antd';
import React, {PropTypes} from 'react';

const ButtonGroup = Button.Group;

const RecordImgModal = React.createClass({
  propTypes: {
    data: PropTypes.any,
    title: PropTypes.string,
    desc: PropTypes.string,
  },
  getInitialState() {
    return {
      imgSrc: [],
      imgIndex: 0,
    };
  },
  componentDidMount() {
    this.autoSize();
  },
  componentDidUpdate() {
    this.autoSize();
  },
  onClickImgModal(visible) {
    this.setState({
      visible,
      imgSrc: this.props.data,
    });
  },
  onCancel() {
    this.setState({
      visible: false,
    });
  },
  onClickToPlay(e) {
    const {imgSrc, imgIndex} = this.state;
    let index = imgIndex;
    if (e === 'left') {
      index = imgIndex - 1;
      if (index < 0 ) {
        index = Number(imgSrc.length - 1);
      }
    } else if (e === 'right') {
      index = imgIndex + 1;
      if ( index > imgSrc.length - 1) {
        index = 0;
      }
    }
    this.setState({
      imgIndex: index,
    });
  },
  autoSize() {
    const {imgSrc, imgIndex, visible} = this.state;
    if (imgSrc && visible) {
      const img = new Image();
      img.src = imgSrc[imgIndex] || '';
      img.onload = () => {
        if (img.width > 800) {
          this.imgBox.style.width = '100%';
        } else {
          this.imgBox.style.width = 'auto';
          this.imgBox.style.height = 'auto';
        }
        if (img.height > 600) {
          this.imgBox.style.height = '100%';
        }
      };
    }
  },
  render() {
    const {imgSrc, imgIndex, visible} = this.state;
    return (
      <span>
        <a onClick={this.onClickImgModal.bind(this, 'true')}>{this.props.desc ? this.props.desc : '查看'}</a>
        {visible ? <Modal title={this.props.title ? this.props.title : '拜访照片'} visible onCancel={this.onCancel}
          footer={false} width={1000}>
          <div style={{width: '100%', height: '600px', textAlign: 'center', overflow: 'hidden'}}>
            <a href={imgSrc[imgIndex]} target="_blank" ><img ref={dom => this.imgBox = dom} src={imgSrc[imgIndex]} /></a>
          </div>
          <div style={{textAlign: 'center', marginTop: 10}}>
            <ButtonGroup>
              <Button type="primary" onClick={this.onClickToPlay.bind(this, 'left')}>
                <Icon type="left" />上一张
              </Button>
              <Button type="primary" onClick={this.onClickToPlay.bind(this, 'right')}>
                下一张<Icon type="right" />
              </Button>
            </ButtonGroup>
          </div>
        </Modal> : null }
      </span>
    );
  },
});

export default RecordImgModal;
