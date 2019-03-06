import './stuff.less';
import Order from './Order/index.jsx';
import FramePage from './Order/FramePage';
import ProductSettingsIndex from './ProductSettings/ProductSettingsIndex';
import ProductPaySettings from './ProductSettings/ProductPaySettings';
import ProductRuleSettings from './ProductSettings/ProductRuleSettings';

export default [{
  path: 'stuff/order',
  component: Order,
}, {
  path: 'stuff/page/:id',
  component: FramePage,
}, {
  path: 'stuff/productSettings',
  component: ProductSettingsIndex,
  childRoutes: [{
    path: 'paySettings',
    component: ProductPaySettings,
  }, {
    path: 'ruleSettings',
    component: ProductRuleSettings,
  }],
}];
