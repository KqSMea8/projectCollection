<template>
    <div class="wyx addManagement">
        <!--<el-card class="box-card">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>填写操作员信息</span>-->
        <!--&lt;!&ndash;<el-button size="small" style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;-->
        <!--</div>-->
        <!--    步骤条-->
        <el-steps :active="active" :finish-status="finishStatus" align-center>
            <el-step title="填写操作员信息"></el-step>
            <el-step title="密码设置"></el-step>
            <el-step :status="statusd" title="完成"></el-step>
        </el-steps>

        <!--填写信息-->
        <el-form v-show="active==0" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px"
                 class="demo-ruleForm">
            <el-form-item label="操作员名称：" prop="loginName">
                <el-input size="small" clearable v-model="ruleForm.loginName" placeholder="请输入操作员名称"></el-input>
                <div class="tag">操作员名称支持5-32位字母、数字、下划线组合<i></i></div>
            </el-form-item>
            <el-form-item label="操作员姓名：" prop="name">
                <el-input size="small" clearable v-model="ruleForm.name" placeholder="请输入操作员姓名"></el-input>
            </el-form-item>
            <el-form-item label="所属部门：" prop="department">
                <el-input size="small" clearable v-model="ruleForm.department" placeholder="请输入操作员所属部门"></el-input>
            </el-form-item>
            <!--<el-alert-->
            <!--title="操作员手机号和邮箱最少填写其中一项"-->
            <!--type="info"-->
            <!--show-icon>-->
            <!--</el-alert>-->
            <!--<el-form-item label="绑定手机号：" prop="phone">-->
            <!--<el-input size="small" clearable v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="绑定邮箱：" prop="email">-->
            <!--<el-input size="small" clearable v-model="ruleForm.email" placeholder="请输入邮箱地址"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="备注：" prop="memo">
                <el-input size="small" clearable type="textarea" v-model="ruleForm.memo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="submitForm('ruleForm',success1,fail1)">下一步</el-button>
                <router-link to="/home/accountManage/managementOperator">
                    <el-button size="small" type="default">取消</el-button>
                </router-link>
            </el-form-item>
        </el-form>

        <!--密码设置-->
        <el-form v-show="active==1" :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="150px"
                 class="demo-ruleForm">
            <el-form-item label="新登录密码：" prop="loginPassword">
                <el-input size="small" clearable type="password" v-model="ruleForm2.loginPassword"
                          placeholder="请输入登录密码"></el-input>
                <div class="tag">
                    <div class="qiangdu">
                        安全强度
                        <p v-show="pwdStrength1==''" class="wu"><span></span><span></span><span></span></p>
                        <p v-show="pwdStrength1=='di'" class="di"><span class="color"></span><span></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;低
                        </p>
                        <p v-show="pwdStrength1=='zhong'" class="zhong"><span class="color"></span><span
                                class="color"></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;中</p>
                        <p v-show="pwdStrength1=='gao'" class="gao"><span class="color"></span><span
                                class="color"></span><span class="color"></span>&nbsp;&nbsp;&nbsp;&nbsp;高</p>
                    </div>
                    <div>•请输入8~20字符，只能包含字母、数字、以及标点符号(除空格)，字母、数字、符号至少包含2种，字母区分大小写</div>
                    <i></i>
                </div>
            </el-form-item>
            <el-form-item label="确认登录密码：" prop="reLoginPass">
                <el-input size="small" clearable type="password" v-model="ruleForm2.reLoginPass"
                          placeholder="请再次输入登录密码"></el-input>
            </el-form-item>
            <el-form-item label="支付密码：" prop="payPassword">
                <el-input size="small" clearable type="password" v-model="ruleForm2.payPassword"
                          placeholder="请输入支付密码"></el-input>
                <div class="tag">
                    <div class="qiangdu">
                        安全强度
                        <p v-show="pwdStrength2==''" class="wu"><span></span><span></span><span></span></p>
                        <p v-show="pwdStrength2=='di'" class="di"><span class="color"></span><span></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;低
                        </p>
                        <p v-show="pwdStrength2=='zhong'" class="zhong"><span class="color"></span><span
                                class="color"></span><span></span>&nbsp;&nbsp;&nbsp;&nbsp;中</p>
                        <p v-show="pwdStrength2=='gao'" class="gao"><span class="color"></span><span
                                class="color"></span><span class="color"></span>&nbsp;&nbsp;&nbsp;&nbsp;高</p>
                    </div>
                    <div>•请输入8~20字符，只能包含字母、数字、以及标点符号(除空格)，字母、数字、符号至少包含2种，字母区分大小写</div>
                    <i></i>
                </div>
            </el-form-item>
            <el-form-item label="确认支付密码：" prop="rePayPass">
                <el-input size="small" clearable type="password" v-model="ruleForm2.rePayPass"
                          placeholder="请再次输入支付密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="default" @click="active--;$refs['ruleForm2'].resetFields();">返回上一步
                </el-button>
                <el-button size="small" type="primary" @click="submitForm('ruleForm2',success1,fail1)">下一步</el-button>
            </el-form-item>
        </el-form>

        <!--完成-->
        <div v-show="active==3" class="result">
            <div v-if="success==1">
                <p><span class="el-icon-success" style='color: #67C23A;font-size: 72px;margin: 86px 0 24px'></span></p>
                <p class="resultSuc">添加成功</p>
                <p class="resultTil">您已经成功添加操作员{{ruleForm.loginName}}，快去给操作员分配权限吧！</p>
            </div>
            <div v-else-if="success==0">
                <p><span class="el-icon-error" style='color: #c2402e;font-size: 72px;margin: 86px 0 24px'></span></p>
                <p class="resultSuc">添加失败</p>
                <p class="resultTil">{{msg}}</p>
            </div>
            <el-button size="small" @click="active=0;$refs['ruleForm'].resetFields();$refs['ruleForm2'].resetFields();statusd='wait'">
                继续添加
            </el-button>
            <router-link v-if="success!=0" to="/home/accountManage/managementOperator">
                <el-button size="small" type="primary">去设置权限</el-button>
            </router-link>
        </div>
        <!--</el-card>-->
    </div>
