<template>
    <div class="wyx modifyManageLoginPass">
        <!--<el-card class="box-card">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>重置操作员登录密码</span>-->
        <!--&lt;!&ndash;<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;-->
        <!--</div>-->
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="150px" class="demo-ruleForm"
                 style="width:50%">
            <el-form-item label="登录账号：">
                <span>{{message.loginName}}</span>
            </el-form-item>
            <el-form-item label="真实姓名：">
                <span>{{message.name}}</span>
            </el-form-item>
            <el-form-item label="新支付密码：" prop="newPwd">
                <el-input size="small" clearable type="password" v-model="ruleForm2.newPwd" auto-complete="off" clearable placeholder="请输入新支付密码"></el-input>
                <div class="tag">
                    <div class="qiangdu">
                        安全强度
                        <p v-show="pwdStrength==''" class="wu"><span></span><span></span><span></span></p>
                        <p v-show="pwdStrength=='di'" class="di"><span class="color"></span><span></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;低
                        </p>
                        <p v-show="pwdStrength=='zhong'" class="zhong"><span class="color"></span><span
                                class="color"></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;中</p>
                        <p v-show="pwdStrength=='gao'" class="gao"><span class="color"></span><span
                                class="color"></span><span class="color"></span>&nbsp;&nbsp;&nbsp;&nbsp;高</p>
                    </div>
                    <div>•请输入6~20字符，只能包含字母、数字、以及标点符号(除空格)，字母、数字、符号至少包含2种，字母区分大小写</div>
                    <i></i>
                </div>
            </el-form-item>
            <el-form-item label="确认新支付密码：" prop="checkPass">
                <el-input size="small" clearable type="password" v-model="ruleForm2.checkPass" auto-complete="off"
                          clearable
                          placeholder="请再次输入支付密码"></el-input>
            </el-form-item>
            <!--<el-form-item label="年龄" prop="age">-->
            <!--<el-input size=small clearable v-model.number="ruleForm2.age" clearable></el-input>-->
            <!--</el-form-item>-->
            <el-form-item>
                <el-button size="small" type="primary" @click="submitForm('ruleForm2',success,error)">确认重置</el-button>
                <router-link to="/home/accountManage/managementOperator">
                    <el-button size="small" type="default">取消</el-button>
                </router-link>
            </el-form-item>
        </el-form>
        <!--</el-card>-->
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import classPost from '../../servies/classPost'
    import {submitForm, getSubmitJson, reset} from '../../assets/js/submitForm'

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
                },
                rules2: {
                    newPwd: [
                        {required: true, message: '登录密码不能为空', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'},
                    ],
                    checkPass: [
                        {required: true, message: '登录密码不能为空', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                },
                pwdStrength: '',
                message:{
                    merchantId:'',
                    operatorId:'',
                    name:'',
                    loginName:''
                }
            }
        },
        methods: {
            submitForm,
//
//            submitForm(formName) {
//                this.$refs[formName].validate((valid) => {
//                    if (valid) {
//                        alert('submit!');
//                        this.$router.push('/home/accountManage/managementOperator');
//                    } else {
//                        console.log('error submit!!');
//                        return false;
//                    }
//                });
//            }
            success(children){
                let submitJson=getSubmitJson(children);
                submitJson.merchantId=this.message.merchantId;
                submitJson.operatorId=this.message.operatorId;
                submitJson.pwdType='T';
                delete submitJson.checkPass;
                console.log(submitJson)
                classPost.resetPass(submitJson)
                    .then((res)=>{
                        console.log(res)
                        this.$message({
                            message: '支付密码重置成功！',
                            type: 'success'
                        });
                        this.$router.push('/home/accountManage/managementOperator');
                    })
                    .catch();
            },
            error(){

            }
        },
        mounted:function () {
//            this.message=JSON.parse(this.$route.params.message);
            let arr=this.$route.params.message.split('-');
            this.message.merchantId=arr[0];
            this.message.operatorId=arr[1];
            this.message.name=arr[2];
            this.message.loginName=arr[3];
        }

    }
</script>
