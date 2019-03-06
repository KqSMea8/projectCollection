import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import TouchScroll from 'rmc-touchscroll';
import PropTypes from 'prop-types';
import { List } from '@alipay/qingtai';
import { page as wrapper } from '@alipay/page-wrapper';
import { getParam } from '@alipay/kb-m-biz-util';
import {
  DigitalFeedbackAllText,
  DigitalGroupingText,
  DigitalFeedbackTypeGrouped,
  DigitalFeedbackStatusText,
} from '../../../common/constants';
import './style.less';

@wrapper({ store: {}, spmConfig: [] })
class Index extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      value: (getParam().digitalFeedback && JSON.parse(getParam().digitalFeedback)) || {},
    };
  }
  render() {
    const value = this.state.value;
    return (
      <TouchScroll className="digital-feedback-detail" fullScreen>
        {Object.entries(DigitalFeedbackTypeGrouped).map(([groupType, childrenTypeMap]) => (
          <List renderHeader={DigitalGroupingText[groupType]} key={groupType}>
            {Object.keys(childrenTypeMap).map(type => (
              <List.Item key={type} extra={DigitalFeedbackStatusText[value[type]]}>
                {DigitalFeedbackAllText[type]}
              </List.Item>
            ))}
          </List>
        ))}
      </TouchScroll>
    );
  }
}

kBridge.ready(() => {
  ReactDOM.render(<Index />, document.querySelector('main'));
});
