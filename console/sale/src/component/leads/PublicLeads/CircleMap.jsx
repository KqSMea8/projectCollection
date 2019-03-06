import React, {PropTypes} from 'react';
import debounce from 'lodash.debounce';
import {message} from 'antd';
import ajax from 'Utility/ajax';

const AMap = window.AMap;

const INITIAL_MAP_SCALE = 16;

function isEq(n1, n2) {
  return (n1 + '') === (n2 + '');
}

function search(cityCode) {
  this.msearch.setCity(cityCode);
  this.msearch.search();
}

function onCircleChange(e) {
  const radius = e.target.getRadius();
  if (radius > 3000) {
    message.warn('当前范围太大，只能搜索3km内的leads');
    return;
  }
  const { lng, lat } = e.target.getCenter();
  this.props.onChange({
    lng,
    lat,
    radius: radius / 1000,
  });
}

function zoom() {
  if (this.map.getZoom() <= INITIAL_MAP_SCALE - 2) {
    if (this.marks && this.marks.length) {
      message.warn('放大地图才能正常显示leads哦');
    }
    this.clearMarks();
    return;
  }
  this.requestShopAndDraw();
}

function inShop(shops, mark) {
  const {lng, lat} = mark.getPosition();
  let index = -1;
  const find = shops.some((s, i) => {
    index = i;
    return isEq(s.latitude, lat) && isEq(s.longitude, lng);
  });
  if (find) {
    return index;
  }
  return -1;
}

function requestShopAndDraw() {
  if (this.map.getZoom() <= INITIAL_MAP_SCALE - 2) {
    return;
  }
  const lnglat = this.map.getCenter();
  const radius = 5;
  ajax({
    url: '/sale/leads/queryPublicMap.json',
    method: 'get',
    data: {
      lng: lnglat.lng,
      lat: lnglat.lat,
      radius,
      pageNum: 1,
      pageSize: 500,
      searchType: 'PUBLIC',
    },
    type: 'json',
    success: (result) => {
      this.shops = result.data.queryResult.shopLeadses;
      this.drawMarks(this.shops);
    },
  });
}

