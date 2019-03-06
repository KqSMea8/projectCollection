<template>
   <div class="currencyQuery clearfix">
        <el-form :inline="true" :model="formInline" :rules="rules" ref="formInline"  class="demo-form-inline">
            <el-form-item label="会员名称：">
                <span>{{name}}</span>
            </el-form-item>
            <el-form-item label="会员号：">
                <span>{{memberCode}}</span>
            </el-form-item>
            <el-form-item label="账户选择：">
            <el-select v-model="formInline.account" placeholder="请选择提现账户" clearable>
                <el-option
                    v-for='(item,index) of accttypeList'
                    :key="index" 
                    :value="item.curCode"
                    :label = "`${item.curCodeName}(${item.curCode})`">
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="交易状态：">
            <el-select v-model="formInline.deal" placeholder="全部" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="交易中" value="0"></el-option>
                <el-option label="交易成功" value="1"></el-option>
                <el-option label="交易失败" value="2"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="入账日期：" prop="daterange">
                <el-date-picker
                        v-model="formInline.daterange"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始时间"
                        :picker-options="pickerOptions1"
                        :editable="false">
                </el-date-picker>
                -
                <el-date-picker
                        v-model="formInline.daterange2"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束时间"
                        :picker-options="pickerOptions2"
                        :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" size="small" @click="querybysetterorderQ">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 下载列表 -->
        <div class="downloadList fr" @click="exportbuysettleorder">
            <el-button icon='el-icon-download' size="small">下载列表</el-button>
        </div>
        <!--表格-->
        <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        empty-text=""
        v-loading="loading"
        >   
            <el-table-column
                prop="exchangeNo"
                label="交易流水号"
                align="center">
            </el-table-column>
            <el-table-column
                prop="completedDateStr"
                label="交易时间"
                @sort-change="sortChange"
                align="center">
            </el-table-column>
            <el-table-column
                prop=""
                label="卖出金额"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.exchAmount}}{{scope.row.exchCurrencyCode}}
                </template>
            </el-table-column>
            <el-table-column
                prop="exchangeRate"
                label="汇率"
                align="center">
            </el-table-column>
            <el-table-column
                prop=""
                label="买入金额"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.orderAmount}}{{scope.row.currencyCode}}
                </template>
            </el-table-column>
            <el-table-column
                prop="tradeFee"
                label="手续费"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.tradeFee}}{{scope.row.exchCurrencyCode}}
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                :formatter="formatter">
                <template slot-scope="scope">
                    <div v-if="scope.row.status==0">
                        <div class="yuan00025"></div><span>交易中</span>  
                    </div>
                    <div v-if="scope.row.status==1">
                        <div class="yuanGreen"></div><span>交易成功</span>  
                    </div>
                    <div v-if="scope.row.status==2">
                        <div class="yuanRed"></div><span>交易失败</span>  
                    </div>
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
        :current-page.sync="currentPage4"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>        
