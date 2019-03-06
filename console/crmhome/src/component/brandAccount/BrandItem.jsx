import React, { PropTypes } from 'react';
import { getImageById } from '../../common/utils';
import './BrandItem.less';

class BrandItem extends React.Component {
  static propTypes = {
    itemDate: PropTypes.object,
  };
  state = {
  };

  onClickEdit(e) {
    e.stopPropagation();
    this.props.history.push({
      pathname: `/brand-account/edit`,
      state: this.props.itemDate,
    });
  }

  render() {
    const { shopName, shopDesc, logo, shopId, brandId } = this.props.itemDate;
    return (
      <div className="brand-item" onClick={() => location.href = `#/brand-account/detail/${shopId}/${brandId}`}>
        <div className="item-img">
          <img src={logo && getImageById(logo)} />
        </div>
        <span className="brand-name">{shopName}</span>
        <div className="brand-describe">{shopDesc}
        </div>
        <a>查看</a>
        <span style={{ margin: '0 6px', color: '#999' }}>|</span>
        <a onClick={e => this.onClickEdit(e)}>修改</a>
      </div>
    );
  }
}

export default BrandItem;
