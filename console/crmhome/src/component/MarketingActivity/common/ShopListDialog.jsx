import React, {PropTypes} from 'react';
import {Modal} from 'antd';

const ShopListDialog = React.createClass({

  propTypes: {
    shopList: PropTypes.array,
    onCancel: PropTypes.func,
  },

  getInitialState() {
    return {};
  },

  render() {
    const {shopList} = this.props;
    const shopListInfo = [];
    if (shopList) {
      shopList.forEach((item) => {
        shopListInfo.push(
          <div>
            <p style={{color: '#333', marginBottom: '10px', marginLeft: '-5px'}}>{'【' + item.cityName + '】'}</p>
            <p style={{marginBottom: '20px', color: '#666'}}>
              {
                (item.shops || []).map((p, index) => {
                  return (index + 1) !== item.shops.length ? p.name + '，' : p.name;
                })
              }
            </p>
          </div>
        );
      });
    }
    return (<Modal visible title="活动门店" onCancel={this.props.onCancel} footer="" width={600} bodyStyle={{height: 300, overflow: 'auto'}}>
      {shopListInfo}
    </Modal>);
  },
});

export default ShopListDialog;
