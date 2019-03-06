import React from 'react';
import ReactDOM from 'react-dom';
import '../common/';
import clueTrackerInit from '../common/ClueTracker';
import { Router, Route, hashHistory } from 'react-router';
import dishRoutes from '../component/dishes/routes';
import {keepSession} from '../common/utils';

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

// 点击后更新链接
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

// 初始化时候替换所有单页链接
const links = Array.prototype.slice.call(document.querySelectorAll('#gloablMenu a'));
links.forEach(item => {
  if (!!~item.href.indexOf('main.htm')) {
    item.href = replaceLink(item.href);
  }
});// 只有main.htm的页面走单页路由

const RouteCollection = dishRoutes.map((props, index) => {
  return <Route {...props} key={index} />;
});

ReactDOM.render((
  <Router history={hashHistory} onUpdate={updateMenu}>
    {RouteCollection}
  </Router>
), document.getElementById('react-content'));

