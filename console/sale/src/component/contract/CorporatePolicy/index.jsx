/*
  协作政策
*/
/* eslint-disable */
import React from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';

const POLICY_CONTENTS = {
  iwzru41f: {
    url: 'https://render.alipay.com/p/f/fd-iz9hxz8a/pages/index.html',
    permissionCode: 'SALE_REBATE_FAN_POLICY',
  },
  iwvrnsel: {
    url: 'https://render.alipay.com/p/f/fd-iz9mn8jq/pages/index.html',
    permissionCode: 'SALE_REBATE_CAN_POLICY',
  },
};

export default class CorporatePolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iframeHeight: '100%'
    };
  }

  componentDidMount() {
    this.messageListenerHandler = evt => {
      const msg = evt.data;
      if (evt.source === this.refs._fm.contentWindow ||
        evt.origin && (evt.origin.indexOf('alipay.net') >= 0 || evt.origin.indexOf('alipay.com') >= 0)
      ) {
        try {
          const obj = JSON.parse(msg);
          if (obj.iframeHeight) {
            this.setState({
              iframeHeight: obj.iframeHeight
            });
          }
        } catch (e) { }
      }
    }

    window.addEventListener('message', this.messageListenerHandler);
  }

  componentWillUnmount() {
    window.removeEventListener(this.messageListenerHandler);
  }

  render() {
    const { routeParams } = this.props;
    /*
        if (!routeParams || !routeParams.id || !POLICY_CONTENTS[routeParams.id]
          || !permission(POLICY_CONTENTS[routeParams.id].permissionCode)) {
          return <ErrorPage type="permission" />;
        }
    */
    const src = 'http://fengdie-dev.alipay.net/p/cmsmng/fd-iz9kvwui/pages/index.html';
    // const src = POLICY_CONTENTS[routeParams.id].url;
    return (
      <iframe
        frameBorder="0"
        height={this.state.iframeHeight}
        scrolling="no"
        width="100%"
        ref="_fm"
        src={src}
      ></iframe>
    );
  }
};
