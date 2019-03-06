<template>
    <div class="wyx operatorDetails">
        <!--<el-card>-->
        <!--<div slot="header" class="clearfix">-->
        <!--操作员详情-->
        <!--</div>-->
        <el-form label-position="right" label-width="150px">
            <el-form-item label="登录账号：">{{data.loginName}}</el-form-item>
            <el-form-item label="真实姓名：">{{data.name}}</el-form-item>
            <el-form-item label="所属部门：">{{data.department}}</el-form-item>
            <el-form-item label="手机号：">{{data.phone}}</el-form-item>
            <el-form-item label="邮箱：">{{data.email}}</el-form-item>
            <el-form-item label="备注：">{{data.memo}}</el-form-item>
            <el-form-item label="操作员状态：">
                <div v-if="data.status==0">创建</div>
                <div v-else-if="data.status==1">正常</div>
                <div v-else-if="data.status==2">关闭</div>
                <div v-else-if="data.status==3">删除</div>
           </el-form-item>
            <el-form-item label="已分配角色：">{{data.roleName}}</el-form-item>
            <!--<el-form-item>-->
            <!--<router-link to="/home/accountManage/managementOperator">-->
            <!--<el-button type="primary">返回操作员管理</el-button>-->
            <!--</router-link>-->
            <!--</el-form-item>-->
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
                data: {}
            }
        },
        mounted: function () {
            classPost.detailOperator({operatorId: this.$route.params.id}).then((res) => {
//            classPost.detailOperator({this.$route.params.id}).then((res) => {
//                this.tableData=res.data;
                this.data = res.data
                console.log(res);
            }).catch((err) => {
                console.log(err)
            });
        }
    }
</script>


<style>
    .operatorDetails .el-form-item{
        /*border-bottom:1px solid #E8E8E8;*/
    }
</style>
