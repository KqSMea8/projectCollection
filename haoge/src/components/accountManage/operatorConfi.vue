<template>
    <div class="wyx operatorConfi">
        <!--<el-card class="box-card">-->
            <!--<div slot="header" class="clearfix">-->
                <!--<span>操作员配置</span>-->
                <!--&lt;!&ndash;<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;-->
            <!--</div>-->

            <!--填写信息-->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="操作员名称：">
                    <span>{{ruleForm.loginName}}</span>
                </el-form-item>
                <el-form-item label="真实姓名：">
                    <span>{{ruleForm.name}}</span>
                </el-form-item>
                <el-form-item label="手机号：">
                    <span>{{ruleForm.phone}}</span>
                    <!--<el-input size="small" clearable v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>-->
                </el-form-item>
                <el-form-item label="邮箱：">
                    <span>{{ruleForm.email}}</span>
                    <!--<el-input size="small" clearable v-model="ruleForm.email" placeholder="请输入邮箱地址"></el-input>-->
                </el-form-item>
                <el-form-item label="所属部门：" prop="department">
                    <el-input size="small" clearable v-model="ruleForm.department" placeholder="请输入操作员所属部门"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="memo">
                    <el-input size="small" clearable type="textarea" v-model="ruleForm.memo"></el-input>
                </el-form-item>
                <el-form-item label="角色分配：" prop="roleId">
                    <el-radio-group v-model="ruleForm.roleId">
                        <el-radio v-for="(item,index) in arr" :key="index" :label="item.roleId">{{item.roleName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="操作员状态：" prop="status">
                    <el-select size="small" clearable v-model="ruleForm.status" placeholder="请选择活动区域">
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="锁定" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="submitForm('ruleForm',success,error)">确认</el-button>
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
//

    export default {
        data() {
            var tel=(rule, value, callback)=>{
                if(!/^\d+$/.test(value)){
                    callback(new Error('请输入纯数字'));
                }else{
                    callback();
                }
            }
            var email=(rule, value, callback)=>{
                if(!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)){
                    callback(new Error('请输正确的邮箱地址'));
                }else{
                    callback();
                }
            }

            return {
                ruleForm: {
                    department: '',
                    phone: '',
                    email: '',
                    memo: '',
                    roleId: '',
                },
                rules: {
                    department: [
                        {required: true, message: '请输入所属部门', trigger: 'blur'},
                    ],
                    phone: [
//                        {required: true, message: '请输入手机号', trigger: 'blur'}
                        {validator:tel,trigger:'blur'}
                    ],
                    roleId: [
//                        {required: true, message: '请选择角色', trigger: 'change'}
                    ],
                    status: [
                        {required: true, message: '请选择操作员状态', trigger: 'change'}
                    ],
                    email:[
                        {validator:email,trigger:'blur'}
                    ]
                },
                message:{
                    operatorId:'',
                    name:'',
                    loginName:''
                },
                arr:[]
            }
        },
        methods: {
            submitForm,
//            submitForm(formName) {
//                this.$refs[formName].validate((valid) => {
//                    if (valid) {
////            alert('submit!');
//                        this.open1()
//                    } else {
//                        console.log('error submit!!');
//                        return false;
//                    }
//                });
//            },
            //      添加成功
            success(children) {
                let submitJson=getSubmitJson(children);
                submitJson.operatorId=this.message.operatorId;
                console.log(submitJson);
                classPost.updateOperator(submitJson)
                    .then((res)=>{
                    console.log(res)
                        this.$alert('您已成功修改操作员'+this.message.name, '配置成功', {
                            confirmButtonText: '确定',
                            type: 'success',
                            callback: action => {
                                this.$router.push({path: '/home/accountManage/managementOperator'})
                            }
                        });
                    })
                    .catch(()=>{

                    });
            },
            error(){
                console.log("验证失败")
            },
            //      添加失败
            open2() {
                this.$alert('添加操作员失败，请重新添加。', '添加失败', {
                    confirmButtonText: '确定',
                    type: 'error',
                    callback: action => {
//            this.$router.push({path:'/home/accountManage/managementOperator/addRole'})
                    }
                });
            },
        },
        mounted:function () {
            this.message.operatorId=this.$route.params.message;
            classPost.detailOperator({operatorId: this.$route.params.message}).then((res) => {
                this.ruleForm = res.data;
                console.log(res);
            }).catch((err) => {
                console.log(err)
            });

//            查询角色
            classPost.queryRoleList({pageSize:100})
                .then((res) => {
                    this.arr = res.data.dataList;
                    this.total=res.data.total;
                    console.log(res.data);
                }).catch((err) => {
                console.log(err)
            });
//            this.message.name=arr[1];
//            this.message.loginName=arr[2];
//            this.ruleForm.phone=arr[3]=='null'?'':arr[3];
//            this.ruleForm.department=arr[4];
        }
    }


</script>

<style>
    .operatorConfi .el-card__body {
        padding-left: 50px;
        padding-right: 50px;
    }

    .operatorConfi .demo-ruleForm {
        width: 50%;
        margin-left: 20%;
        /*margin: auto;*/
    }
    .operatorConfi .el-radio{
        margin-left: 30px;
        display: inline-block;
        min-width: 70px;
        height: 25px;
    }
</style>
