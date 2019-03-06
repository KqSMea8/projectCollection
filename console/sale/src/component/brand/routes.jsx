import BrandList from './BrandList/BrandList';
import BrandDetail from './BrandDetail/ActivityView';
import WhiteList from './WhiteList/WhiteList';
export default [
  {
    path: 'brand/list',
    component: BrandList,
  }, {
    path: 'brand/detail/:pid/:activityId',
    component: BrandDetail,
  }, {
    path: 'brand/brandretailer',
    component: WhiteList,
  },
];
