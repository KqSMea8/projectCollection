import React from 'react';
import {Popover} from 'antd';

const ViewReasonPopover = React.createClass({

  render() {
    return (
      <div>
        <Popover content={<div><p>内容</p><p>内容</p></div>} title="原因" trigger="hover">
          <a>查看原因</a>
        </Popover>
      </div>
    );
  },
});

export default ViewReasonPopover;
