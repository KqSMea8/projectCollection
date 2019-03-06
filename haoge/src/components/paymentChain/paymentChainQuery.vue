<template>
   <div class="currencyQuery clearfix">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" :rules="rules">
            <el-form-item label="支付链ID：" prop="paymentId">
                <el-input v-model="formInline.paymentId" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品名称：" prop="commodityName">
                <el-input v-model="formInline.commodityName" clearable></el-input>
            </el-form-item>
            <el-form-item label="创建时间：" prop="startCreadTime">
                <el-date-picker
                        v-model="formInline.startCreadTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始时间"
                        :picker-options="pickerOptions1"
                        :editable="false">
                </el-date-picker>
                -
                <el-date-picker
                        v-model="formInline.endCreadTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束时间"
                        :picker-options="pickerOptions2"
                        :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="失效时间：" prop="startInvalidTime">
            <el-date-picker
                        v-model="formInline.startInvalidTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始时间"
                        :picker-options="pickerOptions3"
                        :editable="false">
                </el-date-picker>
                -
                <el-date-picker
                        v-model="formInline.endInvalidTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束时间"
                        :picker-options="pickerOptions4"
                        :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="链接状态：">
                <el-select v-model="formInline.status" placeholder="全部" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="生效" value="0"></el-option>
                    <el-option label="失效" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="payment">查询</el-button>
            </el-form-item>
        </el-form>
         <!-- 下载列表 -->
        <div class="downloadList fr" @click="queryDownload">
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
                prop="payChainNo"
                label="支付链ID"
                width="200"
                align="center">
                <template slot-scope="scope">
                    <router-link :to="{path:'/home/paymentChain/paymentChainDetail',query: {name: scope.row.payChainNo}}">{{scope.row.payChainNo}}</router-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="productnamedesc"
                label="商品名称"
                align="center">
                <template slot-scope="scope">
                    <el-select v-model="value=scope.row.productnamedesc.split('|')[0]" placeholder="请选择" @focus="queryAttributeNames(scope.row)">
                        <el-option
                            v-for="(item,index) in productDesc.split('|')"
                            :key="index"
                            :label="item"
                            :value="item"
                            >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                prop="feecurrencycode"
                label="交易币种"
                align="center">
            </el-table-column>
            <el-table-column
                prop="totalamount"
                label="交易金额"
                align="center">
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="创建时间"
                align="center">
            </el-table-column>
            <el-table-column
                prop="status"
                label="链接状态"
                :formatter="formatter">
                <template slot-scope="scope">
                    <div v-show="scope.row.status==0">
                        <div class="yuanGreen"></div><span>生效</span>
                    </div>
                    <div v-show="scope.row.status==1">
                        <div class="yuanGray"></div><span>失效</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                label="操作"
                align="center">
                <template slot-scope="scope">
                    <div style="display:inline;padding:0 5px;" v-show="scope.row.status==0">
                        <el-button style="padding:0;" class="copy" :data-clipboard-text="scope.row.payLinkName" @click="copy" type="text" size="small">复制</el-button>
                    </div>
                    <div style="display:inline;padding:0 5px"  v-show="scope.row.status==0">
                        <el-button style="padding:0;" type="text" size="small" @click="queryInvalid(scope.row.payChainNo)">失效</el-button>
                    </div>
                    <div style="display:inline;padding:0 5px">
                        <router-link :to="{path:'/home/paymentChain',query: {name: scope.row.payChainNo,currency:scope.row.feecurrencycode}}">
                             <el-button style="padding:0;" type="text" size="small">克隆</el-button>
                        </router-link>  
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
        :current-page.sync="currentPage4"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>        
