<template>
    <div class="wyx managementOperator">
        <router-link to="/home/accountManage/managementOperator/addRole">
            <el-button  size="small" type="primary"><i class="el-icon-circle-plus-outline"></i> 新增角色</el-button>
        </router-link>

        <!--表格-->

        <el-table
                :data="tableData"
                style="width: 100%;margin-top: 20px"
                :default-sort="{prop: 'date', order: 'descending'}"
                empty-text="还没有接收人，请添加"
                @sort-change="sortChange">
            <el-table-column
                    prop="roleId"
                    label="角色序号"
                    align="center">

            </el-table-column>
            <el-table-column
                    prop="roleName"
                    label="角色名称"
                    align="center">
                <template slot-scope="scope">
                        <router-link :to="{name:'LANG.router.accountManage.roleDetails',params:{id:scope.row.roleId}}">{{scope.row.roleName}}</router-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="角色描述"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="updateTime"
                    label="最后修改时间"
                    align="center">
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center">
                <template slot-scope="scope">

                        <router-link :to="{name:'LANG.router.accountManage.modifyRole',params:{id:scope.row.roleId}}">修改</router-link>

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
                :total="total">
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
                total:0,
                orderBy:'',
                submitJson:{
                    pageSize :10,
                    pageNum :1,
                    orderBy:'UPDATE_TIME DESC'
                }
            }
        },
        methods: {
            formatter(row, column) {
//        可以格式化操作数据  根据row.address值的不同  return不同的结果
                return row.address;
            },
            open2() {
                this.$confirm('您将要删除该交易主体配置<br/><span style="color: red;">删除后该配置将不能恢复</span>', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!  您已成功删除该交易主体配置!'
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
//                this.submitJson.orderBy='UPDATE_TIME'+' '+this.orderBy;
                this.queryData();
            },
//            列排序
            sortChange(column, prop, order){
//                this.orderBy=column.order.indexOf('desc')==0?'DESC':'';
//                this.submitJson.orderBy='UPDATE_TIME'+' '+this.orderBy;
                this.queryData();
            },
            queryData(){
//                this.submitJson.orderBy='UPDATE_TIME'+' '+this.orderBy;
                classPost.queryRoleList(this.submitJson)
                    .then((res) => {
                        this.tableData = res.data.dataList;
                        this.total=parseInt(res.data.total);
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
