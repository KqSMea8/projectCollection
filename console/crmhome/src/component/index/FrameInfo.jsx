import React, { PropTypes } from 'react';
import AutoFrame from './AutoFrame';

const FramePage = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  render() {
    const { category = 'unconfirmed' } = this.props.params;
    return (<div>
      <AutoFrame target={`${window.APP.kbadvertServer}/main.htm#/promote/list/${category}`} />
    </div>);
  },
});

export default FramePage;
