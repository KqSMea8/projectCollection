import {Cascader, Input} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import debounce from 'lodash.debounce';

// https://github.com/react-component/cascader/issues/4

function search(value, mode) {
  if (value === undefined) return;
  ajax({
    url: this.props.url,
    data: {
      [this.props.fieldName]: value,
      ...this.props.params,
    },
    success: (data)=> {
      if (mode === 'alwaysUpdate') {
        this.setState({data: this.props.transform(data.data)});
        return;
      }
      if (data && data.data && data.data.length) {
        this.setState({data: this.props.transform(data.data)});
      }
    },
  });
}

const CascaderSuggest = React.createClass({
  propTypes: {
    url: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    form: PropTypes.object,
    params: PropTypes.object,
    onChange: PropTypes.func,
    onInputChange: PropTypes.func,
    transform: PropTypes.func,
    style: PropTypes.object,
    mode: PropTypes.string,
  },

  getDefaultProps() {
    return {
      mode: 'alwaysUpdate',
    };
  },

  getInitialState() {
    this.search = debounce(search.bind(this), 500);
    return {
      data: [],
    };
  },

  onInputChange(e) {
    this.props.onInputChange(e);
    this.search(e.target.value, this.props.mode);
  },

  onInputClick(e) {
    this.search(e.target.value, this.props.mode);
  },

  render() {
    const {getFieldProps} = this.props.form;
    const data = this.state.data;
    return (<Cascader options={data} onChange={this.props.onChange} expandTrigger="hover">
      <Input
        {...getFieldProps(this.props.name, {
          onChange: this.onInputChange,
        })}
        style={this.props.style}
        onClick={this.onInputClick}
        placeholder={this.props.placeholder} autoComplete="off"/>
    </Cascader>);
  },
});

export default CascaderSuggest;
