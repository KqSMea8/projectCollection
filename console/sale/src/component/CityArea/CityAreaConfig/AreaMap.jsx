import './AreaMap.less';
import React from 'react';
import { message, Button, Spin } from 'antd';
import { SearchInput } from 'hermes-react';
import ajax from 'Utility/ajax';
import { leadsSts, shopSts } from '../MapClusterConfig.jsx';
const AMap = window.AMap;
const shopIcon = 'https://zos.alipayobjects.com/rmsportal/LAjYznmXogBIBpglWqnD.png';
const leadsIcon = 'https://zos.alipayobjects.com/rmsportal/tRwobBadrBpKvWmbUrvX.png';
const showPointLevel = 15;

let markable = false;
let markers = [];
let map = null;
let polygon = null;
let placeSearch = null;
let pointMap = {};
let markerLeadsArr = [];
let markerShopArr = [];
let leadsCluster = null;
let shopCluster = null;

// 经纬度转换后的平面坐标
class Point {
  constructor(lng, lat, index) {
    this.index = index;
    this.lat = lat;
    this.lng = lng;
    this.x = (lat + 180) * 360;
    this.y = (lng + 90) * 180;
  }

  distance(that) {
    const dX = that.x - this.x;
    const dY = that.y - this.y;
    return Math.sqrt((dX * dX) + (dY * dY));
  }

  slope(that) {
    const dX = that.x - this.x;
    const dY = that.y - this.y;
    return dY / dX;
  }
}