</template>
<script>
import "../../assets/css/hmdCommon.css"
import { Message } from 'element-ui' //element Message 组件引入
import classPost from '../../servies/classPost'
export default {
  data () {
    // 日期选择器不能选择大于90天
    var selecttime = (rule, value, callback) => {
        if(this.formInline.daterange!=null){
            let time = new Date(this.formInline.daterange2)-new Date(this.formInline.daterange)
            let year = 90 * 24 * 60 * 60 * 1000
            if(time>year){
                callback(new Error('查询时间段最长为90天'))
            }else{
                callback()
            }
        }else{
             callback();
        }
    }
    let that=this;
    let timeCheck1=function (time) {
        if(that.formInline.daterange2==null){
            return time.getTime() > Date.now();
        }else{
            return time.getTime() > new Date(that.formInline.daterange2);
        }
    }
    let timeCheck2=function (time) {
        return (time.getTime() > Date.now())||(time.getTime()<new Date(that.formInline.daterange));
    }
    return {
        loading:true,
        memberCode:'',
        name:'',
        currentPage4: 1,
        accttypeList:[],
        pageNumber:1,
        pageSize:10,
        total:0,
        formInline: {
            account: '',
            deal: '',
            daterange:'',
            daterange2:''
        },
        rules: {
            daterange: [
                // { required: true, message: '请选择时间', trigger: 'change' },
                {validator: selecttime, trigger: 'blur'}
            ],
        },
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
        tableData: [
        ]
    }
  },

  created: function () {
        this.data=JSON.parse(localStorage.data)
        this.memberCode=this.data.memberId//商户号
        this.name=this.data.name//商户名
        //	默认时长
	  	let time=new Date();
	    let time2=new Date(new Date().getTime()-(30 * 24 * 60 * 60 * 1000));
	    let now=`${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`;
	    let go=`${time2.getFullYear()}-${time2.getMonth()+1}-${time2.getDate()}`;
	    this.formInline.daterange=go 
        this.formInline.daterange2=now 
        this.queryaccttypeList();
        this.querybysetterorder();
  },

  methods: {
    //提现账户列表
    queryaccttypeList(){
        classPost.queryaccttypeList({acctType:1})
            .then((res)=>{
                console.log(res)
                this.accttypeList=res.data
            }).catch((err)=>{
                console.log(err)
        })    
    },
    //查询
    querybysetterorderQ(){
        this.loading=true
        this.currentPage4=1
        console.log(this.currentPage4)
        this.pageNumber=1
        this.querybysetterorder();
    },
    querybysetterorder(){
        var obj={
            exchCurrencyCode:this.formInline.account,
            status:this.formInline.deal,
            pageNumber:this.pageNumber,
            pageSize:this.pageSize,
            startTime:this.formInline.daterange, 
            endTime:this.formInline.daterange2,
            orderBy:' create_date desc '
        }
        classPost.querybysetterorder(obj)
            .then((res)=>{
                console.log(res)
                this.loading=false
                this.tableData=res.data.dataList
                this.total=parseInt(res.data.total)
            }).catch((err)=>{
                console.log(err)
                this.loading=false
        }) 
    },
    //下载
    exportbuysettleorder(){
        var obj={
            exchCurrencyCode:this.formInline.account,
            status:this.formInline.deal,
            pageNumber:this.pageNumber,
            pageSize:this.total,
            startTime:this.formInline.daterange, 
            endTime:this.formInline.daterange2
        }
        console.log(obj)
        classPost.exportbuysettleorder(obj)
            .then((res)=>{
                const content = res
　　            const blob = new Blob([content],{type:"application/vnd.ms-excel"})
　　            const fileName = '换汇单下载.xls'
　　            if ('download' in document.createElement('a')) { // 非IE下载
　　            　　const elink = document.createElement('a')
　　            　　elink.download = fileName
　　            　　elink.style.display = 'none'
　　            　　elink.href = URL.createObjectURL(blob)
　　            　　document.body.appendChild(elink)
　　            　　elink.click()
　　            　　URL.revokeObjectURL(elink.href) // 释放URL 对象
　　            　　document.body.removeChild(elink)
　　            } else { // IE10+下载
　　            　　navigator.msSaveBlob(blob, fileName)
　　            }
            }).catch((err)=>{
                console.log(err)
        }) 
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
            alert('submit!');
            } else {
            console.log('error submit!!');
            return false;
            }
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    formatter(row, column) {
      return row.state;
    },
//    分页用到
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
        this.loading=true
        this.pageNumber=val;
        this.querybysetterorder();
    },
    allWithdraw(){
        // this.withdrawForm.amount=this.withdrawForm.message
        alert(1)
    },
    handleClick(tab, event) {
        console.log(tab, event);
    },
    sortChange(column, prop, order ){

    },
  }
}

</script>
<style>
.clearfix:after{ content: ""; display: block;width:0; height: 0; clear: both; visibility: hidden; }
.clearfix { zoom: 1; }
.fl{
    float: left;
}
.fr{
    float: right;
}
.currencyQuery{
    background: #fff;
    margin-top:20px;
    padding:20px;
}
.currencyQuery .el-card__header,.currencyQuery .el-table th{
background: rgba(24, 144, 255, 0.1);
color:#000;
}
.currencyQuery .yuan{
display:inline-block;width: 8px;height: 8px;border-radius: 50%;
margin-right: 5px;
background: red
}
.currencyQuery .el-form--inline .el-form-item{
    margin-right: 2%;
}
.currencyQuery .el-pagination.is-background .el-pager li,.currencyQuery .el-pagination.is-background .btn-prev,.currencyQuery .el-pagination.is-background .btn-next{
background: #fff;
border:1px solid #dadada;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
border-radius: 4px;
}
.currencyQuery .el-pagination{
text-align: center;
padding: 30px;
}
.currencyQuery .el-date-editor .el-range-separator{
    padding:0;
} 

.currencyQuery .el-table .cell{
    text-align: center;
    padding:0;
}
.currencyQuery .detail{
    text-decoration: none;
    border:0;
    color:#1890FF;
}
.currencyQuery .downloadList{
    margin-bottom:10px;
}
.currencyQuery .yuanRed {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    background: red
}
.currencyQuery .yuan00025 {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    background: rgba(0, 0, 0, 0.25)
}
.currencyQuery .yuanGreen{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    background: #52C41A
}
.currencyQuery .el-form-item{
    margin-bottom: 10px;
}
</style>
