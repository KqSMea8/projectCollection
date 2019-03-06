import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/login/login';
import Home from '@/components/home/home';
// home 子路由
import user from '@/components/home/child/user';
import operationscommoditylist from '@/components/home/child/operationscommoditylist/operationscommoditylist';
import operpages from '@/components/home/child/operpages/operpages';
import role from '@/components/home/child/role/role';
import memberlist from '@/components/home/child/memberlist/memberlist';
import order from '@/components/home/child/order/order';
import Account from '@/components/home/child/Account/Account';
import goodslist from '@/components/home/child/goodslist/goodslist';
import typelist from '@/components/home/child/typelist/typelist';
import refund from '@/components/home/child/refund/refund';
import statemen from '@/components/home/child/statemen/statemen';
import discount from '@/components/home/child/discount/discount';
import operations from '@/components/home/child/operations/operations.vue';
import discountDispenseList from '@/components/home/child/discountDispenseList/discountDispenseList.vue';
Vue.use(Router);

const route = new Router({
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            redirect: '/home/order',
            children: [ // 二级路由
                {
                    path: 'operations',
                    name: 'operations',
                    component: operations,
                    meta: {
                        title: '运营位列表'
                    }
                },
                {
                    path: 'operationscommoditylist',
                    name: 'operationscommoditylist',
                    component: operationscommoditylist,
                    meta: {
                        title: '运营内容列表'
                    }
                },
                {
                    path: 'user',
                    name: 'user',
                    component: user,
                    meta: {
                        title: 'user'
                    }
                },
                {
                    path: 'operpages',
                    name: 'operpages',
                    component: operpages,
                    meta: {
                        title: '页面列表'
                    }
                },
                {
                    path: 'role',
                    name: 'role',
                    component: role,
                    meta: {
                        title: '角色列表'
                    }
                },
                {
                    path: 'memberlist',
                    name: 'memberlist',
                    component: memberlist,
                    meta: {
                        title: '成员列表'
                    }
                },
                {
                    path: 'order',
                    name: 'order',
                    component: order,
                    meta: {
                        title: '订单列表'
                    }
                },
                {
                    path: 'goodslist',
                    name: 'goodslist',
                    component: goodslist,
                    meta: {
                        title: '商品列表'
                    }
                },
                {
                    path: 'typelist',
                    name: 'typelist',
                    component: typelist,
                    meta: {
                        title: '规格列表'
                    }
                },
                {
                    path: 'Account',
                    name: 'Account',
                    component: Account,
                    meta: {
                        title: '商家结算明细'
                    }
                },
                {
                    path: 'statemen',
                    name: 'statemen',
                    component: statemen,
                    meta: {
                        title: '商家对账单'
                    }
                },
                {
                    path: 'refund',
                    name: 'refund',
                    component: refund,
                    meta: {
                        title: '用户退款'
                    }
                },
                {
                    path: 'discount',
                    name: 'discount',
                    component: discount,
                    meta: {
                        title: '优惠券管理'
                    }
                },
                {
                    path: 'discountDispenseList',
                    name: 'discountDispenseList',
                    component: discountDispenseList,
                    meta: {
                        title: '优惠券发放列表'
                    }
                }
            ]
        }
    ]
});
route.beforeEach((to, from, next) => {
    const title = to.meta.title;
    this.a.app.$options.store.dispatch('changTitle', title);
    next();
});
export default route;
