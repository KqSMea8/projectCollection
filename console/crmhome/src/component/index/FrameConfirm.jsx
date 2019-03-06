import React, {PropTypes} from 'react';
import AutoFrame from './AutoFrame';

const FrameConfirm = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  render() {
    const { applicationId } = this.props.params;
    return (<div>
      <AutoFrame target={`${window.APP.kbadvertServer}/main.htm#/promote/confirm/${applicationId}`} />
    </div>);
  },
});

export default FrameConfirm;
