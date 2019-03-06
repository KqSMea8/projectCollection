import React, {PropTypes} from 'react';
import CityShopList from './CityShopList';


const CityShopIndex = React.createClass({
  propTypes: {
    children: PropTypes.any,
    params: PropTypes.object,
  },
  getInitialState() {
    return {};
  },

  render() {
    return (<div className="kb-detail-main">
      <div className="app-detail-header">城市门店
      </div>
      <CityShopList params={this.props.params}/>
      </div>);
  },
});

export default CityShopIndex;
