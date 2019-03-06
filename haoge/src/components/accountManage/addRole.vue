<template>
    <div class="wyx addRole">
        <!--<el-card class="box-card">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>角色新增</span>-->
        <!--&lt;!&ndash;<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;-->
        <!--</div>-->
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="150px" class="demo-ruleForm"
                 style="width:50%">
            <el-form-item label="角色名称：" prop="roleName">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.roleName" clearable
                          placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="角色描述：" prop="remark">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.remark" clearable
                          placeholder="请输入角色描述"></el-input>
            </el-form-item>
            <el-form-item label="可操作权限：" prop="resourceIdList">
                <el-tree
                        :data="data3"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[1]"
                        :props="defaultProps"
                        @check="check">
                </el-tree>
            </el-form-item>

            <!--<el-form-item label="年龄" prop="age">-->
            <!--<el-input size="small" v-model.number="ruleForm2.age" clearable></el-input>-->
            <!--</el-form-item>-->
            <el-form-item>
                <el-button size="small" type="primary" @click="submitForm('ruleForm2',success,error)">确认添加</el-button>
                <router-link to="/home/accountManage/managementOperator/roleManagement">
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
            return {
                ruleForm2: {
                    roleName: '',
                    remark: '',
                    resourceIdList: ''
                },
                rules2: {
                    roleName: [
                        {required: true, message: '角色名称不能为空', trigger: 'blur'},
                    ],
                    remark: [
                        {required: true, message: '角色描述不能为空', trigger: 'blur'},
                    ],
                    resourceIdList: [
                        {required: true, message: '可操作权限不能为空', trigger: 'blur'},
                    ]
                },
                data3: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        methods: {
            submitForm,
            success(children) {
                let submitJson = getSubmitJson(children);
                console.log(submitJson);
                classPost.roleAdd(submitJson)
                    .then((res) => {
                        console.log(res)
                        if (res.status = '1') {
//                成功
                            this.open1();
                        } else {
//                失败
                            this.open2();
                        }
                    })
                    .catch();
            },
            error() {

            },
            check(a, b) {
//        console.log(a, b);
//                this.ruleForm2.resourceIdList = b.checkedKeys;
                this.ruleForm2.resourceIdList=b.checkedKeys.concat(b.halfCheckedKeys);
            },
//      添加角色成功
            open1() {
                this.$alert('您已成功添加角色' + this.ruleForm2.roleName, '添加成功', {
                    confirmButtonText: '确定',
                    type: 'success',
                    callback: action => {
                        this.$router.push({path: '/home/accountManage/managementOperator/roleManagement'})
                    }
                });
            },
            //      添加角色失败
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
        mounted: function () {
            classPost.queryResource({})
                .then((res) => {
//                    this.ruleForm2 = res.data;
                    let d = [];
                    for (let i = 0; i < res.data.length; i++) {
                        let dataL = [];
                        if (res.data[i].childResourceList != [] && res.data[i].childResourceList != null) {
                            for (let j = 0; j < res.data[i].childResourceList.length; j++) {
                                dataL.push({
                                    id: res.data[i].childResourceList[j].resourceId,
                                    label: res.data[i].childResourceList[j].name
                                })
                            }
                        }
                        d.push({
                            id: res.data[i].resourceId,
                            label: res.data[i].name,
                            children: dataL
                        })
                    }
                    this.data3 = d;
                }).catch((err) => {
                console.log(err)
            });
        }

    }
</script>
