import React from 'react';
import classNames from 'classnames';
import {Input, Icon} from 'antd';

export default class Search extends React.Component {
  static defaultProps = {
    prefixCls: 'search-input-search',
  };

  onSearch = () => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch(this.input.refs.input.value);
    }
  }
  render() {
    const { className, prefixCls, ...others } = this.props;
    delete others.onSearch;
    const searchSuffix = (
      <Icon
        className={`${prefixCls}-icon`}
        onClick={this.onSearch}
        type="search"
      />
    );

    return (
      <Input
        onPressEnter={this.onSearch}
        {...others}
        className={classNames(prefixCls, className)}
        suffix={searchSuffix}
      />
    );
  }
}
