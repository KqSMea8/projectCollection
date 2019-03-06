import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import {keepSession} from '../../../common/utils';
import {message} from 'antd';

const AutoFrame = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      frameHeight: 600,
      errorInfo: false,
      url: '',
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
    this.gainISVUrl();
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

  gainISVUrl() {
    const {id} = this.props.params;
    const {redirectUrl} = this.props.location.query;
    ajax({
      url: '/goods/getIsvLink.json',
      data: {redirectUrl, commodityId: id, newAuth: true},
      success: (res) => {
        if (res.result && res.result.redirectUrl) {
          this.setState({url: res.result.redirectUrl});
        } else {
          message.error('验证失败');
        }
      },
    });
  },

  handleScroll(win) {
    if (this.frame && this.frame.contentWindow) {
      this.frame.contentWindow.postMessage(`{"scrollTop": ${win.pageYOffset || win.document.body.scrollTop}, "windowHeight": ${win.document.documentElement.clientHeight}}`, '*');
    }
  },

  render() {
    const {frameHeight, url} = this.state;
    return (<div {...this.props}>
      {url ? <iframe className="kb-index-frame" ref={dom => this.frame = dom} src={url} style={{height: frameHeight}} onError={this.onError} /> : null}
    </div>);
  },
});

export default AutoFrame;