</template>
<script>
    import '../../assets/css/wyxCard.css'
    import classPost from '../../servies/classPost'
    import {submitForm, getSubmitJson, reset} from '../../assets/js/submitForm'

    export default {
        data() {
            var valiName = (rule, value, callback) => {
                if (!/[0-9a-zA-Z_]/.test(value)) {
                    callback(new Error('请输入数字、字母或下划线'));
                } else {
                    callback();
                }
//            ^[0-9a-zA-Z_]{1,}$
            };

            var valiLoginPass = (rule, value, callback) => {
                if (!/(?!^(\d+|[a-zA-Z_]+|[~!@#$%^&*?,.:;\+\-=/'"<>\|\[\]\(\)]+)$)^[\w~!@#$%\^&*?_,.:;\+\-=/'"<>\(\)\|\[\]]{6,20}$/.test(value)) {
                    this.pwdStrength1 = ''
                    callback(new Error('请按规则输入'));
                } else {
                    let length = value.length;
                    //低
                    if ( length < 10 ) {
                        this.pwdStrength1 = 'di'
                    }
                    //    中
                    if ( length < 15 && length >= 10 ) {
                        this.pwdStrength1 = 'zhong'
                    }
                    //    高
                    if ( length >= 15 ) {
                        this.pwdStrength1 = 'gao'
                    }
                    callback();
                }
            }

            var valiPayPass = (rule, value, callback) => {
                if (value == this.ruleForm2.loginPassword) {
                    callback(new Error('不能与登录密码一致'));
                } else if (!/(?!^(\d+|[a-zA-Z_]+|[~!@#$%^&*?,.:;\+\-=/'"<>\|\[\]\(\)]+)$)^[\w~!@#$%\^&*?_,.:;\+\-=/'"<>\(\)\|\[\]]{6,20}$/.test(value)) {
                    this.pwdStrength2 = ''
                    callback(new Error('请按规则输入'));
                } else {
                    let length = value.length;
                    //低
                    if ( length < 10 ) {
                        this.pwdStrength2 = 'di'
                    }
                    //    中
                    if ( length < 15 && length >= 10 ) {
                        this.pwdStrength2 = 'zhong'
                    }
                    //    高
                    if ( length >= 15 ) {
                        this.pwdStrength2 = 'gao'
                    }
                    callback();
                }
            }

            var validatePass = (rule, value, callback) => {
                if (value !== this.ruleForm2.loginPassword) {
                    callback(new Error('两次登录密码输入不一致!'));
                } else {
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value !== this.ruleForm2.payPassword) {
                    callback(new Error('两次支付密码输入不一致!'));
                } else {
                    callback();
                }
            };
            return {
                active: 0,
                msg:'',
                statusd:'wait',
                finishStatus: 'success',
                ruleForm: {
                    loginName: '',
                    name: '',
                    department: '',
                    phone: '',
                    email: '',
                    memo: ''
                },
                rules: {
                    loginName: [
                        {required: true, message: '操作员名称不能为空', trigger: 'blur'},
                        {min: 5, max: 32, message: '请输入5-32位字母、数字、下划线组合', trigger: 'blur'},
                        {validator: valiName, trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '真实姓名不能为空', trigger: 'change'}
                    ],
                    department: [
                        {required: true, message: '操作员所属部门不能为空', trigger: 'change'}
                    ]
                },
                ruleForm2: {
                    loginPassword: '',
                    payPassword: '',
                    reLoginPass: '',
                    rePayPass: ''
                },
                rules2: {
                    loginPassword: [
                        {required: true, message: '登录密码不能为空', trigger: 'blur'},
                        {validator: valiLoginPass, trigger: 'blur'}
                    ],
                    payPassword: [
                        {required: true, message: '支付密码不能为空', trigger: 'blur'},
                        {validator: valiPayPass, trigger: 'blur'}
                    ],
                    reLoginPass: [
                        {required: true, message: '登录密码不能为空', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    rePayPass: [
                        {required: true, message: '支付密码不能为空', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                },
                subData: {},
//                密码强度
                pwdStrength1: '',
                pwdStrength2: '',
                success: -1
            }
        },
        methods: {
            submitForm,
            getSubmitJson,
//            重置表单
            reset,
            next() {
                if (this.active++ > 3) this.active = 0;
            },
            success1(children) {
                let submitJson = this.getSubmitJson(children);
                Object.assign(this.subData, submitJson);
                delete this.subData.reLoginPass;
                delete this.subData.rePayPass;
//                for (let attr in submitJson) {
//                    this.subData[attr] = submitJson[attr];
//                }
                console.log(this.active);
                if (this.active == 1) {
                    classPost.addOperator(this.subData)
                        .then((res) => {
                            this.success = 1;
                            this.active = 3
                            this.statusd='success'
//                            message
                            console.log(res)
                        })
                        .catch((err) => {
                            console.log(err)
                            this.success = 0;
                            this.active = 3;
                            this.statusd='error'
                            this.msg=err.data.message
                        });
                }
                if (this.active++ > 3)
                    this.active = 0;
//                this.reset('ruleForm');
                this.reset('ruleForm2');
            },
            fail1() {
                console.log('error submit!!');
                return false;
            },
//            success2(){
//                if (this.active++ > 2) this.active = 0;
//            },
//            fail2(){
//                console.log('error submit!!');
//                return false;
//            }
        }
    }


</script>

<style>
    .addManagement .el-card__body {
        padding-left: 50px;
        padding-right: 50px;
    }

    .addManagement .el-steps {
        padding: 40px 0;
    }

    .addManagement .demo-ruleForm {
        width: 50%;
        margin-left: 20%;
    }

    .addManagement .el-alert--info {
        margin-bottom: 22px;
    }

    .addManagement .result {
        text-align: center;
    }

    .addManagement .resultSuc {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 32px;
    }

    .addManagement .resultTil {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.43);
        line-height: 22px;
        margin: 8px 0 76px;
    }

</style>
