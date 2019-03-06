import MaterialAcceptance from './MaterialAcceptance/MaterialAcceptance';
import AcceptanceStaff from './MaterialAcceptance/AcceptanceStaff/AcceptanceStaff';
import MaterialAcceptanceIndex from './MaterialAcceptance/Index';
import MaterialDetail from './MaterialAcceptance/MaterialDetail';
import TemplateIndex from './TemplateManage/TemplateIndex';
import KoubeiTemplateList from './TemplateManage/KoubeiTemplateList';
import AlipayTemplateList from './TemplateManage/AlipayTemplateList';
import TempInfo from './TemplateManage/TempInfo';
import AlipayTempDetail from './TemplateManage/AlipayTempDetail';
import CreateTemplateIndex from './TemplateManage/CreateTemplateIndex';
import ApplyMaterial from './ApplicationManagement/ApplyMaterial/ApplyMaterial';
import ApplyDetail from './ApplicationManagement/ApplyDetail/ApplyDetail';
import PurchaseStorage from './ApplicationManagement/PurchaseStorage';
import QuoteRegistration from './ApplicationManagement/QuoteRegistration';
import InboundBasicInfoForm from './ApplicationManagement/InboundBasicInfoForm';
import QrcodeGenerate from './Qrcode/QrcodeGenerate';

import ApplicationRecordIndex from './ApplicationManagement/ApplicationRecordIndex';
import ApproveMaterial from './ApplicationManagement/ApproveMaterial/ApproveMaterial';
import ApplyInventory from './ApplicationManagement/ApplyInventory';
import KoubeiApplicationRecordList from './ApplicationManagement/ApplicationRecord';
import AlipayApplicationRecordList from './ApplicationManagement/AlipayMaterialApply/AlipayApplicationRecordList';
import AlipayApplyDetail from './ApplicationManagement/AlipayMaterialApply/AlipayApplicationDetail';
import permission from '@alipay/kb-framework/framework/permission';

import KoubeiCodeApply from './KoubeiCode/KoubeiCodeApply';
import KoubeiCodeManage from './KoubeiCode/KoubeiCodeManage';
import HasBindTab from './KoubeiCode/KoubeiCodeManage/HasBindTab';
import ToBindTab from './KoubeiCode/KoubeiCodeManage/ToBindTab';
import ApplyRecordTab from './KoubeiCode/KoubeiCodeManage/ApplyRecordTab';
import KoubeiCodeEntry from './KoubeiCode/KoubeiCodeEntry';
import BatchCodeDownload from './KoubeiCode/KoubeiCodeManage/BatchCodeDownload';

import CreateQrcode from './CreateQrcode';

import Production from './Production';
import Inventory from './Inventory';

