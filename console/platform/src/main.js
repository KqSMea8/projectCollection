import { PureComponent } from 'react';
import history from '@alipay/kobe-history';

export default class Index extends PureComponent {
  componentWillMount() {
    history.push('/spi');
  }
  render() {
    return null;
  }
}
