import './common/decorationMaterial.less';
import Decoration from './decoration/Decoration';
import DishEdit from './decoration/dishesMenus/DishEdit';
import MenuDetail from './decoration/dishesMenus/MenuDetail';
import MenuEdit from './decoration/dishesMenus/MenuEdit';
import EnvironmentEdit from './decoration/shopEnvironment/EnvironmentEdit';
import ServiceDetail from './decoration/ServiceInfo/ServiceDetail';
import ServiceEdit from './decoration/ServiceInfo/ServiceEdit';
import CoverEdit from './decoration/CoverPicture/CoverEdit';
import CommonEdit from './decoration/CommonPanel/create';
// import Material from './material/index';

export default [
  {
    path: 'decoration',
    component: Decoration,
  },
  {
    path: 'decoration/:categoryId',
    component: Decoration,
  },
  {
    path: 'decoration/:categoryId/:type',
    component: Decoration,
  },
  {
    path: 'decoration/:categoryId/menu/dish',
    component: Decoration,
  },
  {
    path: 'decoration/:categoryId/menu/menu',
    component: Decoration,
  },
  {
    path: 'decoration/:categoryId/menu/dish-create',
    component: DishEdit,
  },
  {
    path: 'decoration/:categoryId/menu/dish-edit/:dishIdList',
    component: DishEdit,
  },
  {
    path: 'decoration/:categoryId/menu/menu-detail/:menuId',
    component: MenuDetail,
  },
  {
    path: 'decoration/:categoryId/menu/menu-create',
    component: MenuEdit,
  },
  {
    path: 'decoration/:categoryId/menu/menu-edit/:menuId',
    component: MenuEdit,
  },
  {
    path: 'decoration/:categoryId/environment/create',
    component: EnvironmentEdit,
  },
  {
    path: 'decoration/:categoryId/environment/edit/:environmentIdList',
    component: EnvironmentEdit,
  },
  {
    path: 'decoration/:categoryId/service/detail/:shopId',
    component: ServiceDetail,
  },
  {
    path: 'decoration/:categoryId/service/edit/:shopId',
    component: ServiceEdit,
  },
  {
    path: 'decoration/:categoryId/cover/create',
    component: CoverEdit,
  },
  {
    path: 'decoration/:categoryId/cover/edit/:fileGroupId',
    component: CoverEdit,
  },
  {
    path: 'decoration/:categoryId/:type/:typeName/create',
    component: CommonEdit,
  },
  {
    path: 'decoration/:categoryId/:type/:typeName/:info/edit',
    component: CommonEdit,
  },
  // {
  //   path: 'material/center',
  //   component: Material,
  // },
];
