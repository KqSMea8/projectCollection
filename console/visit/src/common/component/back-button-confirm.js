import React from 'react';
import PropTypes from 'prop-types';

// 控制导航栏返回按钮，点击时弹出确认关闭弹窗
export default class extends React.PureComponent {
  static propTypes = {
    shouldConfirm: PropTypes.bool.isRequired, // true 来拦截返回并展示 confirm
    title: PropTypes.string, // confirm 时的 title
    content: PropTypes.string, // confirm 时的文案
    confirmButtonText: PropTypes.string, // confirm 时的确认按钮文案
    onOk: PropTypes.func, // confirm ok 回调
    cancelButtonText: PropTypes.string, // confirm 时的取消按钮文案
    onCancel: PropTypes.func, // confirm cancel 回调
  };

  static defaultProps = {
    title: '提示',
    content: '确定返回吗？',
    onOk: () => {
      kBridge.call('popWindow');
    },
  };

  backHandler = () => {
    if (this.props.shouldConfirm) {
      kBridge.call('confirm', {
        title: this.props.title,
        content: this.props.content,
        confirmButtonText: this.props.confirmButtonText,
        cancelButtonText: this.props.cancelButtonText,
      }, (result) => {
        if (result.confirm) {
          if (this.props.onOk) this.props.onOk();
        } else if (this.props.onCancel) this.props.onCancel();
      });
    }
  };

  componentDidMount() {
    kBridge.call('onBack', this.backHandler);
    kBridge.call('allowBack', !this.props.shouldConfirm);
  }

  componentDidUpdate() {
    kBridge.call('allowBack', !this.props.shouldConfirm);
  }

  componentWillUnmount() {
    kBridge.call('offBack', this.backHandler);
    kBridge.call('allowBack', true);
  }

  render() {
    return null;
  }
}
