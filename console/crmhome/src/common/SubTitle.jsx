import React, {PropTypes} from 'react';

const SubTitle = React.createClass({
  propTypes: {
    name: PropTypes.string,
  },

  render() {
    return (<h3 className="kb-form-sub-title">
      <div className="kb-form-sub-title-icon"></div>
      <span className="kb-form-sub-title-text">{this.props.name}</span>
      <div className="kb-form-sub-title-line"></div>
    </h3>);
  },
});

export default SubTitle;
