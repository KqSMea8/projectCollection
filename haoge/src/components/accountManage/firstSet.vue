<template>
    <div class="wyx addManagement">
        <!--<el-card class="box-card">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>填写操作员信息</span>-->
        <!--&lt;!&ndash;<el-button size="small" style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;-->
        <!--</div>-->
        <!--    步骤条-->
        <el-alert
                title="您的操作员账号存在风险，为了您的账号安全，请补全安全信息！"
                type="info"
                show-icon>
        </el-alert>
        <el-steps :active="active" :finish-status="finishStatus" align-center>
            <el-step title="设置绑定手机"></el-step>
            <el-step title="设置绑定邮箱"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>

        <!--填写信息-->

        <el-form v-show="active==0" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px"
                 class="demo-ruleForm">
            <el-form-item label="操作员名称：">
                <span>{{message.loginName}}</span>
            </el-form-item>
            <el-form-item label="新绑定手机号：" prop="phone">
                <el-input size="small" type="text" v-model="ruleForm.phone" auto-complete="off" clearable
                          placeholder="请输入新绑定手机号"></el-input>
                          <span style="font-size:14px;color:#777;">非中国大陆用户请 <el-button type="text" @click="active++"> 跳过绑定手机号</el-button></span>
            </el-form-item>
            <el-form-item label="手机验证码：" prop="code">
                <el-input style="width:50%" size="small" type="text" v-model="ruleForm.code" auto-complete="off"
                          clearable
                          placeholder="请输入手机验证码"></el-input>
                <el-button type="primary" size="mini" @click="send(ruleForm)" :disabled="ruleForm.status==false">{{ruleForm.text}}</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="submitForm('ruleForm',success,error)">下一步</el-button>
            </el-form-item>
        </el-form>

        <!--密码设置-->
        <el-form v-show="active==1" :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="150px"
                 class="demo-ruleForm">
            <el-form-item label="操作员名称：">
                <span>{{message.loginName}}</span>
            </el-form-item>
            <el-form-item label="新绑定邮箱：" prop="email">
                <el-input size="small" type="text" v-model="ruleForm2.email" auto-complete="off" clearable
                          placeholder="请输入新绑定邮箱"></el-input>
            </el-form-item>
            <el-form-item label="邮箱验证码：" prop="code">
                <el-input style="width:50%" size="small" type="text" v-model="ruleForm2.code" auto-complete="off" clearable
                          placeholder="请输入邮箱验证码"></el-input>
                <el-button type="primary" size="mini" @click="send2(ruleForm2)" :disabled="ruleForm2.status==false">{{ruleForm2.text}}</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="default" @click="active--;">返回上一步
                </el-button>
                <el-button size="small" type="primary" @click="submitForm('ruleForm2',success2,error2)">下一步</el-button>
            </el-form-item>
        </el-form>

        <!--完成-->
        <div v-show="active==3" class="result">
            <p><span class="el-icon-success" style='color: #67C23A;font-size: 72px;margin: 86px 0 24px'></span></p>
            <!--<p class="resultSuc">添加成功</p>-->
            <p v-show="time!=-1" class="resultTil">您已成功设置绑定邮箱与绑定手机！系统将在 {{time}} 秒后自动跳转至首页</p>
            <router-link to="/home">
                <el-button size="small" type="primary">返回首页</el-button>
            </router-link>
        </div>
        <!--</el-card>-->
    </div>
</template>
<script>
    import '../../assets/css/wyxCard.css'
    import classPost from '../../servies/classPost'
    import {submitForm, getSubmitJson, reset,timeOver} from '../../assets/js/submitForm'

    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (!/^\d+$/.test(value)) {
                    this.ruleForm.status=false;
                    callback(new Error('请输入正确的手机号'));
                }else{
                    if(this.ruleForm.text=='获取验证码'){
                        this.ruleForm.status = true;
                    }
                    callback();
                }
            };
            var validatePassEmail = (rule, value, callback) => {
                if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)) {
                    this.ruleForm2.status=false;
                    callback(new Error('请输入正确的邮箱'));
                }else{
                    if(this.ruleForm2.text=='获取验证码'){
                        this.ruleForm2.status = true;
                    }
                    callback();
                }
            };
            return {
                active: 0,
                finishStatus: 'success',
                ruleForm: {
                    phone: '',
                    code: '',
                    text:'获取验证码',
                    status:false,
                },
                rules: {
                    phone: [
                        {required: true, message: '手机号不能为空', trigger: 'change'},
                        {validator: validatePass, trigger: 'change'}
                    ],
                    code: [
                        {required: true, message: '验证码不能为空', trigger: 'blur'},
//                        {validator: validatePass2, trigger: 'blur'}
                    ]
                },
                ruleForm2: {
                    email: '',
                    code: '',
                    text:'获取验证码',
                    status:false,
                },
                rules2: {
                    email: [
                        {required: true, message: '邮箱不能为空', trigger: 'change'},
                        {validator: validatePassEmail, trigger: 'change'}
                    ],
                    code: [
                        {required: true, message: '验证码不能为空', trigger: 'blur'},
//                        {validator: validatePass2, trigger: 'blur'}
                    ]
                },
                message: {
                    loginName: 'aaaaa',
                    operatorId: '123123',
                    email:''
                },
                time:5
            }
        },
        methods: {
            submitForm,
            next() {
                if (this.active++ > 3) this.active = 0;
            },
            success(children) {
                this.ruleForm.status=false;
                let submitJson = getSubmitJson(children);
                submitJson.operatorId = this.message.operatorId;
                console.log(submitJson);
                classPost.bindPhone(submitJson)
                    .then((res) => {
                        this.$message({
                            message: '已成功绑定手机号',
                            type: 'success'
                        });
                        this.next();
                        console.log(res)
                    })
                    .catch((error)=>{
                        console.log(error)
                    })
            },
            error() {

            },
            send(form) {
                form.status=false;
                classPost.sendPhone({phone: this.ruleForm.phone})
                    .then((res) => {
                        timeOver(form);
                        this.$message({
                            message: '获取验证码成功！',
                            type: 'success'
                        });
                        console.log(res)
                    })
                    .catch((error)=>{
                        this.$message({
                            type:'error',
                            message: '获取验证码失败，请检查手机号!'
                        })
                    })
            },
            success2(children) {
                let submitJson = getSubmitJson(children);
                submitJson.operatorId=this.message.operatorId;
                console.log(submitJson);
                classPost.bindEmail(submitJson)
                    .then((res) => {
                        this.$message({
                            message: '已成功绑定邮箱',
                            type: 'success'
                        });
                        this.active=3
                        var _this=this;
                        this.$eventBus.$emit('upinfo')
                        let time = setInterval(function () {
                            --(_this.time);
                            if(_this.time==-1){
                                clearInterval(time)
                                _this.$router.push('/home');
                            }
                        },1000);
                        console.log(res)
                    })
                    .catch((error)=>{
                        this.$message({
                            message: error.data.message,
                            type: 'error'
                        });
                    })
            },
            error2() {

            },
            send2(form){
                form.status=false;
                classPost.sendEmail({email:this.ruleForm2.email})
                    .then((res)=>{
                        timeOver(form);
                        this.$message({
                            message: '获取验证码成功！',
                            type: 'success'
                        });
                        console.log(res)
                    })
                    .catch((error)=>{
                        this.$message({
                            message: error.data.message,
                            type: 'error'
                        });
                    })
            },

        },
        mounted:function () {
            this.message.loginName=JSON.parse(localStorage.data).loginName;
            this.message.operatorId=JSON.parse(localStorage.data).operatorId;
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
