import React, { PropTypes } from 'react';

const Tips = props => (
  <div>
    {props.content}
  </div>
);

Tips.propTypes = {
  content: PropTypes.element,
};

export default Tips;
