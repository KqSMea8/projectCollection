import React, { Component } from 'react';

class IframeWrap extends Component {
  componentDidMount() {
    // const iframe = document.getElementById('iframe');
    // iframe.onload = () => {
    //   console.log(iframe.contentWindow || iframe.contentDocument.parentWindow);
    //   iframe.height = iframe.contentWindow.document.documentElement.scrollHeight;
    // };
    window.addEventListener('message', (e) => {
      // TODO
      console.log(e.data);
    });
  }
  render() {
    const pageUrl = window.APP.crmhomeUrl + '/main.htm.kb?op_merchant_id='
      + this.props.params.merchantPid + '#/marketing-activity/goods/detail/' + this.props.params.id
      + '/hidebtn';

    return (
      <div>
        <iframe style={{width: '100%', 'min-height': '600px'}} id="iframe" scrolling="no" seamless height="1273" src={pageUrl} frameBorder="0"></iframe>
      </div>
    );
  }
}

export default IframeWrap;
