<template>
    <div class="wyx addRole">
        <!--<el-card class="box-card">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>角色详情</span>-->
        <!--&lt;!&ndash;<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;-->
        <!--</div>-->
        <el-form :model="ruleForm2" label-width="150px" class="demo-ruleForm"
                 style="width:50%">
            <el-form-item label="角色名称：">
                <span>{{ruleForm2.roleName}}</span>
            </el-form-item>
            <el-form-item label="角色描述：">
                <span>{{ruleForm2.remark}}</span>
            </el-form-item>
            <el-form-item label="可操作权限：">
                <el-tree
                        :data="data3"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[1]"
                        :default-checked-keys="checkData"
                        :props="defaultProps"
                        @check="check">
                </el-tree>
            </el-form-item>
        </el-form>
        <!--</el-card>-->
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import classPost from '../../servies/classPost'

    export default {
        data() {
            return {
                ruleForm2: {
                    name: '',
                    describe: '',
                    age: ''
                },
                data2: [
                    {
                        disabled: true,
                        id: 1,
                        label: this.$t('LANG.navbar.fund.index'),
                        children: [
                            {
                                disabled: true,
                                id: 10,
                                label: this.$t('LANG.navbar.fund.balanceOfAccount')
                            }, {
                                disabled: true,
                                id: 11,
                                label: this.$t('LANG.navbar.fund.TheBalanceOfSubsidiary')
                            }, {
                                disabled: true,
                                id: 12,
                                label: this.$t('LANG.navbar.fund.withdrawDeposit')
                            }, {
                                disabled: true,
                                id: 13,
                                label: this.$t('LANG.navbar.fund.currencyExchange')
                            }, {
                                disabled: true,
                                id: 14,
                                label: this.$t('LANG.navbar.fund.ToSettleTheQuery')
                            }]
                    }, {
                        disabled: true,
                        id: 2,
                        label: this.$t('LANG.navbar.deal.index'),
                        children: [
                            {
                                disabled: true,
                                id: 15,
                                label: this.$t('LANG.navbar.deal.transactionQuery')
                            }, {
                                disabled: true,
                                id: 16,
                                label: this.$t('LANG.navbar.deal.transactionProcessing')
                            }, {
                                disabled: true,
                                id: 17,
                                label: this.$t('LANG.navbar.deal.RefusalOfPaymentProcessing')
                            }]
                    }, {
                        disabled: true,
                        id: 3,
                        label: this.$t('LANG.navbar.TheOnlineOrder'),
                    }, {
                        disabled: true,
                        id: 4,
                        label: this.$t('LANG.navbar.payment.index'),
                        children: [
                            {
                                disabled: true,
                                id: 18,
                                label: this.$t('LANG.navbar.payment.PaymentChainGeneration')
                            }, {
                                disabled: true,
                                id: 19,
                                label: this.$t('LANG.navbar.payment.PaymentChainQuery')
                            }, {
                                disabled: true,
                                id: 20,
                                label: this.$t('LANG.navbar.payment.BasicInformationMaintenance')
                            }]
                    }, {
                        disabled: true,
                        id: 5,
                        label: this.$t('LANG.navbar.reconciliation.index'),
                        children: [
                            {
                                disabled: true,
                                id: 21,
                                label: this.$t('LANG.navbar.reconciliation.StatementOfAccount')
                            }]
                    }, {
                        disabled: true,
                        id: 6,
                        label: this.$t('LANG.navbar.risk.index'),
                        children: [
                            {
                                disabled: true,
                                id: 22,
                                label: this.$t('LANG.navbar.risk.RuleConfiguration')
                            }, {
                                disabled: true,
                                id: 23,
                                label: this.$t('LANG.navbar.risk.BlacklistManagement')
                            }, {
                                disabled: true,
                                id: 24,
                                label: this.$t('LANG.navbar.risk.riskOrderAudit')
                            }]
                    }, {
                        disabled: true,
                        id: 7,
                        label: this.$t('LANG.navbar.configuration.index'),
                        children: [
                            {
                                disabled: true,
                                id: 25,
                                label: this.$t('LANG.navbar.configuration.SubjectManagement')
                            }, {
                                disabled: true,
                                id: 26,
                                label: this.$t('LANG.navbar.configuration.keyManagement')
                            }, {
                                disabled: true,
                                id: 27,
                                label: this.$t('LANG.navbar.configuration.MessagePushConfiguration')
                            }]
                    }, {
                        disabled: true,
                        id: 8,
                        label: this.$t('LANG.navbar.ID.index'),
                        children: [
                            {
                                disabled: true,
                                id: 28,
                                label: this.$t('LANG.navbar.ID.essentialInformation')
                            }, {
                                disabled: true,
                                id: 29,
                                label: this.$t('LANG.navbar.ID.operatorManagement')
                            }, {
                                disabled: true,
                                id: 30,
                                label: this.$t('LANG.navbar.ID.securitySettings')
                            }, {
                                disabled: true,
                                id: 31,
                                label: this.$t('LANG.navbar.ID.ShortcutEntryConfiguration')
                            }, {
                                disabled: true,
                                id: 32,
                                label: this.$t('LANG.navbar.ID.WithdrawalCardManagement.index.index'),
                            }, {
                                disabled: true,
                                id: 33,
                                label: this.$t('LANG.navbar.ID.myMessage'),
                            }, {
                                disabled: true,
                                id: 34,
                                label: this.$t('LANG.navbar.ID.logQuery'),
                            }]
                    }, {
                        disabled: true,
                        id: 9,
                        label: this.$t('LANG.navbar.helpCenter.index'),
                        children: [
                            {
                                disabled: true,
                                id: 35,
                                label: this.$t('LANG.navbar.helpCenter.FAQ')
                            }, {
                                disabled: true,
                                id: 36,
                                label: this.$t('LANG.navbar.helpCenter.contactWay')
                            }]
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                data3: [],
                checkData: []
            }
        },
        methods: {
            check(a, b) {
//        console.log(a, b);
                this.ruleForm2.age = b.checkedKeys;
            }
        },
        mounted: function () {
            classPost.roleDetail({roleId: this.$route.params.id})
//            classPost.roleDetail({roleId: '81'})
                .then((res) => {
                    for (let i = 0; i < res.data.resourceTreeList.length; i++) {
                        if (res.data.resourceTreeList[i].childList != null) {
//                              有子树
                            for(let j=0;j<res.data.resourceTreeList[i].childList.length;j++){
                                if(res.data.resourceTreeList[i].childList[j].checked=='1') {
//                                选中
                                    this.checkData.push(res.data.resourceTreeList[i].childList[j].orderId);
                                }
                            }
                        } else {
//                            无子树
                            if(res.data.resourceTreeList[i].checked=='1') {
//                                选中
                                this.checkData.push(res.data.resourceTreeList[i].orderId);
                            }
                        }

                    }
                    console.log(this.checkData);
                    this.ruleForm2 = res.data;
                    classPost.queryResource({})
                        .then((res) => {
//                    this.ruleForm2 = res.data;
                            let d = [];
                            for (let i = 0; i < res.data.length; i++) {
                                let dataL = [];
                                if (res.data[i].childResourceList != [] && res.data[i].childResourceList != null) {
                                    for (let j = 0; j < res.data[i].childResourceList.length; j++) {
                                        dataL.push({
                                            disabled: true,
                                            id: res.data[i].childResourceList[j].resourceId,
                                            label: res.data[i].childResourceList[j].name
                                        })
                                    }
                                }
                                d.push({
                                    disabled: true,
                                    id: res.data[i].resourceId,
                                    label: res.data[i].name,
                                    children: dataL
                                })
                            }
                            this.data3 = d;
                        }).catch((err) => {
                        console.log(err)
                    });
//                    classPost.queryRoleResource({roleId: this.$route.params.id})
//                        .then((res) => {
//                            this.checkData = res.data;
//                            console.log(res.data);
//                        }).catch((err) => {
//                        console.log(err)
//                    });
                    console.log(res.data);
                }).catch((err) => {
                console.log(err)
            });

        }
    }
</script>
