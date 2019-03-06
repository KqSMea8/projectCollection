<template>
    <div class="wyx modifyLoginPass">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="150px" class="demo-ruleForm"
                 style="width:50%">
            <el-form-item label="操作员名称：">
                <span>{{message.loginName}}</span>
            </el-form-item>
            <el-form-item label="新绑定手机号：" prop="phone">
                <el-input size="small" type="text" v-model="ruleForm2.phone" auto-complete="off" clearable
                          placeholder="请输入新绑定手机号"></el-input>
            </el-form-item>
            <el-form-item label="手机验证码：" prop="code">
                <el-input style="width:50%" size="small" type="text" v-model="ruleForm2.code" auto-complete="off" clearable
                          placeholder="请输入手机验证码"></el-input>
                <el-button type="primary" size="mini" @click="send(ruleForm2)" :disabled="ruleForm2.status==false">{{ruleForm2.text}}</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="submitForm('ruleForm2',success,error)">提交</el-button>
                <router-link to="/home/accountManage">
                    <el-button size="small" type="default">取消</el-button>
                </router-link>
            </el-form-item>
        </el-form>
        <el-alert
                title="注：非中国大陆用户暂时不支持绑定手机"
                type="info"
                show-icon>
        </el-alert>
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import {submitForm, getSubmitJson, reset,timeOver} from '../../assets/js/submitForm'
    import classPost from '../../servies/classPost'
    //

    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if(value!='') {
                    if (!/^\d+$/.test(value)) {
                        this.ruleForm2.status = false;
                        callback(new Error('请输入正确的手机号'));
                    }else{
                        this.ruleForm2.status = true;
                        callback();
                    }
                }else{
                    if(this.ruleForm2.text=='获取验证码'){
                        this.ruleForm2.status = true;
                    }
                    callback(new Error('请输入手机号'));
                }
            };
            return {
                ruleForm2: {
                    phone: '',
                    code: '',
                    status:false,
                    text:'获取验证码'
                },
                rules2: {
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: validatePass, trigger: 'change'}
                    ],
                    code: [
                        {required: true, message: '验证码不能为空', trigger: 'blur'},
//                        {validator: validatePass2, trigger: 'blur'}
                    ]
                },
                message: {
                    loginName: '',
                    operatorId: '',
                    phone:''
                }
            }
        },
        methods: {
            submitForm,
            success(children) {
                let submitJson = getSubmitJson(children);
                submitJson.operatorId=this.message.operatorId;
                console.log(submitJson);
                classPost.bindPhone(submitJson)
                    .then((res) => {
                        this.$message({
                            message: '已成功绑定手机号',
                            type: 'success'
                        });
                        this.$router.push('/home/accountManage/')
                        console.log(res)
                    })
                    .catch()
            },
            error() {

            },
            send(form){
                form.status=false;
                console.log({phone:this.ruleForm2.phone})
                classPost.sendPhone({phone:this.ruleForm2.phone})
                    .then((res)=>{
                        timeOver(form);
                        this.$message({
                            message: '获取验证码成功！',
                            type: 'success'
                        });
                        console.log(res)
                    })
                    .catch()
            }
        },
        mounted: function () {
            let arr = this.$route.params.id.split('-')
            this.message.loginName = arr[0];
            this.message.operatorId = arr[1];
            this.message.phone = arr[2];
        }

    }
</script>
