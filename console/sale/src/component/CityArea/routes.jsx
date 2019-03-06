import CityArea from './CityArea';
import CityAreaConfig from './CityAreaConfig/CityAreaConfig';
import CityAreaManageAdd from './CityAreaManagerNew/CityAreaManageAdd';

export default [{
  path: 'cityarea/tabs/:page',
  component: CityArea,
}, {
  path: 'cityarea/config/:id',
  component: CityAreaConfig,
}, {
  path: 'cityarea/manager/add',
  component: CityAreaManageAdd,
}, {
  path: 'cityarea/manager/edit',
  component: CityAreaManageAdd,
}];
