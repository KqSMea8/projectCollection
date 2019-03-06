import React, { PropTypes, Component } from 'react';

const IS_CHROME = window.navigator.userAgent.toLocaleLowerCase().indexOf('chrome') > -1;
const noop = () => { };
const SIZE_MAP = {
  large: '-lg',
  small: '-sm',
  normal: '',
};
export default class InputWithComposition extends Component {
  static propTypes = {
    value: PropTypes.any,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onCompositionStart: PropTypes.func,
    onCompositionUpdate: PropTypes.func,
    onCompositionEnd: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string,
    size: PropTypes.oneOf(['large', 'small', 'normal']),
  }

  static defaultProps = {
    onFocus: noop,
    onChange: noop,
    onBlur: noop,
    onCompositionStart: noop,
    onCompositionUpdate: noop,
    onCompositionEnd: noop,
    size: 'normal',
  }

  constructor(props, ctx) {
    super(props, ctx);
    this.isCompositing = false;
    const _SELF = this;
    Object.defineProperty(window, 'isCompositing', {
      get() {
        return _SELF.isCompositing;
      },
    });
  }

  onCompositionStart = (e) => {
    this.isCompositing = true;
    this.props.onCompositionStart(e);
  }

  onCompositionEnd = (e) => {
    this.isCompositing = false;
    this.props.onCompositionEnd(e);
    if (IS_CHROME) {
      this.onChange(e);
    }
  }

  onCompositionUpdate = (e) => {
    this.props.onCompositionUpdate(this.props.value, e);
  }

  onChange = e => {
    if (this.isCompositing) return true;
    this.props.onChange(e.target.value);
  }

  render() {
    const { value, placeholder, disabled, style, onFocus, onBlur, name, id, size } = this.props;
    const props = {
      onCompositionStart: this.onCompositionStart,
      onCompositionUpdate: this.onCompositionUpdate,
      onCompositionEnd: this.onCompositionEnd,
      defaultValue: value === null || value === void 0 ? '' : value,
      placeholder, disabled, onFocus, onBlur, name, id,
      onChange: this.onChange,
      style: Object.assign({}, style),
    };
    return (
      <span className="ant-input-wrapper">
        <input type="text" className={`ant-input ant-input${SIZE_MAP[size]}`} {...props} />
      </span>
    );
  }
}