</template>
<script>
import "../../assets/css/hmdCommon.css"
import Clipboard from 'clipboard';
// import "../../util/clipboard.min.js"
import classPost from '../../servies//classPost'
import { Message, Header } from 'element-ui' //element Message 组件引入
export default {
  data () {
    // 日期选择器不能选择大于90天
    var selecttime = (rule, value, callback) => {
        if(value!=null){
            console.log(value)
            let time = new Date(this.formInline.endCreadTime)-new Date(this.formInline.startCreadTime)
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
    var selecttimes = (rule, value, callback) => {
        if(value!=null){
            console.log(value)
            let time = new Date(this.formInline.endInvalidTime)-new Date(this.formInline.startInvalidTime)
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
        if(that.formInline.endCreadTime==null){
            return time.getTime() > Date.now();
        }else{
            return time.getTime() > new Date(that.formInline.endCreadTime);
        }
    }
    let timeCheck2=function (time) {
        return (time.getTime() > Date.now())||(time.getTime()<new Date(that.formInline.startCreadTime));
    }
    let timeCheck3=function (time) {
        if(that.formInline.endInvalidTime==null){
            return time.getTime() > Date.now();
        }else{
            return time.getTime() > new Date(that.formInline.endInvalidTime);
        }
    }
    let timeCheck4=function (time) {
        return (time.getTime() -7*24*60*60*1000 > Date.now())||(time.getTime()<new Date(that.formInline.startInvalidTime));
    }
    var checkPaymentId = (rule, value, callback) => {
        if(value!=undefined&&value!=''){
            if(!(/^\d+$/.test(value))){
                this.formInline.paymentId=value.replace(/\D/g,'');
                callback()
            }else{
                callback()
            }
        }else{
             callback()
        }
    }
    return {
        loading:true,
        productDesc:"",
        result:'',
        total:0,
        payChainNo:"",
        currentPage4: 1,
        pageSize: 10,
        pageNumber: 1,
        formInline: {
            paymentId: '',
            commodityName: '',
            startCreadTime:'',
            endCreadTime:'',
            startInvalidTime:'',
            endInvalidTime:'',
            status: '',
        },
        rules: {
            paymentId:[
                 {validator: checkPaymentId, trigger: 'change'}
            ],
            startCreadTime: [
                {validator: selecttime, trigger: 'change'}
            ],
            startInvalidTime: [
                {validator: selecttimes, trigger: 'change'}
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
        pickerOptions3: {
            disabledDate(time) {
                return timeCheck3(time);
            }
        },
        pickerOptions4: {
            disabledDate(time) {
                return timeCheck4(time);
            }
        },
        value: '',
        value6: '',
        options: [],
        tableData: [
        ]
    }
  },

  created: function () {
      
      this.formInline.paymentId=this.$route.params.id

      //	默认时长
          let time=new Date();
          let time1=new Date(new Date().getTime()+7 * 24 * 60 * 60 * 1000);
	    let time2=new Date(new Date().getTime()-(30 * 24 * 60 * 60 * 1000));
        let now=`${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`;
        let go=`${time2.getFullYear()}-${time2.getMonth()+1}-${time2.getDate()}`;
        let end=`${time1.getFullYear()}-${time1.getMonth()+1}-${time1.getDate()}`;
        this.formInline.startCreadTime=go 
        this.formInline.endCreadTime=now 
        this.formInline.startInvalidTime=go 
        this.formInline.endInvalidTime=end

        this.paymentChainQuery();
  },

  methods: {
      //商品名称
    queryAttributeNames(row){
        var obj={
            payChainNo:row.payChainNo
        }
        console.log(obj)
        classPost.queryAttributeNames(obj)
            .then((res)=>{
                console.log(res)         
                this.productDesc=res.data
            }).catch((err)=>{
                console.log(err)
        })
    },
    payment(){
        this.loading=true;
        this.pageNumber=1;
        this.currentPage4=1;
        this.paymentChainQuery()
    },
    //支付链查询  初始化全部的
    paymentChainQuery(){
        var obj={
            payChainNo:this.formInline.paymentId,
            productnamedesc:this.formInline.commodityName,
            startCreateTime:this.formInline.startCreadTime,
            endCreateTime:this.formInline.endCreadTime,
            startInvalidTime:this.formInline.startInvalidTime,
            endInvalidTime:this.formInline.endInvalidTime,
            status:this.formInline.status,
        }
        obj.pageNumber=this.pageNumber;
        obj.pageSize=this.pageSize;
        console.log(obj)
        classPost.paymentChainQuery(obj)
            .then((res)=>{
                console.log(res)
                this.loading=false;
                this.tableData=res.data.dataList
                this.total=parseInt(res.data.total)
            }).catch((err)=>{
                this.loading=false;
                console.log(err)
        })
    },
    //支付链失效数剧请求
    paymentChainInvalid(){
        var obj={
            payChainNo:this.payChainNo
        }
        classPost.paymentChainInvalid(obj)
            .then((res)=>{
                console.log(res)
            }).catch((err)=>{
                console.log(err)
        })
    },
    //支付链克隆
    clone(payChainNo){
        this.payChainNo=payChainNo
        var obj={
            payChainNo:this.payChainNo
        }
        classPost.paymentChainClone(obj)
            .then((res)=>{
            }).catch((err)=>{
            console.log(err)
        })
    },
    //支付链下载
    queryDownload(){
         var obj={
            payChainNo:this.formInline.paymentId,
            productnamedesc:this.formInline.commodityName,
            startCreateTime:this.formInline.startCreadTime,
            endCreateTime:this.formInline.endCreadTime,
            startInvalidTime:this.formInline.startInvalidTime,
            endInvalidTime:this.formInline.endInvalidTime,
            status:this.formInline.status,
        }
        classPost.paymentChainDownLoad(obj)
            .then((res)=>{
              　const content = res
　　            const blob = new Blob([content],{type:"application/vnd.ms-excel"})
　　            const fileName = '支付链.xls'
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
    formatter(row, column) {
      return row.state;
    },
    handleClick(row) {
       console.log(row)
    },
    copy(){
        var clipboard = new Clipboard('.copy')
        clipboard.on('success', e => {
          this.$message('复制成功');
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          this.$message('复制失败');
          // 释放内存
          clipboard.destroy()
        })

    },
    cellClick(row, column, cell, event){

    },
    //失效按钮
    queryInvalid(payChainNo) {
        this.$confirm('确定将改支付链失效吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
            this.payChainNo=payChainNo
            var obj={
                payChainNo:this.payChainNo
            }
            classPost.paymentChainInvalid(obj)
                .then((res)=>{
                    this.loading=true
                    this.paymentChainQuery();
                }).catch((err)=>{
                    console.log(err)
            })

        //   this.$message({
        //     type: 'success',
        //     message: '支付链失效!'
        //   });
        }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '支付链不失效'
        //   });
        });
      },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
        this.loading=true;
        this.pageNumber=val
        this.paymentChainQuery();
    },
    allWithdraw(){
        // this.withdrawForm.amount=this.withdrawForm.message
        alert(1)
    },
  }
}

</script>
<style>
a{
    text-decoration: none;
}
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
.currencyQuery .yuanGreen{
display:inline-block;width: 8px;height: 8px;border-radius: 50%;
margin-right: 5px;
background: #52C41A;
}
.currencyQuery .yuanGray{
display:inline-block;width: 8px;height: 8px;border-radius: 50%;
margin-right: 5px;
background:rgba(0, 0, 0, 0.25);
}
.currencyQuery .el-pagination.is-background .el-pager li,.currencyQuery .el-pagination.is-background .btn-prev,.currencyQuery .el-pagination.is-background .btn-next{
background: #fff;
border:1px solid #dadada;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
border-radius: 4px;
}
.currencyQuery .el-date-editor .el-range-separator{
    padding:0;
} 

.currencyQuery .el-table .cell{
    text-align: center;
    padding:0;
}
.currencyQuery tbody tr td:nth-child(1) a{
    color:#1890FF;
}
.currencyQuery select{
    width:90px;
    height:40px;
    background: transparent;
    border:none;
    outline: none;
}
.currencyQuery .el-table .el-select{
    width:100px;
}
.currencyQuery .el-table .el-input--suffix .el-input__inner{
    border:none;
}
.currencyQuery .el-table--enable-row-hover .el-table__body tr:hover>td{
     background: #fff;
}


.currencyQuery input::-webkit-input-placeholder{
    color:#606266;
}
.currencyQuery input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#606266;
}
.currencyQuery input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#606266;
}
.currencyQuery inputt:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
    color:#606266;
}
.currencyQuery .el-select .el-input .el-select__caret{
     color:#606266;
}

.currencyQuery .downloadList{
    margin-bottom:10px;
}
</style>
