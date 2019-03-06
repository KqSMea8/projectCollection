import React from 'react';
import moment from 'moment';
import {message, Cascader, Spin, Alert, Button, Select, Modal} from 'antd';
import { SearchInput } from 'hermes-react';
import ajax from 'Utility/ajax';
import CategoryType from './components/CategoryType';
import BizTypeChoose from './components/BizTypeChoose';
import PointChoose from './components/PointChoose';
import PointShopCount from './components/PointShopCount';
import PointLeadsCount from './components/PointLeadsCount';
import AreaMapInCircle from './components/AreaMapInCircle';
import queryAreas from '../common/queryAreas';
import compBoundsForCityMap from './components/compBoundsForCityMap';
import './CityMap.less';
import { leadsSts, shopSts } from '../MapClusterConfig.jsx';
const AMap = window.AMap;
const shopIcon = 'https://zos.alipayobjects.com/rmsportal/LAjYznmXogBIBpglWqnD.png';
const leadsIcon = 'https://zos.alipayobjects.com/rmsportal/tRwobBadrBpKvWmbUrvX.png';
const showPointLevel = 15;

let map = null;
let placeSearch = null;
let markerLeadsArr = [];
let markerShopArr = [];
let leadsCluster = null;
let shopCluster = null;

const params = {};
let gridArr = [];
let gridObjs = {};
let pointMap = {}; // 用来筛选重复的点
const defaultGrids = [{
  label: '全部网格',
  value: 'all'
}, {
  label: '不展示网络',
  value: 'none'
}];
let polygonObj = {};
let curPolygonId = null;

const colorArr = ['#FF6A6A', '#FF7F24', '#FF83FA', '#B23AEE', '#9ACD32', '#8F8F8F', '#98FB98'];

