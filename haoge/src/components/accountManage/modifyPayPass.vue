<template>
    <div class="wyx modifyLoginPass">
        <!--<el-card  class="box-card">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>修改登录密码</span>-->
        <!--&lt;!&ndash;<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;-->
        <!--</div>-->
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="150px" class="demo-ruleForm"
                 style="width:50%">
            <el-form-item label="操作员名称：">
                <span>{{message.loginName}}</span>
            </el-form-item>
            <el-form-item label="当前支付密码：" prop="origPwd">
                <el-input size="small" type="password" auto-complete="off" v-model="ruleForm2.origPwd" clearable placeholder="请输入当前支付密码"></el-input>
            </el-form-item>
            <el-form-item label="新支付密码：" prop="newPwd">
                <el-input size="small" type="password" v-model="ruleForm2.newPwd" auto-complete="off" clearable placeholder="请输入新支付密码"></el-input>
                <div class="tag">
                    <div class="qiangdu">
                        安全强度
                        <p v-show="pwdStrength==''" class="wu"><span></span><span></span><span></span></p>
                        <p v-show="pwdStrength=='di'" class="di"><span class="color"></span><span></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;低</p>
                        <p v-show="pwdStrength=='zhong'" class="zhong"><span class="color"></span><span class="color"></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;中</p>
                        <p v-show="pwdStrength=='gao'" class="gao"><span class="color"></span><span class="color"></span><span class="color"></span>&nbsp;&nbsp;&nbsp;&nbsp;高</p>
                    </div>
                    <div>•请输入6~20字符，只能包含字母、数字、以及标点符号(除空格)，字母、数字、符号至少包含2种，字母区分大小写</div>
                    <i></i>
                </div>
            </el-form-item>
            <el-form-item label="确认新支付密码：" prop="checkPass">
                <el-input size="small" type="password" v-model="ruleForm2.checkPass" auto-complete="off" clearable placeholder="请再次输入支付密码"></el-input>
            </el-form-item>
            <!--<el-form-item label="年龄" prop="age">-->
            <!--<el-input size="small" v-model.number="ruleForm2.age" clearable></el-input>-->
            <!--</el-form-item>-->
            <el-form-item>
                <el-button size="small" type="primary" @click="submitForm('ruleForm2',success,fail)">提交</el-button>
                <router-link to="/home/accountManage">
                    <el-button size="small" type="default">取消</el-button>
                </router-link>
            </el-form-item>
        </el-form>
        <!--</el-card>-->
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import {submitForm, getSubmitJson, reset} from '../../assets/js/submitForm'
    import classPost from '../../servies/classPost'

    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (!/(?!^(\d+|[a-zA-Z_]+|[~!@#$%^&*?,.:;\+\-=/'"<>\|\[\]\(\)]+)$)^[\w~!@#$%\^&*?_,.:;\+\-=/'"<>\(\)\|\[\]]{6,20}$/.test(value)) {
                    this.pwdStrength = ''
                    callback(new Error('请按规则输入'));
                } else {
                    let length = value.length;
                    //低
                    if ( length < 10 ) {
                        this.pwdStrength = 'di'
                    }
                    //    中
                    if ( length < 15 && length >= 10 ) {
                        this.pwdStrength = 'zhong'
                    }
                    //    高
                    if ( length >= 15 ) {
                        this.pwdStrength = 'gao'
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value !== this.ruleForm2.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm2: {
                    newPwd: '',
                    checkPass: '',
                    origPwd: ''
                },
                rules2: {
                    newPwd: [
                        {required: true, message: '新密码不能为空', trigger: "blur"},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {required: true, message: '确认密码不能为空', trigger: "blur"},
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    origPwd: [
                        {required: true, message: '当前登录密码不能为空', trigger: "blur"}
                    ]
                },
                pwdStrength: '',
                message:{
                    loginName:'',
                    merchantId:'',
                    operatorId:''
                }
            }
        },
        methods: {
            submitForm,
            getSubmitJson,
            reset,
            success(children) {
                let submitJson = this.getSubmitJson(children);
                submitJson.pwdType = 'T';
                submitJson.merchantId = this.message.merchantId;
                submitJson.operatorId = this.message.operatorId;
                delete submitJson.checkPass;
                classPost.modifyLoginPass(submitJson)
                    .then((res) => {
                        this.$message({
                            message: '您已成功修改支付密码',
                            type: 'success'
                        });
                        this.$router.push('/home/accountManage/')
                        console.log(res)
                    })
                    .catch(() => {

                    })
                console.log(submitJson);
            },
            fail() {
                console.log('验证失败');
            },
        },
        mounted:function () {
            let arr=this.$route.params.message.split('-');
            this.message.loginName=arr[0];
            this.message.merchantId=arr[1];
            this.message.operatorId=arr[2];
        }
    }
</script>