export default [
  {
    path: 'material',
    component: MaterialAcceptanceIndex,
    childRoutes: [{
      path: 'acceptance',
      component: MaterialAcceptance,
    },
    {
      path: 'staff',
      component: AcceptanceStaff,
    }],
  },
  {
    path: 'material/detail/:stuffCheckId',
    component: MaterialDetail,
  },
  {
    path: '/material/TemplateManage',
    onEnter(route, replace) {
      if (route.location.pathname === '/material/TemplateManage' || route.location.pathname === '/material/TemplateManage') {
        if (permission('STUFF_TEMPLATE_MANAGE_KOUBEI')) {
          replace('/material/TemplateManage/koubei');
        } else if (permission('STUFF_TEMPLATE_MANAGE_ALIPAY')) {
          replace('/material/TemplateManage/alipay');
        } else {
          replace('/material/TemplateManage/koubei');
        }
      }
    },
  },
  {
    path: '/material/TemplateManage',
    component: TemplateIndex,
    childRoutes: [{
      path: 'koubei',
      component: KoubeiTemplateList,
    },
    {
      path: 'alipay',// 新增支付宝物料模板
      component: AlipayTemplateList,
    }],
  }, {
    path: 'material/templatemanage/tempinfo/:id',
    component: TempInfo,
  }, { // 新增支付宝物料模板详情
    path: 'material/templatemanage/alipaytempdetail/:id',
    component: AlipayTempDetail,
  }, {
    path: 'material/templatemanage/createtemplate',
    component: CreateTemplateIndex,
  },
  {// 申请单管理
    path: 'material/applicationManagement/applicationRecord',
    onEnter(route, replace) {
      if (route.location.pathname === '/material/applicationManagement/applicationRecord' || route.location.pathname === '/material/applicationManagement/applicationRecord') {
        if (permission('STUFF_MANAGE_KOUBEI')) {
          replace('/material/applicationManagement/applicationRecord/koubei');
        } else if (permission('STUFF_MANAGE_ALIPAY')) {
          replace('/material/applicationManagement/applicationRecord/alipay');
        } else {
          replace('/material/applicationManagement/applicationRecord/koubei');
        }
      }
    },
  },
  {// 申请单管理
    path: 'material/applicationManagement/applicationRecord',
    component: ApplicationRecordIndex,
    childRoutes: [{
      path: 'koubei',
      component: KoubeiApplicationRecordList,
    },
    {
      path: 'alipay',// 新增支付宝物料模板
      component: AlipayApplicationRecordList,
    }],
  },
  {// 采购入库
    path: 'material/applicationManagement/purchaseStorage',
    component: PurchaseStorage,
  },
  {// 支付宝申请单详情
    path: 'material/applicationManagement/alipayApplyDetail/:orderId',
    component: AlipayApplyDetail,
  },
  {// 申请物料 by david
    path: 'material/applicationManagement/applyMaterial',
    component: ApplyMaterial,
  },
  {// 物料审核
    path: 'material/applicationManagement/approve/:orderId',
    component: ApproveMaterial,
  },
  {// 调度预采购库存
    path: 'material/applicationManagement/apply-inventory',
    component: ApplyInventory,
  },
  {// 申请单详情 by david
    path: 'material/applicationManagement/applyDetail/:orderId',
    component: ApplyDetail,
  },
  {// 报价登记
    path: 'material/quote/:id',
    component: QuoteRegistration,
  },
  {// 入库登记
    path: 'material/inbound/:id',
    component: InboundBasicInfoForm,
  },
  {// 二维码生成记录
    path: 'material/qrcode',
    component: QrcodeGenerate,
  },
  {// 获取口碑码
    path: 'material/koubeicode/apply',
    component: KoubeiCodeApply,
  },
  {// 口碑码管理
    path: 'material/koubeicode/manage',
    component: KoubeiCodeManage,
    childRoutes: [
      {// 已绑定（明码）
        path: 'hasbind',
        component: HasBindTab,
      },
      {// 未绑定（空码）
        path: 'tobind',
        component: ToBindTab,
      },
      {// 生成记录
        path: 'record',
        component: ApplyRecordTab,
      },
    ],
  },
  {// 未绑定 打包下载码
    path: 'material/koubeicode/manage/batchcodedownload',
    component: BatchCodeDownload,
  },
  {
    path: '/material/koubeicode/index',
    component: KoubeiCodeEntry,
  },
  {
    path: '/material/createQrcode',
    component: CreateQrcode,
  },
  {
    path: '/material/production/placeorder',
    component: Production.PlaceOrder,
  },
  {
    path: '/material/production/order-manage',
    component: Production.OrderManage.OrderList,
  },
  {
    path: '/material/production/order-manage/allocate/:id',
    component: Production.OrderManage.Allocate,
  },
  {
    path: '/material/production/order-manage/:id/:tab',
    component: Production.OrderManage.OrderDetail,
  },
  {
    path: '/material/production/order-manage/:id',
    onEnter: (route, replace) => {
      replace(`/material/production/order-manage/${route.params.id}/orderinfo`);
    }
  },
  {
    path: '/material/inventory/manage',
    component: Inventory.Manage
  },
  {
    path: '/material/inventory/logistics',
    component: Inventory.Logistics
  },
  {
    path: '/material/inventory/register',
    component: Inventory.Register
  },
  {
    path: '/material/inventory/register/:expressProvider/:expressNo',
    component: Inventory.Register
  },
  {
    path: '/material/inventory/register/:expressProvider/:expressNo/:purchaseItemId',
    component: Inventory.Register
  }
];
