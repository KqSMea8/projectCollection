import NewConsume from './Consume/NewConsume';
import ConsumeDetail from './Consume/ConsumeDetail';
import CommandDetail from './Command/CommandDetail';
import DiscountDetail from './Discount/DiscountDetailNew';
import RandomReduceDetail from './Discount/RandomReduceDetail';
import GoodKouBei from './Shop/GoodKouBei';
import NewExchange from './Exchange/NewExchange';
import BuyGive from './BuyGive/BuyGive';
import BuyGiveDetail from './BuyGive/BuyGiveDetail';
import BillDownload from './Bill/BillDownload';
import Vouchers from './vouchers/';
import Template from './template/';
import GoodsActivityCreate from './GoodsActivity/GoodsActivityCreate';
import GoodsActivityDetail from './GoodsActivity/GoodsActivityDetail';
// import FillReductionDetail from './FillReduction/FillReductionDetail';

export default [{
  path: 'marketing-activity/consume/create',
  component: NewConsume,
}, {
  path: 'marketing-activity/consume/edit/:id',
  component: NewConsume,
}, {
  path: 'marketing-activity/consume/detail/:id',
  component: ConsumeDetail,
}, {
  path: 'marketing-activity/command/detail/:id',
  component: CommandDetail,
}, {
  path: 'marketing-activity/discount/detail/:id',
  component: DiscountDetail,
}, {
  path: 'marketing-activity/randomreduce/detail/:id',
  component: RandomReduceDetail,
}, {
  path: 'marketing-activity/shop/goodkoubei',
  component: GoodKouBei,
}, {
  path: 'marketing-activity/exchange/create',
  component: NewExchange,
}, {
  path: 'marketing-activity/exchange/:id',
  component: NewExchange,
}, {
  path: 'marketing-activity/buygive/edit/:id',
  component: BuyGive,
}, {
  path: 'marketing-activity/buygive/create',
  component: BuyGive,
}, {
  path: 'marketing-activity/buygive/detail/:orderId',
  component: BuyGiveDetail,
}, {
  path: 'marketing-activity/bill/download',
  component: BillDownload,
}, {
  path: 'marketing-activity/bill/download/:type',
  component: BillDownload,
}, {
  path: 'marketing-activity/vouchers/create',
  component: Vouchers,
}, {
  path: 'marketing-activity/template',
  component: Template,
}, {
  path: 'marketing-activity/goods/create',
  component: GoodsActivityCreate,
}, {
  path: 'marketing-activity/goods/edit/:id',
  component: GoodsActivityCreate,
}, {
  path: 'marketing-activity/goods/detail/:id(/:sceneType)',
  component: GoodsActivityDetail,
}];
