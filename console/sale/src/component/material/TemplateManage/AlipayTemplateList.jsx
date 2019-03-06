import React from 'react';
import AlipayTemplateForm from './AlipayTemplateForm';
import AlipayTemplateTable from './AlipayTemplateTable';

const AlipayTemplateList = React.createClass({
  getInitialState() {
    return {};
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  render() {
    return (<div>
      <div className="app-detail-content-padding">
        <AlipayTemplateForm onSearch={this.onSearch}/>
        <AlipayTemplateTable params={this.state.params}/>
      </div>
    </div>
    );
  },
});
export default AlipayTemplateList;
