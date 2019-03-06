import React from 'react';
import CRMTpl from '../../../common/CRMTpl';

export default class CateringList extends React.Component {
  render() {
    const params = {
      title: '商品管理',
      url: window.APP.crmhomeUrl + '/main.htm.kb',
      hash: '#/catering/list'
    };
    return (
      <CRMTpl params={params}/>
    );
  }
}
