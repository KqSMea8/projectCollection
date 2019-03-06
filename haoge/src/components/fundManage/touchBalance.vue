<template>
   <div class="touchBalance clearfix">
        <el-form :inline="true" :model="formInline" :rules="rules" ref="formInline" class="demo-form-inline">
            <el-form-item label="账户类型：" prop="accountType">
            <el-select v-model="formInline.accountType" placeholder="请选择账户类型" clearable @change="changeAccountType"> 
                <el-option label="基本账户" value="1"></el-option>
                <el-option label="保证金" value="2"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="选择币种：" prop="currency">
            <el-select v-model="formInline.currency" placeholder="请选择币种" clearable no-data-text="请先选择账户类型">
                <el-option  v-for="(item,index) in currency" :key="index" :label="`${item.curCodeName}(${item.curCode})`" :value="item.acctCode"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="明细类型：" prop="detailType">
            <el-select v-model="formInline.detailType" placeholder="请选择明细类型"  clearable no-data-text="请先选择账户类型">
                <el-option v-for="(item,index) of detailType" :key="index" :label="item.message" :value="item.code"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="商户订单号：" prop="orderNumber">
                <el-input v-model="formInline.orderNumber" clearable placeholder="请输入商户订单号"></el-input>
            </el-form-item>
            <el-form-item label="入账日期：" prop="daterange">
                <el-date-picker
                        v-model="formInline.daterange"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择入账开始时间"
                        :picker-options="pickerOptions1"
                        :editable="false">
                </el-date-picker>
                -
                <el-date-picker
                        v-model="formInline.daterange2"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择入账结束时间"
                        :picker-options="pickerOptions2"
                        :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" size="small" @click="submitForm('formInline')">查询</el-button>
            </el-form-item>
        </el-form>

        <!-- 下载列表 -->
        <div class="downloadList fr"  @click="downLoadBalanceDeal">
            <el-button icon='el-icon-download' size="small">下载报表</el-button>
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
                prop="merchantOrderId"
                label="商户订单号"
                align="center">
            </el-table-column>
            <el-table-column
                prop="orderId"
                label="交易流水号"
                align="center">
            </el-table-column>
            <el-table-column
                prop="createDateStr"
                label="入账日期"
                align="center">
            </el-table-column>
            <el-table-column
                prop="dealTypeName"
                label="明细类型"
                align="center">
            </el-table-column>
            <el-table-column
                prop=""
                label="收入"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.revenue}}({{scope.row.payeeCurrencyCode==null?scope.row.payerCurrenCode:scope.row.payeeCurrencyCode}})
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="支出"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.pay}}({{scope.row.payerCurrenCode==null?scope.row.payeeCurrencyCode:scope.row.payerCurrenCode}})
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="账户余额"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.balance}}({{scope.row.currencyCode}})
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
import classPost from '../../servies//classPost'
export default {
  data () {
    // 日期选择器不能选择大于7天
    var selecttime = (rule, value, callback) => {
        if(this.formInline.daterange!=null){
            let time = new Date(this.formInline.daterange2)-new Date(this.formInline.daterange)
            let year = 30 * 24 * 60 * 60 * 1000
            if(time>year){
                callback(new Error('查询时间段最长为30天'))
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
        return (time.getTime() > Date.now())||(time.getTime()<(new Date(that.formInline.daterange)-1*24*60*60*1000));
    }
    var checkamount = (rule, value, callback) => {
        let num = currencynum(this.formInline.currency)
        let arr = value.indexOf('.')!==-1?value.split('.'):value
        const reg = /[^\d]/
        if(this.ruleForm.currency==''){
          callback(new Error('请先选择交易币种'))
        }else{
          if(!value){
            callback(new Error('请输入交易金额'))
          }else{
            if(num==='0'){
              if(value.indexOf('.')!==-1){
                callback('请输入合法的数值')
              }else{
                callback()
              }
            }else{
              if(typeof arr!=='string'){
                if(arr.length > 2 || num < arr[1].length || reg.test(arr[1])){
                  callback('请输入合法的数值')
                }else{
                  callback()
                }
              }else{
                if( value*1<=0 ){
                  callback(new Error('金额不能为0或者小于0'))
                }else if(reg.test(value)){
                  callback('请输入合法的数值')
                }else{
                  callback()
                }
              }
             }
            
          }
        }
      }
    return {
        loading:false,
        pageNumber:1,
        pageSize:10,
        acctCode:'',
        currentPage4: 1,
        currency:[],
        detailType:[],
        total:0,
        formInline: {
            accountType: '',
            currency: '',
            detailType: '',
            orderNumber: '',
            daterange:'',
            daterange2:'',
        },
        rules: {
          accountType: [
            { required: true, message: '请选择账户类型', trigger: 'change' },
          ],
          currency: [
            { required: true, message: '请选择币种', trigger: 'change' }
          ],
          daterange: [
            { required: true, message: '请选择时间', trigger: 'change' },
            { validator: selecttime, trigger: 'blur'}
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

  mounted: function () {
    //	默认时长
	  	let time=new Date();
	    let time2=new Date(new Date().getTime()-(7 * 24 * 60 * 60 * 1000));
	    let now=`${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`;
	    let go=`${time2.getFullYear()}-${time2.getMonth()+1}-${time2.getDate()}`;
        this.formInline.daterange=go 
        this.formInline.daterange2=now
  },  
  methods: {
      //选择基本类型
    changeAccountType(){
        this.queryAcctTypeAnddealTypeList(this.formInline.accountType)
        this.currency=[];
        this.detailType=[];
        this.formInline.currency=''
    },
    //根据基本类型获取账户币种列表和明细类型列表
    queryAcctTypeAnddealTypeList(id){
        classPost.queryAcctTypeAnddealTypeList({acctType:id})
          .then((res)=>{
                console.log(res)
                this.currency=res.data.acctAttribDTOList
                this.detailType=res.data.dealTypeDTOList
          }).catch((err)=>{
            console.log(err)
        })
    },
    //查询
    queryBalanceDeal(){
        var obj={
            pageSize:this.pageSize,
            pageNumber:this.pageNumber,
            acctType:this.formInline.accountType,
            acctCode:this.formInline.currency,
            dealType:this.formInline.detailType,
            merchantOrderId:this.formInline.orderNumber,
            startTime:this.formInline.daterange,
            endTime:this.formInline.daterange2
        }
        console.log(obj)
        classPost.queryBalanceDeal(obj)
          .then((res)=>{
            console.log(res);
            this.tableData=res.data.dataList
            this.total=parseInt(res.data.total)
            this.loading=false
          }).catch((err)=>{
            console.log(err)
            this.loading=false
        })
    },
    //下载
    downLoadBalanceDeal(){
        var obj={
            pageSize:this.pageSize,
            pageNumber:this.pageNumber,
            acctType:this.formInline.accountType,
            acctCode:this.formInline.currency,
            dealType:this.formInline.detailType,
            merchantOrderId:this.formInline.orderNumber,
            startTime:this.formInline.daterange,
            endTime:this.formInline.daterange2,
            pageSize:this.total
        }
        classPost.downLoadBalanceDeal(obj)
            .then((res)=>{
                console.log(res)
                const content = res
　　            const blob = new Blob([content],{type:"application/vnd.ms-excel"})
　　            const fileName = '余额明细.xls'
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
              this.loading=true
              this.pageNumber=1
              this.queryBalanceDeal();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    onSubmit() {
      console.log('submit!');
    },
    formatter(row, column) {
      return row.state;
    },
    open2() {
//      this.$alert('<strong>这是 <i>HTML</i> 片段</strong>', 'HTML 片段', {
//        dangerouslyUseHTMLString: true
//      });
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
        this.loading=true
        this.pageNumber=val;
        this.queryBalanceDeal();
    },
    allWithdraw(){
        // this.withdrawForm.amount=this.withdrawForm.message
        alert(1)
    },
    handleClick(tab, event) {
        console.log(tab, event);
    }
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
.touchBalance{
    background: #fff;
    margin-top:20px;
    padding:20px;
}
.touchBalance .el-card__header,.touchBalance .el-table th{
background: rgba(24, 144, 255, 0.1);
color:#000;
}
.touchBalance .yuan{
display:inline-block;width: 8px;height: 8px;border-radius: 50%;
margin-right: 5px;
background: red
}
.touchBalance .el-form--inline .el-form-item{
    
    margin-bottom: 20px;
}
.touchBalance .el-pagination.is-background .el-pager li,.touchBalance .el-pagination.is-background .btn-prev,.touchBalance .el-pagination.is-background .btn-next{
background: #fff;
border:1px solid #dadada;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
border-radius: 4px;
}
.touchBalance .el-date-editor .el-range-separator{
    padding:0;
}

.touchBalance .el-table .cell{
    text-align: center;
    padding:0;
}
.touchBalance .detail{
    text-decoration: none;
    border:0;
    color:#1890FF;
}
.touchBalance .downloadList{
    margin-bottom:10px;
}

.touchBalance .el-card__header,.touchBalance .el-table th {
    padding: 9px 0;
}
</style>


