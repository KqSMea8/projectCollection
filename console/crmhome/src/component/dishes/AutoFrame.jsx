import React, {PropTypes} from 'react';
import ReactDom from 'react-dom';
import ErrorPage from './ErrorPage';
import {keepSession} from '../../common/utils';

const AutoFrame = React.createClass({
  propTypes: {
    target: PropTypes.string,
  },

  getDefaultProps() {
    return {
      target: '',
    };
  },

  getInitialState() {
    return {
      target: '',
      frameHeight: 600,
      errorInfo: false,
    };
  },

  componentDidMount() {
    const isKbInput = document.getElementById('J_isFromKbServ');
    const isParentFrame = isKbInput && isKbInput.value === 'true' && window.parent;
    if (isParentFrame) {
      window.parent.addEventListener('scroll', this.handleScroll.bind(this, window.parent), false);
    } else {
      window.addEventListener('scroll', this.handleScroll.bind(this, window), false);
    }

    window.addEventListener('message', (e) => {
      if (e.data && typeof e.data === 'string') {
        const data = JSON.parse(e.data);
        const {pageHeight, scrollTop } = data;
        if (pageHeight) {
          this.setState({frameHeight: pageHeight});
        }
        if (!isNaN(Number(scrollTop))) {
          if (isParentFrame) {
            window.parent.scrollTo(0, scrollTop);
          } else {
            window.scrollTo(0, scrollTop);
          }
        }
      }
    }, false);

    keepSession();
  },

  componentWillUnmount() {
    const isKbInput = document.getElementById('J_isFromKbServ');
    if (isKbInput && isKbInput.value === 'true' && window.parent) {
      window.parent.removeEventListener('scroll', this.handleScroll.bind(this, window.parent), false);
    } else {
      window.removeEventListener('scroll', this.handleScroll.bind(this, window), false);
    }
  },

  onError(errorInfo) {
    this.setState({errorInfo});
  },

  handleScroll(win) {
    const frame = ReactDom.findDOMNode(this.refs.kbFrame);
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage(`{"scrollTop": ${win.pageYOffset || win.document.body.scrollTop}, "windowHeight": ${win.document.documentElement.clientHeight}}`, '*');
    }
  },

  render() {
    const {target} = this.props;
    const {frameHeight, errorInfo} = this.state;
    return (<div {...this.props}>
      {errorInfo ? <ErrorPage desc={errorInfo} /> : null}
      {target && !errorInfo ? <iframe className="kb-index-frame" src={target} ref="kbFrame" style={{height: frameHeight, width: '100%', border: '0' }} onError={this.onError} /> : null}
    </div>);
  },
});

export default AutoFrame;
