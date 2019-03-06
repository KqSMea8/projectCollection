<template>
    <div class="wyx logQuery">
        <el-form :inline="true" :model="formInline" ref="formInline" :rules="rules" class="demo-form-inline">
            <el-form-item label="日志类型：" prop="type">
                <el-select size="small" clearable v-model="formInline.type" placeholder="请选择类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="登录" value="login"></el-option>
                    <el-option label="交易查询下载" value="tradeDownload"></el-option>
                    <el-option label="报表查询下载" value="statementDownload"></el-option>
                    <el-option label="交易操作" value="tradeOperator"></el-option>
                    <el-option label="风控配置调整" value="riskConfig"></el-option>
                    <el-option label="配置操作" value="config"></el-option>
                </el-select>
            </el-form-item>
            <!--<el-form-item label="选择日期：" prop="time">-->
                <!--&lt;!&ndash;<el-input v-model="formInline.user" placeholder="审批人"></el-input>&ndash;&gt;-->
                <!--<el-date-picker-->
                        <!--size="small"-->
                        <!--clearable-->
                        <!--type="daterange"-->
                        <!--v-model="formInline.time"-->
                        <!--start-placeholder="开始日期"-->
                        <!--end-placeholder="结束日期"-->
                        <!--:default-time="['00:00:00', '23:59:59']"-->
                        <!--:picker-options="pickerOptions2">-->
                <!--</el-date-picker>-->
            <!--</el-form-item>-->
            <el-form-item label="开始时间：" prop="beginDate">
                <el-date-picker
                        v-model="formInline.beginDate"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择开始时间"
                        :picker-options="pickerOptions1"
                        :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" prop="endDate">
                <el-date-picker
                        v-model="formInline.endDate"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择结束时间"
                        :picker-options="pickerOptions2"
                        :editable="false"
                        @change="changeEndTime">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="关键字：" prop="screen">
                <el-input size="small" v-model="formInline.screen" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="submitForm('formInline',success,error)">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="日志类型"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="日志内容">
                <template slot-scope="scope">
                    {{scope.row.createTime}} 操作员{{scope.row.operatorName}}在IP:{{scope.row.clientIp}}的计算机上{{scope.row.opName}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="操作时间"
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="operatorName"
                    label="操作人员"
                    width="150">
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
                :current-page.sync="currentPage4"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>


<script>
    import '../../assets/css/wyxCard.css'
    import {submitForm, getSubmitJson, reset} from '../../assets/js/submitForm'
    import classPost from '../../servies/classPost'

    export default {
        data() {
            var selecttime = (rule, value, callback) => {
                if (value != null) {
                    if(this.formInline.endDate==null){
                        callback(new Error('请选择结束时间'))
                    }else {
                        let time = new Date(this.formInline.endDate).getTime() - new Date(this.formInline.beginDate).getTime()
//                let time = this.formInline.createTime[1] - this.formInline.createTime[0]
                        let year = 90 * 24 * 60 * 60 * 1000;
                        if (Math.abs(time) > year) {
                            callback(new Error('查询时间段最长为90天'))
                        } else {
                            callback();
                        }
                    }
                } else {
                    callback();
                }
            };
            let that=this;
            let timeCheck1=function (time) {
                return (time.getTime() > new Date(that.formInline.endDate))
            }
            let timeCheck2=function (time) {
                return (time.getTime() > Date.now())||(time.getTime()<new Date(that.formInline.beginDate))
            }
            return {
                currentPage4: 1,
                formInline: {
                    beginDate: '',
                    type: '',
                    screen:'',
                    endDate:''
                },
                rules:{
                    beginDate: [
                        {validator: selecttime, trigger: 'change'}
                    ],
                    endDate:[

                    ]
                },
                tableData: [],
                total:0,
                submitJson:{},
//                控制可选时间
                pickerOptions1: {
                    disabledDate(time) {
                        return timeCheck1(time);
                    }
                },
                pickerOptions2: {
                    disabledDate(time) {
                        return timeCheck2(time);
                    }
                },
            }
        },
        methods: {
            submitForm,
            changeEndTime(value){
                let time1=new Date(new Date(value).getTime()+24*60*60*1000-1);

//                this.formInline.endDate=new Date(new Date(this.formInline.endDate).getTime()+24*60*60*1000-1)
                this.formInline.endDate=`${time1.getFullYear()}-${time1.getMonth()+1}-${time1.getDate()} ${time1.getHours()}:${time1.getMinutes()}:${time1.getSeconds()}`
            },
            //    分页用到
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                Object.assign(this.submitJson,{pageNum:val});
                this.classPost(this.submitJson);
            },
            success(children){
                let submitJson=getSubmitJson(children);
                submitJson.pageNum=1;
                submitJson.pageSize=10;
                this.currentPage4=1;
//                if(submitJson.time!=null){
//                    submitJson.beginDate=submitJson.time[0];
//                    submitJson.endDate=submitJson.time[1];
//                }
//                submitJson.beginDate=submitJson.time;
//                delete submitJson.time;
                console.log(submitJson)
                this.submitJson=submitJson;
                this.classPost(this.submitJson);
            },
            error(){

            },
            classPost(params){
                classPost.oplogList(params)
                    .then((res)=>{
                        this.tableData=res.data.pagedResult.dataList;
                        this.total=parseInt(res.data.pagedResult.total);
                        console.log(res)
                    })
                    .catch();
            }
        },
        mounted:function () {
//            获取当天时间 作为初始时间
            let date=new Date();
            let time1=new Date(date.setHours(0, 0, 0, 0));
            let time2=new Date(date.setHours(23, 59, 59, 59));
            this.formInline.beginDate=`${time1.getFullYear()}-${time1.getMonth()+1}-${time1.getDate()} ${time1.getHours()}:${time1.getMinutes()}:${time1.getSeconds()}`
            this.formInline.endDate=`${time2.getFullYear()}-${time2.getMonth()+1}-${time2.getDate()} ${time2.getHours()}:${time2.getMinutes()}:${time2.getSeconds()}`


//            classPost.oplogList({type:'login',pageNum:1,pageSize:10,merchantId:1,beginDate:'2018-06-27T08:04:30.672Z',endDate:'2018-06-30T08:04:30.673Z',opType:'login'})
            this.submitJson={pageNum:1,pageSize:10};
            this.classPost(this.submitJson);
        }
    }
</script>

<style>
    .logQuery .el-form {
        display: inline-block;
    }

    .logQuery .el-input-group {
        width: 20%;
        float: right;
    }

    /*.logQuery .el-table td, .logQuery .el-table th {*/
        /*padding: 5px 0;*/
    /*}*/
</style>
