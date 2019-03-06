import './CityAreaManage.less';
import React from 'react';
import { Tree, message, Spin } from 'antd';
import ajax from 'Utility/ajax';
import CityAreaManageInit from './CityAreaManageInit';
import CityAreaManageAdd from './CityAreaManageAdd';
import CityAreaManageArea from './CityAreaManageArea';
import CityAreaManageCity from './CityAreaManageCity';
import queryAreas from '../common/queryAreas';
const TreeNode = Tree.TreeNode;


const CityAreaManage = React.createClass({
  getInitialState() {
    return {
      treeData: [], // 当前tree的data
      rightState: '', // 右边的状态
      pastState: '', // 右边的历史状态
      cityCode: '', // 城市code
      parentName: '', // 城市名称
      parentId: '', // 城市id
      defaultExpandedKeys: '', // 默认展开项
      defaultKey: [], // 当前选中项
      cityId: '', // 当前选中的id
      modifyData: {}, // 储存修改以后的数据
      loading: false,
      loadingDtail: true,
      title: '', // 当前城市名称
      areaSum: 0, // 网格数量
    };
  },

  componentDidMount() {
    this.fetchCity();
  },
  // 加载分区
  onLoadData(treeNode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const treeData = [...this.state.treeData];
        const params = {
          cityCode: treeNode.props.eventKey,
          pageNum: 1,
          pageSize: 1000,
        };
        ajax({
          url: window.APP.crmhomeUrl + '/shop/koubei/territory/queryTerritorys.json',
          method: 'get',
          data: params,
          type: 'json',
          success: (results) => {
            if (results.status && results.status === 'succeed') {
              this.getNewTreeData(treeData, treeNode.props.eventKey, this.handlerArea(results.data.territorys, treeNode.props.eventKey, treeNode.props.title));
              this.setState({ treeData });
            } else {
              message.error('分区查询失败，请稍候再试', 3);
            }
          },
          error: (result) =>{
            if (result.resultMsg) {
              message.error(result.resultMsg);
            }
          },
        });
        resolve();
      }, 300);
    });
  },
  // 选择城市或分区
  onSelect(info, obj) {
    if (info[0]) {
      this.setState({
        defaultKey: info,
        cityId: info[0],
        modifyData: {},
        title: obj.node.props.title,
        cityCode: obj.node.props.cityCode,
        parentName: obj.node.props.parentName,
      });
      if (obj.node.props.isLeaf) {
        this.getCityDetail(obj.node.props.cityCode, obj.node.props.isLeaf);
      } else {
        this.getCityDetail(info[0]);
      }
    }
  },
  // 设置默认值
  onDefaultKey(data, areaData) {
    if (data && data[0]) {
      if (areaData) {
        this.setState({
          defaultKey: [areaData.territoryId],
          cityId: areaData.territoryId,
          defaultExpandedKeys: [data[0].i],
          title: data[0].n,
          cityCode: data[0].i,
          loading: true,
        });
      } else {
        this.setState({
          defaultKey: [data[0].i],
          cityId: data[0].i,
          defaultExpandedKeys: [data[0].i],
          title: data[0].n,
          cityCode: data[0].cityCode,
          loading: true,
        });
      }
    }
  },
  // 取消——返回原来页面
  onCancel() {
    this.setState({
      rightState: this.state.pastState,
    });
  },
  // 设置新增或修改后的初始值
  setAddDefault(submitkey) {
    if (submitkey.delete) {
      this.setState({
        defaultKey: [submitkey.cityKey],
        cityId: submitkey.cityKey,
        defaultExpandedKeys: [submitkey.cityKey],
        cityCode: submitkey.cityKey,
        title: submitkey.parentName || submitkey.title,
        loading: true,
      });
    } else {
      this.setState({
        defaultKey: [submitkey.areaKey],
        cityId: submitkey.areaKey,
        defaultExpandedKeys: [submitkey.areaKey],
        cityCode: submitkey.cityKey,
        title: submitkey.parentName || submitkey.title,
        rightState: 'area',
        loading: true,
      });
    }
  },
  // 获取城市详情
  getCityDetail(cityId, isLeaf) {
    const params = {
      cityCode: cityId,
      pageNum: 1,
      pageSize: 1000,
    };
    this.setState({loadingDtail: false});
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/territory/queryTerritorys.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (results) => {
        if (results.status && results.status === 'succeed' && results.data) {
          if (isLeaf) {
            this.setState({
              rightState: 'area',
              parentId: results.data.territorys[0].parentId,
              loadingDtail: true,
            });
          } else if (results.data.pageInfo && results.data.pageInfo.items > 0) {
            this.setState({
              rightState: 'city',
              areaSum: results.data.pageInfo.items,
              parentId: results.data.territorys[0].parentId,
              loadingDtail: true,
            });
          } else {
            this.setState({
              rightState: 'init',
              parentId: '',
              loadingDtail: true,
            });
          }
        } else {
          message.error('分区查询失败，请稍候再试', 3);
        }
      },
      error: (result) =>{
        if (result.resultMsg) {
          message.error(result.resultMsg);
        }
      },
    });
  },
  // 加载城市分区
  getNewTreeData(treeData, curKey, child) {
    const loop = (data) => {
      data.forEach((item) => {
        if (curKey.indexOf(item.i) === 0) {
          if (item.children) {
            loop(item.children);
          } else {
            item.children = child;
          }
        }
      });
    };
    loop(treeData);
  },
  // 获得城市, 加载页面
  fetchCity(submitkey) {
    queryAreas({
      success: (results) => {
        if (!results) {
          return;
        }
        if (results.status && results.status === 'succeed') {
          if (results.data) {
            let cityData = [];
            results.data.map((item) => {
              if (item.c) {
                cityData = cityData.concat(item.c);
              }
            });
            this.fetchFirstCity(cityData, submitkey);
          }
        } else {
          if (results.errorMsg) {
            message.error(results.errorMsg, 3);
          }
        }
      },
      error: (result) =>{
        if (result.resultMsg) {
          message.error(result.resultMsg);
        }
      },
    });
  },
  // 第一次加载页面城市，并展开第一个城市的分区
  fetchFirstCity(city, submitkey) {
    const treeData = city;
    let parentName = city[0].n;
    let initialKey = city[0].i;
    let params = {
      cityCode: city[0].i,
      pageNum: 1,
      pageSize: 1000,
    };
    if (submitkey && submitkey.title) {
      this.setState({
        title: submitkey.title,
      });
      parentName = submitkey.title;
    }
    if (submitkey && submitkey.cityKey) {
      initialKey = submitkey.cityKey;
      params = {
        cityCode: submitkey.cityKey,
        pageNum: 1,
        pageSize: 1000,
      };
    }
    this.setState({loading: false});
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/territory/queryTerritorys.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (results) => {
        if (results.status && results.status === 'succeed') {
          if (results.data.pageInfo && results.data.pageInfo.items > 0) {
            if (submitkey && submitkey.delete) {
              this.setState({
                rightState: 'city',
                parentId: results.data.territorys[0].parentId,
                areaSum: results.data.pageInfo.items,
              });
            } else {
              this.setState({
                rightState: 'area',
                parentId: results.data.territorys[0].parentId,
              });
            }
          } else {
            this.setState({
              rightState: 'init',
              parentId: '',
            });
          }
          this.getNewTreeData(city, initialKey, this.handlerArea(results.data.territorys, initialKey, parentName));
          this.setState({
            treeData,
          });
          if (submitkey && submitkey.cityKey) {
            this.setAddDefault(submitkey);
          } else {
            if (results.data.pageInfo && results.data.pageInfo.items > 0) {
              this.onDefaultKey(city, results.data.territorys[0]);
            } else {
              this.onDefaultKey(city);
            }
          }
        } else {
          this.setState({
            treeData,
          });
          this.onDefaultKey(city);
          message.error('分区查询失败，请稍候再试', 3);
        }
      },
      error: (result) =>{
        this.setState({
          treeData,
        });
        this.onDefaultKey(city);
        if (result.resultMsg) {
          message.error(result.resultMsg);
        }
      },
    });
  },
  // 分区数据处理
  handlerArea(territorys, cityCode, parentName) {
    const areaArr = [];
    if (territorys) {
      territorys.map((item, i) => {
        areaArr[i] = item;
        areaArr[i].n = item.territoryName;
        areaArr[i].i = item.territoryId;
        areaArr[i].isLeaf = true;
        areaArr[i].cityCode = cityCode;
        areaArr[i].parentName = parentName;
      });
    }
    return areaArr;
  },
  // 新增、修改
  addCity(historicalStatus, modifyData) {
    this.setState({
      rightState: 'add',
      pastState: historicalStatus,
    });
    if (modifyData) {
      this.setState({
        modifyData,
      });
    } else {
      this.setState({
        modifyData: {},
      });
    }
  },
  render() {
    const {rightState, defaultKey, cityId, modifyData, defaultExpandedKeys,
      loading, loadingDtail, title, areaSum, cityCode, parentId, parentName} = this.state;
    const loop = data => data.map((item) => {
      if (item.children) {
        return <TreeNode title={item.n} key={item.i}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode title={item.n} key={item.i} isLeaf={item.isLeaf} cityCode={item.cityCode} parentName={item.parentName}/>;
    });
    const treeNodes = loop(this.state.treeData);

    return (
      <div className="main-panel">
        <div className="left-panel">
        {!loading && <Spin />}
        {loading &&
          <Tree className="increase-tree" onSelect={this.onSelect}
            loadData={this.onLoadData}
            defaultExpandedKeys={ defaultExpandedKeys}
            selectedKeys={defaultKey}>
            {treeNodes}
          </Tree>}
        </div>
        <div className="right-panel">
          {loadingDtail && rightState === 'init' && <CityAreaManageInit addCity={this.addCity}/>}
          {loadingDtail && rightState === 'area' && <CityAreaManageArea cityId={cityId} title={title}
          addCity={this.addCity} fetchCity={this.fetchCity} cityCode={cityCode} parentName={parentName}/>}
          {loadingDtail && rightState === 'city' && <CityAreaManageCity cityId={cityId} addCity={this.addCity}
          title={title} areaSum={areaSum} parentId={parentId}/>}
          {loadingDtail && rightState === 'add' && <CityAreaManageAdd cityId={cityId}
          title={title} onCancel={this.onCancel}
          modifyData={modifyData}fetchCity={this.fetchCity} cityCode={cityCode} parentId={parentId}/>}
        </div>
      </div>
    );
  },
});

export default CityAreaManage;
