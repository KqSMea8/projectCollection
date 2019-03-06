<template>
    <div class="wyx addSendee">
        <!--<el-card class="box-card" shadow="never">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>新增接收人</span>-->
        <!--</div>-->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="接收人:" prop="name">
                <el-input size="small" :clearable="true" v-model="ruleForm.name" placeholder="请输入接收人名称"></el-input>
            </el-form-item>
            <el-form-item label="接收人邮箱:" prop="email">
                <el-input size="small" :clearable="true" v-model="ruleForm.email" placeholder="请输入接收人邮箱"></el-input>
            </el-form-item>
            <el-form-item label="接收人手机号:" prop="phone">
                <el-input size="small" :clearable="true" v-model.number="ruleForm.phone" placeholder="请输入接收人手机号"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button size="small" type="primary" @click="submitForm('ruleForm',success,error)">提交</el-button>
            </el-form-item>
        </el-form>
        <!--</el-card>-->

    </div>
</template>

<script>
    //  import router from "../../router"
    import '../../assets/css/wyxCard.css'
    import {submitForm,getSubmitJson,reset} from '../../assets/js/submitForm'
    import classPost from '../../servies/classPost'

    export default {
        data() {
            var delspace = (rule, value, callback) => {
                if (value.toString().trim() === '') {
                    callback(new Error('不能只输入空字符'));
                } else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
//                if(value==''){
//                    if(this.ruleForm.email==''){
//                        callback(new Error('手机号和邮箱不能全部为空，必填其中一项'));
//                    }else{
//                        callback();
//                    }
//                }else
                    if(!/^\d+$/.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                }else{
                    callback();
                }
            };
            var validatePassEmail = (rule, value, callback) => {
//                if(value==''){
//                    if(this.ruleForm.phone==''){
//                        callback(new Error('手机号和邮箱不能全部为空，必填其中一项'));
//                    }else{
//                        callback();
//                    }
//                }else
                    if(!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)) {
                    callback(new Error('请输入正确的邮箱'));
                }else{
                    callback();
                }
            };
            return {
                ruleForm: {
                    name: '',
                    email: '',
                    phone: ''
                },
                rules: {
                    name: [
                        {required: true, message: '接收人不能为空', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'},
                        {validator: delspace, trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入接收人邮箱', trigger: 'blur'},
                        {validator: delspace, trigger: 'blur'},
                        {validator: validatePassEmail, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入接收人手机号', trigger: 'blur'},
//                        {type: 'number', message: '请输入正确的手机号', trigger: 'blur'},
                        {validator: delspace, trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
//
            submitForm,
//            submitForm(formName) {
//                this.$refs[formName].validate((valid) => {
//                    if (valid) {
////          数据提交成功调用该函数
////          this.alertBox();
////          数据提交失败时调用
//                        this.falseBox();
//                    } else {
//                        console.log('error submit!!');
//                        return false;
//                    }
//                });
//            },
            alertBox() {
                this.$confirm('您已经新增了一个联系人，快去设置消息推送配置吧！', '添加成功', {
                    confirmButtonText: '去设置',
                    cancelButtonText: '关闭',
                    type: 'success'
                }).then(() => {
//          this.$message({
//            type: 'success',
//            message: '删除成功!'
//          });
                    this.$router.push({path: '/home/mainManage/messagePush'})
                }).catch(() => {
//          this.$message({
//            type: 'info',
//            message: '已取消删除'
//          });
                    this.ruleForm.name = '';
                    this.ruleForm.email = '';
                    this.ruleForm.tel = '';
                });
            },
            falseBox() {
                this.$alert('请重新添加消息接收人', '添加失败', {
                    confirmButtonText: '确定',
                    type: 'error',
                    callback: action => {
//            this.$message({
//              type: 'info',
//              message: `action: ${ action }`
//            });
                    }
                });
            },
            success(children){
                let submitJson=getSubmitJson(children);
                console.log(submitJson);
                classPost.addReceiver(submitJson)
                    .then((res)=>{
                        this.$message({
                            message: '已成功添加接收人',
                            type: 'success'
                        });
                        this.$router.push('/home/mainManage/messagePush');
                        console.log(res)
                    })
                    .catch();
            },
            error(){
                console.log('error')
            }
        }
    }
</script>

<style>
    .addSendee .demo-ruleForm {
        width: 50%;
        margin: 20px auto;
    }
</style>
