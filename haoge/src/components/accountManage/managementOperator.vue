<template>
    <div class="wyx managementOperator">
        <router-link to="/home/accountManage/managementOperator/addManagement">
            <el-button size="small" type="primary"><i class="el-icon-circle-plus-outline"></i> 新增操作员</el-button>
        </router-link>

        <!--表格-->

        <el-table
                :data="tableData"
                style="margin-top: 10px"
                :default-sort="{prop: 'date', order: 'descending'}"
                empty-text=""
                @sort-change="sortChange"
        >
            <el-table-column
                    prop="operatorId"
                    label="序号"
                    align="center"
                    width="120">

            </el-table-column>
            <el-table-column
                    prop="name"
                    label="操作员"
                    align="center"
                    width="120">
                <template slot-scope="scope">
                    <router-link
                            :to="{path:'/home/accountManage/managementOperator/operatorDetails/'+scope.row.operatorId}">
                     {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="loginName"
                    label="操作员登录名称"
                    align="center"
                    width="150">

            </el-table-column>
            <el-table-column
                    prop="lastLoginTime"
                    label="最后登录时间"
                    align="center"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="roleName"
                    label="分配角色"
                    align="center"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
                    width="150">
                <template slot-scope="scope">
                    <div v-if="scope.row.status==0">
                        <div class="yuan00025"></div>
                        创建
                    </div>
                    <div v-else-if="scope.row.status==1">
                        <div class="yuanGreen"></div>
                        正常
                    </div>
                    <div v-else-if="scope.row.status==2">
                        <div class="yuan00025"></div>
                        锁定
                    </div>
                    <div v-else-if="scope.row.status==3">
                        <div class="yuanRed"></div>
                        删除
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="100"
                    align="center">
                <template v-if="scope.row.name!='admin'" slot-scope="scope">
                    <el-button style="height:22px;" type="text" @click="open2(scope.row.operatorId)">删除</el-button>
                    <!--<router-link :to="{name:'LANG.router.accountManage.operatorConfi',params:{message:`${scope.row.operatorId}-${scope.row.name}-${scope.row.loginName}-${scope.row.phone}-${scope.row.department}`}}">修改</router-link>-->
                    <router-link
                            :to="{name:'LANG.router.accountManage.operatorConfi',params:{message:`${scope.row.operatorId}`}}">
                        <el-button style="height:22px;" type="text">修改</el-button>
                    </router-link>

                    <!--<router-link :to="{name:'LANG.router.accountManage.modifyManageLoginPass',params:{merchantId:scope.row.merchantId,operatorId:scope.row.operatorId,name:scope.row.name,loginName:scope.row.loginName}}">重置登录密码-->
                    <router-link
                            :to="{name:'LANG.router.accountManage.modifyManageLoginPass',params:{message:`${scope.row.merchantId}-${scope.row.operatorId}-${scope.row.name}-${scope.row.loginName}`}}">
                        <el-button style="height:22px;" type="text">重置登录密码</el-button>
                    </router-link>
                    <router-link
                            :to="{name:'LANG.router.accountManage.modifyManagePayPass',params:{message:`${scope.row.merchantId}-${scope.row.operatorId}-${scope.row.name}-${scope.row.loginName}`}}">
                        <el-button style="height:22px;" type="text">重置支付密码</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <div slot="empty" class="noData">
                <img src="../../assets/images/frown-o@2x.png" alt="">
                <p>暂无数据</p>
            </div>
        </el-table>

        <!--分页-->
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="total*1">
        </el-pagination>
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import classPost from '../../servies/classPost'

    export default {
        data() {
            return {
                currentPage4: 1,
                tableData: [],
                total: 0,
                orderBy:'DESC',
                submitJson:{
                    pageSize :10,
                    pageNum :1,
                    orderBy:'MODIFY_TIME DESC'
                }
            }
        },
        methods: {
            formatter(row, column) {
//        可以格式化操作数据  根据row.address值的不同  return不同的结果
                return row.address;
            },
            open2(id) {
                this.$confirm('您将要删除该操作员配置<br/><span style="color: red;">删除后该配置将不能恢复</span>', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    classPost.deleteOperator({operatorId: id}).then((res) => {
                        console.log(res);
                        classPost.queryListOperator(this.submitJson).then((res) => {
                            this.tableData = res.data.dataList;
                            this.total = res.data.total;
                            console.log(res.data);
                        }).catch((err) => {
                            console.log(err)
                        });
                        this.$message({
                            type: 'success',
                            message: '删除成功!  您已成功删除该操作员配置!'
                        });
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
//    分页用到
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
//                console.log(`当前页: ${val}`);
                this.submitJson.pageNum=val;
//                this.submitJson.orderBy='LAST_LOGIN_TIME'+' '+this.orderBy;
                this.queryData();
            },
//            列排序
            sortChange(column, prop, order){
                this.orderBy=column.order.indexOf('desc')==0?'DESC':'';
//                this.submitJson.orderBy='LAST_LOGIN_TIME'+' '+this.orderBy;
                this.queryData();
            },
            queryData(){
//                this.submitJson.orderBy='LAST_LOGIN_TIME'+' '+this.orderBy;
                classPost.queryListOperator(this.submitJson).then((res) => {
                    this.tableData = res.data.dataList;
                    this.total = parseInt(res.data.total);
                    console.log(res.data);
                }).catch((err) => {
                    console.log(err)
                });
            }
        },
        mounted: function () {
           this.queryData();
        }
    }
</script>

<style>
    .managementOperator .el-table td, .managementOperator .el-table th {
        /*padding: 5px 0;*/
    }
</style>
