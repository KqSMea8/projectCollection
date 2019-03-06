import React, {PropTypes} from 'react';
import Map from './Map';
import ajax from '../../../common/ajax';
import InfoShopModal from './InfoShopModal';
import {Select, Spin, message} from 'antd';
import './shopMap.less';
const Option = Select.Option;

const ShopMap = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    return {
      buildingId: this.props.params.buildingId || '',
      mallId: '',
      loading: true,
    };
  },
  componentDidMount() {
    this.getMallId();
  },

  getMallId() {
    const self = this;
    ajax({
      url: window.APP.kbretailprod + '/gaodeMap.json?action=/mall/query&data={}',
      method: 'get',
      type: 'json',
      withCredentials: true,
      success: (res) => {
        if (res.success === true) {
          self.setState({
            mallId: res.shopList[0].shopId,
          });
          self.getBuildingIdList(res.shopList[0].shopId);
        } else {
          message.error(res.errorMsg || '系统繁忙，请稍候');
        }
      },
    });
  },

  getBuildingIdList(id) {
    const mallId = id;
    ajax({
      url: window.APP.kbretailprod + '/gaodeMap.json?action=/mallBuilding/query&data=' + JSON.stringify({'mallId': mallId}),
      method: 'get',
      type: 'json',
      withCredentials: true,
      success: (res) => {
        if (res.success === true) {
          this.setState({
            buildingIdList: res.buildingList,
            buildingId: this.props.params.buildingId || res.buildingList && res.buildingList[0].buildingId,
            loading: (this.props.params.buildingId || res.buildingList && res.buildingList[0].buildingId) ? false : true,
          });
        } else {
          message.error(res.errorMsg || '系统繁忙，请稍候');
        }
      },
    });
  },

  determineMall() {
    const {buildingId, mallId} = this.state;
    let txt = <div style={{margin: '10px 13px'}}>暂未开通室内定位功能。</div>;
    if (mallId && buildingId) {
      txt = <Spin />;
    }
    return txt;
  },

  handleChange(value) {
    const buildingIdKey = localStorage.getItem('buildingId');
    localStorage.setItem('buildingId', value);
    if (value !== (buildingIdKey || this.state.buildingId)) {
      location.reload();
    }
  },

  render() {
    const {buildingId, buildingIdList, mallId, loading} = this.state;
    const params = this.props.params;
    const buildingIdKey = localStorage.getItem('buildingId');
    const OptionList = [];
    if (buildingIdList) {
      buildingIdList.map((item) => {
        OptionList.push(<Option value={item.buildingId} key={item.buildingId} >{item.buildingName}</Option>);
      });
    }
    return (<div>
      <h2 className="kb-page-title" style={{position: 'relative'}}>室内定位
        { buildingIdList && <Select defaultValue={buildingIdKey || this.props.params.buildingId || buildingIdList[0].buildingName} onChange={this.handleChange} style={{marginLeft: '10px', width: 150 }} >
          {OptionList}
        </Select>}
        {mallId && <InfoShopModal mallId={mallId} />}
      </h2>

      { loading ? this.determineMall() : <Map buildingId={buildingIdKey || buildingId} params={params} mallId={mallId}/>}
    </div>);
  },
});

export default ShopMap;
