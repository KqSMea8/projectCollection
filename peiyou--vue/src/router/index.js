import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/login';
import Home from '@/components/home';
import Order from '@/components/order/order';
import Role from '@/components/role/role';
import discount from '@/components/discount/discount';
import upload from '@/components/discountDispenseList/upload';

Vue.use(Router);
const routers = new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            redirect: '/home/welcome',
            children: [
                {
                    path: '/home/welcome',
                    name: 'welcome',
                    meta: {
                        title: 'default'
                    },
                    component: {
                        template: '<div>欢迎进入</div>'
                    }
                },
                {
                    path: '/home/operations',
                    name: 'operations',
                    meta: {
                        title: '运营位列表'
                    },
                    component: {
                        template: '<div>运营位列表</div>'
                    }
                },
                {
                    path: '/home/operationscommoditylist',
                    name: 'operationscommoditylist',
                    meta: {
                        title: '运营内容列表'
                    },
                    component: {
                        template: '<div>运营内容列表</div>'
                    }
                },
                {
                    path: '/home/operpages',
                    name: 'operpages',
                    meta: {
                        title: '页面列表'
                    },
                    component: {
                        template: '<div>页面列表</div>'
                    }
                },
                {
                    path: '/home/role',
                    name: 'role',
                    meta: {
                        title: '角色列表'
                    },
                    component: Role
                },
                {
                    path: '/home/memberlist',
                    name: 'memberlist',
                    meta: {
                        title: '成员列表'
                    },
                    component: {
                        template: '<div>成员列表</div>'
                    }
                },
                {
                    path: '/home/order',
                    name: 'order',
                    meta: {
                        title: '订单列表'
                    },
                    component: Order
                },
                {
                    path: '/home/goodslist',
                    name: 'goodslist',
                    meta: {
                        title: '商品列表'
                    },
                    component: {
                        template: '<div>商品列表</div>'
                    }
                },
                {
                    path: '/home/typelist',
                    name: 'typelist',
                    meta: {
                        title: '规格列表'
                    },
                    component: {
                        template: '<div>规格列表</div>'
                    }
                },
                {
                    path: '/home/Account',
                    name: 'Account',
                    meta: {
                        title: '商家结算明细'
                    },
                    component: {
                        template: '<div>商家结算明细</div>'
                    }
                },
                {
                    path: '/home/statemen',
                    name: 'statemen',
                    meta: {
                        title: '商家对账单'
                    },
                    component: {
                        template: '<div>商家对账单</div>'
                    }
                },
                {
                    path: '/home/refund',
                    name: 'refund',
                    meta: {
                        title: '用户退款'
                    },
                    component: {
                        template: '<div>用户退款</div>'
                    }
                },
                {
                    path: '/home/discount',
                    name: 'discount',
                    meta: {
                        title: '优惠券管理'
                    },
                    component: discount
                },
                {
                    path: '/home/discountDispenseList',
                    name: 'discountDispenseList',
                    meta: {
                        title: '优惠券发放列表'
                    },
                    component: upload
                }
            ]
        }
    ]
}
);
routers.beforeEach((to, from, next) => {
    const title = to.meta.title;
    this.a.app.$store.dispatch('getTitle', title);
    next();
}
);
export default routers;
