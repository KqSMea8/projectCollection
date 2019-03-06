import React from 'react';
import { Modal } from 'antd';
import CityShopList from '../CityShopList';
import { itemLabelMap, ageRangeMap2 } from '../../config/GroupItem';
import ajax from '../../../../common/ajax';

class GroupViewBasic extends React.Component {
  static propTypes = {
    gender: React.PropTypes.number,
    age: React.PropTypes.array,
    birthdayMonth: React.PropTypes.array,
    constellation: React.PropTypes.array,
    haveBaby: React.PropTypes.number,
    occupation: React.PropTypes.array,
    consumeLevel: React.PropTypes.string,
    residentPlace: React.PropTypes.array,
    nativePlace: React.PropTypes.array,
    applyVoucher: React.PropTypes.string,
    verifyVoucher: React.PropTypes.string,
    firstLinkDate: React.PropTypes.string,
  };

  state = {
    residentCities: [],
    nativeCities: [],
    visible: false,
    modalType: '',
  };

  componentWillMount() {
    const { residentPlace, nativePlace } = this.props;
    if (residentPlace) {
      ajax({
        url: '/getCityListByCode.json',
        method: 'GET',
        data: { cityCode: residentPlace.join(','), level: 'P' },
        type: 'json',
        success: response => {
          const residentCities = response.citys.map(({ n, i, c }) => ({
            primary: n,
            second: c.map(({ n: n2 }) => n2).join('，'),
            key: i,
          }));
          this.setState({ residentCities });
        },
      });
    }
    if (nativePlace) {
      ajax({
        url: '/getCityListByCode.json',
        method: 'GET',
        data: { cityCode: nativePlace.join(','), level: 'P' },
        type: 'json',
        success: response => {
          const nativeCities = response.citys.map(({ n, i, c }) => ({
            primary: n,
            second: c.map(({ n: n2 }) => n2).join('，'),
            key: i,
          }));
          this.setState({ nativeCities });
        },
      });
    }
  }

  /*eslint-disable */
  valueMap(key, all) {
    const value = all[key];
    if (value === undefined) {
      return '不限制';
    }
    let newValue = value;
    if (key === 'gender') {
      newValue = value === 1 ? '男' : '女';
    }
    if (key === 'age') {
      value.sort((prev, next) => prev - next);
      const min = value[0];
      const max = value[value.length - 1];
      const age = [ageRangeMap2[min][0], ageRangeMap2[max][1]];
      if (age[0] === 1) {
        newValue = `${age[1]}岁以下`;
      } else if (age[1] === 100) {
        newValue = `${age[0]}岁以上`;
      } else {
        newValue = `${age[0]}岁~${age[1]}岁`;
      }
    }
    if (key === 'birthdayMonth') {
      newValue = value.map(v => `${v}月`).join('、');
    }
    if (key === 'constellation') {
      newValue = value.join('、');
    }
    if (key === 'haveBaby') {
      newValue = value === 0 ? '否' : '是';
    }
    if (key === 'occupation') {
      newValue = value.join('、');
    }
    if (key === 'consumeLevel') {
      newValue = `${value}档`;
    }
    if (key === 'firstLinkDate') {
      if (value.split(',')[0] && value.split(',')[1]) {
        const linkDate = value.split(',')[1].replace(/(\d{4})(\d{2})(\d{2})/, '$1 年 $2 月 $3 日');
        newValue = (value.split(',')[0] === 'LT' ? '早于 ' : '晚于 ') + linkDate;
      } else {
        newValue = '不限制';
      }
    }
    if (key === 'residentPlace') {
      newValue = (
        <span>
          <span>{`${value.length} 个城市`}</span>
          <a onClick={() => this.setState({
            visible: true,
            modalType: 'resident',
          })}>查看</a>
        </span>
      );
    }
    if (key === 'nativePlace') {
      newValue = (
        <span>
          <span>{`${value.length} 个城市`}</span>
          <a onClick={() => this.setState({
            visible: true,
            modalType: 'native',
          })}>查看</a>
        </span>
      );
    }
    if (key === 'applyVoucher') {
      newValue = (
        <span>
          {!all.verifyVoucher && '已领券'}
          {all.verifyVoucher === 'LTEQ' && '已领券未使用券'}
          {all.verifyVoucher === 'GT' && '已领券已使用券'}
        </span>
      );
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
          <span>{this.valueMap(key, this.props)}</span>
        </div>
      );
    });
    const { visible, modalType, residentCities, nativeCities } = this.state;
    const modalProps = {
      visible,
      title: modalType === 'resident' ? '常住地' : '籍贯',
      onCancel: () => this.setState({ visible: false }),
      children: modalType === 'resident' ? <CityShopList list={residentCities} /> :
        <CityShopList list={nativeCities} />,
      footer: null,
    };
    return (
      <groups-view-basic>
        <div><span>基本特征</span></div>
        <div>{items}</div>
        <Modal { ...modalProps } />
      </groups-view-basic>
    );
  }
}

export default GroupViewBasic;
