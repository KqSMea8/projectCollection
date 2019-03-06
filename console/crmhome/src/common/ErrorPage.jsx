import React, {PropTypes} from 'react';
import {Icon} from 'antd';

const propsMap = {
  permission: {
    icon: 'lock',
    theme: 'orange',
    title: '暂无权限',
    shift: '',
    pluses: [],
  },
};

const ErrorPage = React.createClass({
  propTypes: {
    type: PropTypes.oneOf(['permission']),
  },

  render() {
    const {theme, icon, title, shift, pluses} = propsMap[this.props.type] || {};
    return (
        <div className={['error-page', theme].join(' ')}>
          <div className="icon">
              <Icon type={icon} />
          </div>
          <div className="sep"></div>
          <div className="description">
            <div className="title">{title}</div>
            <div className="shift">{shift}</div>
            {
              (pluses || []).map((t, i) => {
                return <div key={i} className="plus">{t}</div>;
              })
              }
          </div>
        </div>
    );
  },
});

export default ErrorPage;
