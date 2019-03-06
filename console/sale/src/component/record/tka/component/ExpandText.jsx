import React, { PropTypes } from 'react';

export default class extends React.Component {

  static propTypes = {
    maxLength: PropTypes.number,
    text: PropTypes.string,
  };

  static defaultProps = {
    maxLength: 100,
    text: '',
  };

  state = {
    expanded: false,
  };

  render() {
    const { text, maxLength } = this.props;
    const { expanded } = this.state;
    if (text.length < maxLength) {
      return <span>{text}</span>;
    }
    if (expanded) {
      return <span>{text} <a onClick={() => this.setState({ expanded: false })}>收起</a></span>;
    }
    return <span>{text.substr(0, maxLength)} <a onClick={() => this.setState({ expanded: true })}>查看全文</a></span>;
  }
}
