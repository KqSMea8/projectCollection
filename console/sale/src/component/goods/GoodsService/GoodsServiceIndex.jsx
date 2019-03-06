import React from 'react';
import CRMTpl from '../../../common/CRMTpl';
import { message } from 'antd';

const GoodsServiceIndex = React.createClass({
  componentDidMount() {
    // 为了更友善的提示，给iframe里面暴露 message 方法
    // 莫名的bug，直接输出message会报错
    window.antd = {
      message: {
        error: message.error,
        success: message.success,
      },
    };
  },

  render() {
    const params = {
      title: '商品服务',
      // url: window.APP.crmhomeUrl + '/goods/itempromo/recruitItemQueryInit.htm.kb',
      url: window.APP.crmhomeUrl + '/main.htm.kb',
      hash: '#stuff/order',
    };

    return (
      <CRMTpl params={params}/>
    );
  },
});

export default GoodsServiceIndex;