const CircleMap = React.createClass({
  propTypes: {
    cityCode: PropTypes.string,
    onChange: PropTypes.func,
    area: PropTypes.array,
  },

  componentDidMount() {
    this.onCircleChange = debounce(onCircleChange.bind(this), 500);
    this.requestShopAndDraw = debounce(requestShopAndDraw.bind(this), 500);
    this.zoom = debounce(zoom.bind(this), 500);
    this.search = debounce(search.bind(this), 500);
    this.marks = [];

    const map = this.map = new AMap.Map(this.refs.map, {
      level: INITIAL_MAP_SCALE,
      resizeEnable: true,
      keyboardEnable: false,
    });

    map.plugin(['AMap.ToolBar', 'AMap.PlaceSearch'], () => {
      const toolBar = new AMap.ToolBar();
      map.addControl(toolBar);
      this.msearch = new AMap.PlaceSearch();
      AMap.event.addListener(this.msearch, 'complete', this.searchPlaceCallBack);
    });

    AMap.event.addListener(map, 'dragend', this.requestShopAndDraw);

    AMap.event.addListener(map, 'zoomend', this.zoom);

    AMap.event.addListener(map, 'click', this.onMapClick);

    this.componentDidUpdate({});

    this.requestShopAndDraw();
  },

  shouldComponentUpdate(prevProps) {
    return this.props.cityCode !== prevProps.cityCode;
  },

  componentDidUpdate(prevProps) {
    const {cityCode} = this.props;
    if (cityCode && cityCode !== prevProps.cityCode) {
      this.clearMarks();
      this.search(cityCode);
      return;
    }
  },

  componentWillUnmount() {
    AMap.event.removeListener(this.msearch, 'complete', this.searchPlaceCallBack);
    this.map.destroy();
    this.search.cancel();
  },

  onMapClick(e) {
    if (this.map.getZoom() <= INITIAL_MAP_SCALE - 2) {
      message.warn('放大地图才能正常显示leads哦');
      return;
    }
    this.initCircle(e.lnglat.lng, e.lnglat.lat);
    this.props.onChange({
      ...e.lnglat,
      radius: this.circle.getRadius() / 1000,
    });
  },

  initCircle(lng, lat) {
    const lnglat = new AMap.LngLat(lng, lat);
    if (this.circle) {
      this.circleEditor.open();
      this.circle.setCenter(lnglat);
      return;
    }
    this.circle = new AMap.Circle({
      map: this.map,
      radius: 500, // 半径
      strokeColor: '#2DB7F5', // 线颜色
      strokeOpacity: 1, // 线透明度
      strokeWeight: 2, // 线粗细度
      fillColor: '#2DB7F5', // 填充颜色
      fillOpacity: 0.15,// 填充透明度
      center: lnglat,
    });
    this.map.plugin(['AMap.CircleEditor'], () => {
      this.circleEditor = new AMap.CircleEditor(this.map, this.circle);
      this.circleEditor.open();
      AMap.event.addListener(this.circleEditor, 'move', this.onCircleChange);
      AMap.event.addListener(this.circleEditor, 'adjust', this.onCircleChange);
    });
  },

  clearCircle() {
    if (this.circle) {
      this.circleEditor.close();
      AMap.event.addListener(this.circleEditor, 'move', this.onCircleChange);
      AMap.event.addListener(this.circleEditor, 'adjust', this.onCircleChange);
      this.map.remove(this.circle);
      this.map.remove(this.circleEditor);
      this.circle = null;
    }
  },

  searchPlaceCallBack(data) {
    this.clearCircle();
    const {map} = this;
    const d = data.poiList.pois[0];
    if (d) {
      const lngX = d.location.getLng();
      const latY = d.location.getLat();
      const lnglat = new AMap.LngLat(lngX, latY);
      map.setZoomAndCenter(INITIAL_MAP_SCALE, lnglat);
      map.setFitView();
      // 不要注释 by chengyu
      this.requestShopAndDraw();
    }
  },

  clearMarks(shops = []) {
    const newShops = shops.concat();
    if (this.marks.length) {
      const newMarks = [];
      this.marks.forEach((m) => {
        const shopIndex = inShop(newShops, m);
        if (shopIndex === -1) {
          this.map.remove(m);
        } else {
          newShops.splice(shopIndex, 1);
          newMarks.push(m);
        }
      });
      this.marks = newMarks;
    }
    return newShops;
  },

  drawMarks(shops) {
    const newShops = this.clearMarks(shops);
    const params = {
      UNIVERSAL_A: 'https://zos.alipayobjects.com/rmsportal/dszcvsfjepcpxyKqajbu.png',
      UNIVERSAL_B: 'https://zos.alipayobjects.com/rmsportal/VrbsgRMakHIUhEOOYJxb.png',
      UNIVERSAL_C: 'https://zos.alipayobjects.com/rmsportal/qyvrvPKMcbreUkWmsPKl.png',
      Default: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
    };
    if (newShops && newShops.length) {
      newShops.forEach((s) => {
        if (s.latitude) {
          // const position = {
          //   w: s.latitude,
          //   r: s.longitude,
          //   lng: s.longitude,
          //   lat: s.latitude,
          // };

          const list = this.dealTagData(s);
          // const marker = new AMap.Marker({
          //   map: this.map,
          //   position: position,
          //   icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          // });
          const icon = new AMap.Icon({image: params[list[0]], size: new AMap.Size(36, 36), imageSize: new AMap.Size(36, 36)});
          const marker = new AMap.Marker({
            map: this.map,
            position: [s.longitude, s.latitude],  // 原来使用position{} 但是会报错,看文档说这里传的是数组,所以修改了.
            icon: icon,
          });
          marker.setTitle(s.name);
          this.marks.push(marker);
        }
      });
    }
  },
  dealTagData(s) {
    // 定义优先级,用于循环
    const labelInfos = ['UNIVERSAL_A', 'UNIVERSAL_B', 'UNIVERSAL_C'];
    const list = [];
    const shopsLabel = s.labelInfos;
    if (!shopsLabel || shopsLabel.length <= 0) {
      list[0] = 'Default';
      return list;
    }
    for (let j = 0; j < labelInfos.length; j++) {
      for (let n = 0; n < shopsLabel.length; n++) {
        if (labelInfos[j] === shopsLabel[n]) {
          list.push(labelInfos[j]);
        }
      }
    }
    return list;
  },
  render() {
    return (<div style={{marginTop: 10, marginBottom: 10, height: 500}} ref="map"/>);
  },
});

export default CircleMap;
