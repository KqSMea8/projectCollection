<template>
    <div class="wyx messagePush">
        <router-link to="/home/mainManage/messagePush/addSendee">
            <el-button size="small" type="primary"><i class="el-icon-circle-plus-outline"></i> 新增接收人</el-button>
        </router-link>

        <!--表格-->

        <el-table
                :data="tableData"
                style="width: 100%;margin-top: 20px"
                :default-sort="{prop: 'date', order: 'descending'}"
                empty-text="还没有接收人，请添加">
            <el-table-column
                    prop="name"
                    label="接收人"
                    align="center">

            </el-table-column>
            <el-table-column
                    prop="createTimeStr"
                    label="创建时间"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="updateTimeStr"
                    label="修改时间"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="phoneStatus"
                    label="手机接收"
                    :formatter="formatter">
                <template slot-scope="scope">
                    <div v-if="scope.row.phoneStatus==1">
                        <div class="yuanGreen"></div>
                        有效
                    </div>
                    <div v-else>
                        <div class="yuan00025"></div>
                        无效
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="emailStatus"
                    label="邮箱接收">
                <template slot-scope="scope">
                    <div v-if="scope.row.emailStatus==1">
                        <div class="yuanGreen"></div>
                        有效
                    </div>
                    <div v-else>
                        <div class="yuan00025"></div>
                        无效
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center">
                <template slot-scope="scope">
                    <el-button style="height:22px;" type="text" @click="open2(scope.row.id)">删除</el-button>
                    <router-link :to="{name:'LANG.router.mainManage.receiverConfig',params:{id:scope.row.id}}"><el-button style="height:22px;" type="text">配置</el-button></router-link>
                        <!--<router-link :to="{path:'/home/mainManage/messagePush/receiverConfig',query:{id:scope.row.id}}"><el-button type="text">配置</el-button></router-link>-->

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
                currentPage:1
            }
        },
        methods: {
            formatter(row, column) {
//        可以格式化操作数据  根据row.address值的不同  return不同的结果
                return row.address;
            },
            open2(receiverId) {
                this.$confirm('您将要删除该消息推送配置<br/><span style="color: red;">删除后该配置将不能恢复</span>', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    classPost.deleteReceiver({id:receiverId})
                        .then((res) => {
                            console.log(res);
                            classPost.receiverList({pageSize:10,pageNumber:this.currentPage})
                                .then((res) => {
                                    this.tableData = res.data.dataList;
                                    this.total = parseInt(res.data.total);
                                })
                                .catch()
                            this.$message({
                                type: 'success',
                                message: '删除成功!  您已成功删除该消息推送配置!'
                            });
                        })
                        .catch()
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
                this.currentPage=val;
                classPost.receiverList({pageSize:10,pageNumber:val})
                    .then((res) => {
                        this.tableData = res.data.dataList;
                    })
                    .catch()
            }
        },
        mounted: function () {
            classPost.receiverList({pageSize:10,pageNumber:1})
                .then((res) => {
                    this.tableData = res.data.dataList;
                    this.total = parseInt(res.data.total);
                    console.log(res)
                })
                .catch()
        }
    }
</script>

<style>
.messagePush .el-table{
    margin-top: 10px!important;
}
    .messagePush .el-table td, .messagePush .el-table th {
        /*padding: 5px 0;*/
    }
</style>
