import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class AnchorLink extends React.Component {
  static contextTypes = {
    antAnchor: PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'ant-anchor',
    href: '#',
  };

  componentDidMount() {
    this.context.antAnchor.registerLink(this.props.href);
  }

  componentWillUnmount() {
    this.context.antAnchor.unregisterLink(this.props.href);
  }

  context = {
    antAnchor: '',
  };

  handleClick = (e) => {
    e.preventDefault();
    this.context.antAnchor.scrollTo(this.props.href);
  }

  render() {
    const {
      prefixCls,
      href,
      title,
      children,
    } = this.props;
    const active = this.context.antAnchor.activeLink === href;
    const wrapperClassName = classNames(`${prefixCls}-link`, {
      [`${prefixCls}-link-active`]: active,
    });
    const titleClassName = classNames(`${prefixCls}-link-title`, {
      [`${prefixCls}-link-title-active`]: active,
    });
    return (
      <div className={wrapperClassName}>
        <a
          className={titleClassName}
          href={href}
          title={typeof title === 'string' ? title : ''}
          onClick={this.handleClick}
        >
          {title}
        </a>
        {children}
      </div>
    );
  }
}
