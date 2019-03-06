import WaitingShelveList from './IntelligentGoodsList/WaitingShelveList';
import ShelvedList from './IntelligentGoodsList/ShelvedList';
import IntelligentGoodsList from './IntelligentGoodsList/IntelligentGoodsList';
import WaitingPutaway from './IntelligentCatering/WaitingPutaway';
import AlreadyPutaway from './IntelligentCatering/AlreadyPutaway';
import CateringList from './IntelligentCatering/CateringList';
import IntelligentCatering from './IntelligentCatering/IntelligentCatering';
import OneClickMoveCRMIframe from '../goods/GoodsDetail/OneClickMoveCRMIframe';

export default [
  {
    path: 'intelligentgoods/list',
    component: IntelligentGoodsList,
    childRoutes: [{
      path: 'waitingshelve',
      component: WaitingShelveList,
    }, {
      path: 'shelved',
      component: ShelvedList,
    }],
  }, {
    path: 'intelligentcatering/list',
    component: IntelligentCatering,
    childRoutes: [{
      path: 'stayputaway',
      component: WaitingPutaway,
    }, {
      path: 'putaway',
      component: AlreadyPutaway,
    }],
  }, {
    path: '/catering/list',
    component: CateringList,
  }, {
    path: '/catering/detail',
    component: OneClickMoveCRMIframe,
  }, {
    path: '/catering/edit',
    component: OneClickMoveCRMIframe,
  }, {
    path: '/catering/new',
    component: OneClickMoveCRMIframe,
  }
];
