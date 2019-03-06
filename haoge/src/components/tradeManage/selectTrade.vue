<template>
    <div id="selTrade" class="trademanage">
        <div class="asdf" :style="{'background':showfilter?'RGBA(255, 255, 255, 0)':'RGBA(248, 251, 255, 1)'}">
            <div class="filter" :style="{'width':showfilter?'100%':'auto'}">
                <div class="downinput">
                    <span class="labels">过滤器：</span>
                    <el-select @change="seletList" v-model="value" placeholder="请选择">
                        <el-option
                        v-for="(item, index) in options"
                        :key="index"
                        :label="item.filterName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <span class="hand setCriteria" @click="gofilter">设置过滤器条件</span>
            </div>
            <div v-loading="loading" element-loading-background="rgba(255,255,255,1)">
                <div v-if="condition">
                    <div class="filtercond">
                        <el-form :inline="true" label-width="130px" >
                            <el-form-item
                                v-show="showfilter"
                                v-for="(item, index) of inputList"
                                :key="index"
                                :label="item.itemName+'：'"
                                v-if="item.filterStyle==='1'">
                                <el-input class="ipt" :key="item.itemName" size="small"  @change="setOne" clearable :placeholder="`请输入${item.itemName}`" v-model="item.value"></el-input>
                            </el-form-item>
                            <el-form-item
                                v-show="showfilter"
                                :key="index"
                                v-else-if="item.filterStyle==='2'"
                                :label="item.itemName+'：'">
                                <el-select class="sets" @change="setOne" collapse-tags :key="item.itemName" size="small" v-model="item.value" multiple placeholder="全部">
                                    <el-option
                                        v-for="(i, ind) in item.defaultValue.initValue"
                                        v-if="typeof i==='string'&&i.indexOf('&')!==-1"
                                        :key="ind"
                                        :label="i.split('&')[0]"
                                        :value="i.split('&')[1]">
                                    </el-option>
                                    <el-option
                                        v-else-if="typeof i==='string'"
                                        :key="ind"
                                        :label="i"
                                        :value="i">
                                    </el-option>
                                    <el-option
                                        v-else
                                        :key="ind"
                                        :label="`${i[Object.keys(i)[0]][1]}(${i[Object.keys(i)[0]][0]})`"
                                        :value="i[Object.keys(i)[0]][0]">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                v-show="showfilter"
                                :key="index"
                                v-else
                                :label="item.itemName+'：'">
                                <el-date-picker
                                    class="tim"
                                    :key="item.itemName+1"
                                    v-model="item.value[0]"
                                    @change="setOne"
                                    value-format="timestamp"
                                    type="date"
                                    size="small"
                                    :picker-options="pickerOptions1"
                                    placeholder="开始日期">
                                </el-date-picker>
                                -
                                <el-date-picker
                                    class="tim"
                                    :key="item.itemName"
                                    v-model="item.value[1]"
                                    @change="setOne"
                                    value-format="timestamp"
                                    type="date"
                                    :picker-options="pickerOptions2"
                                    size="small"
                                    placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <div class="sel">
                                    <el-button :disabled="loads" @click="submit" type="primary">查询</el-button>
                                    <span @click="changeshow" class="hico hand">{{showfilter?'收起':'展开'}}<i :class="showfilter?'el-icon-arrow-up':'el-icon-arrow-down'" ></i></span>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <el-button class="download" @click="download"> <img src="../../assets/icon/down.svg"/> 下载报表</el-button>
            <el-table v-loading="loads" element-loading-background="rgba(255,255,255,1)"
                max-height="500"
                @sort-change="changeSort"
                :data="data">
                    <div slot="empty">
                        <div class="tablebox">
                            <img src="../../assets/icon/frown-o.svg" alt="" />
                        </div>
                        <p :style="{'marginTop': '15px'}">{{hint}}</p>
                    </div>
                    <el-table-column
                        width="200"
                        align="center"
                        header-align="center"
                        v-for="item of tableList"
                        v-if="item.prop!=='merchantOrderId'&&item.prop!=='gmtCreateTime'"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label">
                    </el-table-column>
                        <el-table-column
                        width="200"
                        align="center"
                        header-align="center"
                        sortable="custom"
                        v-else-if="item.prop==='gmtCreateTime'"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label">
                    </el-table-column>
                    <el-table-column
                        v-else
                        :key="item.prop"
                        width="250"
                        align="center"
                        header-align="center"
                        :prop="item.prop"
                        :label="item.label">
                        <template slot-scope="scope">
                            <span @click="goDetail(scope)" class="hand txt">{{scope.row.merchantOrderId}}</span>
                        </template>
                    </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage4"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="pagenum"
                layout="total, prev, pager, next, jumper"
                :total="allPageSize">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import classPost from '../../servies/classPost';
