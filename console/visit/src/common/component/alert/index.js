import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.less';

import ExpandableText from '../expandable-text';

const { string } = PropTypes;

export default class extends PureComponent {
  static propTypes = {
    title: string,
    description: string,
  };

  render() {
    const { title, description } = this.props;
    return (
      <div className="alert">
        <div className="alert-title">{title}</div>
        <div className="alert-description">
          <ExpandableText text={description} />
        </div>
      </div>
    );
  }
}
