import React from 'react';


/**
 * 口碑活动报名主页
 */

const MainRedirect = React.createClass({

  getInitialState() {
    const origin = window.location.origin;
    const search = window.location.search;
    window.location.href = `${origin}/goods/itempromo/promotion.htm${search}#/`;  // eslint-disable-line no-location-assign
  },
  render() {
    return null;
  },
});

export default MainRedirect;
