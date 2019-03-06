import React, {PropTypes} from 'react';
// import {Breadcrumb} from 'antd';
// import ActivityTable from './ActivityTable';
import ValidationSKUTable from './ValidationSKUTable';
import ValidationSKUForm from './ValidationSKUForm';
// const BreadcrumbItem = Breadcrumb.Item;

const ValidationSKU = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      params: '',
    };
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  render() {
    // const {name} = this.props.params;

    return (
      <div className="kb-manage">
        <h2 className="kb-page-title" style={{border: 'none'}}>活动管理</h2>
        <div style={{ margin: 20 }}>
          <p style={{ margin: '20px 2px' }}><a href="goods/itempromo/activityList.htm">活动管理</a> / 活动SKU验证</p>
          <ValidationSKUForm onSearch={this.onSearch}/>
          <ValidationSKUTable params={this.state.params}/>
        </div>
      </div>
    );
  },
});

export default ValidationSKU;
