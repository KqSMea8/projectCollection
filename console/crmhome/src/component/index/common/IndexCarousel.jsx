import React from 'react';
import {Carousel} from 'antd';

const IndexCarousel = React.createClass({
  render() {
    const bannerInfo = window.__fd_banner_data && window.__fd_banner_data.banner;
    if (!bannerInfo) {
      return <div></div>;
    }

    const bannerPics = bannerInfo.filter(item => item.trigger).map((item, index) => {
      const {link, imgLink, text} = item;
      return <a href={link} key={index} target="_blank"><img alt={text} src={imgLink} /></a>;
    });

    return (<Carousel className="index-carousel" autoplay>
    {bannerPics}
  </Carousel>);
  },
});

export default IndexCarousel;
