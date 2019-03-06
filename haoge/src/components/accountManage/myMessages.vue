<template>
    <div class="wyx myMessages">
        <div class="btn" style="margin-bottom: 20px">
            <!--<el-button type="primary">批量删除</el-button>-->
            <el-radio-group size="small" v-model="status" @change="query">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="已读"></el-radio-button>
                <el-radio-button label="未读"></el-radio-button>
            </el-radio-group>
        </div>
        <el-table
                ref="multipleTable"
                :data="tableData3"
                tooltip-effect="dark"
                style="width: 100%"
                >
            <!--@selection-change="handleSelectionChange"-->
            <!--<el-table-column-->
                    <!--type="selection"-->
                    <!--width="55">-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="message"
                    label="消息主题"
                    :row-style="style"
                    align="left">
                <template slot-scope="scope">
                    <!--<router-link :to="{name:'LANG.router.accountManage.mesDetails',params:{id:scope.row.id+'-'+scope.row.readStatus}}" v-html="scope.row.message.slice(0,30)"></router-link>-->
                    <router-link v-if="scope.row.readStatus==0" :to="{name:'LANG.router.accountManage.mesDetails',params:{id:scope.row.id+'-'+scope.row.readStatus}}" v-html="scope.row.subject"></router-link>
                    <router-link v-if="scope.row.readStatus==1" :to="{name:'LANG.router.accountManage.mesDetails',params:{id:scope.row.id+'-'+scope.row.readStatus}}" v-html="scope.row.subject" style="color: rgba(0,0,0,0.5);"></router-link>
                </template>
            </el-table-column>
            <el-table-column
                    label="通知时间"
                    prop="startTime"
                    align="center">
                <template slot-scope="scope">
                    <p v-if="scope.row.readStatus==0">{{ scope.row.starttime}}</p>
                    <p v-if="scope.row.readStatus==1" style="color: rgba(0,0,0,0.5);">{{ scope.row.starttime}}</p>
                </template>
            </el-table-column>
            <!--<el-table-column-->
                    <!--prop="msgType"-->
                    <!--label="消息类型">-->
                <!--<template slot-scope="scope">-->
                    <!--<div v-if="scope.row.msgType==1">公告</div>-->
                    <!--<div v-if="scope.row.msgType==''"></div>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="readStatus"
                    label="状态"
                    show-overflow-tooltip
                    align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.readStatus==1" style="color: rgba(0,0,0,0.5);">
                        <!--<div class="yuanGreen"></div> -->
                        已读
                    </div>
                    <div v-if="scope.row.readStatus==0">
                        <!--<div class="yuan00025"></div> -->
                        未读
                    </div>
                </template>
            </el-table-column>
            <div slot="empty" class="noData">
                <img src="../../assets/images/frown-o@2x.png" alt="">
                <p>暂无数据</p>
            </div>
        </el-table>
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
                tableData3: [],
                multipleSelection: [],
                status: '全部',
                total:0,
                queryJson:{
                    orderBy:'STARTTIME DESC'
                }
            }
        },

        methods: {
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
            },
            //    分页用到
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.queryJson.pageNum=val;
                this.queryList(this.queryJson);
            },
            query(value){
                let status='';
                if(value=='已读'){
                    status=1;
                }else if(value=='未读'){
                    status=0;
                }
                this.queryJson={readStatus:status,pageSize:10,pageNum:1};
                this.queryList(this.queryJson);
            },
            queryList(subJson){
                classPost.messageList(subJson)
                    .then((res)=>{
                        this.total=parseInt(res.data.total);
                        this.tableData3=res.data.dataList;
                        console.log(res)
                    })
                    .catch();
            },
            style(){
                return {overflow: hidden,textOverflow:ellipsis,whiteSpace: nowrap,height:'48px'}
            }
        },
        mounted:function () {
            this.queryJson={readStatus:'',pageSize:10,pageNum:1};
            this.queryList(this.queryJson);
        }
    }
</script>
<style>
    .myMessages a {
        color: #1890FF;
    }
    .myMessages a:hover{
        text-decoration: underline;
    }
    .myMessages td .cell a p{
        width: 100%;
        height: 23px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    /*.myMessages .el-table td, .myMessages .el-table th {*/
        /*padding: 5px 0;*/
    /*}*/
</style>
