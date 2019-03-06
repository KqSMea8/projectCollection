import BrandAccountList from './BrandAccountList';
import BrandAccountEdit from './BrandAccountEdit/BrandAccountEdit';
import BrandAccountDetail from './BrandAccountDetail';

export default [{
  path: 'brand-account',
  component: BrandAccountList,
}, {
  path: 'brand-account/detail/:shopId/:brandId',
  component: BrandAccountDetail,
}, {
  path: 'brand-account/edit',
  component: BrandAccountEdit,
}];
