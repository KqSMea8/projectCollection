import React from 'react';
import PropTypes from 'prop-types';

import './style.less';

class ProgressBar extends React.PureComponent {
  static propTypes = {
    value: PropTypes.number,
    className: PropTypes.string,
  };
  static defaultProps = {
    value: 0,
    className: '',
  };
  render() {
    const { value, className } = this.props;
    const combinedClassName = `kb-progress-bar${className ? (' ' + className) : ''}`;
    return (
      <div className={combinedClassName}>
        <div className="bar-inner" style={{width: `${value * 100}%`}}/>
      </div>
    );
  }
}

export default ProgressBar;
