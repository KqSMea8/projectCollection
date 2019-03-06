import { PropTypes, Component } from 'react';
import { itemLayout } from './ExchangeConfig';
class FormItemBase extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    initialData: PropTypes.object,
  }
  static defaultProps = {
    initialData: {},
  };
  constructor(props, ctx) {
    super(props, ctx);
    this.itemLayout = itemLayout;
  }
  get isReadyToOnline() {
    return !!this.props.isReadyToOnline;
  }
  get isOnline() {
    return !!this.props.isOnline;
  }
  get initialValue() {
    console.warn(`组件 ${this.constructor.name} 没有实现 getter initialValue`);
    return void 0;
  }
}
export default FormItemBase;
