import React, {PropTypes} from 'react';
import ReactDom from 'react-dom';
import {Modal, Icon, message} from 'antd';

const PicViewer = React.createClass({
  propTypes: {
    maxH: PropTypes.number,
    maxW: PropTypes.number,
    minH: PropTypes.number,
    minW: PropTypes.number,
    url: PropTypes.string,
    children: PropTypes.any,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      maxW: 750,
      maxH: 360,
      minH: 80,
      minW: 80,
    };
  },

  getInitialState() {
    return {
      visible: true,
      viewW: 50,
      viewH: 30,
      hoverClose: false,
      loaded: false,
      childrenLoaded: false,
      topData: 0,
    };
  },

  componentWillMount() {
    const img = this.img = new Image();
    const win = this.getWin(img);
    img.onload = this.loadImg;
    img.onerror = () => { message.error('图片加载失败，请重试'); this.img = null; this.props.onClose(); };
    img.src = this.props.url;

    if (win.addEventListener) {
      win.addEventListener('resize', this.loadImg, false);
    } else {
      win.attachEvent('onresize', this.loadImg);
    }
  },

  componentWillReceiveProps(nextPorps) {
    if (nextPorps.visible && this.props !== nextPorps.props && this.states) {
      this.resizeImg(...Object.values(this.states));
    }
  },

  componentWillUnmount() {
    const win = this.getWin(this.img);

    if (win.removeEventListener) {
      win.removeEventListener('resize', this.loadImg);
    } else {
      win.detachEvent('onresize', this.loadImg);
    }
    this.img = null;
  },

  onClose() {
    if (typeof this.props.visible === 'boolean') {
      this.props.onClose();
    } else {
      this.setState({
        visible: false,
      });
      setTimeout(() => {
        this.props.onClose();
      }, 400); // 动画结束后重置modal状态
    }
  },

  getWin(el) {
    if (!el) {
      return window;
    }
    const doc = el.ownerDocument;
    return doc.defaultView || doc.parentWindow;
  },

  loadImg() {
    const win = this.getWin(this.img);
    const {innerWidth, innerHeight} = win;
    const {width, height, naturalWidth, naturalHeight} = this.img;
    const {minW, minH, maxW, maxH} = this.props;

    const winW = innerWidth - 80 < maxW ? innerWidth - 80 : maxW;
    const winH = innerHeight - 80 < maxH ? innerHeight - 80 : maxH;
    const imgW = naturalWidth || width;
    const imgH = naturalHeight || height;
    const rate = imgH / imgW;
    const winRate = winH / winW;

    let viewH = imgH < minH ? minH : imgH;
    let viewW = imgW < minW ? minW : imgW;

    if (imgW > winW || imgH > winH) {
      if (rate === 1) {
        viewH = viewW = winW > winH ? winH : winW;
      } else if (imgH > winH && rate > winRate) {
        viewH = winH;
        viewW = winH / rate;
      } else {
        viewH = winW * rate;
        viewW = winW;
      }
    }

    const states = { viewH, viewW, topData: Math.floor((innerHeight - viewH) / 2), loaded: true };
    this.childrenDom = ReactDom.findDOMNode(this.refs.picContainer);
    this.states = states;
    if (!this.state.loaded || !this.props.children) {
      this.setState(states, () => {
        if (this.props.children) {
          this.resizeImg(...Object.values(states));
        }
      });
    } else {
      this.resizeImg(...Object.values(states));
    }
  },

  toggleMouse() {
    const {hoverClose} = this.state;
    this.setState({hoverClose: !hoverClose});
  },

  resizeImg(viewH, viewW, topV, loaded = true) {
    if (typeof this.props.visible === 'boolean' && !this.props.visible) {
      return;
    }
    if (this.props.children && this.childrenDom) {
      const {offsetHeight = 0} = this.childrenDom;
      const topData = topV > 16 ? topV : 16;
      const states = {viewH, viewW, topData, loaded, childrenLoaded: true};

      // 附加区域小于上边距，进行优化。否则会显示出滚动条，保证图片清晰
      if (offsetHeight / 2 < topData) {
        this.setState({...states, topData: topData - Math.ceil(offsetHeight / 2)});
      } else {
        this.setState(states);
      }
    }
  },

  render() {
    const {viewH, viewW, topData, loaded, hoverClose, visible} = this.state;
    const {url, children} = this.props;

    if (!loaded) {
      return <div></div>;
    }

    return (<Modal className="pic-viewer" width={viewW} visible={typeof this.props.visible === 'boolean' ? this.props.visible : visible} style={{top: topData}} footer="" title="">
      <div onClick={this.onClose} className="pic-viewer-close" onMouseEnter={this.toggleMouse} onMouseLeave={this.toggleMouse}>{!hoverClose ? <Icon type="cross" style={{fontSize: 14, vericalAlign: 'middle'}}/> : <Icon type="cross-circle" />}</div>
      <img width={viewW} height={viewH} src={url} />
      <div className="pic-container" ref="picContainer">
        {children}
      </div>
    </Modal>);
  },
});

export default PicViewer;
