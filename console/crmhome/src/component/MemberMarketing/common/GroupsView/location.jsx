import React from 'react';
import { Modal } from 'antd';
import CityShopList from '../CityShopList';
import { itemLabelMap, activityTimeMap2 } from '../../config/GroupItem';
import ajax from '../../../../common/ajax';

class GroupViewLocation extends React.Component {
  static propTypes = {
    activityTime: React.PropTypes.array,
    activityLbs: React.PropTypes.array,
    activityScope: React.PropTypes.number,
    crowdGroupId: React.PropTypes.string.isRequired,
    activityType: React.PropTypes.oneOf(['city', 'shop', 'none']).isRequired,
  }

  state = { list: [], visible: false }

  componentWillMount() {
    const { activityLbs, activityType, crowdGroupId } = this.props;
    if (activityType === 'city') {
      ajax({
        url: '/getCityListByCode.json',
        method: 'GET',
        data: { cityCode: activityLbs.join(','), level: 'P' },
        type: 'json',
        success: response => {
          const list = response.citys.map(({ n, i, c }) => ({
            primary: n,
            second: c.map(({ n: n2 }) => n2).join('，'),
            key: i,
          }));
          this.setState({ list });
        },
      });
    } else if (activityType === 'shop') {
      ajax({
        url: '/promo/merchant/crowd/getShopsByIds.json',
        method: 'GET',
        data: { crowdGroupId, returnType: 1 },
        type: 'json',
        success: response => {
          const { data } = response;
          const list = Object.keys(data).map((city, i) => ({
            primary: city,
            second: data[city].map(({ name }) => name).join('，'),
            key: i,
          }));
          this.setState({ list });
        },
      });
    }
  }

  valueMap(key, value) {
    const { activityType } = this.props;
    if (value === undefined) {
      return '不限制';
    }
    let newValue = value;
    if (key === 'activityTime') {
      newValue = value.map(v => activityTimeMap2[v]).join('、');
    }
    if (key === 'activityLbs') {
      newValue = (
        <span>
          <span>{activityType === 'city' ? `${value.length} 个城市` : `${value.length} 家门店`}</span>
          <a onClick={() => this.setState({ visible: true })}>查看</a>
        </span>
      );
    }
    if (key === 'activityScope') {
      newValue = `附近${value / 1000}公里`;
    }
    return newValue;
  }

  render() {
    const keys = Object.keys(this.props).filter(key => itemLabelMap.hasOwnProperty(key));
    const lastLine = keys.length % 3 ? keys.length - keys.length % 3 : keys.length - 3;
    const items = keys.map((key, i) => {
      return (
        <div key={key} data-last-line={i >= lastLine}>
          <label>{itemLabelMap[key]}</label>
          <span>{this.valueMap(key, this.props[key])}</span>
        </div>
      );
    });
    const { visible, list } = this.state;
    const { activityType } = this.props;
    const modalProps = {
      visible,
      title: activityType === 'city' ? '参与城市' : '参与商家',
      onCancel: () => this.setState({ visible: false }),
      children: <CityShopList list={list} />,
      footer: null,
    };
    return (
      <groups-view-location>
        <div><span>地理位置</span></div>
        <div>{items}</div>
        <Modal { ...modalProps } />
      </groups-view-location>
    );
  }
}

export default GroupViewLocation;
