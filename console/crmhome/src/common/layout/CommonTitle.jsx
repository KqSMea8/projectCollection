import React, {PropTypes} from 'react';
import './layout.less';
const CommonTitle = props => {
  return (<div className="events-section-header">
        <div className="events-section-title">
          {props.name}
        </div>
      </div>
    );
};

CommonTitle.propTypes = {
  name: PropTypes.string,
};

CommonTitle.defaultProps = {
  name: null,
};

export default CommonTitle;
