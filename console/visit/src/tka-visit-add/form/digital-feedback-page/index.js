import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TouchScroll from 'rmc-touchscroll';
import PropTypes from 'prop-types';
import { page as wrapper } from '@alipay/page-wrapper';
import { getParam, popPage } from '@alipay/kb-m-biz-util';
import { List, Checkbox } from '@alipay/qingtai';
import {
  DigitalFeedbackTypeGrouped,
  DigitalGroupingText,
  DigitalFeedbackStatusText,
  DigitalFeedbackAllText,
} from '../../../common/constants';
import './style.less';

const CheckboxItem = Checkbox.CheckboxItem;

/* eslint-disable */
@wrapper({ store: {}, spmConfig: [] })
class Index extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  };
  constructor(props) {
    super(props);
    const valueStr = getParam().value;
    this.state = {
      multiMode: false,
      multiChooseValue: [], // 多选选中的节点
      value: (valueStr && JSON.parse(valueStr)) || {},
    };
  }
  componentDidMount() {
    this.refreshOptionButton();
    kBridge.call('allowBack', false);
    kBridge.call('onBack', () => {
      popPage(this.state.value);
    });
  }
  // 展示选择 picker
  startChoosePicker(callback) {
    kBridge.call(
      'showActionSheet',
      {
        title: '数字化程度反馈',
        items: Object.values(DigitalFeedbackStatusText),
      },
      res => {
        if (res.index >= 0) {
          callback(Object.keys(DigitalFeedbackStatusText)[res.index]);
        }
      }
    );
  }
  // 点击完成
  onMultipleFinish() {
    if (this.state.multiChooseValue.length === 0) {
      this.setState({ multiMode: false }, () => this.refreshOptionButton());
      return;
    }
    this.startChoosePicker(value => {
      const newValue = { ...this.state.value };
      this.state.multiChooseValue.forEach(item => {
        newValue[item] = value;
      });
      this.setState(
        {
          multiMode: false,
          multiChooseValue: [],
          value: newValue,
        },
        () => this.refreshOptionButton()
      );
    });
  }
  // 更新导航栏菜单按钮
  refreshOptionButton() {
    if (!this.state.multiMode) {
      kBridge.call('setOptionButton', {
        items: [{ title: '多选' }],
        onClick: () =>
          this.setState({ multiMode: true }, () => this.refreshOptionButton()),
      });
    } else {
      const count = this.state.multiChooseValue.length;
      kBridge.call('setOptionButton', {
        items: [{ title: count ? `完成(${count})` : '完成' }],
        onClick: this.onMultipleFinish.bind(this),
      });
    }
  }
  // 改变多选状态
  onCheckChange(type, e) {
    const { multiChooseValue } = this.state;
    if (e.target.checked) {
      multiChooseValue.push(type);
    } else {
      multiChooseValue.splice(multiChooseValue.indexOf(type), 1);
    }
    this.setState({ multiChooseValue }, () => this.refreshOptionButton());
  }
  // 一项值改变
  onClickOption(type) {
    this.startChoosePicker(chooseValue => {
      this.setState({
        value: {
          ...this.state.value,
          [type]: chooseValue,
        },
      });
    });
  }
  render() {
    const { value } = this.state;
    return (
      <TouchScroll className="digital-feedback-page" fullScreen>
        {Object.entries(DigitalFeedbackTypeGrouped).map(
          ([groupType, childrenTypeMap]) => (
            <List renderHeader={DigitalGroupingText[groupType]} key={groupType}>
              {Object.keys(childrenTypeMap).map(
                type =>
                  this.state.multiMode ? (
                    <CheckboxItem
                      key={type}
                      onChange={this.onCheckChange.bind(this, type)}
                      extra={DigitalFeedbackStatusText[value[type]]}
                    >
                      {DigitalFeedbackAllText[type]}
                    </CheckboxItem>
                  ) : (
                    <List.Item
                      arrow="horizontal"
                      key={type}
                      extra={
                        DigitalFeedbackStatusText[value[type]]
                          ? DigitalFeedbackStatusText[value[type]]
                          : '请选择'
                      }
                      onClick={this.onClickOption.bind(this, type)}
                    >
                      {DigitalFeedbackAllText[type]}
                    </List.Item>
                  )
              )}
            </List>
          )
        )}
      </TouchScroll>
    );
  }
}

kBridge.ready(() => {
  ReactDOM.render(<Index />, document.querySelector('main'));
});
