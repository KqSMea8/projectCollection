<template>
    <div class="wyx securitySet">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>安全设置</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            </div>
            <div class="set">
                <div class="con">
                    <div class="row">
                        <div class="left">会员名称：</div>
                        <div class="mid">{{message.name}}</div>
                    </div>
                    <div class="row">
                        <div class="left">会员号：</div>
                        <div class="mid">{{message.id}}</div>
                    </div>
                    <div class="row">
                        <div class="left">当前操作员名称：</div>
                        <div class="mid">{{message.nowName}}</div>
                    </div>
                </div>
                <div class="con">
                    <div class="row">
                        <div class="left">登录密码：</div>
                        <div class="mid">定期更换密码会让您的账号更加安全。</div>
                        <div class="right">
                            <el-button type="text">
                                <router-link to="/home/accountManage/safeMain/modifyLoginPass">修改</router-link>
                            </el-button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="left"></div>
                        <div class="mid">密码最少6位，需使用字母、数字和符号两种及以上的组合。</div>
                    </div>
                </div>
                <div class="con">
                    <div class="row">
                        <div class="left">支付密码：</div>
                        <div class="mid">定期更换密码会让您的账号更加安全。</div>
                        <div class="right">
                            <el-button type="text">
                                <router-link to="/home/accountManage/safeMain/modifyPayPass">修改</router-link>
                            </el-button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="left"></div>
                        <div class="mid">密码最少6位，需使用字母、数字和符号两种及以上的组合。</div>
                    </div>
                </div>
                <div class="con">
                    <div class="row">
                        <div class="left">手机绑定：</div>
                        <div class="mid">您已绑定手机{{message.tel}}</div>
                        <div class="right">

                                <router-link to="/home/accountManage/safeMain/modifyTelPass"><el-button type="text">修改</el-button></router-link>

                        </div>
                    </div>
                </div>
                <div class="con">
                    <div class="row">
                        <div class="left">邮箱绑定：</div>
                        <div class="mid">
                            <span v-show="message.email==''">您还没有设置绑定邮箱，快去设置吧！</span>
                            <span v-show="message.email!=''">您已绑定了邮箱{{message.email}}</span>
                        </div>
                        <div class="right">
                            <router-link v-show="message.email!=''" to="/home/accountManage/safeMain/modifyEmail">
                                <el-button type="text">修改</el-button>
                            </router-link>
                            <router-link v-show="message.email==''" to="/home/accountManage/safeMain/setEmail">
                                <el-button type="text" style="color: #ffa104;">设置</el-button>
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

    export default {
        data() {
            return {
                message: {
                    name: '会员名称',
                    id: '123456',
                    nowName: '当前',
                    tel: '18555552222',
//          email:'184@erter.com'
                    email: ''
                }
            }
        }
    }
</script>

<style>
    .securitySet .set {
        padding: 0 30px;
    }

    .securitySet .set .con {
        padding: 20px 0;
        border-bottom: 1px dashed #d6d3d3;
    }

    .securitySet .set .con .row {
        overflow: hidden;
        height: 30px;
        line-height: 30px;
    }

    .securitySet .set .con:last-child {
        border: 0;
    }

    .securitySet .set .con .left {
        width: 120px;
        float: left;
        text-align: right;
        min-height: 1px;
    }

    .securitySet .set .con .mid {
        /*width: 100px;*/
        float: left;
    }

    .securitySet .set .con .right {
        float: right;
    }
</style>
