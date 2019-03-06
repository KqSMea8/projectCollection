import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import {SearchInput} from 'hermes-react';
import {Button, Modal, Tree, message, Spin} from 'antd';

const TreeNode = Tree.TreeNode;

const SelectShop = React.createClass({
  propTypes: {
    mallId: PropTypes.string,
    visibleType: PropTypes.func,
    buildingId: PropTypes.string,
    shopDate: PropTypes.object,
    edit: PropTypes.bool,
    map: PropTypes.object,
    params: PropTypes.object,
    addMarker: PropTypes.func,
  },
  getInitialState() {
    return {
      visible: false,
      locatedShop: [],
      unlocatedShop: [],
      shopList: [],
      categoryId: '',
      loading: true,
      shopCount: '',
    };
  },
  componentDidMount() {
    this.getMallCategoryShop();
  },

  componentDidUpdate() {
    const updateKey = localStorage.getItem('update');
    if (updateKey === 'true') {
      this.getMallCategoryShop();
    }
  },

  onCheck(e, bool) {
    let shopList = e;
    if (bool && (bool.halfCheckedKeys[0] === '0-0' || bool.halfCheckedKeys[0] === '0-1') && e.length <= 3) {
      if (bool.checkedNodes.length < 3) {
        shopList = [];
        shopList.push(e[0]);
      }
    } else if (bool && bool.checkedNodes[2] && (bool.checkedNodes[2].key === '0-1' || bool.checkedNodes[2].key === '0-0') && e.length <= 3) {
      shopList = [];
      shopList.push(e[0]);
    }
    this.setState({
      shopList: shopList,
      shopName: bool.checkedNodes[0] ? bool.checkedNodes[0].props.title : '',
      categoryId: bool.checkedNodes[0] ? bool.checkedNodes[0].props.categoryId : '',
    });
  },

  getMallCategoryShop() {
    const self = this;
    const mallId = self.props.mallId;
    ajax({
      url: window.APP.kbretailprod + '/gaodeMap.json?action=/mallCategoryShop/query&data=' + JSON.stringify({'mallId': mallId}),
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.success === true) {
          if (res.shopInfo) {
            self.setState({
              locatedShop: res.shopInfo.LOCATED_SHOP,
              unlocatedShop: res.shopInfo.UNLOCATED_SHOP,
              loading: false,
              shopCount: res.shopCount,
            });
            localStorage.setItem('update', 'false');
          }
        } else {
          if (res.errorMsg) {
            message.error(res.errorMsg);
          }
        }
      },
    });
  },

  handleOk() {
    const self = this;
    const { shopList, shopName, categoryId} = this.state;
    const { shopDate, buildingId, mallId, edit, map, switchBool} = this.props;
    if ( shopList.length !== 1) {
      message.error('只能选择一个门店');
      return;
    }
    const floorNona = map.getFloorNona(shopDate.floor || shopDate.data[0].floor);
    let url = '/gaodeMap.json?action=/shopRelation/create';
    if (edit) {
      url = '/gaodeMap.json?action=/shopRelation/update';
    }
    let versionBool = true;
    const buildingIdKey = localStorage.getItem('buildingId');
    if (switchBool) {
      ajax({
        url: 'https://indoorreaper.amap.com/api/getapplystatus/?poiid=' + (buildingIdKey || buildingId) + '&key=1c8441e2d9e4fe2ba6fbbeefc0c0179f',
        method: 'get',
        type: 'jsonp',
        success: (resl) => {
          if (resl.status === '0' || resl.status === '1' || resl.status === '3') {
            versionBool = true;
          } else {
            versionBool = false;
          }
          if (!versionBool) {
            message.error('地图更新中，暂时无法编辑，请稍后再试。');
          } else {
            self.setState({
              loading: true,
            });
            self.props.map.EditService.updateShop({'ft_name_cn': shopName, 'ft_sourceid': shopDate.ft_sourceid || shopDate.data[0].ft_sourceid, 'ft_typecode': categoryId, ft_isnew: true}, function fn(e) {
              if (e.msg === 'SUCCESS' ) {
                const data = {
                  floor: floorNona,
                  areaId: e.ft_sourceid,
                  oldAreaId: shopDate.ft_sourceid || shopDate.data[0].ft_sourceid,
                  buildingId: buildingId,
                  shopId: shopList[0],
                  mallId: mallId,
                };
                ajax({
                  url: window.APP.kbretailprod + url,
                  method: 'get',
                  type: 'json',
                  data: {
                    data: JSON.stringify(data),
                  },
                  success: (res) => {
                    if (res.success === true) {
                      message.success(edit ? '修改成功' : '配置成功');
                      setTimeout(()=> {
                        self.nameSearch();
                        self.props.map.reload();
                      }, 1000);
                    } else {
                      message.error( edit ? '修改失败' : '配置失败');
                      self.props.addMarker(shopDate.centroid, shopName, shopDate.ft_sourceid, 'error', res && res.errorMsg || '更新失败');
                    }
                  },
                });
              } else {
                message.error( edit ? '修改失败' : '配置失败');
                self.props.addMarker(shopDate.centroid, shopName, shopDate.ft_sourceid, 'error', e && e.errorMsg || '更新失败');
              }
            });
          }
        },
      });
    } else {
      const data = {
        floor: floorNona,
        areaId: shopDate.ft_sourceid,
        oldAreaId: shopDate.ft_sourceid || shopDate.data[0].ft_sourceid,
        buildingId: buildingId,
        shopId: shopList[0],
        mallId: mallId,
      };
      ajax({
        url: window.APP.kbretailprod + url,
        method: 'get',
        type: 'json',
        data: {
          data: JSON.stringify(data),
        },
        success: (res) => {
          if (res.success === true) {
            message.success(edit ? '修改成功' : '配置成功');
            setTimeout(()=> {
              self.nameSearch();
              self.props.map.reload();
            }, 1000);
          } else {
            message.error( edit ? '修改失败' : '配置失败');
            self.props.addMarker(shopDate.centroid, shopName, shopDate.ft_sourceid, 'error', res && res.errorMsg || '更新失败');
          }
        },
      });
    }
    this.setState({
      visible: false,
    });
    this.props.visibleType();
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
    this.props.visibleType();
  },

  showModal() {
    this.setState({
      visible: true,
    });
  },

  nameSearch(v) {
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.kbretailprod + '/gaodeMap.json?action=/mallCategoryShop/query',
      method: 'get',
      type: 'json',
      data: {
        data: JSON.stringify({'mallId': this.props.mallId, 'query': v}),
      },
      withCredentials: true,
      success: (res) => {
        if (res.success === true) {
          if (res.shopInfo) {
            this.setState({
              locatedShop: res.shopInfo.LOCATED_SHOP,
              unlocatedShop: res.shopInfo.UNLOCATED_SHOP,
              shopCount: res.shopCount,
              loading: false,
            });
          }
        } else {
          if (res.errorMsg) {
            message.error(res.errorMsg);
          }
        }
      },
    });
  },

  generateData(e, type) {
    const loop = e.map((item)=>{
      if (item.shopList.length && item.shopList) {
        return (<TreeNode key={type + item.categoryId} title={item.categoryName} >{
          (item.shopList).map((eShop) => {
            return <TreeNode key={eShop.shopId} title={eShop.shopName} categoryId={eShop.gaodeCategoryId}/>;
          })
        }</TreeNode>);
      }
      return (<TreeNode key={type + item.categoryId} title={item.categoryName}/>);
    });
    return loop;
  },

  render() {
    const {locatedShop, unlocatedShop, loading, shopCount} = this.state;
    const edit = this.props.edit;
    return (<span>
        <Button type="default" onClick={this.showModal}>{edit ? '修改其他门店' : '配置其他门店'}</Button>
        <Modal title={edit ? '修改门店' : '配置门店'}
          visible={this.state.visible}
          width={400}
          footer={<div>
            <Button onClick={this.handleCancel} type="ghost">取消</Button>
            <Button onClick={this.handleOk} type="primary">确定</Button>
          </div>}
          onCancel={this.handleCancel}
          className="shopModal"
          >
            <div className="node-container">
              <div className="header">
                <span style={{verticalAlign: '16px'}}>
                  <span>所有门店</span>
                  <span>({shopCount})</span>
                </span>
              </div>
              <div className="certain-category-search-wrapper" >
                <SearchInput placeholder="请输入门店" onSearch={this.nameSearch} style={{width: 335, marginLeft: 15, marginTop: 10}} />
              </div>
              <div style={{overflow: 'auto', height: '363px'}}>
                { loading ? <div style={{textAlign: 'center', lineHeight: '300px'}}><Spin /></div> :
                <Tree
                  checkable
                  onCheck={this.onCheck}
                >
                  <TreeNode title="已定位门店" key="0-0">
                    {this.generateData(locatedShop, 'located')}
                  </TreeNode>
                  <TreeNode title="未定位门店" key="0-1">
                    {this.generateData(unlocatedShop, 'unlocated')}
                  </TreeNode>
                </Tree>
              }
              </div>
            </div>
        </Modal>
      </span>);
  },
});

export default SelectShop;
