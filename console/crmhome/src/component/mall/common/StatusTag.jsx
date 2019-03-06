import React, {Component, PropTypes} from 'react';
import { retailersActivityStatus } from '../../MemberMarketing/config/AllStatus';
import './StatusTag.less';

class StatusTag extends Component {
  render() {
    const status = this.props.status;
    if (!status) return null;
    return (
    <span className={`status ${retailersActivityStatus[status].color}`}>
      { retailersActivityStatus[status].text }
    </span >
    );
  }
}

StatusTag.propTypes = {
  status: PropTypes.string,
};

StatusTag.defaultProps = {
  status: null,
};

export default StatusTag;
