import React from 'react';


/**
 * 营销活动跳转至kb-brands
 */

const MainRedirect = React.createClass({

  getInitialState() {
    const hash = window.location.hash;
    window.location.href = window.APP.kbretailprod + '/main.htm' + hash;  // eslint-disable-line no-location-assign
  },
  render() {
    return null;
  },
});

export default MainRedirect;
