import brandShopGroup from './index';
import brandShopGroupNew from './BrandShopChild/brandShopNew';
import brandShopGroupDetail from './BrandShopChild/brandShopDetail';

export default [
  {
    path: '/brandShopGroup',
    component: brandShopGroup,
  },
  {
    path: '/brandShopGroup/new',
    component: brandShopGroupNew,
  },
  {
    path: '/brandShopGroup/detail/:id',
    component: brandShopGroupDetail,
  },
  {
    path: '/brandShopGroup/edit/:id',
    component: brandShopGroupNew,
  },
];
