import SuperStar from './Index';
import CreateSuperStar from './CreateSuperStar';
import SuperStarView from './SuperStarView';

export default [
  {
    path: 'superstar',
    component: SuperStar,
  },
  {
    path: 'superstar/create(/:pid)',
    component: CreateSuperStar,
  },
  {
    path: 'superstarview/:pid',
    component: SuperStarView,
  },
];
