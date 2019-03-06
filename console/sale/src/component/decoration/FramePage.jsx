import React, {PropTypes} from 'react';
import ReactDom from 'react-dom';

const AutoFrame = React.createClass({
  propTypes: {
    params: PropTypes.object,
    hideHead: PropTypes.bool,
  },

  getInitialState() {
    return {
      frameH: 998,
    };
  },

  componentDidMount() {
    this.loadFrame();
  },

  shouldComponentUpdate(nextProps, nextSate) {
    if (nextSate.frameH !== this.frameH) {
      this.frameH = nextSate.frameH;
      return true;
    }
    return false;
  },

  componentWillUnmount() {
    clearInterval(this.searchH);
    this.searchH = null;
  },

  initialFrameStyle(frameDoc) {
    if (!this.initial) {
      this.initial = true;
      frameDoc.body.style.maxWidth = '100%';
      const frameW = window.document.documentElement.offsetWidth;
      const frameContainer = frameDoc.querySelector('.tbf-context');
      if (frameContainer) {
        frameContainer.setAttribute('style', `width: ${frameW < 1100 ? 1100 : frameW}px;`);
      }
    }
  },

  loadFrame() {
    const frameW = ReactDom.findDOMNode(this.refs.decorateFrame);
    this.searchH = setInterval(() => {
      if (frameW.contentWindow && frameW.contentWindow.document) {
        this.setState({
          frameH: Math.max(frameW.contentWindow.document.documentElement.offsetHeight, frameW.contentWindow.document.body.offsetHeight),
        });
        this.initialFrameStyle(frameW.contentWindow.document);
      } else {
        this.componentWillUnmount();
        this.loadFrame();
      }
    }, 500);
  },

  render() {
    const {url = '', merchantId} = this.props.params;
    return (
      <div>
        <div style={{display: 'none'}} id="kbMerchantId">{merchantId}</div>
        <iframe src={decodeURIComponent(url)} ref="decorateFrame" width="100%" height={this.state.frameH} scrolling="no" border="0" frameBorder="0"></iframe>
      </div>
    );
  },
});

export default AutoFrame;
