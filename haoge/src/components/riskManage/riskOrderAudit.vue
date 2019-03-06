<template>
   <div class="riskOrderAudit clearfix">
        <el-form :inline="true" :model="formInline" :rules="rules" ref="formInline" class="demo-form-inline">
            <el-form-item label="商户订单号：" prop="orderNumber">
                <el-input v-model="formInline.orderNumber" clearable placeholder="请输入商户订单号"></el-input>
            </el-form-item>
            <el-form-item label="创建时间：" prop="daterange">
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
             <el-form-item label="处理状态：" prop="treatmentState">
                <el-select size="small" v-model="formInline.treatmentState">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已处理" value="1,2,3"></el-option>
                    <el-option label="未处理" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" size="small" @click="riskManageQ('formInline')">查询</el-button>
            </el-form-item>
        </el-form>
         <!-- 输入退款金额的弹框 -->
         <el-dialog title="交易退款" :visible.sync="outerVisible">
             <p class="everinfo">
                <span>交易流水号</span>
                <span>{{refundinfo.orderId}}</span>
            </p>
             <p class="everinfo">
                <span>商户订单号</span>
                <span>{{refundinfo.merchantOrderId}}</span>
            </p>
             <p class="everinfo">
                <span>交易金额</span>
                <span>{{refunds}}    {{refundinfo.orderCurrency}}</span>
            </p>
             <p class="everinfo">
                <span>可退金额</span>
                <span>{{okrefund}}    {{refundinfo.orderCurrency}}</span>
            </p>
             <el-form class="form2" ref="refundform" :model="refundinfo" status-icon :rules="refundrule">
                    <el-form-item
                        label="退款金额" 
                        prop="refundMoneyNum" >
                        <el-input clearable v-model="refundinfo.refundMoneyNum" placeholder="请输入退款金额"></el-input>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="refundcencel('refundform')">取消</el-button>
                <el-button type="primary" @click="refundNext('refundform')">提交</el-button>
            </div>
        </el-dialog>
        <!-- 下载列表 -->
        <div class="downloadList fr">
            <el-button icon='el-icon-download' size="small" @click="downLoadRiskManage">下载列表</el-button>
        </div>
        <div class="downloadList fr">
            <el-button @click="riskManageNormal" type="primary" size="small" :disabled="this.tableData.length==0||noSelect">置为正常</el-button>
        </div>
        <!--表格-->
        <el-table
        :data="tableData"
        style="width: 100%"
        @sort-change="sortTime"
        @select="handleSelectionChange"
        @select-all="handleSelectionChange"
        :default-sort = "{prop: 'date', order: 'descending'}"
        empty-text=""
        v-loading="loading"
        >   
            <el-table-column
                prop=""
                label=""
                type="selection"
                :selectable="selectable"
                align="center">
            </el-table-column>
            <el-table-column
                prop="orderId"
                label="商户订单号"
                align="center"
                width="200">
                <template slot-scope="scope">
                    <span @click="riskOrderIdClick(scope)" style="color: #409EFF;cursor: pointer;">{{scope.row.orderId}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="交易金额"
                align="center">
                <template slot-scope="scope">
                   {{fmoney(scope.row.orderAmount,currencynum(scope.row.currencyCode))}}{{scope.row.currencyCode}}
                </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="预警时间"
                sortable="custom"
                align="center">
            </el-table-column>
            <el-table-column
                prop="orderSubmitTime"
                label="交易完成时间"
                align="center">
            </el-table-column>
            <el-table-column
                prop="reason"
                label="预警原因"
                align="center">
            </el-table-column>
            <el-table-column
                prop="status"
                label="处理状态"
                align="center">
                <template slot-scope="scope">
                    <div v-if='scope.row.status==0'>
                         <div>未处理</div>   
                    </div>
                    <div v-if='scope.row.status==1||scope.row.status==2||scope.row.status==3'>
                         <div>已处理</div>   
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                label="操作"
                align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.showRefundBtn==true" type="text" size="small" @click="refund(scope,'refundform')">退款</el-button>
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
import { moneyToNumValue, fmoney,currencynum } from '../../util/commonality'
import classPost from '../../servies//classPost'
export default {
  data () {
      // 日期选择器不能选择大于90天
        var selecttime = (rule, value, callback) => {
            if(this.formInline.daterange!=null){
                let time = new Date(this.formInline.daterange2)- new Date(this.formInline.daterange)
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
      // 退款金额的规则
      var checkRefund = (rule, value, callback) => {
            value = value.toString()
            let num = currencynum(this.refundinfo.orderCurrency)
            let money = moneyToNumValue(this.okrefund)
            let arr = value.indexOf('.')!==-1?value.split('.'):value
            const reg = /[^\d]/
            if(!value){
                callback(new Error('请输入交易金额'))
            }else{
                if(num==='0'){
                    if(value.indexOf('.')!==-1){
                        callback('请输入合法的数值')
                    }else{
                        if(value*1>money*1){
                            callback('退款金额不能大于可退金额')
                        }else{
                            callback()
                        }  
                    }
                }else{
                    if(value*1>money*1){
                        callback('退款金额不能大于可退金额')
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
        // // 完成金额表单验证规则
        // var checkmoney = (rule, value, callback) => {
        //     let refund = this.pre[1].value.substr(0,this.pre[1].value.lastIndexOf('U'))
        //     refund = moneyToNumValue(refund)
        //     if(!value){
        //         callback(new Error('请输入完成金额'))
        //     }else{
        //         if(value*1>refund*1){
        //             callback(new Error('完成金额不能大于未完成金额'))
        //         }else if(!Number.isInteger(value*1)){
        //             callback(new Error('请输入数字值'));
        //         }else{
        //             callback()
        //         }
        //     }
        // }
        var checkOrderNumber = (rule, value, callback) => {
            console.log(value)
            if(value!=undefined&&value!=''){
                if(!(/^\d+$/.test(value))){
                    this.formInline.orderNumber=value.replace(/\D/g,'');
                    callback()
                }else if(value.length>32){
                    callback(new Error('长度不得超过32个字符'))
                }else{
                    callback()
                }
            }else{
                callback()
            }
        }
    return {
        orderss:'desc',
        noSelect:true,
        loading:true,
        checked:false,
        pageNumber:1,
        pageSize:10,
        outerVisible:false,
        checked: false,
        refundrule:{ //退款弹框的验证规则
            refundMoneyNum:[
                { required:true, validator: checkRefund, trigger: 'blur'}
            ]
        },
        currentPage4: 1,
        formInline: {
            treatmentState:'', 
            orderNumber: '',
            daterange:'',
            daterange2:''
        },
        rules: {
            orderNumber:[
                {validator: checkOrderNumber, trigger: 'change'}
                // { min: 0, max: 32, message: '长度不得超过32个字符', trigger: 'change' }
            ],
            daterange: [
                {validator: selecttime, trigger: 'change'}
            ],
            treatmentState:[
                {message:'请选择处理状态',trigger:'blur'}
            ]
        },
        // prerule:{
        //         okmoney:[
        //             { required:true, validator: checkmoney, trigger: 'blur' }
        //         ]
        // },
       refundinfo:{ // 退款弹框默认信息   
                merchantOrderId:'',
                orderId:'',
                orderAmount:'',
                availableAmount:'',
                refundMoneyNum:'',
                orderCurrency:''
            },
        tableData: [
        ],
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
        multipleSelection: [],
        trades:[],
        total:0,
        
    }
  },
  mounted() {
    
    if(this.$route.query.type){
        this.formInline.treatmentState='0'
    }else{
        let time=new Date();
        let time2=new Date(new Date().getTime()-(30 * 24 * 60 * 60 * 1000));
        let now=`${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`;
        let go=`${time2.getFullYear()}-${time2.getMonth()+1}-${time2.getDate()}`;
        this.formInline.daterange=go 
        this.formInline.daterange2=now 
    }
    this.riskManageQuery();
  },
  computed:{
        refunds(){
            return fmoney(this.refundinfo.orderAmount,currencynum(this.refundinfo.orderCurrency))
        },
        // 退款金额 金钱化
        okrefund(){
            return fmoney(this.refundinfo.availableAmount?this.refundinfo.availableAmount:0,currencynum(this.refundinfo.orderCurrency))
        },
        // 完成退款金额
        refundes(){
            return fmoney(this.refundinfo.refundMoneyNum,currencynum(this.refundinfo.orderCurrency))
        },
        das(){
            return {
                "availableAmount": this.refundinfo.availableAmount,
                "merchantOrderId": this.refundinfo.merchantOrderId,
                "orderId": this.refundinfo.orderId,
                "refundAmount": this.refundinfo.refundMoneyNum,
                }
        }
  },  
  methods: {
      fmoney,
      currencynum,
      //未处理可勾选
      selectable(row,index){
        return row.status==0
      },
      //获取置为正常的请求参数tradeOrderNo
      handleSelectionChange(val){
          console.log(val)
          if(val.length==0){
              this.noSelect=true
          }else{
              this.noSelect=false;
          }
          let arr = []
          val.forEach((item)=>{
              arr.push(item.tradeOrderNo)
          })
          this.trades = arr
      },
      //查询
        riskManageQ(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                        console.log(1111)
                        this.loading=true
                        this.pageNumber=1
                        this.currentPage4=1
                        this.riskManageQuery();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //排序
    sortTime(data){
        console.log(data)
        if(data.order=='descending'){
            this.orderss='desc'
            this.loading=true
            this.riskManageQuery() 
        }else if(data.order=='ascending'){
            this.orderss='asc'
            this.loading=true
            this.riskManageQuery() 
        }else{
            return false
        }
    },
      riskManageQuery(){
          let arr = this.formInline.treatmentState.includes(',')?this.formInline.treatmentState.split(','):this.formInline.treatmentState?[this.formInline.treatmentState]:[]
            var obj={
                orderId:this.formInline.orderNumber,
                startDate:this.formInline.daterange, 
                endDate :this.formInline.daterange2,
                statusList:arr,
                pageBean:{
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize,
                    orderBy:`r.CREATE_TIME ${this.orderss}`  
                }
            }
          classPost.riskManageQuery(obj)
            .then((res)=>{
                console.log(res)
                this.total=parseInt(res.data.total)
                this.tableData=res.data.dataList;
                this.loading=false
            }).catch((err)=>{
                console.log(err)
                this.loading=false
            })
      },
     //置为正常
     riskManageNormal(){
         this.$confirm('是否置为正常?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            classPost.riskManageNormal({tradeOrderNos:this.trades})
                .then((res)=>{
                    this.$confirm('置为正常成功', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'success'
                    }).then(() => {
                        this.loading=true
                        this.riskManageQuery()
                    // this.$message({
                    //     type: 'success',
                    //     message: '删除成功!'
                    // });
                    }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });          
                    });
                    
                }).catch((err)=>{
                    console.log(err)
                })
            }).catch(() => {        
        });
     },
     //下载
     downLoadRiskManage(){
         var obj={
                orderId:this.formInline.orderNumber,
                startDate:this.formInline.daterange, 
                endDate :this.formInline.daterange2,
                pageBean:{
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize
                }
            }
            console.log(obj)
        classPost.downLoadRiskManage(obj)
            .then((res)=>{
                const content = res
　　            const blob = new Blob([content],{type:"application/vnd.ms-excel"})
　　            const fileName = '风控管理.xls'
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
     // 赋值事件
        assignment(scope, assignmentArr){
            Object.assign(assignmentArr,scope)
        },
      // 退款事件
    refund (scope ,form) {
        classPost.query_detail({orderId:scope.row.tradeOrderNo})
            .then((res)=>{
                console.log(res)
                if(res.data==null){
                    this.$alert('数据异常', '退款', {
                    confirmButtonText: '确定',
                    callback: action => {
                        // this.$message({
                        // type: 'info',
                        // message: `action: ${ action }`
                        // });
                    }
                    });
                }
                let money = moneyToNumValue(res.data.orderAmount)
                this.assignment(res.data, this.refundinfo)
                if(money>0){
                    this.$refs[form]&&this.$refs[form].resetFields()
                    console.log(res.data)
                    this.outerVisible=true
                }else{
                    return 
                }
            })
            .catch((err)=>{
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
    riskOrderIdClick(scope){
        this.$router.push('/home/tradeManage/orderDetails/'+scope.row.tradeOrderNo)
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
        this.pageNumber=val
        this.riskManageQuery();
    },
    handleClick(tab, event) {
        console.log(tab, event);
    },
    // 输入支付密码弹框的返回事件
    back(){
        this.outerVisible = true
        this.outerVisible2 = false
    },
     refundcencel(Form){ // 退款取消
            this.outerVisible=false
            setTimeout(()=>{
                this.$refs[Form].resetFields() 
            },300)
            
        },
    // 输入退款金额弹框的提交事件
         refundNext(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.outerVisible=false
                    this.$confirm('您好，您要退款的金额为'+this.refundes+this.refundinfo.orderCurrency, '退款确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '返回',
                        type: 'warning'
                    }).then(()=>{
                        let obj = Object.assign(this.refundinfo,{refundAmount:this.refundinfo.refundMoneyNum})
                        console.log(obj,'124')
                        classPost.refund(this.das)
                            .then((res)=>{
                                console.log(res)
                                this.$alert('您的退款已成功，退款金额为：'+ this.refundes+this.refundinfo.orderCurrency, '提交成功', {
                                        confirmButtonText: '确定',
                                        type: 'success'
                                    }).then(()=>{
                                        this.riskManageQuery()
                                    })
                            })
                            .catch((err)=>{
                                 this.$alert('您的退款失败了,失败原因：'+res.message, '提交失败', {
                                        confirmButtonText: '确定',
                                        type: 'error'
                                })   
                            })
                      
                    }).catch(()=>{
                        this.outerVisible=true
                    })
                } else {
                    return false;
                }
            });
        },
  },
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
.riskOrderAudit{
    background: #fff;
    margin-top:20px;
    padding:20px;
}
.riskOrderAudit .el-card__header,.riskOrderAudit .el-table th{
background: rgba(24, 144, 255, 0.1);
color:#000;
}
.riskOrderAudit .yuan{
display:inline-block;width: 8px;height: 8px;border-radius: 50%;
margin-right: 5px;
background: red
}
.riskOrderAudit .el-pagination.is-background .el-pager li,.riskOrderAudit .el-pagination.is-background .btn-prev,.riskOrderAudit .el-pagination.is-background .btn-next{
background: #fff;
border:1px solid #dadada;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
border-radius: 4px;
}
.riskOrderAudit .el-date-editor .el-range-separator{
    padding:0;
} 

.riskOrderAudit .el-table .cell{
    text-align: center;
    padding:0;
}
.riskOrderAudit .detail{
    text-decoration: none;
    border:0;
    color:#1890FF;
}
.riskOrderAudit .downloadList{
    margin-left:10px;
    margin-bottom:10px;
}
.riskOrderAudit tbody tr td:nth-child(2) a{
    color:#1890FF;
    text-decoration: none;
}

.riskOrderAudit .myCell .el-checkbox__input {
  display: none
}



.riskOrderAudit .everinfo{
    height: 50px;
    display: flex;
    align-items: center;
    padding-left:20px;
}

.riskOrderAudit .everinfo span:nth-child(1){
        width: 110px;
        text-align: right
    }
.riskOrderAudit .everinfo span:nth-child(2){
    margin-left: 20px;
}
.riskOrderAudit .form2 .el-form-item{
    padding-left: 65px;
    display: flex;
    margin-top: 10px;
}
.riskOrderAudit .form2 .el-input{
    margin-left: 10px;
}
.riskOrderAudit .form2 .el-form-item__error{
    left: 10px;
}
.riskOrderAudit .pl50{
    padding-left: 50px;
}
.riskOrderAudit .pl30{
    padding-left: 30px;
}
.riskOrderAudit .all{
    margin-left: 30px; 
    margin-top: 20px;
    color: rgb(22, 155, 213);
}
</style>



