import React, { PropTypes } from 'react';
import { Input } from 'antd';

export default class extends React.Component {

  static propTypes = {
    maxLength: PropTypes.number,
  };

  static defaultProps = {
    maxLength: 1000,
  };

  state = {
    value: '',
  };

  onChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const { value, maxLength } = this.props;
    const valueLength = value ? value.length : this.state.value.length;
    return (<div style={{ position: 'relative' }}>
      <Input {...this.props} maxLength={maxLength} onChange={this.onChange.bind(this)} />
      <div style={{ position: 'absolute', right: 12, bottom: 0, color: '#666'}}>
        {valueLength || 0}/{maxLength}
      </div>
    </div>);
  }
}
