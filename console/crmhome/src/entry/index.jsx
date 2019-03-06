import 'matchmedia-polyfill/matchMedia.js';
import '../common/';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { message } from 'antd';
import clueTrackerInit from '../common/ClueTracker';
import { Router, Route, hashHistory } from 'react-router';
import indexRoutes from '../component/index/routes';
import memberMarketingRoutes from '../component/MemberMarketing/routes';
import marketingActivityRoutes from '../component/MarketingActivity/routes';
import settlement from '../component/settlement/routes';
import itemManagementRoutes from '../component/ItemManagement/routes';
import agreementRoutes from '../component/agreement/routes';
import shopRoutes from '../component/shop/routes';
import decorationMaterialRoutes from '../component/decorationMaterial/routes';
import mallRoutes from '../component/mall/routes';
import workflowRoutes from '../component/workflow/routes';
import stuffRoutes from '../component/stuff/routes';
import itemPormoRoutes from '../component/itemPromo/routes';
import { keepSession, getUriParam } from '../common/utils';
import promote from '../component/promote/routes';
import oneClickMoveRoutes from '../component/OneClickMove/routes';
import emeberRouters from '../component/emeber/routes';
import microblogRouters from '../component/microblog/routes';
import brandAccountRoutes from '../component/brandAccount/routes';
import materialCenterRoutes from '../component/materialCenter/routes';

clueTrackerInit();

function replaceLink(link) {
  const randomVal = `refresh=${Date.now()}`;
  if (!!~link.indexOf('htm?')) {
    if (/(\?|\&)refresh=/.test(link)) {
      return link.replace(/refresh=[^#\?\&]*/, randomVal);
    }
    return link.replace('#', `&${randomVal}#`);
  }
  return link.replace('#', `?${randomVal}#`);
}

// 进入新的路由的时候，如果当前地址和菜单地址匹配，更新菜单的链接
// 避免在单页路由中跳转的时候，refresh参数一致导致没有刷新
function updateMenu() {
  const currentHash = window.location.hash.replace(/\?.*/, '');
  const currentMenu = document.querySelector('.selected a');
  const menus = document.querySelectorAll('#gloablMenu a');
  const menuTree = document.getElementById('authMenuTree');
  window.scrollTo(0, 0); // 前端路由后，重置scroll位置
  if (menus && menus.length) {
    Array.prototype.slice.call(menus).forEach(item => {
      if (item.href.endsWith(currentHash)) {
        item.href = replaceLink(item.href);
        item.parentNode.className = 'selected';
        if (menuTree) {
          const newMenuCode = item.parentNode.getAttribute('data-mcode');
          menuTree.setAttribute('data-cmenu', newMenuCode);
        }

        if (currentMenu) {
          currentMenu.parentNode.className = '';
        }
        return true;
      }
    });
  }
  keepSession(); // 几乎每个页面都过期时间太短。
}

// 初始化时候替换所有单页链接,为链接加上强制刷新参数
const links = Array.prototype.slice.call(document.querySelectorAll('#gloablMenu a'));
links.forEach(item => {
  if (!!~item.href.indexOf('main.htm') || !!~item.href.indexOf('promotion.htm')) {
    item.href = replaceLink(item.href);
  }
}); // 只有main.htm, promotion.htm 的页面走单页路由

const RouteArray = indexRoutes
  .concat(memberMarketingRoutes)
  .concat(marketingActivityRoutes)
  .concat(shopRoutes)
  .concat(decorationMaterialRoutes)
  .concat(mallRoutes)
  .concat(workflowRoutes)
  .concat(itemManagementRoutes)
  .concat(settlement)
  .concat(itemPormoRoutes)
  .concat(stuffRoutes)
  .concat(agreementRoutes)
  .concat(promote)
  .concat(oneClickMoveRoutes)
  .concat(emeberRouters)
  .concat(microblogRouters)
  .concat(brandAccountRoutes)
  .concat(materialCenterRoutes);

const RouteCollection = RouteArray.map((props, index) => {
  return <Route {...props} key={index} />;
});

// 998去除在中台中会抖动的情况
ReactDOM.render(
  <div style={{ height: '100%' }}>
    <div style={{ width: 998, height: '100%', position: 'relative' }}>
      <Router history={hashHistory} onUpdate={updateMenu}>
        {RouteCollection}
      </Router>
    </div>
  </div>,
  document.getElementById('react-content')
);

// 展示通用提示信息
const commonMessage = getUriParam('cmsg');
if (commonMessage) {
  message.info(commonMessage, 0);
}
