import React, {PropTypes} from 'react';
import {Icon} from 'antd';

const ErrorPage = React.createClass({
  propTypes: {
    desc: PropTypes.string,
  },

  render() {
    return (
        <div className="error-page orange">
          <div className="icon">
              <Icon type="cross-circle-o" />
          </div>
          <div className="sep"></div>
          <div className="description">
            <div className="title">访问失败</div>
            <div className="shift">{this.props.desc || '请刷新重试'}</div>
          </div>
        </div>
    );
  },
});

export default ErrorPage;
