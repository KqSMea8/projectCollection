import { Popover } from 'antd';
import React, {PropTypes} from 'react';
import {format, formatTime} from '../../../common/dateUtils';


const RecordPopover = React.createClass({
  propTypes: {
    data: PropTypes.object,
    type: PropTypes.string,
  },
  getInitialState() {
    return {
      data: this.props.data || {},
    };
  },
  render() {
    const {data, type} = this.props;
    const content = (
      <div>
        <p>时间: {format(new Date(data.signTime))} {formatTime(new Date(data.signTime))}</p>
        {type === 'BRAND' ? null : <p>距离: 当前门店约<span style={{color: '#f50'}}>{data.distance}m</span></p>}
      </div>
    );
    let popoverHtml = <span style={{color: '#999'}} >签到</span>;
    if (type !== 'BRAND') {
      popoverHtml = data.distance !== '0' ? <span>距离当前门店约<span style={{color: '#f50'}}>{data.distance}m</span></span> : <span>准确签到</span>;
    }
    return (
      <div>
        {popoverHtml}
        <Popover overlayStyle={{width: 'auto'}} content={content} title={data.signAddress}>
          <a style={{marginLeft: '5px'}}>查看</a>
        </Popover>
      </div>
    );
  },
});

export default RecordPopover;
