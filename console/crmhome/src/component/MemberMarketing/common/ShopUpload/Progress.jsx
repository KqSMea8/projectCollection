import React, {PropTypes} from 'react';
import { Progress} from 'antd';

/**
 * 进度条
 *
 */
// let thisProps = {percent: 0};
const ShopUploadBox = React.createClass({

  propTypes: {
    data: PropTypes.object,
  },
  getInitialState() {
    return {
      percent: 0,
      status: 'loading',
      notice: '服务器正在检测门店数据，请稍后..',
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.percent !== nextProps.data.percent || this.props.status !== nextProps.data.status ) {
      // thisProps = nextProps.data;
      this.setState({
        percent: nextProps.data.percent,
        status: nextProps.data.status,
        notice: nextProps.data.message,
      });
    }
  },

  renderErrContent(data) {
    return (<div>
      <p>{data.message}</p>
      {
        data.percent !== 100 && <Progress percent={data.percent} status="exception" strokeWidth={5}/>
      }
      </div>);
  },

  render() {
    const {percent, status, notice} = this.state;
    return (
      <div>
      {
        status !== 'exception' ?
        <div>
          <p>{notice}</p>
          {percent !== 100 && <Progress percent={percent} strokeWidth={5}/>}
        </div> : null
      }
      {
        status === 'exception' ? this.renderErrContent(this.props.data) : null
      }
      </div>
    );
  },
});
export default ShopUploadBox;
