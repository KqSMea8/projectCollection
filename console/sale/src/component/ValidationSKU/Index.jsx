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
    return (
      <div className="kb-manage">
        <p style={{padding: 15, fontSize: 16, fontWeight: 400, borderBottom: '1px solid #e4e4e4'}}><span>单品SKU验证</span></p>
        <div style={{ margin: 20 }}>
          <ValidationSKUForm onSearch={this.onSearch}/>
          <ValidationSKUTable params={this.state.params}/>
        </div>
      </div>
    );
  },
});

export default ValidationSKU;