const CityMap = React.createClass({
  getInitialState() {
    const queryParam = this.props.queryParam || {}; // bizType=CodeBizType-2&category=FMCG&pointChooseValue=transactionInCode_Mouth1,tradeNumShop_Week0
    const bizType = queryParam.bizType || BizTypeChoose.ShopTypeValues.Shop;
    const pointChooseValue = queryParam.pointChooseValue && queryParam.pointChooseValue.split(',') || [];
    const category = queryParam.category || '';
    return {
      cities: [],
      loading: true,
      mapShow: false,
      showGrid: false,
      pageReloading: false,
      canShowPoints: false,
      grids: defaultGrids,
      bizType: bizType,
      pointChooseValue: pointChooseValue,
      category: category,
      filterGrid: defaultGrids[0].value,
      searchingValue: {
        category: category,
        bizType: bizType,
        pointChooseValue: pointChooseValue,
      },
    };
  },

  componentDidMount() {
    this.fetchCities(cities => {
      params.city = [cities[0].i, cities[0].c[0].i];
      const formatedCities = this.formatCities(cities);
      this.setState({
        cities: formatedCities,
        city: [cities[0].i, cities[0].c[0].i],
        cityName: cities[0].c[0].n,
        cityCode: cities[0].c[0].i,
        loading: false,
      }, () => {
        this.fetchGrids();
        this.initialMap();
        this.fetchShopLeadsCountInfo();
      });
    });
  },

  onCategoryChange(value) {
    this.setState({
      category: value,
    });
  },

  onBizTypeChange(value) {
    this.setState({
      bizType: value,
      pointChooseValue: [],
    });
  },

  onGridChange(value) {
    this.setState({ filterGrid: value });
    if (value === 'all') {
      Object.keys(polygonObj).forEach(key => {
        polygonObj[key].show();
      });
      this.clearChooseGrid();
      map.setFitView();
      return;
    }
    if (value === 'none') {
      Object.keys(polygonObj).forEach(key => {
        polygonObj[key].hide();
      });
      this.clearChooseGrid();
      return;
    }
    if (value) {
      Object.keys(polygonObj).forEach(key => {
        polygonObj[key].hide();
      });
      polygonObj[value].show();
      this.chooseGrid(value);
      map.setBounds(compBoundsForCityMap(polygonObj[value].getBounds()));
    }
  },

  onCityChange(city, items) {
    if (this.state.cityCode === items[1].value) {
      return;
    }
    this.setState({
      cityName: items[1].label,
      cityCode: items[1].value,
      showGrid: false,
      filterGrid: defaultGrids[0].value,
      circleMapLoadLeadsShop: false,
      circleMapConfig: null,
    }, () => {
      if (map) {
        map.destroy();
        map = null;
      }
      this.clearChooseGrid();
      if (!this.state.inCircleMode) {
        this.initialMap();
        this.fetchGrids();
      }
      this.onClickSearch();
    });
    params.city = city;
  },

  onAlertClose() {
    localStorage.setItem('cityMapInfoClose', 1);
  },
  onClickSearch() {
    this.setState({
      searchingValue: {
        category: this.state.category,
        bizType: this.state.bizType,
        pointChooseValue: this.state.pointChooseValue,
      },
    }, () => {
      this.fetchShopLeadsCountInfo();
    });
  },
  onClickClearSearch() {
    this.setState({
      pointChooseValue: [],
    }, () => {
      this.onClickSearch();
    });
  },
  onResetCircleShop(circleTerritoryId, positions) {
    Modal.info({
      title: `新圈入数据将覆盖旧的门店数据`,
      onOk: () => {
        this.onClickCircleShop(circleTerritoryId, positions);
      },
    });
  },
  onClickCircleShop(circleTerritoryId, positions) {
    this.setState({
      inCircleMode: true,
      circleMapConfig: {
        zoom: map.getZoom(),
        center: map.getCenter(),
      },
      circleMapLoadLeadsShop: shopCluster && shopCluster.getMap() === map,
      circleTerritoryId: circleTerritoryId,
      circleTerritoryPositions: positions,
    });
  },
  onFinishCircleMode() {
    this.setState({
      inCircleMode: false,
    }, () => {
      this.initialMap();
      this.fetchGrids();
    });
  },
  onSearchPlace(value) {
    if (!placeSearch) return;
    placeSearch.setCity(this.state.cityName);
    placeSearch.search(value);
  },
  mapLevelChange() {
    if (map.getZoom() < showPointLevel) {
      this.setState({canShowPoints: false});
      this.clearShopLeadsCluster();
    } else {
      this.setState({canShowPoints: true});
    }
  },

  initialMap() {
    let overrideConfig;
    if (map) {
      overrideConfig = {
        zoom: map.getZoom(),
        center: map.getCenter(),
      };
      map.destroy();
    }
    map = new AMap.Map(this.refs.map, {
      resizeEnable: false,
      keyboardEnable: false,
      scrollWheel: false,
      mapStyle: 'fresh',
      zoom: 10,
      ...(overrideConfig || {}),
    });

    if (!overrideConfig) map.setCity(this.state.cityName || '杭州市');

    map.plugin(['AMap.ToolBar'], () => {
      map.addControl(new AMap.ToolBar({offset: new AMap.Pixel(20, 60)}));
    });
    AMap.service(['AMap.PlaceSearch'], () => {
      placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 5,
        pageIndex: 1,
        city: this.state.cityName || '杭州市', // 城市
        map: map,
      });
    });
    map.on('zoomend', () => {
      this.mapLevelChange();
    });
    if (map.getZoom() < showPointLevel) {
      this.setState({canShowPoints: false});
      this.clearShopLeadsCluster();
    } else {
      if (shopCluster) shopCluster.setMap(map);
      if (leadsCluster) leadsCluster.setMap(map);
    }
  },
  clickShowPoints() {
    const { bizType, category, pointChooseValue } = this.state.searchingValue;
    const bound = map.getBounds();
    const positions = [
      {lng: bound.northeast.lng, lat: bound.southwest.lat},
      {lng: bound.southwest.lng, lat: bound.southwest.lat},
      {lng: bound.southwest.lng, lat: bound.northeast.lat},
      {lng: bound.northeast.lng, lat: bound.northeast.lat}
    ];
    this.setState({mapShow: true});
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/queryCityShopLeadsList.json`,
      method: 'get',
      type: 'json',
      data: {
        businessType: BizTypeChoose.parseCodeBizTypeFromBizTypeValue(bizType),
        param: JSON.stringify({
          cityCode: this.state.cityCode,
          shopType: BizTypeChoose.parseShopTypeFromBizTypeValue(bizType),
          category: category,
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
          this.clearShopLeadsCluster();
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
            this.setState({mapShow: false});
          });
        } else {
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
      error: (res) => {
        this.setState({mapShow: false});
        message.error((res && res.resultMsg) || '请求服务超时，请重试！', 3);
      },
    });
  },
  clearShopLeadsCluster() {
    if (shopCluster) shopCluster.setMap(null);
    if (leadsCluster) leadsCluster.setMap(null);
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

  fetchCities(callback) {
    queryAreas({
      success: (cityRes) => {
        if (cityRes && cityRes.status && cityRes.status === 'succeed') {
          callback(cityRes.data);
        } else {
          message.error(cityRes && cityRes.errorMsg || '请求失败', 3);
        }
      },
      error: (res) => {
        message.error((res && res.resultMsg) || '请求异常', 3);
      },
    });
  },

  fetchGrids() {
    this.setState({ pageReloading: true });
    polygonObj = {};
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/queryMapTerritorys.json`,
      method: 'get',
      type: 'json',
      data: {
        cityId: this.state.cityCode,
        isMapTerritorys: true,
      },
      success: (cityRes) => {
        this.setState({ pageReloading: false });
        if (!cityRes) return;
        if (cityRes.status && cityRes.status === 'succeed') {
          gridArr = cityRes.data;
          gridArr.sort((i1, i2) => i1 && i2 && i2.territoryArea > i1.territoryArea);
          gridObjs = {};
          const _grids = this.formatGrids(cityRes.data);
          gridArr.forEach((item, index) => {
            if (!item.mapRange) return;
            gridObjs[item.territoryId] = item;
            const mapArr = item.mapRange.split(',').map(data => {
              return data.split('_');
            });
            this.addPolygon(mapArr, colorArr[index % colorArr.length], item.territoryId);
          });
          if (curPolygonId) this.chooseGrid(curPolygonId);
          this.setState({ grids: _grids });
        } else {
          if (cityRes.errorMsg) {
            message.error(cityRes.errorMsg, 3);
          }
        }
      },
      error: () => {
        message.error('服务异常，请重试 ！', 3);
      },
    });
  },

  fetchShopLeadsCountInfo() {
    const { bizType, category, pointChooseValue } = this.state.searchingValue;
    this.setState({
      searchTotalCountTitle: [CategoryType.getCategoryTypeName(category), BizTypeChoose.BizTypeKeyValueMap[bizType], PointChoose.getNamesFromValue(pointChooseValue)].filter(i => !!i).join('-'),
      searchTotalCount: '统计中...',
    });
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/queryCityShopLeadsQuotaCount.json`,
      method: 'get',
      type: 'json',
      data: {
        businessType: BizTypeChoose.parseCodeBizTypeFromBizTypeValue(bizType),
        param: JSON.stringify({
          cityCode: this.state.cityCode,
          shopType: BizTypeChoose.parseShopTypeFromBizTypeValue(bizType),
          category: category,
        }),
        ...PointChoose.parseRequestParamFromValue(pointChooseValue),
      },
      success: (res) => {
        if (!res) {
          return;
        }
        if (res.status && res.status === 'succeed') {
          this.setState({
            searchTotalCount: res.data,
          });
        } else {
          if (res.errorMsg) {
            message.error(res.errorMsg, 3);
          }
        }
      },
      error: () => {
        message.error('服务异常，请重试 ！', 3);
      }
    });
  },

  formatCities(cities) {
    return cities.map(city => {
      const formatedCity = {};
      if (city.c && city.c.length > 0) {
        formatedCity.children = this.formatCities(city.c);
      }
      formatedCity.value = city.i;
      formatedCity.label = city.n;
      return formatedCity;
    });
  },

  addPolygon(gonArr, color, id) {
    const polygon = new AMap.Polygon({
      path: gonArr,// 设置多边形边界路径
      strokeColor: color, // 线颜色
      strokeOpacity: 0.4, // 线透明度
      strokeWeight: 2,    // 线宽
      fillColor: color, // 填充色
      fillOpacity: 0.2// 填充透明度
    });
    polygon.setMap(map);
    polygonObj[id] = polygon;
    polygon.on('click', () => {
      if (curPolygonId === id) {
        this.clearChooseGrid();
      } else {
        this.chooseGrid(id);
      }
    });
  },
  chooseGrid(id) {
    const oldPolygon = polygonObj[curPolygonId];
    if (oldPolygon) {
      const options = oldPolygon.getOptions();
      options.strokeColor = options.fillColor;
      options.strokeOpacity = 0.4;
      options.strokeWeight = 2;
      oldPolygon.setOptions(options);
    }

    const polygon = polygonObj[id];
    if (polygon) {
      const options = polygon.getOptions();
      options.strokeColor = '#FFFF00';
      options.strokeOpacity = 1;
      options.strokeWeight = 4;
      polygon.setOptions(options);
    }

    curPolygonId = id;
    const grid = gridObjs[id];
    this.setState({
      showGrid: true,
      gridMotifiedTime: moment(grid.gmtModified).format('YYYY-MM-DD'),
      gridRestaurantShopCnt: grid.restaurantShopCnt,
      gridRestaurantLeadsCnt: grid.restaurantLeadsCnt,
      gridFastConsumeShopCnt: grid.fastConsumeShopCnt,
      gridFastConsumeLeadsCnt: grid.fastConsumeLeadsCnt,
      territoryShopCount: grid.territoryShopCount,
      territoryLeadsCount: grid.territoryLeadsCount,
      gridUniversalLeadsCnt: grid.universalLeadsCnt,
      gridUniversalShopCnt: grid. universalShopCnt,
      territoryName: grid.territoryName,
      territoryId: grid.territoryId,
      hasBeenLocked: grid.has_been_locked,
      gridPositions: grid.mapRange && grid.mapRange.split(',').map(lnglat => ({lng: lnglat.split('_')[0], lat: lnglat.split('_')[1]})),
    });
  },
  clearChooseGrid() {
    const oldPolygon = polygonObj[curPolygonId];
    if (oldPolygon) {
      const options = oldPolygon.getOptions();
      options.strokeColor = options.fillColor;
      options.strokeOpacity = 0.4;
      options.strokeWeight = 2;
      oldPolygon.setOptions(options);
    }
    curPolygonId = null;
    this.setState({
      showGrid: false,
      territoryName: undefined,
      territoryId: undefined,
      gridPositions: null,
    });
  },

  formatGrids(_grids) {
    const result = defaultGrids.map(item => item);
    _grids.forEach(item => {
      if (!item.mapRange) {
        return;
      }
      const grid = {};
      grid.label = item.territoryName;
      grid.value = item.territoryId;
      result.push(grid);
    });
    return result;
  },
  download(id, cityId) {
    const downloadPath = `${window.APP.crmhomeUrl}/shop/koubei/territory/exportShop.json?_input_charset=ISO8859-1&territoryId=${id}&cityId=${cityId}`;
    window.open(downloadPath);
  },
  render() {
    const { cities, cityName, loading, mapShow, grids, filterGrid, showGrid, bizType, category, pointChooseValue, inCircleMode,
      circleTerritoryId, circleTerritoryPositions, circleMapConfig, circleMapLoadLeadsShop,
       searchTotalCountTitle, searchTotalCount,
       gridMotifiedTime, gridRestaurantShopCnt, gridRestaurantLeadsCnt, gridFastConsumeShopCnt,
       gridFastConsumeLeadsCnt, territoryShopCount, territoryLeadsCount, gridUniversalLeadsCnt, gridPositions,
       gridUniversalShopCnt, territoryName, territoryId, cityCode, hasBeenLocked, pageReloading, canShowPoints } = this.state;
    const { city } = params;
    const cityMapInfoClose = localStorage.getItem('cityMapInfoClose');

    if (loading) return <div><Spin /></div>;
    return (
      <div className="city-map">
        <div>
          城市：
          {
            cities.length > 0 &&
              <Cascader style={{width: '230px'}} defaultValue={city} options={cities} onChange={this.onCityChange}
                placeholder="请选择" disabled={mapShow || (inCircleMode && !!circleTerritoryId)} allowClear={false} />
          }
          <span style={{width: 20, display: 'inline-block'}} />
          行业：<CategoryType style={{width: '230px'}} defaultValue={category} onChange={this.onCategoryChange} disabled={mapShow} />
          <div style={{marginTop: 20, display: 'flex', alignItems: 'center'}} >
            业务名称：<BizTypeChoose defaultValue={bizType} onChange={(value) => this.onBizTypeChange(value)} />
            <span style={{width: 20, display: 'inline-block'}} />
            指标名称：<PointChoose value={pointChooseValue} onChange={(value) => this.setState({pointChooseValue: value})} disabled={PointChoose.isDisabled(bizType)} />
          </div>
          <div style={{marginTop: 20, textAlign: 'right'}}>
            <Button type="primary" onClick={this.onClickSearch}>搜索</Button>
            <Button style={{marginLeft: 20}} onClick={this.onClickClearSearch}>清除条件</Button>
          </div>
          { !cityMapInfoClose && (<div style={{ marginTop: 20}}><Alert message={<div style={{display: 'inline-block', verticalAlign: 'top'}}>通过地图圈店的方式创建的网格才能在城市地图上展示。</div>} type="info" showIcon closable
            onClose={this.onAlertClose} /></div>)}
          { inCircleMode ? (<AreaMapInCircle key={cityCode + (circleTerritoryId || '')} mapConfig={circleMapConfig} loadLeadsShop={circleMapLoadLeadsShop}
            cityName={cityName} cityCode={cityCode} onCancel={this.onFinishCircleMode} onFinish={this.onFinishCircleMode} {...this.state.searchingValue}
            searchTotalCountTitle={searchTotalCountTitle} searchTotalCount={searchTotalCount} territoryId={circleTerritoryId} positions={circleTerritoryPositions}
          />) : (<div>
            <div style={{ marginTop: 20, background: 'white', padding: 12, border: '1px solid #ddd', borderBottom: 'none' }}>
              {searchTotalCountTitle}：<span style={{color: 'red', fontSize: '140%'}}>{searchTotalCount}</span>
              <Button type="primary" style={{float: 'right'}} onClick={() => this.onClickCircleShop()}>圈选门店</Button>
            </div>
            <div className="city-grid">
              <Spin spinning={mapShow || pageReloading} tip="正在加载门店和leads...">
                <div className="city-map-container">
                  <div className="map" ref="map" />
                  <div className="point-desc">
                    <Button type="primary" style={{marginRight: 12}} disabled={!canShowPoints} onClick={this.clickShowPoints}>加载数据</Button>
                    <div className="shop point"><i /><span>门店</span></div>
                    <div className="leads point"><i /><span>leads</span></div>
                    <div style={{float: 'right'}}>
                      <Select value={filterGrid} style={{ marginRight: 12, minWidth: 160 }} optionFilterProp="children"
                        onChange={this.onGridChange} showSearch>
                        {grids.map((item, index) => (
                          <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                        ))}
                      </Select>
                      <SearchInput placeholder="请输入地名／店名／建筑名称" onSearch={this.onSearchPlace} style={{ width: 200 }} />
                    </div>
                  </div>
                  { showGrid ? (<div className="info">
                    <div className="grid-desc">
                      <div className="name">{territoryName}</div>
                      <p className="time">更新时间： {gridMotifiedTime}</p>
                      { hasBeenLocked === 'T' ? (<div className="operate" style={{color: 'red'}}>数据待生效，请稍后查看...</div>) : (<div className="operate">
                        <span className="first"><a href="#" onClick={(e) => { e.preventDefault(); this.onResetCircleShop(territoryId, gridPositions); }}>重新圈店</a></span>
                        <span><a href="#" onClick={(e) => { e.preventDefault(); this.download(territoryId, cityCode); }}>下载</a></span>
                      </div>)}
                    </div>
                    <div className="grid-desc">
                      <div>门店总数</div>
                      <div className="number">{territoryShopCount}</div>
                      <PointShopCount className="point-shop-count" {...this.state.searchingValue} cityCode={cityCode} positions={gridPositions} />
                      <div className="text">
                        <span>餐饮门店数：</span>
                        <span className="right">{gridRestaurantShopCnt}</span>
                      </div>
                      <div className="text">
                        <span>快消门店数：</span>
                        <span className="right">{gridFastConsumeShopCnt}</span>
                      </div>
                      <div className="text">
                        <span>泛行业门店数：</span>
                        <span className="right">{gridUniversalShopCnt}</span>
                      </div>
                    </div>
                    <div className="grid-desc">
                      <div>leads总数</div>
                      <div className="number">{territoryLeadsCount}</div>
                      <PointLeadsCount className="point-shop-count" {...this.state.searchingValue} cityCode={cityCode} positions={gridPositions} />
                      <div className="text">
                        <span>餐饮leads数：</span>
                        <span className="right">{gridRestaurantLeadsCnt}</span>
                      </div>
                      <div className="text">
                        <span>快消leads数：</span>
                        <span className="right">{gridFastConsumeLeadsCnt}</span>
                      </div>
                      <div className="text">
                        <span>泛行业leads数：</span>
                        <span className="right">{gridUniversalLeadsCnt}</span>
                      </div>
                    </div>
                  </div>) : null}
                </div>
              </Spin>
            </div>
          </div>)}
        </div>
      </div>
    );
  },
});

export default CityMap;
