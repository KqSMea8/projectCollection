import showTrainingModal from '../../common/BindTrainingTask'; // 任务绑定
import PrivateLeads from './PrivateLeads/PrivateLeads';
import PrivatePosLeads from './PrivateLeads/PrivatePosLeads/PrivatePosLeads';
import WaitedLeads from './PrivateLeads/WaitedLeads/WaitedLeads';
import PrivateLeadsIndex from './PrivateLeads/Index';
import PublicLeads from './PublicLeads/PublicLeads';
import PublicPosLeads from './PublicLeads/PublicPosLeads/PublicPosLeads';
import ConditionPublicLeads from './PublicLeads/ConditionPublicLeads';
import PublicLeadsIndex from './PublicLeads/Index';
import TeamLeads from './TeamLeads/TeamLeads';
import TeamPosLeads from './TeamLeads/TeamPosLeads/TeamPosLeads';
import NotEffectiveLeads from './TeamLeads/NotEffectiveLeads';
import TeamIndex from './TeamLeads/TeamIndex';
import LeadDetailForm from './common/LeadDetailForm';
import LeadComplete from './completeLeads/LeadsComplete';
import LeadDetail from './common/LeadDetail';
import PosLeadDetail from './common/PosLeadDetail';
import LeadDetailIndex from './common/LeadDetailIndex';
import LogDetail from './common/LogDetail';
import TeamLeadBatchLog from './TeamLeads/TeamLeadBatchLog';

export default [
  {
    path: '/private-leads',
    onEnter: showTrainingModal,
    component: PrivateLeadsIndex,
    childRoutes: [{
      path: 'waited',
      component: WaitedLeads,
    }, {
      path: 'valid',
      component: PrivateLeads,
    }, {
      path: 'pos',
      component: PrivatePosLeads,
    }],
  },
  {
    path: '/public-leads',
    onEnter: showTrainingModal,
    component: PublicLeadsIndex,
    childRoutes: [{
      path: 'map',
      component: PublicLeads,
    }, {
      path: 'condition',
      component: ConditionPublicLeads,
    }, {
      path: 'pos',
      component: PublicPosLeads,
    }],
  },
  {
    path: 'leads/detail/:leadsId',
    component: LeadDetailIndex,
    childRoutes: [{
      path: 'logs',
      component: LogDetail,
    }, {
      path: 'detail',
      component: LeadDetail,
    }],
  },
  {
    path: 'leads/detail/:leadsId/:type',
    component: LeadDetail,
  },
  {
    path: 'leads/waited/detail/:orderId',
    component: LeadDetail,
  },
  {
    path: 'leads/waited/detail/:orderId/:type',
    component: LeadDetail,
  },
  {
    path: 'leads/new',
    component: LeadDetailForm,
  },
  {
    path: 'leads/edit/:leadsId',
    component: LeadDetailForm,
  },
  {
    path: 'leads/waited/edit/:orderId',
    component: LeadDetailForm,
  },
  {
    path: 'leads/complete/:leadsId',
    component: LeadComplete,
  },
  {
    path: '/team-leads',
    onEnter: showTrainingModal,
    component: TeamIndex,
    childRoutes: [{
      path: 'team',
      component: TeamLeads,
    },
    {
      path: 'noteffective',
      component: NotEffectiveLeads,
    }, {
      path: 'pos',
      component: TeamPosLeads,
    }],
  }, {
    path: '/team-leads/logs',
    component: TeamLeadBatchLog,
  },
  {
    path: 'posLeads/detail/:leadsId',
    component: PosLeadDetail,
  },
];
