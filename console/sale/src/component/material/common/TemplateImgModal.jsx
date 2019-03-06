import { Modal, Button, Icon} from 'antd';
import React, {PropTypes} from 'react';

const ButtonGroup = Button.Group;
const TemplateImgModal = React.createClass({
  propTypes: {
    picsArr: PropTypes.any,
    filesArr: PropTypes.any,
  },
  getInitialState() {
    // 把封装在picsArr数组里的url解析出来picsUrlArr,供使用
    const picsUrlArr = [];
    if (this.props.picsArr) {
      for (let i = 0; i < this.props.picsArr.length; i++) {
        picsUrlArr[i] = this.props.picsArr[i].url;
      }
    }
    return {
      picsUrlArr,
      imgIndex: 0,
    };
  },
  onClickImgModal(visible, index) {
    this.setState({
      visible,
      imgIndex: index,
    });
  },
  onCancel() {
    this.setState({
      visible: false,
    });
  },
  onClickToPlay(e) {
    const {picsUrlArr, imgIndex} = this.state;
    let index = imgIndex;
    if (e === 'left') {
      index = imgIndex - 1;
      if (index < 0 ) {
        index = Number(picsUrlArr.length - 1);
      }
    } else if (e === 'right') {
      index = imgIndex + 1;
      if ( index > picsUrlArr.length - 1) {
        index = 0;
      }
    }
    this.setState({
      imgIndex: index,
    });
  },
  render() {
    const {picsUrlArr, imgIndex} = this.state;
    const styleObj = {
      float: 'left',
      overflow: 'hidden',
    };
    return (
      <div>
        {this.props.picsArr.length > 0 && this.props.picsArr.map((key, index) => {
          return [<a style={styleObj} onClick={this.onClickImgModal.bind(this, 'true', index)}>
            <span className="tempInfo-imglist">
              <span className="temp-picList-box">
                <img src={key.url} />
                <span className="temp-file-title">查看示例</span>
               </span>
               <p className="temp-img-name">{key.name}</p>
            </span>
          </a>];
        })}
        {this.props.filesArr.length > 0 && this.props.filesArr.map((key) => {
          return [
            <a target="_blank" style={styleObj} href={key.url}>
              <span className="tempInfo-imglist">
                <span className="temp-picList-box">
                  <sapn className="showpicSrc"></sapn>
                  <span className="temp-file-title">下载</span>
                 </span>
                 <p className="temp-img-name">{key.name}</p>
              </span>
            </a>];
        })}

        {this.state.visible ? <Modal title="物料设计图" visible onCancel={this.onCancel}
          footer={false} width={1000}>
          <div style={{width: '100%', height: '600px', textAlign: 'center', overflow: 'hidden'}}>
            <a href={picsUrlArr[imgIndex]} target="_blank" ><img ref="imgBox" src={picsUrlArr[imgIndex]} /></a>
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
      </div>
    );
  },
});

export default TemplateImgModal;
