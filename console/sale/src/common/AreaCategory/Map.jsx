import React, {PropTypes} from 'react';
import debounce from 'lodash.debounce';
const AMap = window.AMap;

function search(areaId, address) {
  this.msearch.setCity(areaId);
  this.msearch.search(address || '', (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      const data = result.poiList;
      const pos = data.pois[0];
      this.initMarker();
      this.marker.setPosition(pos.location);
      const lnglat = new AMap.LngLat(pos.location.lng, pos.location.lat);
      this.map.setZoomAndCenter(13, lnglat);
      // 地图自适应
      this.map.setFitView();
      this.props.onChange(pos.location);
    } else {
      this.props.onChange(null);
    }
  });
}

const Map = React.createClass({
  propTypes: {
    areaId: PropTypes.string,
    address: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    checkAll: PropTypes.func,
  },

  getInitialState() {
    return {
    };
  },

  componentDidMount() {
    this.search = debounce(search.bind(this), 500);

    const map = this.map = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      keyboardEnable: false,
    });

    map.plugin(['AMap.ToolBar'], () => {
      const toolBar = new AMap.ToolBar();
      map.addControl(toolBar);
    });

    this.map.plugin(['AMap.PlaceSearch'], () => {
      this.msearch = new AMap.PlaceSearch({});
    });

    this.map.plugin(['AMap.DistrictSearch'], () => {
      this.districtSearch = new AMap.DistrictSearch({});
    });

    const {value} = this.props;

    if (value) {
      this.initMarker();
      const lnglat = new AMap.LngLat(value.lng, value.lat);
      this.marker.setPosition(lnglat);
      this.map.setZoomAndCenter(13, lnglat);

      // 地图自适应
      this.map.setFitView();
    }
  },

  componentDidUpdate(prevProps) {
    this.locate(prevProps);
  },

  componentWillUnmount() {
    if (this.marker) {
      AMap.event.removeListener(this.marker, 'dragend', this.markDragEnd);
    }
    this.map.destroy();
  },


  initMarker() {
    if (this.marker) {
      return this.marker;
    }
    const markerConfig = {
      position: this.map.getCenter(),
      draggable: true,
      cursor: 'move',  // 鼠标悬停点标记时的鼠标样式
      raiseOnDrag: true,// 鼠标拖拽点标记时开启点标记离开地图的效果,
      icon: 'https://t.alipayobjects.com/images/rmsweb/T1RmBfXddhXXXXXXXX.png_32x.png',
    };
    this.marker = new AMap.Marker(markerConfig);
    this.marker.setMap(this.map);
    AMap.event.addListener(this.marker, 'dragend', this.markDragEnd);
  },

  locate(prevProps) {
    const {areaId, address} = this.props;
    if ((areaId !== prevProps.areaId || prevProps.address !== address)) {
      if (areaId) {
        this.search(areaId, address);
      }
    }
  },

  markDragEnd(e) {
    this.props.checkAll();
    this.props.onChange(e.lnglat);
  },

  render() {
    return <div ref="map" style={{marginTop: 10, marginBottom: 10, height: 300}}/>;
  },
});

export default Map;
