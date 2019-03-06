import React, {PropTypes} from 'react';
import BacklogShopListForm from './BacklogShopListForm';
import BacklogShopListTable from './BacklogShopListTable';

const BacklogShopList = React.createClass({
  propTypes: {
    isService: PropTypes.bool,
    setParams: PropTypes.func,
  },

  getInitialState() {
    return {};
  },

  onSearch(params) {
    if (this.props.setParams) {
      this.props.setParams(params);
    }
    this.setState({
      params,
    });
  },

  render() {
    return (
      <div>
        <BacklogShopListForm onSearch={this.onSearch} isService={this.props.isService}/>
        <BacklogShopListTable params={this.state.params} isService={this.props.isService}/>
      </div>
    );
  },
});

export default BacklogShopList;
