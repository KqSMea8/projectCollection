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
  initialAjaxFail: {
    icon: 'frown',
    theme: 'orange',
    shift: '',
    pluses: [],
    title: '数据加载失败',
  },
};

const ErrorPage = React.createClass({
  propTypes: {
    type: PropTypes.oneOf(['permission', 'initialAjaxFail']),
    title: PropTypes.string,
  },
  render() {
    const props = { ...propsMap[this.props.type], ...this.props };
    return (
      <div className={['error-page', props.theme].join(' ')}>
        <div className="icon">
          <Icon type={props.icon} />
        </div>
        <div className="sep"></div>
        <div className="description">
          <div className="title">{props.title}</div>
          <div className="shift">{props.shift}</div>
          {
            (props.pluses || []).map((t, i) => {
              return <div key={i} className="plus">{t}</div>;
            })
          }
        </div>
      </div>
    );
  },
});

export default ErrorPage;
