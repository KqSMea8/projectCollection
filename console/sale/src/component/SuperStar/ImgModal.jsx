import React, {PropTypes} from 'react';
import {Modal} from 'antd';

export default class ImgModal extends React.Component {
  static propTypes = {
    coverImg: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  onClick = () => {
    this.setState({visible: true});
  }

  onCancel = () => {
    this.setState({visible: false});
  }

  render() {
    const {coverImg} = this.props;
    const self = this;
    const img = new Image();
    if (this.state.visible === true) {
      img.src = coverImg && coverImg.fileUrl;
      img.onload = () => {
        if (img.width > 800) {
          self.refs.imgBox.style.width = '100%';
        } else {
          self.refs.imgBox.style.width = 'auto';
        }
      };
    }
    return (<div>
      {coverImg && coverImg.fileUrl ? <a onClick={this.onClick} ><img src={coverImg.fileUrl} width={50} height={50}/></a> : <i className="anticon anticon-picture" onClick={this.onClick} style={{fontSize: 30, color: '#2db7f5'}}></i>}
      {this.state.visible === true ? <Modal title={''} width={800} visible={this.state.visible} footer="" onCancel={this.onCancel}>
          <div style={{marginTop: 20, textAlign: 'center', width: '100%'}}>
            <a href={coverImg && coverImg.fileUrl} target="_blank">
              <img ref="imgBox" src={coverImg && coverImg.fileUrl} />
            </a>
          </div>
        </Modal> : null}
    </div>);
  }
}

