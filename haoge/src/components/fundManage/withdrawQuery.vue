<template>
   <div class="withdrawQuery clearfix">
        <el-form :inline="true" :model="formInline" :rules="rules" ref="formInline" class="demo-form-inline">
            <el-form-item label="会员名称：">
                <span>{{name}}</span>
            </el-form-item>
            <el-form-item label="会员号：">
                <span>{{memberCode}}</span>
            </el-form-item>
            <el-form-item label="账户选择：" prop="payerAcctcode">
            <el-select v-model="formInline.payerAcctcode" placeholder="请选择" clearable>
            	<el-option v-for='(item,index) of selectAccountType' :key='index' :label='`${item.curCodeName}(${item.curCode})`' :value='item.acctCode'></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="交易状态：" prop="orderStatus">
            <el-select v-model="formInline.orderStatus" placeholder="请选择" clearable >
            	<el-option v-for='(item,index) of transactionState' :key='index' :label='item.textExpress' :value='item.id'></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="选择日期：" prop="startTime">
                <el-date-picker
                        v-model="formInline.startTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始时间"
                        :picker-options="pickerOptions1"
                        :editable="false">
                </el-date-picker>
                -
                <el-date-picker
                        v-model="formInline.endTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束时间"
                        :picker-options="pickerOptions2"
                        :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" size="small" @click="submitForm('formInline',querySuccess,queryError)">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 下载列表 -->
        <div class="downloadList fr">
            <el-button icon='el-icon-download' size="small" @click='withdrawDown'>下载列表</el-button>
        </div>
        <!--表格-->
        <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        empty-text=""
        >   
            <el-table-column
                prop="orderId"
                label="交易流水号"
                align="center"
                width="200">
                <template slot-scope="scope">
                    <router-link :to="{path:'/home/fundManage/withdraw/withdrawDetail',query:{id:scope.row.orderId}}" class="detail">
                  	    {{scope.row.orderId}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="createDateStr"
                label="提现发起时间"
                align="center">
            </el-table-column>
            <el-table-column
                prop=""
                label="提现账户"
                align="center">
                 <template slot-scope="scope">
                    {{scope.row.payerAcctcodeName}}({{scope.row.payerAcctcodeCurrency}})
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="提现金额"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.orderAmountStr}}{{scope.row.payerAcctcodeCurrency}}
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="提现手续费"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.feeStr}}{{scope.row.payerAcctcodeCurrency}}
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="提现卡"
                width="200"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.payeeBankname}}({{'尾号'+scope.row.maskpayeeBankacctcode}})
                </template>
            </el-table-column>
            <el-table-column
                prop="orderStatus "
                label="状态"
                :formatter="formatter">
                <template slot-scope="scope">
                	<div v-if ='scope.row.orderStatus == 100'>
                		<div class="yuanGray"></div>初始状态
                	</div>
                	<div v-else-if ='scope.row.orderStatus == 101'>
                		<div class="yuanGray"></div>处理中
                	</div>
                	<div v-else-if ='scope.row.orderStatus == 102'>
                		<div class="yuan"></div>申请失败
                	</div>
                	<div v-else-if ='scope.row.orderStatus == 111'>
                		<div class="yuanGreen"></div>处理成功
                	</div>
                	<div v-else-if ='scope.row.orderStatus == 112'>
                		<div class="yuan"></div>处理失败
                	</div>
                	<div v-else-if ='scope.row.orderStatus == 113'>
                		<div class="yuanGray"></div>已退票
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
        :current-page.sync="currentPage"  
        :page-size="pageShowNumber"
        layout="total, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>        
