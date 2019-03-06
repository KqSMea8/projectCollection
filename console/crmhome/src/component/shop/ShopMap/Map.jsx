import React, {PropTypes} from 'react';
import {Button, Modal, message, Switch} from 'antd';
import ajax from '../../../common/ajax';
import EmptyShopModel from './EmptyShopModel';
import SelectShop from './SelectShop';
const Indoor = window.Indoor;

const Map = React.createClass({
  propTypes: {
    params: PropTypes.object,
    buildingId: PropTypes.string,
    onChange: PropTypes.func,
    mallId: PropTypes.string,
    versionBool: PropTypes.bool,
  },

  getInitialState() {
    return {
      sourceIdList: [],
      visibleType: false,
      visibleEmpty: false,
      updateBool: false,
      iCode: '',
      switchBool: true,
    };
  },

  componentDidMount() {
    this.initMap(this.props.buildingId);
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      window.location.reload();
    }
  },

  onClickApplyOnline() {
    this.map.EditService.applyOnline(function fn(e) {
      if (e.msg === 'SUCCESS') {
        message.success(<span>申请成功。<br/><span style={{marginLeft: '22px'}}>门店更新数据t+1日生效。</span></span>);
      } else {
        message.error('申请失败');
      }
    });
  },

  onChangeSwitch() {
    this.setState({
      switchBool: this.state.switchBool === false ? true : false,
    });
  },

  initMap(buildingId) {
    const self = this;
    const map = this.map = new Indoor.Map(self.refs.map, {
      key: '1c8441e2d9e4fe2ba6fbbeefc0c0179f',
      buildingId: buildingId || 'B00155MS14',
      searchBarControl: false,
      floorControl: true,
      zoom: 19,
      detailTipControl: false,
      highlightFeatrueClick: false,
      renderColors: {
        shopStyle: [
          // 商铺分类配色，根据ft_typecode的前2位
          { typeCode: '98,05,06,14,07,08,09,00,010', style: { 'fillColor': '#ddd', 'color': '#d1ccc0', 'fontColor': '#000' } },
        ],
      },
    });
    // 加载地图后执行
    map.on('mapready', function fn() {
      self.floor = map.getFloor();

      if (self.props.sourceId) {
        const shopData = map.getShopData(self.props.sourceId);
        self.addMarker(shopData.data[0].centroid, shopData.data[0].ft_name_cn);
      }

      self.floorShopQuery(self.props.buildingId, self.floor, self.map);

      const floorKey = localStorage.getItem('floor');
      const params = self.props.params;
      if ( params.buildingId && params.shopId && (Number(floorKey) !== Number(self.floor))) {
        ajax({
          url: window.APP.kbretailprod + '/gaodeMap.json?action=/shopRelation/query',
          method: 'get',
          type: 'json',
          data: {
            data: JSON.stringify({'shopId': params.shopId}),
          },
          withCredentials: true,
          success: (res) => {
            if (res.success === true) {
              const ShopData = self.shopDate = map.getShopData(res.shopMapRelationList[0].gaodeAreaId);
              localStorage.setItem('floor', ShopData.data[0].floor);
              map.setFloor(ShopData.data[0].floor);
              self.addMarker(ShopData.data[0].centroid, ShopData.data[0].ft_name_cn, ShopData.data[0].ft_sourceid, ShopData.data[0].ft_typecode);
            }
          },
        });
      }
      localStorage.removeItem('floor');
    });
    // 切换楼层触发事件
    map.on('floorchanged', function fn() {
      if (self.popup) {
        self.popup.remove();
      }
      if (self.floor !== map.getFloor() ) {
        self.floor = map.getFloor();
        self.floorShopQuery(self.props.buildingId, self.floor, map);
      }
    });
    // 点击门店触发事件
    map.on('shopclick', function fn(e) {
      console.log('shop', e);
      self.shopDate = e;
      const sourceIdList = self.state.sourceIdList;
      if (sourceIdList.length) {
        let bool = true;
        sourceIdList.map((item) => {
          if (item === e.ft_sourceid) {
            self.addMarker(e.centroid, e.ft_name_cn, e.ft_sourceid, e.ft_typecode);
            bool = false;
          }
        });
        if (bool) {
          self.addMarker(e.centroid, e.ft_name_cn, self.props.sourceId, e.ft_typecode);
        }
      } else {
        self.addMarker(e.centroid, e.ft_name_cn, self.props.sourceId, e.ft_typecode);
      }
    });
  },
  // 切换楼层查询匹配门店数据
  floorShopQuery(buildingId, floor, map) {
    const self = this;
    const floorNona = map.getFloorNona(floor);
    ajax({
      url: window.APP.kbretailprod + '/gaodeMap.json?action=/floorShop/query&data=' + JSON.stringify({'buildingId': buildingId, 'floor': floorNona}),
      method: 'get',
      type: 'json',
      success: (res) => {
        const sourceIdList = [];
        if (res.areaList) {
          (res.areaList).map((item) => {
            map.setShopStyle(item.areaId, {fillColor: '#0ae', 'color': '#d1ccc0', 'fontColor': '#000'});
            sourceIdList.push(item.areaId);
          });
          self.setState({
            sourceIdList: sourceIdList,
          });
        }
      },
    });
  },

  handleCancel() {
    this.setState({
      visibleType: false,
    });
  },

  // 新添加窗口信息
  addMarker(latlng, name, id, code, depict) {
    const self = this;
    let html = '<p style="margin-top: 0px">' + name + '</p><button id="type' + code + '" class="ant-btn"><span>配置</span></button>';
    if (id) {
      html = '<p style="margin-top: 0px">' + name + '</p><button id="type' + code + '" class="ant-btn" onClick=""><span>修改</span></button>';
    } else if ( code.substring(0, 3) === '000' || code.substring(0, 3) === '010' ) {
      html = '<p style="margin-top: 0px">' + name + '</p><span style="position: absolute;top: 9px;background: #666;padding: 4px 10px;color: #fff;right: 24px;">空店</span><button id="type' + code + '" class="ant-btn" onClick=""><span>配置</span></button>';
    }
    if (code === 'error') {
      html = '<p style="margin: 0px">未知门店</p><p style="font-size: 12px;color: #999;margin: 8px 0;">“' + name + '”' + depict + '</p><span style="position: absolute;top: 9px;background: #666;padding: 4px 10px;color: #fff;right: 24px;">空店</span><button id="type' + code + '" class="ant-btn" onClick=""><span>配置</span></button>';
    }
    let num = 150;
    if (name.length > 5) {
      num = 200;
    }
    self.popup = Indoor.popup({minWidth: num})
      .setLatLng(latlng)
      .setContent(html)
      .openOn(self.map);


    self.map.on('popupclose', function fn() {
      self.map.cancelClick();
    });

    const sId = 'type' + code;

    document.getElementById(sId).onclick = function fn() {
      self.setState({
        visibleType: true,
        updateBool: id ? true : false,
        iCode: code ? code.substring(0, 3) : '',
      });
    };
  },

  render() {
    return (<div>
      <div style={{position: 'relative'}}>
        <div ref="map" style={{height: 500}}/>

        <Modal title="选择类型" visible={this.state.visibleType} footer={null} onCancel={this.handleCancel} width={250}>
          <SelectShop {...this.props} visibleType={this.handleCancel} shopDate={this.shopDate} edit={this.state.updateBool} map={this.map} addMarker={this.addMarker} switchBool={this.state.switchBool}/>
          { (this.state.iCode === '000') ? null : <EmptyShopModel {...this.props} visibleType={this.handleCancel} map={this.map} shopDate={this.shopDate} edit={this.state.updateBool} switchBool={this.state.switchBool} /> }
        </Modal>
        <div className="locationBox" style={{position: 'absolute', left: '5px', bottom: '65px', border: '2px solid rgba(0,0,0,.2)', background: '#fff', height: '40px', lineHeight: '36px', zIndex: '999'}}>
            <i style={{width: '15px', height: '15px', background: '#0ae', position: 'absolute', left: '10px', top: '10px'}}></i><span style={{marginLeft: '30px'}}>已匹配的门店</span>
            <i style={{width: '15px', height: '15px', background: '#ddd', position: 'absolute', left: '125px', top: '10px'}}></i><span style={{marginLeft: '30px', marginRight: '10px'}}>未匹配的门店</span>
        </div>
    </div>
    <Button type="primary" disabled={this.state.switchBool ? false : true} size="large" style={{float: 'right', margin: '20px'}} onClick={this.onClickApplyOnline}>申请上线</Button>
    <Switch checked={this.state.switchBool} onChange={this.onChangeSwitch} style={{float: 'right', margin: '25px 0'}}/>
    </div>);
  },
});

export default Map;