const AreaMap = React.createClass({
  getInitialState() {
    return {
      mapLoading: false,
      canShowPoints: false,
    };
  },

  componentDidMount() {
    map = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      mapStyle: 'fresh',
    });

    // map.plugin(['AMap.ToolBar'], () => {
    //   const toolBar = new AMap.ToolBar();
    //   map.addControl(toolBar);
    // });
    // console.log(this.props.cityName);
    map.setCity(this.props.cityName || '杭州市');
    const geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: 'all'
    });
    map.plugin(['AMap.ToolBar'], () => {
      map.addControl(new AMap.ToolBar({offset: new AMap.Pixel(20, 60)}));
    });
    map.on('click', (e) => {
      geocoder.getAddress([e.lnglat.getLng(), e.lnglat.getLat()], (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          if (result.regeocode && result.regeocode.addressComponent && (result.regeocode.addressComponent.province === this.props.cityName || result.regeocode.addressComponent.city === this.props.cityName)) {
            this.addMarker(e.lnglat.getLng(), e.lnglat.getLat());
          } else {
            message.error('您圈选的点不在当前城市范围内！');
          }
        } else {
          message.error('地图服务错误，请重试！');
        }
      });
    });
    map.on('zoomend', () => {
      console.log(map.getZoom());
      this.mapLevelChange();
    });
    /* map.on('complete', () => {
      map.setLimitBounds(map.getBounds());
    }); */
    // AMap.event.addListener(map, 'zoomend', () => {
    //   console.log('Zoom', map.getZoom());
    // });
    // 关键字查询初始化
    AMap.service(['AMap.PlaceSearch'], () => {
      placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 5,
        pageIndex: 1,
        city: this.props.cityName || '杭州市', // 城市
        map: map,
      });
    });
  },

  componentWillUnmount() {
    markers = [];
    polygon = null;
    map.destroy();
  },

  onSearch(value) {
    placeSearch.search(value);
  },

  onShowPoints() {
    this.addPoints();
  },

  mapLevelChange() {
    console.log(map.getZoom());
    if (map.getZoom() < showPointLevel) {
      this.setState({canShowPoints: false});
      if (shopCluster) {
        shopCluster.setMap(null);
      }
      if (leadsCluster) {
        leadsCluster.setMap(null);
      }
    } else {
      this.setState({canShowPoints: true});
    }
  },

  addPoints() {
    this.setState({mapLoading: true});
    const bound = map.getBounds();
    const positions = [
      {lng: bound.northeast.lng, lat: bound.southwest.lat},
      {lng: bound.southwest.lng, lat: bound.southwest.lat},
      {lng: bound.southwest.lng, lat: bound.northeast.lat},
      {lng: bound.northeast.lng, lat: bound.northeast.lat}
    ];
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/queryCityShopLeadsList.json`,
      method: 'get',
      type: 'json',
      data: {
        param: JSON.stringify({
          cityCode: this.props.cityCode,
          category: '',
          shopType: ['SHOP', 'LEADS'].join(','),
          positions: positions,
        })
      },
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          markerLeadsArr = [];
          markerShopArr = [];
          pointMap = {};
          if (shopCluster) {
            shopCluster.setMap(null);
          }
          if (leadsCluster) {
            leadsCluster.setMap(null);
          }
          const startTime = new Date().getTime();
          if (result.data && result.data.shopList) {
            result.data.shopList.forEach(item => {
              if (!pointMap[item.longitude + item.latitude]) {
                this.addShops([item.longitude, item.latitude]);
                pointMap[item.longitude + item.latitude] = true;
              }
            });
          }
          if (result.data && result.data.leadsList) {
            result.data.leadsList.forEach(item => {
              if (!pointMap[item.longitude + item.latitude]) {
                this.addLeads([item.longitude, item.latitude]);
                pointMap[item.longitude + item.latitude] = true;
              }
            });
          }
          map.plugin(['AMap.MarkerClusterer'], () => {
            shopCluster = new AMap.MarkerClusterer(map, markerShopArr, {maxZoom: 17, minClusterSize: 10, styles: shopSts});
            leadsCluster = new AMap.MarkerClusterer(map, markerLeadsArr, {maxZoom: 17, minClusterSize: 10, styles: leadsSts});
            this.setState({mapLoading: false});
          });
          console.log('total time:', new Date().getTime() - startTime);
        } else {
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
      error: () => {
        this.setState({mapLoading: false});
        message.error('请求服务超时，请重试！', 3);
      },
    });
  },
  addShops(position) {
    const marker = new AMap.Marker({
      bubble: true,
      icon: shopIcon,
      position: position,
      offset: new AMap.Pixel(0, 0),
    });
    markerShopArr.push(marker);
  },
  addLeads(position) {
    const marker = new AMap.Marker({
      bubble: true,
      icon: leadsIcon,
      position: position,
      offset: new AMap.Pixel(0, 0),
    });
    markerLeadsArr.push(marker);
  },
  sortPositions(marks) {
    const points = marks.map((item, index) => {
      const pos = item.getPosition();
      return new Point(pos.lng, pos.lat, index);
    });

    let top = points[0];
    for (let i = 1; i < points.length; i++) {
      const temp = points[i];
      if (temp.y > top.y || (temp.y === top.y && temp.x < top.x)) {
        top = temp;
      }
    }
    const upper = top;
    points.sort((p1, p2) => {
      if (p1 === upper) return -1;
      if (p2 === upper) return 1;

      const m1 = upper.slope(p1);
      const m2 = upper.slope(p2);

      if (m1 === m2) {
        return p1.distance(upper) < p2.distance(upper) ? -1 : 1;
      }

      if (m1 <= 0 && m2 > 0) return -1;

      if (m1 > 0 && m2 <= 0) return 1;

      return m1 > m2 ? -1 : 1;
    });

    return points.map(item => {
      return [item.lng, item.lat];
    });
  },

  // longitude 经度  latitude 纬度
  addMarker(lng, lat) {
    if (!markable) { return; }

    const marker = new AMap.Marker({
      draggable: false,
      raiseOnDrag: true,
      cursor: 'move',
      icon: 'https://t.alipayobjects.com/images/rmsweb/T1RmBfXddhXXXXXXXX.png_32x.png',
      position: [lng, lat],
    });
    markers.push(marker);
    marker.setMap(map);
  },

  startDraw() {
    if (polygon) return;
    markable = true;
  },

  makePolygon() {
    if (polygon) return;
    if (markers.length < 3) {
      message.error('请至少选中3个点');
      return;
    }

    // const posList = this.sortPositions(markers);
    const posList = markers.map(item => {
      const pos = item.getPosition();
      return [pos.lng, pos.lat];
    });

    polygon = new AMap.Polygon({
      path: [...posList], // 设置多边形边界路径
      strokeColor: '#FF33FF', // 线颜色
      strokeOpacity: 0.2, // 线透明度
      strokeWeight: 3, // 线宽
      fillColor: '#1791fc', // 填充色
      fillOpacity: 0.35, // 填充透明度
    });

    polygon.setMap(map);
    markable = false;

    this.props.onChange(markers);
  },

  clearMap() {
    if (polygon) {
      polygon.setMap(null);
      polygon = null;
    }

    if (markers.length > 0) {
      map.remove(markers);
      markers = [];
    }

    this.props.onChange(markers);
  },

  render() {
    const { shopCount, leadsCount, fastConsumeLeadsCnt, fastConsumeShopCnt, restaurantLeadsCnt,
       restaurantShopCnt, universalLeadsCnt, universalShopCnt, showMapInfo, canClean } = this.props;
    const { mapLoading, canShowPoints } = this.state;
    return (<div className="area-map wrap-container">
      <div className="map-container">
        <Spin spinning={mapLoading} tip="正在加载门店和leads...">
          <div className="operation">
            <span className="tip">圈选地图</span>
            <SearchInput
              placeholder="请输入地名／店名／建筑名称"
              onSearch={this.onSearch} style={{ width: 200, marginRight: 40 }}
            />
            <Button type="ghost" onClick={this.startDraw} className="start-btn">开始绘制</Button>
            <Button type="ghost" onClick={this.makePolygon} className="end-btn">结束绘制</Button>
            <Button type="ghost" onClick={this.clearMap} className="clear-btn" disabled={canClean}>清除绘制</Button>
            <Button type="primary" className="show-button" disabled={!canShowPoints} onClick={this.onShowPoints}>显示门店和leads</Button>
          </div>
          <div className="map-content">
            <div ref="map" style={{height: 550}}/>
            <div className="point-desc">
              <div className="shop point"><i /><span>门店</span></div>
              <div className="leads point"><i /><span>leads</span></div>
            </div>
            <div className="float-bg" />
          </div>
        </Spin>
      </div>

      { showMapInfo ? (<div className="info">
        <div className="name">已圈目标</div>
        <div className="grid-desc">
          <div>门店总数</div>
          <div className="number">{shopCount}</div>
          <div className="text">
            <span>餐饮门店数：</span>
            <span className="right">{restaurantShopCnt}</span>
          </div>
          <div className="text">
            <span>快消门店数：</span>
            <span className="right">{fastConsumeShopCnt}</span>
          </div>
          <div className="text">
            <span>泛行业门店数：</span>
            <span className="right">{universalShopCnt}</span>
          </div>
        </div>
        <div className="grid-desc">
          <div>leads总数</div>
          <div className="number">{leadsCount}</div>
          <div className="text">
            <span>餐饮leads数：</span>
            <span className="right">{restaurantLeadsCnt}</span>
          </div>
          <div className="text">
            <span>快消leads数：</span>
            <span className="right">{fastConsumeLeadsCnt}</span>
          </div>
          <div className="text">
            <span>泛行业leads数：</span>
            <span className="right">{universalLeadsCnt}</span>
          </div>
        </div>
      </div>) : null}
    </div>);
  },
});

export default AreaMap;
