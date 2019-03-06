import React from 'react';
import './style.less';

const CityShopList = props => {
  const { list } = props;
  const items = list.map(({ primary, second, key }) => (
    <dl key={key}>
      <dt>{`【${primary}】`}</dt>
      <dd>{second}</dd>
    </dl>
  ));
  return <city-shop-list>{items}</city-shop-list>;
};

CityShopList.propTypes = {
  list: React.PropTypes.array.isRequired,
};

export default CityShopList;
