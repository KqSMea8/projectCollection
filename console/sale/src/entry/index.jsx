import 'babel-polyfill';
import '../common/';
import Index from '../component/index/Index';
import KbAppFramework from '@alipay/kb-framework/framework/KbAppFramework';
import shopRoutes from '../component/shop/routes';
import leadsRoutes from '../component/leads/routes';
import SystemsRoutes from '../component/system/routes';
import merchantRoutes from '../component/merchant/routes';
import goodsRoutes from '../component/goods/routes';
import photoRoutes from '../component/photo/routes';
import commissionRoutes from '../component/commission/routes';
import materialRoutes from '../component/material/routes';
import activityRoutes from '../component/activity/routes';
import contractRoutes from '../component/contract/routes';
import decorationRoutes from '../component/decoration/routes';
import mallRoutes from '../component/mall/routes';
import workflowRoutes from '../component/workflow/routes';
import recordRoutes from '../component/record/routes';
import brandRoutes from '../component/brand/routes';
import signRoutes from '../component/sign/routes';
import agreementRoutes from '../component/agreement/routes';
import cityAreaRoutes from '../component/CityArea/routes';
import promotion from '../component/promotion/routes';
import intelligentGoodsRoutes from '../component/IntelligentGoods/routes';
import todoTaskRoutes from '../component/TodoTask/routes';
import ValidationSKU from '../component/ValidationSKU/routes';
import SuperStar from '../component/SuperStar/routes';
import tkaRoutes from '../component/tka/route';
import taskRoutes from '../component/task/route';
import newCateringRoutes from '../component/new-catering/routes';
import authTree from '../component/authTree/routes';
import queryAuth from '../component/queryAuth/routes';
import brandShopGroupRoutes from '../component/BrandShopGroup/routes';
import batchFileManagerRoutes from '../component/batchFileManager/routes';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router } from 'react-router';
import { LocaleProvider } from 'antd';
import zhCN from '../common/zhCN';
const buserviceUrl = window.APP.buserviceUrl || '';

/* eslint-disable */
!(function(t, e, a, r, c) {
  (t.TracertCmdCache = t.TracertCmdCache || []),
    (t[c] = window[c] || {
      _isInit: !0,
      call: function() {
        t.TracertCmdCache.push(arguments);
      },
      start: function(t) {
        this.call('start', t);
      },
    }),
    (t[c].l = new Date());
  var n = e.createElement(a),
    s = e.getElementsByTagName(a)[0];
  (n.async = !0), (n.src = r), s.parentNode.insertBefore(n, s);
})(
  window,
  document,
  'script',
  'https://tracert.alipay.com/tracert.js',
  'Tracert'
);
Tracert.start({
  plugins: ['BucName'],
  spmAPos: 'a334',
  spmBPos: 'b3999',
  bucUserId: window.APP.uvUserId, // 上报自动化埋点的 uid
  role_id: window.APP.uvUserId, // 兼容手动上报的 tracert 的 uid 字段
});

window.addEventListener('message', e => {
  if (e.data && typeof e.data === 'string') {
    try {
      const data = JSON.parse(e.data);
      if (data.data && data.data.action === 'redirect' && data.sourceOrigin) {
        window.location.href = data.sourceOrigin;
      }
    } catch (err) {
      // 容错处理
      // 全局监听，难免收到不兼容的消息
    }
  }
});

function refreshSpaUrlDOM(key) {
  const url = `${location.protocol}//${key}`;
  const cur = document.querySelector('#tracker-spa-url');
  if (cur && cur.value !== url) {
    if (cur.remove) {
      cur.remove();
    } else if (cur.removeNode) {
      cur.removeNode(true);
    }
  }
  if (!cur || cur.value !== url) {
    const routePathDOM = document.createElement('input');
    Object.assign(routePathDOM, {
      id: 'tracker-spa-url',
      name: 'tracker-spa-url',
      type: 'hidden',
      value: url,
    });
    document.body.appendChild(routePathDOM);
  }
}

function onEnterHandle({ routes }) {
  refreshSpaUrlDOM(
    location.host +
      location.pathname +
      '/' +
      routes
        .map(({ path }) => (path.charAt(0) === '/' ? path.substr(1) : path))
        .join('/')
        .replace(':', '')
  );
}

function routeGenerate(route) {
  let pre = () => {};
  if (route.onEnter && typeof route.onEnter === 'function') {
    pre = route.onEnter;
  }
  route.onEnter = function wrapperFunc(...arg) {
    onEnterHandle.apply(this, arg);
    pre.apply(this, arg);
  };
  if (route.childRoutes && route.childRoutes.length) {
    route.childRoutes.forEach(cr => routeGenerate(cr));
  }
}

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <KbAppFramework
      additionalInfo={window.APP.serviceInfo}
      platformType="kb-sale"
      urlWhiteList={[/^.*$/]}
      buserviceUrl={buserviceUrl}
      Router={Router}
      name="销售工作台"
    >
      {[
        {
          path: '/',
          component: Index,
          onEnter(state, replace) {
            if (window.APP.isShowKAIndex) {
              replace(null, '/tka/dashboard');
            }
          },
        },
      ]
        .concat(shopRoutes)
        .concat(leadsRoutes)
        .concat(merchantRoutes)
        .concat(SystemsRoutes)
        .concat(goodsRoutes)
        .concat(photoRoutes)
        .concat(commissionRoutes)
        .concat(materialRoutes)
        .concat(contractRoutes)
        .concat(activityRoutes)
        .concat(decorationRoutes)
        .concat(mallRoutes)
        .concat(ValidationSKU)
        .concat(SuperStar)
        .concat(workflowRoutes)
        .concat(recordRoutes)
        .concat(brandRoutes)
        .concat(signRoutes)
        .concat(agreementRoutes)
        .concat(cityAreaRoutes)
        .concat(promotion)
        .concat(tkaRoutes)
        .concat(taskRoutes)
        .concat(intelligentGoodsRoutes)
        .map(route => {
          routeGenerate(route);
          return route;
        })
        .concat(todoTaskRoutes)
        .concat(newCateringRoutes)
        .concat(brandShopGroupRoutes)
        .concat(batchFileManagerRoutes)
        .concat(authTree)
        .concat(queryAuth)
      }
    </KbAppFramework>
  </LocaleProvider>,
  document.getElementById('react-content')
);
