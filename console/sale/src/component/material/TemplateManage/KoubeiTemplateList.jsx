import React from 'react';
import KoubeiTemplateForm from './KoubeiTemplateForm';
import KoubeiTemplateTable from './KoubeiTemplateTable';

const KoubeiTemplateList = React.createClass({
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
        <KoubeiTemplateForm onSearch={this.onSearch}/>
        <KoubeiTemplateTable params={this.state.params}/>
      </div>
    </div>
    );
  },
});
export default KoubeiTemplateList;
