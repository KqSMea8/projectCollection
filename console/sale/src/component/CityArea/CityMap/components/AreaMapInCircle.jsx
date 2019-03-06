import './AreaMapInCircle.less';
import React from 'react';
import { message, Button, Spin } from 'antd';
import { SearchInput } from 'hermes-react';
import ajax from 'Utility/ajax';
import PointShopCount from './PointShopCount';
import PointLeadsCount from './PointLeadsCount';
import RelateGridModal from './RelateGridModal';
import { leadsSts, shopSts } from '../../MapClusterConfig.jsx';
import compBoundsForCityMap from './compBoundsForCityMap';
import BizTypeChoose from './BizTypeChoose';
import PointChoose from './PointChoose';
const AMap = window.AMap;
const shopIcon = 'https://zos.alipayobjects.com/rmsportal/LAjYznmXogBIBpglWqnD.png';
const leadsIcon = 'https://zos.alipayobjects.com/rmsportal/tRwobBadrBpKvWmbUrvX.png';
const showPointLevel = 15;

let markers = [];
let map = null;
let polygon = null;
let polyline = null;
let placeSearch = null;
let pointMap = {};
let markerLeadsArr = [];
let markerShopArr = [];
let leadsCluster = null;
let shopCluster = null;
let mouseLatLng = null;

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
  propTypes: {
    cityName: React.PropTypes.string,
    cityCode: React.PropTypes.string,
    bizType: React.PropTypes.string,
    category: React.PropTypes.string,
    pointChooseValue: React.PropTypes.array,
    territoryId: React.PropTypes.string, // 重新圈店时进入
    positions: React.PropTypes.array, // 重新圈店时进入
    mapConfig: React.PropTypes.any,
    loadLeadsShop: React.PropTypes.bool,
    onCancel: React.PropTypes.func,
    onFinish: React.PropTypes.func,
  },

  getInitialState() {
    return {
      mapLoading: false,
      canShowPoints: false,
      relateModalVisible: false,
    };
  },

  componentDidMount() {
    const overrideOption = this.props.mapConfig || {};
    map = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      scrollWheel: false,
      mapStyle: 'fresh',
      ...overrideOption,
    });
    map.setDefaultCursor('url(https://gw.alipayobjects.com/zos/rmsportal/XyFPszIpcFGAJurDrjsJ.png) 8 32, default');

    // map.plugin(['AMap.ToolBar'], () => {
    //   const toolBar = new AMap.ToolBar();
    //   map.addControl(toolBar);
    // });
    // console.log(this.props.cityName);
    if (!this.props.mapConfig) {
      map.setCity(this.props.cityName || '杭州市');
    }
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
      this.mapLevelChange();
    });
    map.on('mousemove', (e) => {
      mouseLatLng = e.lnglat;
      if (!polygon) this.makePolyline();
    });
    map.on('mouseout', () => {
      mouseLatLng = null;
      if (!polygon) this.makePolyline();
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

    if (this.props.positions) {
      for (const pos of this.props.positions) {
        this.addMarker(pos.lng, pos.lat);
      }
      if (markers.length >= 3) {
        this.makePolygon();
        if (polygon) {
          polygon.show();
          map.on('complete', () => {
            if (polygon) {
              map.setBounds(compBoundsForCityMap(polygon.getBounds()));
            }
          });
        }
      }
    }
    map.on('complete', () => {
      if (map.getZoom() >= showPointLevel) {
        this.setState({ canShowPoints: true });
        if (this.props.loadLeadsShop) {
          this.onShowPoints();
        }
      }
    });
  },

  componentWillReceiveProps(nextProps) {
    const { cityCode, bizType, category, pointChooseValue } = this.props;
    if (nextProps.cityCode !== cityCode || nextProps.bizType !== bizType || nextProps.category !== category
      || nextProps.pointChooseValue !== pointChooseValue) {
      this.clearShopLeadsCluster();
    }
  },

  componentWillUnmount() {
    this.clearPolyline();
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
    if (map.getZoom() < showPointLevel) {
      this.setState({canShowPoints: false});
      this.clearShopLeadsCluster();
    } else {
      this.setState({canShowPoints: true});
    }
  },

  clearShopLeadsCluster() {
    if (shopCluster) shopCluster.setMap(null);
    if (leadsCluster) leadsCluster.setMap(null);
  },

  addPoints() {
    const { bizType, category, pointChooseValue } = this.props;
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
        businessType: BizTypeChoose.parseCodeBizTypeFromBizTypeValue(bizType),
        param: JSON.stringify({
          cityCode: this.props.cityCode,
          category: category,
          shopType: BizTypeChoose.parseShopTypeFromBizTypeValue(bizType),
          positions: positions,
        }),
        ...PointChoose.parseRequestParamFromValue(pointChooseValue),
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
    if (polygon) return;
    const marker = new AMap.Marker({
      draggable: true,
      // raiseOnDrag: true,
      cursor: 'move',
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/YNqcSXPaeMUEKlCZnCKL.png',
      position: [lng, lat],
    });
    markers.push(marker);
    marker.setMap(map);

    marker.on('click', () => { // 点击第一个 marker 自动闭合
      if (markers.length > 2 && markers[0] === marker) {
        this.makePolygon();
      }
    });
    marker.on('dragging', () => {
      if (polyline) this.makePolyline();
      this.checkRemakePolygon(false);
    });
    marker.on('dragend', () => {
      if (polyline) this.makePolyline();
      this.checkRemakePolygon(true);
    });
    this.makePolyline();
  },
  formatMarkerPositionsForPolyPath() {
    return markers.map(item => {
      const pos = item.getPosition();
      return [pos.lng, pos.lat];
    });
  },
  clearPolyline() {
    if (polyline) {
      polyline.setMap(null);
      polyline = null;
    }
  },
  makePolyline() {
    if (!polyline) {
      polyline = new AMap.Polyline({
        strokeColor: '#ff7b00', // 线颜色
        strokeOpacity: 0.7, // 线透明度
        strokeWeight: 3, // 线宽
        fillColor: '#ff7b00', // 填充色
        fillOpacity: 0.2, // 填充透明度
        bubble: true,
        cursor: 'url(https://gw.alipayobjects.com/zos/rmsportal/XyFPszIpcFGAJurDrjsJ.png) 8 32, default',
      });
      polyline.setMap(map);
    }
    const path = this.formatMarkerPositionsForPolyPath();
    if (mouseLatLng && !polygon) path.push([mouseLatLng.lng, mouseLatLng.lat]);
    polyline.setPath(path); // 设置多边形边界路径
  },
  checkRemakePolygon(loadData) {
    if (polygon) {
      polygon.setPath(this.formatMarkerPositionsForPolyPath());
      if (loadData) {
        this.queryCityShopLeadsCount();
      }
    }
  },
  makePolygon() {
    if (polygon) return;
    if (markers.length < 3) {
      message.error('请至少选中3个点');
      return;
    }
    this.clearPolyline();

    polygon = new AMap.Polygon({
      path: this.formatMarkerPositionsForPolyPath(), // 设置多边形边界路径
      strokeColor: '#ff7b00', // 线颜色
      strokeOpacity: 0.7, // 线透明度
      strokeWeight: 3, // 线宽
      fillColor: '#ff7b00', // 填充色
      fillOpacity: 0.2, // 填充透明度
    });

    polygon.setMap(map);
    this.queryCityShopLeadsCount();
  },
  clickFinishCircle() {
    if (polygon) {
      this.queryCityShopLeadsCount();
    } else {
      this.makePolygon();
    }
  },
  queryCityShopLeadsCount() {
    this.setState({
      mapInfoLoading: true,
      showMapInfo: true,
      gridPositions: markers.map(item => ({ lng: item.getPosition().lng, lat: item.getPosition().lat })),
    });
    const loadingLock = this.loadingLock = Math.random();
    const { cityCode, territoryId } = this.props;
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/uploadPolygon.json`,
      method: 'post',
      data: {
        param: JSON.stringify({
          cityCode: cityCode,
          territoryId: territoryId,
          isCircleShopSubmit: false,
          positions: markers.map(item => ({ lng: item.getPosition().lng, lat: item.getPosition().lat })),
          territoryArea: polygon.getArea(),
        }),
      },
      type: 'json',
      success: (res) => {
        if (loadingLock !== this.loadingLock) return;
        if (res.status && res.status === 'succeed') {
          // 更新参数
          if (!res.data || !res.data.shopIds || !res.data.leadsIds) {
            message.error('系统异常！', 3);
            return;
          }
          this.setState({
            shopCount: res.data.shopIds.length,
            leadsCount: res.data.leadsIds.length,
            fastConsumeLeadsCnt: res.data.fastConsumeLeadsCnt,
            fastConsumeShopCnt: res.data.fastConsumeShopCnt,
            restaurantLeadsCnt: res.data.restaurantLeadsCnt,
            restaurantShopCnt: res.data.restaurantShopCnt,
            universalLeadsCnt: res.data.universalLeadsCnt,
            universalShopCnt: res.data.universalShopCnt,
            showMapInfo: true,
            chooseShopIds: res.data.shopIds,
            chooseLeadsIds: res.data.leadsIds,
          });

          if (res.data.shopIds.length <= 0 && res.data.shopIds.length <= 0) {
            message.warn('您当前所选区域无符合岗位业务约束的门店或leads', 3);
          }
        }
      },
      error: ({resultMsg}) => {
        if (loadingLock !== this.loadingLock) return;
        if (resultMsg) {
          message.error(resultMsg);
        }
      },
      complete: () => {
        if (loadingLock !== this.loadingLock) return;
        this.setState({
          mapInfoLoading: false,
        });
      },
    });
  },

  clearMap() {
    if (polygon) {
      polygon.setMap(null);
      polygon = null;
    }
    this.clearPolyline();

    if (markers.length > 0) {
      map.remove(markers);
      markers = [];
    }

    this.setState({
      showMapInfo: false,
      mapInfoLoading: false,
    });
  },

  clickCancel() {
    this.props.onCancel();
  },

  circleFinish() {
    this.props.onFinish();
  },

  clickRelateGrid() {
    if (this.state.chooseShopIds.length <= 0 && this.state.chooseLeadsIds.length <= 0) {
      message.warn('您当前所选区域无符合岗位业务约束的门店或leads', 3);
    } else {
      this.setState({ relateModalVisible: true });
    }
  },

  render() {
    const { shopCount, leadsCount, fastConsumeLeadsCnt, fastConsumeShopCnt, restaurantLeadsCnt,
       restaurantShopCnt, universalLeadsCnt, universalShopCnt, showMapInfo, mapInfoLoading, gridPositions,
      chooseShopIds, chooseLeadsIds} = this.state;
    const { searchTotalCountTitle, searchTotalCount, bizType, category, pointChooseValue, cityCode, cityName, territoryId } = this.props;
    const { mapLoading, canShowPoints } = this.state;
    return (<div className="area-map-in-circle wrap-container">
      <div className="map-container">
        <Spin spinning={mapLoading} tip="正在加载门店和leads...">
          <div style={{ padding: 12, borderBottom: 'none' }}>
            {searchTotalCountTitle}：<span style={{color: 'red', fontSize: '140%'}}>{searchTotalCount}</span>
            <div style={{ float: 'right' }}>
              {!showMapInfo && <Button type="ghost" onClick={this.clickFinishCircle} loading={mapInfoLoading} className="end-btn">完成圈选</Button>}
              <Button type="ghost" onClick={this.clearMap} className="clear-btn">清除圈选</Button>
              <Button type="ghost" onClick={this.clickCancel} className="clear-btn">结束圈选</Button>
            </div>
          </div>

          <div className="map-content">
            <div ref="map" style={{height: 639}} />
            <div className="point-desc">
              <Button type="primary" style={{marginRight: 12}} disabled={!canShowPoints} onClick={this.onShowPoints}>加载数据</Button>
              <div className="shop point"><i /><span>门店</span></div>
              <div className="leads point"><i /><span>leads</span></div>
              <SearchInput
                placeholder="请输入地名／店名／建筑名称"
                onSearch={this.onSearch} style={{ width: 200, marginRight: 40, float: 'right' }}
              />
            </div>
            { showMapInfo ? (<div className="info">
              <Spin spinning={mapInfoLoading} tip="正在加载...">
                <div className="relate-btn-layout">
                  <button className="relate-btn" onClick={this.clickRelateGrid}>+ 关联网络</button>
                </div>
                <div className="grid-desc">
                  <div>门店总数</div>
                  <div className="number">{mapInfoLoading ? '-' : shopCount}</div>
                  <PointShopCount className="point-shop-count" cityCode={cityCode} category={category} bizType={bizType}
                    pointChooseValue={pointChooseValue} positions={gridPositions} />
                  <div className="text">
                    <span>餐饮门店数：</span>
                    <span className="right">{mapInfoLoading ? '-' : restaurantShopCnt}</span>
                  </div>
                  <div className="text">
                    <span>快消门店数：</span>
                    <span className="right">{mapInfoLoading ? '-' : fastConsumeShopCnt}</span>
                  </div>
                  <div className="text">
                    <span>泛行业门店数：</span>
                    <span className="right">{mapInfoLoading ? '-' : universalShopCnt}</span>
                  </div>
                </div>
                <div className="grid-desc">
                  <div>leads总数</div>
                  <div className="number">{mapInfoLoading ? '-' : leadsCount}</div>
                  <PointLeadsCount className="point-shop-count" cityCode={cityCode} category={category} bizType={bizType}
                    pointChooseValue={pointChooseValue} positions={gridPositions} />
                  <div className="text">
                    <span>餐饮leads数：</span>
                    <span className="right">{mapInfoLoading ? '-' : restaurantLeadsCnt}</span>
                  </div>
                  <div className="text">
                    <span>快消leads数：</span>
                    <span className="right">{mapInfoLoading ? '-' : fastConsumeLeadsCnt}</span>
                  </div>
                  <div className="text">
                    <span>泛行业leads数：</span>
                    <span className="right">{mapInfoLoading ? '-' : universalLeadsCnt}</span>
                  </div>
                </div>
              </Spin>
            </div>) : null}
          </div>
        </Spin>
      </div>
      <RelateGridModal
        cityName={cityName}
        cityCode={cityCode}
        positions={gridPositions}
        shopIds={chooseShopIds}
        leadsIds={chooseLeadsIds}
        territoryArea={polygon && polygon.getArea()}
        bindTerritoryId={territoryId}
        visible={this.state.relateModalVisible}
        onCancel={() => this.setState({relateModalVisible: false })}
        onOk={() => this.circleFinish()}
      />
    </div>);
  },
});

export default AreaMap;
