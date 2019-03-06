import React from 'react';
import { Cascader, message } from 'antd';
import queryAreas from '../common/queryAreas';

export default class extends React.Component {
  static propTypes = {
    cityCode: React.PropTypes.string,
    value: React.PropTypes.array,
    defaultValue: React.PropTypes.array,
    onChange: React.PropTypes.func,
  };

  state = {};

  componentDidMount() {
    this.fetchCities();
  }

  fetchCities() {
    queryAreas({
      success: (cityRes) => {
        if (cityRes && cityRes.status && cityRes.status === 'succeed') {
          const formatedCity = this.formatCities(cityRes.data);
          this.setState({
            cities: formatedCity,
          }, () => {
            this.checkChooseCityCode();
          });
        } else {
          message.error(cityRes && cityRes.errorMsg || '请求失败', 3);
        }
      },
      error: (res) => {
        message.error((res && res.resultMsg) || '请求异常', 3);
      },
    });
  }

  checkChooseCityCode() {
    for (const province of this.state.cities) {
      for (const city of province.children) {
        if (city.value === this.props.cityCode || !this.props.cityCode) {
          this.props.onChange([province.value, city.value]);
          return;
        }
      }
    }
  }

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
  }

  render() {
    const filterProps = {...this.props};
    delete filterProps.cityCode;
    return <Cascader options={this.state.cities} placeholder="正在加载..." disabled={!this.state.cities} {...filterProps} />;
  }
}