import { formatDateTime, payType, fmoney, downloadfile, statusZh, typeZh, easyCopy, currencynum } from '../../util/commonality'
export default {
    name:'selectTrade',
    data () {
        var selecttime = (rule, value, callback) => {
            if(value!==null){
                let time = value[1]-value[0]
                let year = 90 * 24 * 60 * 60 * 1000
                if(time>year){
                    callback('最大日期选择时间为90天')
                }else{
                    callback()
                }
            }
        }
        let that=this;
        let timeCheck1=function (time) {
            let crt = that.crt
            let prt = that.prt
            if(crt){
                if(crt.value[1]){
                    return (time.getTime() > new Date(crt.value[1]))
                }else{
                    return (time.getTime() > Date.now())
                }
            }else if(prt){
                 let crt = that.crt
                let prt = that.prt
                if(prt.value[1]){
                    return (time.getTime() > new Date(prt.value[1]))
                }else{
                    return (time.getTime() > Date.now())
                }
            }
        }
        let timeCheck2=function (time) {
            let crt = that.crt
            let prt = that.prt
            if(crt){
                return (time.getTime() > Date.now())||(time.getTime()<new Date(crt.value[0]))
            }else if(prt){
                return (time.getTime() > Date.now())||(time.getTime()<new Date(prt.value[0]))
            }
        }
        return {
            value:'',
            crt:[],
            prt:[],
            hint:'您还没有设置查询条件',
            condition:true,
            loads:false,
            inputList:[],
            tableList:[],
            loading:true,
            allPageSize:0,
            pagenum:10,
            orderrs:'desc',
            currentPage4: 1,
            options: [],
            showfilter:true,
            pickerOptions1: {
                disabledDate(time) {     
                    return timeCheck1(time)
                }
            },
            pickerOptions2: {
                disabledDate(time) {
                    return timeCheck2(time)
                }
            },
            data:[]
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm=>{
            if(from.meta.title==='过滤器列表'||from.meta.title==='过滤器设置'){
                vm.get_data({})
            }
        })
         
    },
    methods:{
        goDetail(scope){
            let id = scope.row.orderId
            this.$router.push(`/home/tradeManage/orderDetails/${id}`)
        },
        setOne(){
            this.currentPage4=1
        },
        changeSort(data){
            if(data.order==="descending"){
                this.loads=true
                this.orderrs='desc'
                this.get_table_data({})
            }else if(data.order==="ascending"){
                this.loads=true
                this.orderrs='asc'
                this.get_table_data({})
            }else{
                return false
            }
        },
        changeshow(){
            this.showfilter = !this.showfilter
        },
        seletList(){
            this.loading=true
            const arr = this.options.filter(item => item.id === this.value)[0]
            this.setdata(arr)
                .then(()=>{
                    this.get_table_data({})
                })
        },
        handleCurrentChange() {
            this.loads=true
            this.get_table_data({})
        },
        gofilter(){
            this.$router.push('/home/tradeManage/filterList')
        },
        setdata(arr){
            let _this = this
            return new Promise(function(res,rej){
                var end = new Date();
                var start = new Date();
                let year = start.getFullYear()
                let month = start.getMonth()
                let day = start.getDate()
                end = new Date(year,month,day,23,59,59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                start = start.getTime();
                end = end.getTime();
                _this.value = arr.id;
                _this.condition = arr.showToolbar!=='0'?true:false;
                _this.pagenum = arr.pageSize;
                let input =[]; 
                let table =[];
                arr.filterConfigItems.map((item)=>{
                    item.defaultValue = item.defaultValue?typeof item.defaultValue === 'string'?JSON.parse(item.defaultValue):item.defaultValue:item.defaultValue
                    if(item.asCondition!=='0'){
                        input.push(item)
                    }
                    if(item.disabled!=='0'){
                        table.push(item)
                    }
                     return {...item}
                })
                let ary = []
                table.forEach(item=>{
                    let obj = {
                        label:item.itemName,
                        prop:item.itemFieldName
                    }
                    ary.push(obj)
                })
                _this.tableList = ary
                _this.inputList = input.map(item =>{
                    if(item.itemFieldName==="orderType"){
                        item.defaultValue.initValue = item.defaultValue.initValue.map(i=>{
                            i = `${statusZh(i)}&${i}`
                            return i
                        })
                    }
                    if(item.itemFieldName==="outerStatus"){
                        item.defaultValue.initValue = item.defaultValue.initValue.map(i=>{
                            i = `${typeZh(i)}&${i}`
                            return i
                        })
                    }
                    if(item.itemFieldName==='payMode'){
                        item.defaultValue.initValue = item.defaultValue.initValue.map(i=>{
                            i = `${payType(i)}&${i}`
                            return i
                        })
                    }
                    const obj = {
                        value:item.defaultValue?item.defaultValue.value:item.filterStyle==='1'?'':item.filterStyle==='3'?[start,end]:item.filterStyle==='2'?[]:null
                    }
                    item = Object.assign(obj,item)
                    if(item.itemName==='创建时间'){
                        _this.crt = item
                    }
                    if(item.itemName==='完成时间'){
                        _this.prt = item
                    }
                    return {...item}
                })
                if(_this.tableList.length>0&&_this.inputList.length>0&&_this.value!==''){
                   res('ok')
                }
            })
        },
        get_table_data(opt){
            this.loads = true
            let obj = Object.assign(this.postdata,opt)
            classPost.tradeSelect(obj)
                .then((response)=>{
                        if( response.data){
                            this.data = response.data.dataList.map(item=>{
                                item.gmtCreateTime = item.gmtCreateTime?formatDateTime(item.gmtCreateTime):''
                                item.gmtCompleteTime = item.gmtCompleteTime?formatDateTime(item.gmtCompleteTime):''
                                item.orderAmount = fmoney(item.orderAmount?item.orderAmount:0,currencynum(item.orderCurrency))
                                item.orderType = statusZh(item.orderType)
                                item.payMode = payType(item.payMode)
                                item.outerStatus = typeZh(item.outerStatus)
                                return {...item}
                            })
                            this.allPageSize = Number(response.data.total)
                        }else{
                            this.data = []
                            this.allPageSize = 0
                            this.hint = "抱歉，暂时没有符合您的查找条件的单子，可以换个条件试试"
                        }
                        this.loading = false
                        this.loads = false
                })
                .catch((err)=>{
                    this.loading = false
                    console.log(err)
                })
        },
        get_data(obj){
            this.loads = true
            classPost.config_list(obj)
                .then((res)=>{
                    this.options = res.data
                    const arr = res.data.filter(item=>item.defaultSet==='1')[0]
                    this.setdata(arr)
                        .then((data)=>{
                            this.loading = false
                            this.loads = false
                        })
                })
                .catch((err)=>{
                    console.log(err)
                })
        },
        download(){
            let obj = easyCopy(this.postdata)
            delete obj.pageBean
            classPost.export_query(obj)
                .then((res)=>{
                    downloadfile(res,'交易查询')
                })
                .catch((err)=>{
                    console.log(err)
                })
        },
        filterdata(data){
            let val = this.inputList.filter(item => item.itemFieldName===data)
            val = val.length?val[0].value:false
            return val
        },
        submit(){
            this.loads = false
            this.get_table_data({})
        },
        setim(val,num){
            let value = val.split(' ')[0]
            if(num==1){
                value = `${value} 00:00:00`
            }else{
                value = `${value} 23:59:59`
            }
            return value
        }
   },
   mounted() {
        this.get_data({})
   },
   computed:{
     postdata(){
         return{
        "availableAmount": this.filterdata("availableAmount")||'',
        "cardOrg": this.filterdata("cardOrg")||[],
        "carrierId": this.filterdata("carrierId")||"",
        "cashierTypeCode": this.filterdata("cashierTypeCode")||"",
        "clientCode": this.filterdata("clientCode")||"",
        "endCompleteTime": this.filterdata("gmtCompleteTime")[1]?this.setim(formatDateTime(this.filterdata("gmtCompleteTime")[1]),2):null,
        "endTime": this.filterdata("gmtCreateTime")[1]?this.setim(formatDateTime(this.filterdata("gmtCreateTime")[1]),2):null,
        "fileName": this.filterdata("fileName")||"",
        "goodsDesc": this.filterdata("goodsDesc")||"",
        "goodsName": this.filterdata("goodsName")||"",
        "issuerCountry": this.filterdata("issuerCountry")||"",
        "merchantId": this.filterdata("merchantId")||"",
        "merchantOrderId": this.filterdata("merchantOrderId")||"",
        "orderAmount": this.filterdata("orderAmount")||"",
        "orderCurrency": this.filterdata("orderCurrency")||[],
        "orderId": this.filterdata("orderId")||"",
        "orderStatus": this.filterdata("orderStatus")||"",
        "orderType": this.filterdata("orderType")||[],
        "oriMerchantOrderId": this.filterdata("oriMerchantOrderId")||"",
        "outerCode": this.filterdata("outerCode")||"",
        "outerMsg": this.filterdata("outerMsg")||"",
        "outerStatus": this.filterdata("outerStatus")||[],
        "pageBean": {
            "pageNumber":this.currentPage4,
            "pageSize": this.pagenum,
            "orderBy":`o.gmt_Create_Time ${this.orderrs}`
        },
        "payChannel": this.filterdata("payChannel")||[],
        "payMode": this.filterdata("payMode")||[],
        "payType": this.filterdata("payType")||[],
        "registerUserId": this.filterdata("registerUserId")||"",
        "settlementCurrency": this.filterdata("settlementCurrency")||[],
        "startCompleteTime":this.filterdata("gmtCompleteTime")[0]?this.setim(formatDateTime(this.filterdata("gmtCompleteTime")[0]),1):null,
        "startTime": this.filterdata("gmtCreateTime")[0]?this.setim(formatDateTime(this.filterdata("gmtCreateTime")[0]),1):null,
        "terminalType": this.filterdata("terminalType")||"",
        "traceId": this.filterdata("traceId")||"",
        }
     }
   }
}
</script>
<style>

.trademanage{
    width: 100%;
    margin-top: 20px;
    background: RGBA(255, 255, 255, 1);
    padding:0 0 20px 0;
}
.content{
    padding:0 20px;
}

.tablebox img{
   width:36px;
   height:36px;
}
.trademanage .txt{
    color: rgb(22, 155, 213);
}
.asdf{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.filter .labels{
    display: inline-block;
    text-align: right;
    padding-right: 8px;
    color:#606266;
}
.filter{
    padding-left: 60px;
    height:65px;
    background:RGBA(248, 251, 255, 1);
    display: flex;
    align-items: center;
}
.downinput .el-select{
    width: 60%;
}
.filter .setCriteria {
    color:RGBA(24, 144, 255, 1);
    margin-left: 10px;
    margin-right: 20px;
}

.filter .el-button{
    margin-left: 30px;
}
.filtercond{
    width: 100%;
    padding-top: 20px;
    word-wrap: break-word;
    word-break: break-all;
}

.trademanage .sel .hico{
    margin-left: 10px;
    display: inline-block;
    width: 50px;
    color:rgba(18, 150, 219, 1);   
    font-size: 14px;
}
.trademanage .sel .hico i{
    margin-left: 5px;
}
.trademanage .sel{
    padding-right: 15px;
}
.trademanage .download{
    float: right;
    width: 106px;
    height: 32px;
    font-size: 16px;
    padding: 0;
    margin-top: 10px;
    margin-bottom: 10px;;
}
.trademanage .download::after{
    width: 0;
    height: 0;
    content: "";
    clear: both;
}
</style>
