import React from 'react';
import AreaCard from './AreaCard';
import CityAreaMultiSelect from './CityAreaMultiSelect';
import { Alert, Pagination, message, Cascader, Icon, Spin, Button } from 'antd';
import ajax from 'Utility/ajax';
import Constants from '../common/constants';
import queryAreas from '../common/queryAreas';

let params = {
  pageSize: 12,
  pageNum: 1,
  city: '',
};

const CityAreaList = React.createClass({
  getInitialState() {
    return {
      cities: [],
      areas: [],
      current: 1,
      loading: true,
      filterAreaIds: [],
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
      });
      this.fetchAreas();
    });
    this.onMessage = (e) => {
      const type = e && e.data && e.data.type;
      if (type && type === Constants.TerritoryChanged) {
        this.fetchAreas();
      }
    };
    window.addEventListener('message', this.onMessage);
  },

  componentWillUnmount() {
    params = {
      pageSize: 12,
      pageNum: 1,
      city: '',
    };
    window.removeEventListener('message', this.onMessage);
  },

  onCityChange(city, items) {
    // 城市变化，恢复成第一页数据
    params.pageNum = 1;
    this.setState({
      current: 1,
      cityName: items[1].label,
      filterAreaIds: [],
    });
    params.city = city;
    this.fetchAreas();
  },

  onPageChange(current) {
    this.setState({
      current,
    });
    params.pageNum = current;
    // this.fetchAreas();
  },

  onShowSizeChange(current, pageSize) {
    params.pageNum = 1;
    params.pageSize = pageSize;
    this.setState({
      current: 1,
    });
    // this.fetchAreas();
  },

  onAlertClose() {
    localStorage.setItem('cityAreaClose', 1);
  },
  onFilterArea(areaIds) {
    this.setState({
      filterAreaIds: areaIds,
    });
    if (areaIds.length === 0 || this.state.filterAreaIds.length === 0) {
      this.onPageChange(1);
    }
  },
  getFilteredAreas() {
    const {filterAreaIds} = this.state;
    let {current, areas} = this.state;
    const pageSize = params.pageSize;
    if (filterAreaIds && filterAreaIds.length > 0) {
      areas = areas.filter(area => filterAreaIds.indexOf(area.territoryId) !== -1);
    }
    const totalSize = areas.length;
    while ((current - 1) * pageSize >= totalSize) {
      current--;
    }
    return areas.slice((current - 1) * pageSize, current * pageSize);
  },
  getFilteredAreasTotal() {
    const {filterAreaIds, areas} = this.state;
    if (filterAreaIds && filterAreaIds.length > 0) {
      return filterAreaIds.length;
    }
    return areas.length;
  },
  fetchCities(callback) {
    queryAreas({
      success: (cityRes) => {
        if (!cityRes) {
          return;
        }
        if (cityRes.status && cityRes.status === 'succeed') {
          callback(cityRes.data);
        } else {
          this.setState({loading: false});
          if (cityRes.errorMsg) {
            message.error(cityRes.errorMsg, 3);
          }
        }
      },
      error: (res) => {
        message.error((res && res.resultMsg) || '请求异常', 3);
      },
    });
  },

  fetchAreas() {
    this.setState({loading: true});
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/queryTerritorys.json`,
      method: 'get',
      data: {
        cityCode: params.city[1],
        // pageNum: params.pageNum,
        // pageSize: params.pageSize,
        pageNum: 1,
        pageSize: 2000,
      },
      type: 'json',
      success: (res) => {
        this.setState({loading: false});
        if (!res) {
          return;
        }
        if (res.status && res.status === 'succeed') {
          const territorys = res.data.territorys;

          let {filterAreaIds} = this.state;
          if (filterAreaIds && filterAreaIds.length > 0) {
            filterAreaIds = territorys.filter(area => filterAreaIds.indexOf(area.territoryId) !== -1).map(area => area.territoryId);
          }
          this.setState({
            areas: territorys,
            filterAreaIds,
          });
        } else {
          if (res.errorMsg) {
            message.error(res.errorMsg, 3);
          }
        }
      },
      error: ({resultMsg}) => {
        if (resultMsg) {
          this.setState({ loading: false });
          message.error(resultMsg);
        }
      },
    });
  },

  clear(id) {
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/clear.json`,
      method: 'post',
      data: {
        territoryId: id,
      },
      type: 'json',
      success: (res) => {
        if (!res) {
          return;
        }
        if (res.status && res.status === 'succeed') {
          this.fetchAreas();
        } else {
          if (res.errorMsg) {
            message.error(res.errorMsg, 3);
          }
        }
      },
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

  clickAdd() {
    window.open(`#/cityarea/manager/add?cityCode=${params.city[1]}`);
  },

  render() {
    const { areas, cities, current, cityName, loading, filterAreaIds } = this.state;
    const { pageSize } = params;
    const cityAreaClose = localStorage.getItem('cityAreaClose');

    return (
      <div>
        <div style={{marginBottom: '10px'}}>
          城市：<Cascader style={{width: 220}} value={params.city} options={cities} onChange={this.onCityChange} placeholder="正在加载..." disabled={!cities || cities.length === 0} />
          <span style={{width: 20, display: 'inline-block'}} />
          网格名称：<CityAreaMultiSelect loading={loading} value={filterAreaIds} onChange={this.onFilterArea} data={areas} />
          <Button style={{float: 'right'}} type="primary" onClick={this.clickAdd}>新建网格</Button>
        </div>
        {
          !cityAreaClose ?
            <Alert message={<div style={{display: 'inline-block', verticalAlign: 'top'}}>每个网格区包含多个门店和leads，通过地图点圈或上传表格方式进行初始化，城市端可以针对每个网格区的门店进行分配及管理。</div>} type="info" showIcon closable
              onClose={this.onAlertClose} />
            :
            null
        }

        {
          loading ? <Spin />
          :
          <div>
            {
              this.getFilteredAreasTotal() > 0 &&
                [
                  <div key="a" className="area-card-list">
                    { this.getFilteredAreas().map(item => <AreaCard
                      data={{...item, cityCode: params.city[1], cityName: cityName}}
                      clear={this.clear}
                      key={item.territoryId}
                      doReloadList={() => this.fetchAreas()}
                    />) }
                  </div>,
                  <div key="b" style={{ marginTop: '10px' }} className="clearfix">
                    <Pagination className="pull-right" showSizeChanger showQuickJumper
                      onChange={this.onPageChange} onShowSizeChange={this.onShowSizeChange}
                      pageSizeOptions={['12', '24', '36', '48']}
                      defaultCurrent={1} current={current} pageSize={pageSize} total={this.getFilteredAreasTotal()} />
                  </div>,
                ]
            }
            {
              this.getFilteredAreasTotal() <= 0 &&
              <div style={{textAlign: 'center'}}>
                <Icon type="frown" /> 暂无数据
              </div>
            }
          </div>
        }
      </div>
    );
  },
});

export default CityAreaList;