</template>
<script>
import "../../assets/css/hmdCommon.css"
import { Message } from 'element-ui' 	//element Message 组件引入
import { submitForm,getSubmitJson, reset } from '../../assets/js/submitForm'
import { downloadfile } from '../../util/commonality'
import classPost from '../../servies/classPost'
export default {
  data () {
    // 日期选择器不能选择大于90天
    var selecttime = (rule, value, callback) => {
        if(value!=null){
            console.log(value)
            let time = new Date(this.formInline.endTime)-new Date(this.formInline.startTime)
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
        if(that.formInline.endTime==null){
            return time.getTime() > Date.now();
        }else{
            return time.getTime() > new Date(that.formInline.endTime);
        }
    }
    let timeCheck2=function (time) {
        return (time.getTime() > Date.now())||(time.getTime()<(new Date(that.formInline.startTime)-1*24*60*60*1000));
    }
    return {
        memberCode:'',
        name:'',
        currentPage: 1,		     //当前页数
        pageShowNumber:10,		// 每页显示条目个数
        total:0,				//共多少页
        selectAccountType:[],  //选择状态
        transactionState:[			//交易状态
        	{
        		id:100,
        		textExpress:'初始状态'
        	},
        	{
        		id:101,
        		textExpress:'处理中'
        	},
        	{
        		id:102,
        		textExpress:'申请失败'
        	},
        	{
        		id:111,
        		textExpress:'处理成功'
        	},
        	{
        		id:112,
        		textExpress:'处理失败'
        	},
        	{
        		id:113,
        		textExpress:'已退票'
        	}
        ],
        formInline: {
            payerAcctcode: '',
            orderStatus: '',
            startTime:'',
            endTime:'',
        },
        rules: {
            startTime: [
                // { required: true, message: '请选择时间', trigger: 'change' },
                { validator: selecttime,  trigger: 'blur' }
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
		tableData: [],
		myJson:{}
    }
  },

  created: function () {
    this.accountSelect();
    this.data=JSON.parse(localStorage.data)
    this.memberCode=this.data.memberId//商户号
    this.name=this.data.name//商户名
  },

  methods: {
  	//账户选择
  	accountSelect(){
  		var obj = {
			"acctType": 1
		}
  		classPost.accountSelect(obj)
  			.then((res)=>{
  				console.log(res);
				if(res.code=='00000000'){
					this.selectAccountType = res.data;
				}
  			})
  			.catch((err)=>{
  				console.log(err)
  			})
  	},
  	//查询提交
  	submitForm,
  	//查询成功
  	querySuccess(children){
  		let submitJson = getSubmitJson(children);	
  		submitJson.pageNumber  = 1;     //第几页
        submitJson.pageSize = 10;   //每页行数]
  		// submitJson.startTime=submitJson.daterange;
  		submitJson.endTime=this.formInline.endTime;
        // delete submitJson.daterange;
          this.myJson=submitJson;
          this.currentPage = 1;
          console.log(submitJson)
  		classPost.withdrawQuery(submitJson)
  			.then((res)=>{
                console.log(res)
  				if(res.status=='1'){
  					this.tableData = res.data.dataList;
                    this.total = parseInt(res.data.total);
  				}
  				console.log(res);
  			})
  			.catch((err) => {
            console.log(err)
        })
  		
  		console.log(submitJson);
  	},
  	queryError(){
  		console.log('你好,报错了,开心了吧---打后台');
  	},
  	//提现查询下载
  	withdrawDown(){
  		var obj = {
			pageNumber: this.currentPage,
            pageSize: this.total,
            startTime:this.formInline.startTime,
            endTime:this.formInline.endTime,
            payerAcctcode:this.formInline.payerAcctcode,
            orderStatus:this.formInline.orderStatus
		}
  		classPost.withdrawDownload(obj)
  			.then((res)=>{
  				console.log(res)
                const content = res
　　            const blob = new Blob([content],{type:"application/vnd.ms-excel"})
　　            const fileName = '提现单下载.xls'
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
  			})
  			.catch()
  	},
  	
    /*submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
            alert('submit!');
            } else {
            console.log('error submit!!');
            return false;
            }
        });
    },*/
    
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
    //点击页数
    handleCurrentChange(val) {
//  	this.currentPage = val;
//      this.choosePara.pageNumber = val;
//		submitJson.pageNumber  = 1;     //第几页
//		submitJson.pageSize = 10;   //每页行数
//   bizhong
        //console.log('jfskjfksfjkfjkfjkfjksfj', this.submitJson.pageNumber );
		this.myJson.pageNumber = val;
        classPost.withdrawQuery(this.myJson).then((res) => {
            this.tableData = res.data.dataList;
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
        console.log(`当前页: ${val}`);
    },
    allWithdraw(){
        // this.withdrawForm.amount=this.withdrawForm.message
        
    },
    handleClick(tab, event) {
        console.log(tab, event);
    }
  },
	//默认时间
	mounted:function(){
	  	let time=new Date();
	    let time2=new Date(new Date().getTime()-(30 * 24 * 60 * 60 * 1000));
	    let now=`${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`;
	    let go=`${time2.getFullYear()}-${time2.getMonth()+1}-${time2.getDate()}`;
        this.formInline.startTime=go 
        this.formInline.endTime=now



        this.myJson.startTime=this.formInline.startTime;
        this.myJson.endTime=this.formInline.endTime;
        this.myJson.pageSize=10;
        this.myJson.pageNumber=1;
        console.log( this.myJson)
  		classPost.withdrawQuery(this.myJson)
  			.then((res)=>{
  				if(res.status=='1'){
  					this.tableData = res.data.dataList;
  					this.total = parseInt(res.data.total);
  				}
  				console.log(res);
  			})
  			.catch()
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
.withdrawQuery{
    background: #fff;
    margin-top:20px;
    padding:20px;
}
.withdrawQuery .el-card__header,.withdrawQuery .el-table th{
background: rgba(24, 144, 255, 0.1);
color:#000;
}

.withdrawQuery .el-form--inline .el-form-item{
    margin-right: 5%;
}
.withdrawQuery .el-pagination.is-background .el-pager li,.withdrawQuery .el-pagination.is-background .btn-prev,.withdrawQuery .el-pagination.is-background .btn-next{
background: #fff;
border:1px solid #dadada;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
border-radius: 4px;
}
.withdrawQuery .el-pagination{
text-align: center;
padding: 30px;
}
.withdrawQuery .el-date-editor .el-range-separator{
    padding:0;
} 

.withdrawQuery .el-table .cell{
    text-align: center;
    padding:0;
}
.withdrawQuery .detail{
    text-decoration: none;
    border:0;
    color:#1890FF;
}
.withdrawQuery .downloadList{
    margin-bottom:10px;
}
.withdrawQuery .yuan{
display:inline-block;width: 8px;height: 8px;border-radius: 50%;
margin-right: 5px;
background: red
}
.withdrawQuery .yuanGreen{
    display:inline-block;width: 8px;height: 8px;border-radius: 50%;
margin-right: 5px;
background: #52C41A;
}
.withdrawQuery .yuanGray{
display:inline-block;width: 8px;height: 8px;border-radius: 50%;
margin-right: 5px;
background:rgba(0, 0, 0, 0.25);
}
.withdrawQuery .el-form-item{
    margin-bottom: 10px;
}
</style>


