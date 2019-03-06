<template>
    <div class="wyx baseInfo">
        <!-- html这里开始 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>商户信息</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            </div>
            <div class="message">
                <div class="set">
                    <div class="con">
                        <div class="row">
                            <div class="width3P">
                                <div class="left">商户名称：</div>
                                <div class="mid">{{message.baseInfo.name}}</div>
                            </div>
                            <div class="width3P">
                                <div class="left">商户号：</div>
                                <div class="mid">{{message.baseInfo.merchantId}}</div>
                            </div>
                            <div class="width3P">
                                <div class="left">邮箱：</div>
                                <div class="mid">{{message.baseInfo.email}}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="width3P">
                                <div class="left">联系电话：</div>
                                <div class="mid">{{message.baseInfo.legalPhone}}</div>
                            </div>
                            <div class="width3P">
                                <div class="left">联系地址：</div>
                                <div class="mid">{{message.baseInfo.regAddress}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>当前操作员信息</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            </div>
            <div class="set">
                <div class="con">
                    <div class="row">
                        <div class="left">操作员名称：</div>
                        <div class="mid">{{message.operatorInfo.loginName}}</div>
                    </div>
                    <div class="row">
                        <div class="left">操作员姓名：</div>
                        <div class="mid">{{message.operatorInfo.name}}</div>
                    </div>
                    <div class="row">
                        <div class="left">备注：</div>
                        <div class="mid black50p">{{message.operatorInfo.memo}}</div>
                    </div>
                    <div class="row">
                        <div class="left">登录密码：</div>
                        <div class="mid black50p mds">定期更换密码会让您的账号更加安全。</div>
                        <div class="right">
                            <!--
                            message.baseInfo.merchantId
                            message.operatorInfo.operatorId -->
                            <router-link :to="{name:'LANG.router.accountManage.modifyLoginPass',params:{message:`${message.operatorInfo.loginName}-${message.baseInfo.merchantId}-${message.operatorInfo.operatorId}`}}">
                                <el-button style="height: 24px" type="primary" plain size="mini">修改</el-button>
                            </router-link>
                        </div>
                    </div>
                    <!--<div class="row">-->
                    <!--<div class="left"></div>-->
                    <!--<div class="mid">密码最少6位，需使用字母、数字和符号两种及以上的组合。</div>-->
                    <!--</div>-->
                    <div class="row">
                        <div class="left">支付密码：</div>
                        <div class="mid black50p mds">定期更换密码会让您的账号更加安全。</div>
                        <div class="right">
                            <router-link :to="{name:'LANG.router.accountManage.modifyPayPass',params:{message:`${message.operatorInfo.loginName}-${message.baseInfo.merchantId}-${message.operatorInfo.operatorId}`}}">

                            <!--<router-link to="/home/accountManage/modifyPayPass">-->
                                <el-button style="height: 24px" type="primary" plain size="mini">修改</el-button>
                            </router-link>
                        </div>
                    </div>
                    <!--<div class="row">-->
                    <!--<div class="left"></div>-->
                    <!--<div class="mid">密码最少6位，需使用字母、数字和符号两种及以上的组合。</div>-->
                    <!--</div>-->
                    <div class="row">
                        <div class="left">手机绑定：</div>
                        <div class="mid black50p">
                            <span v-show="message.operatorInfo.phone==''||message.operatorInfo.phone==null" class="mds">您还没有设置绑定手机，快去设置吧！</span>
                            <span v-show="message.operatorInfo.phone!=''&&message.operatorInfo.phone!=null" class="mds">您已绑定手机{{message.operatorInfo.phone}}</span>
                        </div>
                        <div class="right">
                            <router-link :to="{name:'LANG.router.accountManage.modifyTelPass',params:{id:`${message.operatorInfo.loginName}-${message.operatorInfo.operatorId}-${message.operatorInfo.phone}`}}">
                                <el-button style="height: 24px" v-show="message.operatorInfo.phone!=null" type="primary" plain size="mini">修改
                                </el-button>
                            </router-link>
                            <router-link :to="{name:'LANG.router.accountManage.setTel',params:{id:`${message.operatorInfo.loginName}-${message.operatorInfo.operatorId}-${message.operatorInfo.phone}`}}">
                                <el-button style="height: 24px" v-show="message.operatorInfo.phone==null" type="warning" plain size="mini">设置
                                </el-button>
                            </router-link>
                        </div>
                    </div>
                    <div class="row">
                        <div class="left">邮箱绑定：</div>
                        <div class="mid black50p">
                            <span v-show="message.operatorInfo.email==''||message.operatorInfo.email=='未知'||message.operatorInfo.email==null" class="mds">您还没有设置绑定邮箱，快去设置吧！</span>
                            <span v-show="message.operatorInfo.email!=''&&message.operatorInfo.email!='未知'&&message.operatorInfo.email!=null" class="mds">您已绑定了邮箱{{message.operatorInfo.email}}</span>
                        </div>
                        <div class="right">
                            <router-link v-show="message.operatorInfo.email!=''&&message.operatorInfo.email!='未知'&&message.operatorInfo.email!=null" :to="{name:'LANG.router.accountManage.modifyEmail',params:{id:`${message.operatorInfo.loginName}-${message.operatorInfo.operatorId}-${message.operatorInfo.email}`}}">
                                <el-button style="height: 24px" type="primary" plain size="mini">修改</el-button>
                            </router-link>
                            <router-link v-show="message.operatorInfo.email==''||message.operatorInfo.email=='未知'||message.operatorInfo.email==null" :to="{name:'LANG.router.accountManage.setEmail',params:{id:`${message.operatorInfo.loginName}-${message.operatorInfo.operatorId}-${message.operatorInfo.email}`}}">
                                <el-button style="height: 24px" type="warning" plain size="mini">设置</el-button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import classPost from '../../servies/classPost'

    export default {
        data() {
            return {
                message: {
                    a: [
                        {}
                    ],
                    baseInfo: {},
                    operatorInfo: {
                        id: '123',
                        name: '张三',
                        loginName:'',
                        memo:'',
                        tel: '',
                        email: '1',
                        remark: 'hao ',
                    }
                }
            }
        },

        created: function () {

        },

        methods: {},
        mounted: function () {
//            商户信息
            classPost.merchant({})
                .then((res) => {
                this.message.baseInfo=res.data;
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
//            操作员信息
            classPost.nowManagementInfo({}).then((res) => {
                this.message.operatorInfo=res.data;
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        }
    }

</script>

<style>
    .baseInfo .message {
        /*padding: 0 30px;*/
    }

    .baseInfo .message p {
        height: 40px;
        line-height: 40px;
    }

    .baseInfo .set {
        padding: 0 30px;
    }
    .baseInfo .mds{
        font-size: 12px;
    }
    .baseInfo .set .con {
        /*padding: 20px 0;*/
        /*border-bottom:1px dashed #d6d3d3;*/
    }

    .baseInfo .set .con .row {
        overflow: hidden;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #E8E8E8;
    }

    .baseInfo .set .con .row:last-child {
        border: 0;
    }

    .baseInfo .set .con .left {
        width: 15%;
        float: left;
        text-align: right;
        min-height: 1px;
    }

    .baseInfo .set .con .mid {
        width: 40%;
        float: left;
    }
    .baseInfo .set .con .right {
        /*width: 45%;*/
        float: right;
    }
    .baseInfo .set .con .right span {
        font-size: 12px
    }
    .baseInfo .el-card__body {
        padding: 0;
    }
    .baseInfo .width3P{
        width: 33.3%;
        float: left;
    }
    .baseInfo .set .con .width3P .left{
        width: 40%;
    }
    .baseInfo .set .con .width3P .mid{
        width: 60%;
    }
</style>
