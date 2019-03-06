import React, {PropTypes} from 'react';
const Indoor = window.Indoor;
import ajax from '../../../common/ajax';

const MapModel = React.createClass({
  propTypes: {
    sourceId: PropTypes.string,
    data: PropTypes.array,
    buildingIdList: PropTypes.array,
    onChange: PropTypes.func,
    mallId: PropTypes.string,
  },

  getInitialState() {
    return {
      sourceIdList: [],
      visibleType: false,
      visibleEmpty: false,
    };
  },

  componentDidMount() {
    this.initMap();
  },

  componentDidUpdate(prevProps) {
    const self = this;
    if (this.props.data !== prevProps.data) {
      self.marker.remove();
      self.addMarker(self.props.data, self.map);
    }
  },

  initMap() {
    const self = this;
    const map = self.map = new Indoor.Map(self.refs.map, {
      key: '1c8441e2d9e4fe2ba6fbbeefc0c0179f',
      buildingId: self.props.data[0].gaodeBuildId,
      searchBarControl: false,
      floorControl: true,
      zoom: 18,
      detailTipControl: false,
      highlightFeatrueClick: false,
    });

    map.once('mapready', function fn() {
      if (self.props.data) {
        self.addMarker(self.props.data, map);
      }
    });
  },

  addMarker(data, map) {
    const self = this;
    ajax({
      url: window.APP.kbretailprod + '/gaodeMap.json?action=/shopRelation/query',
      method: 'get',
      data: { 'data': JSON.stringify({shopId: data[0].shopId}) },
      type: 'json',
      withCredentials: true,
      success: (res) => {
        if (res.shopMapRelationList) {
          const ShopData = map.getShopData(data[0].gaodeAreaId);
          map.setFloor(ShopData.data[0].floor);
          self.marker = Indoor.marker(ShopData.data[0].centroid).addTo(map);
        }
      },
    });
  },

  showEmptyShop() {
    this.setState({
      visibleEmpty: true,
      visibleType: false,
    });
  },

  hideEmptyShop(bool) {
    this.setState({
      visibleEmpty: bool,
    });
  },

  handleCancel() {
    this.setState({
      visibleType: false,
    });
  },

  render() {
    return (<div style={{margin: '-15px'}}>
      <div ref="map" style={{height: 500, position: 'relative'}}/>
    </div>);
  },
});

export default MapModel;
