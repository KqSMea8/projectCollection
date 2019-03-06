import RecordEditorIndex from './RecordEditor/RecordEditorIndex';
import RecordEditorTable from './RecordEditor/RecordEditorTable';
import RecordEditorAdd from './RecordEditor/RecordEditorAdd';
import RecordEditorLeadsTable from './RecordEditor/RecordEditorLeadsTable';
import RecordEditorDetail from './RecordEditor/RecordEditorDetail';
import TKAList from './tka/List';
import TKADetail from './tka/Detail';
import TKAAddVisit from './tka/AddVisit';

export default [
  {
    path: '/record',
    component: window.APP.isShowKAIndex ? TKAList : RecordEditorIndex,
    childRoutes: window.APP.isShowKAIndex ? [] : [{
      path: 'shop',
      component: RecordEditorTable,
    },
    {
      path: 'leads',
      component: RecordEditorLeadsTable,
    },
    {
      path: 'pos_leads',
      component: RecordEditorLeadsTable,
    }],
  },
  {
    path: '/record/newrecord/:type/:isPosSale',
    component: RecordEditorAdd,
  },
  {
    path: '/record/recordDetail/:recordId/:isPosSale/:type',
    component: RecordEditorDetail,
  },
  {
    path: '/record/:brandId/:brandName',
    component: RecordEditorIndex,
  },
  {
    path: '/tka-record',
    component: TKAList,
  }, {
    path: '/tka-record/detail/:recordId',
    component: TKADetail,
  }, {
    path: '/tka-record/add',
    component: TKAAddVisit,
  }
];
