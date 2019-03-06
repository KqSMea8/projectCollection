import React from 'react';

export default class AdviseExtra extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }
  render() {
    const props = this.props;
    if (!props.children) {
      return null;
    }
    return (
      <span>
        <span style={{ fontWeight: 400 }}>建议设置：</span>
        <span style={{ color: '#ff9900' }}>{props.children}</span>
      </span>
    );
  }
}
