import React from 'react';
import {Button, message} from 'antd';
import ListForm from './ListForm';
import ListTable from './ListTable';
import ajax from '../../../common/ajax';

const ItemList = React.createClass({
  getInitialState() {
    return {
      params: {},
      brandList: [],
      cateList: [],
    };
  },

  componentDidMount() {
    this.initForm();
  },

  onSearch(params) {
    this.setState({
      params: params,
    });
  },

  initForm() {
    ajax({
      url: '/goods/ic/queryBrandsInfo.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            brandList: res.data,
          });
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (res) => {
        message.error(res.resultMsg);
      },
    });

    ajax({
      url: '/goods/ic/queryCatetoriesInfo.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            cateList: res.data,
          });
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (res) => {
        message.error(res.resultMsg);
      },
    });
  },

  clickHandler(type) {
    location.hash = '/item-management/' + type;
  },

  render() {
    const {brandList, cateList, params} = this.state;

    return (<div style={{position: 'relative'}}>
      <div className="app-detail-header">
        商品库
        <div style={{position: 'absolute', top: 17, right: 20}}>
          <Button type="ghost" size="large" style={{marginRight: 10}} onClick={this.clickHandler.bind(this, 'bulk-add')}>批量添加商品</Button>
          <Button type="primary" size="large" onClick={this.clickHandler.bind(this, 'add-item')}>添加商品</Button>
        </div>
      </div>

      <div className="app-detail-content-padding">
        <ListForm
          onSearch={this.onSearch}
          brandList={brandList}
          cateList={cateList}
        />
        <ListTable
          params={params}
          brandList={brandList}
        />
      </div>
    </div>);
  },
});

export default ItemList;
