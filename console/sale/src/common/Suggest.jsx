import {Select} from 'antd';
import React, {PropTypes} from 'react';
const Option = Select.Option;
import ajax from 'Utility/ajax';
import debounce from 'lodash.debounce';

function fetchData(v) {
  ajax({
    url: this.props.url,
    data: {v, ...this.props.params},
    success: (data)=> {
      this.setState({data: data.data});
    },
  });
}

const Suggest = React.createClass({
  propTypes: {
    url: PropTypes.string,
    params: PropTypes.object,
  },

  getInitialState() {
    this.fetchData = debounce(fetchData.bind(this), 500);
    return {
      data: [],
    };
  },

  render() {
    const data = this.state.data;
    const sOptions = data.map((d) => {
      return <Option key={d}>{d}</Option>;
    });
    return (<Select combobox
            onChange={this.fetchData}
            defaultActiveFirstOption={false}
            notFoundContent=""
            filterOption={false}>
      {sOptions}
    </Select>);
  },
});

export default Suggest;
