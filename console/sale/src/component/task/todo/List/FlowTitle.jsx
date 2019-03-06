import React from 'react';

import './FlowTitle.less';

class FlowTitle extends React.PureComponent {
  render() {
    const {name, description} = this.props.data;
    return (
      <div className="flow-title">
        <span className="icon">流</span>
        <span className="title">{name}</span>
        {description && <span className="description">{description}</span>}
      </div>
    );
  }
}

export default FlowTitle;
