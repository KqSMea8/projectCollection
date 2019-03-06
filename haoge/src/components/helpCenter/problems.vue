<template>
    <div class="wyx problems">
        <el-tabs tab-position="left">
            <el-tab-pane v-for="(items,index) in dataList" :key="index" :label="items.classify">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item v-for="(item,index) in items.details" :key="index" :title="item.title"
                                      :name="index">
                        <div class="da">答：</div>
                        <div class="daCon">{{item.con}}</div>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'

    export default {
        data() {
            return {
                activeName: 0,
                dataList: [
                    {
                        classify: '支付业务问答',
                        details: [
                            {
                                title: '1、EDC模式和DCC模式的区别？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            }, {
                                title: '2、EDC模式和DCC模式的区别？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            }, {
                                title: '3、EDC模式和DCC模式的区别？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            }, {
                                title: '4、EDC模式和DCC模式的区别？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            },
                        ]
                    }, {
                        classify: 'MPS商户后台操作问答',
                        details: [
                            {
                                title: '1、MPS商户后台操作问答？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            },
                        ]
                    }, {
                        classify: '清算业务问答',
                        details: [
                            {
                                title: '1、清算业务问答？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            },
                        ]
                    }, {
                        classify: '保证金相关问答',
                        details: [
                            {
                                title: '1、保证金相关问答？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            },
                        ]
                    }, {
                        classify: '退款业务问答',
                        details: [
                            {
                                title: '1、退款业务问答？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            },
                        ]
                    }, {
                        classify: '预授权交易问答',
                        details: [
                            {
                                title: '1、预授权交易问答？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            },
                        ]
                    }, {
                        classify: '动态预授权交易问答',
                        details: [
                            {
                                title: '1、动态预授权交易问答？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            },
                        ]
                    }, {
                        classify: '提现业务问答',
                        details: [
                            {
                                title: '1、提现业务问答？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            },
                        ]
                    }, {
                        classify: '拒付交易问答',
                        details: [
                            {
                                title: '1、拒付交易问答？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            },
                        ]
                    }, {
                        classify: '风险订单相关问答',
                        details: [
                            {
                                title: '1、风险订单相关问答？',
                                con: 'EDC模式，持卡人以商户网站的商品标价及币种进行支付。归还信用卡账单时，再按归还时汇率转换成卡本币 DCC模式，持卡人可以选择以持卡人的卡本币币种及转换后的金额进行支付。归还信用卡账单时，按支付时的金额支付'
                            },
                        ]
                    },
                ]
            };
        },

        created: function () {

        },

        methods: {}
    }

</script>

<style>
    .problems .el-tabs__item.is-active {
        background: rgba(24, 144, 255, 1);
        color: #fff;
    }

    .problems .el-tabs--left .el-tabs__item.is-left {
        text-align: left;
    }

    .problems .el-tabs__content {
        padding: 0 85px;
    }

    .problems .el-collapse-item__header {
        font-size: 16px;
        font-family: PingFangSC-Regular;
        line-height: 48px;
    }

    .problems .el-collapse-item__header.is-active {
        color: #1890FF;
    }

    .problems .da {
        float: left;
        width: 4%;
        font-size: 16px;
        color: rgba(51, 51, 51, 1);
        line-height: 22px;
    }

    .problems .daCon {
        float: left;
        width: 96%;
        font-size: 14px;
        color: rgba(85, 85, 86, 1);
        line-height: 22px;
    }

</style>
