<template>
    <div class="repudiate">
            <div class="content">
                <el-form label-width="100px"  :model="ruleForm" status-icon ref="ruleForm" :rules="timerule" :inline="true" class="demo-ruleForm">
                    <el-form-item label="商户订单号：" prop="orderNumber">
                        <el-input @change="setOne" clearable placeholder="请输入商户订单号" v-model="ruleForm.orderNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="交易流水号：" prop="accOrder">
                        <el-input @change="setOne" clearable placeholder="请输入交易流水号" v-model="ruleForm.accOrder"></el-input>
                    </el-form-item>
                    <el-form-item label="拒付类型：" prop="tradeType">
                        <el-select @change="setOne" v-model="ruleForm.tradeType">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="调单" value="1"></el-option>
                            <el-option label="拒付" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="拒付状态：" prop="orderStatus">
                        <el-select @change="setOne" v-model="ruleForm.orderStatus">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="处理中" value="1,2,3,4"></el-option>
                            <el-option label="未处理" value="0"></el-option>
                            <el-option label="不申诉" value="7"></el-option>
                            <el-option label="申诉成功" value="6"></el-option>
                            <el-option label="申诉失败" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交易时间：" prop="createTime">
                         <el-date-picker
                            v-model="ruleForm.createTime[0]"
                            @change="setOne"
                            @blur="check_create_time"
                            value-format="timestamp"
                            type="date"
                            size="small"
                            :picker-options="pickerOptions1"
                            placeholder="开始日期">
                        </el-date-picker>
                        -
                        <el-date-picker
                            v-model="ruleForm.createTime[1]"
                            @change="setOne"
                            @blur="check_create_time"
                            value-format="timestamp"
                            type="date"
                            :picker-options="pickerOptions2"
                            size="small"
                            placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                     <el-form-item label="拒付时间：" prop="protestTime">
                         <el-date-picker
                            v-model="ruleForm.protestTime[0]"
                            @change="setOne"
                            @blur="check_protest_time"
                            value-format="timestamp"
                            type="date"
                            size="small"
                            :picker-options="pickerOptions3"
                            placeholder="开始日期">
                        </el-date-picker>
                        -
                        <el-date-picker
                            v-model="ruleForm.protestTime[1]"
                            @change="setOne"
                            @blur="check_protest_time"
                            value-format="timestamp"
                            type="date"
                            :picker-options="pickerOptions4"
                            size="small"
                            placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="loading" size="small" type="primary" @click="onSubmit({})">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="down">
                <el-button size="small" type="primary" class="download" @click="nodownload">批量不申诉</el-button>
                <el-button size="small" type="primary" class="download" @click="appeal">下载申诉模板</el-button>
                <el-button size="small" class="download" @click="download"> <img src="../../assets/icon/down.svg"/> 下载报表</el-button>
            </div>
            <el-table
            v-loading="loading"
            @sort-change="sortTime"
            element-loading-background="rgba(255,255,255,1)"
            :data="data">
             <div slot="empty">
                    <div class="tablebox">
                        <img src="../../assets/icon/frown-o.svg" alt="" />
                    </div>
                    <p :style="{'marginTop': '15px'}">{{hint}}</p>
                </div>
             <el-table-column
                v-for="(item,index) of protest"
                :key="index"
                v-if="item.isSelfDefined==='ceck'"
                width="55">
                    <template slot-scope="scope">
                        <el-checkbox @change="addList" v-if="scope.row.status==='未处理'" v-model="scope.row.value"></el-checkbox>
                    </template>
            </el-table-column>
              <el-table-column
            :key="index"
            :width="item.width"
            align="center"
            header-align="center"
            v-else-if="item.prop=='chargeBackAmount'"
            :label="item.label"
            :prop="item.prop">
                <template slot-scope="scope">
                    <span>{{scope.row.bouncedAmount}}     {{scope.row.cpCurrencyCode}}</span>
                </template>
            </el-table-column>
            <el-table-column
            :key="index"
            :width="item.width"
            align="center"
            header-align="center"
            sortable="custom"
            :label="item.label"
            v-else-if="item.prop=='createDate'"
            :prop="item.prop">
            </el-table-column>
            <el-table-column
            :key="index"
            :width="item.width"
            align="center"
            header-align="center"
            :label="item.label"
            v-else-if="item.prop=='tradeAmount'"
            :prop="item.prop">
                <template slot-scope="scope">
                    <span>{{scope.row.tradeAmount}}     {{scope.row.tranCurrencyCode}}</span>
                </template>
            </el-table-column>
             <el-table-column
            :key="index"
            :width="item.width"
            align="center"
            header-align="center"
            :label="item.label"
            v-else-if="item.prop=='cpType'"
            :prop="item.prop">
                <template slot-scope="scope">
                    <span>{{scope.row.cpType!='0'?'调单':'拒付'}}</span>
                </template>
            </el-table-column>
            <el-table-column
            :key="index"
            :width="item.width"
            align="center"
            header-align="center"
            v-else-if="item.isSelfDefined==='txt'"
            :prop="item.prop"
            :label="item.label">
            </el-table-column>
            <el-table-column
                :width="item.width"
                v-else-if="item.isSelfDefined==='goto'"
                :key="index"
                align="center"
                header-align="center"
                :label="item.label">
                  <template slot-scope="scope">
                      <span @click="goDetail(scope)" class="txt hand">{{scope.row.orderNo}}</span>
                  </template>
            </el-table-column>
            <el-table-column
                v-else-if="item.isSelfDefined==='many'"
                :key="index"
                :width="item.width"
                align="center"
                header-align="center"
                :label="item.label">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status==='未处理'" @click="handle('rulefile',scope.row)" class="txt hand">处理</span>  
                  </template>
            </el-table-column>
        </el-table>
         <el-pagination
            @current-change="handleCurrentChange"
            background
            :current-page.sync="page"
            :page-size="pagesize"
            layout="total, prev, pager, next, jumper"
            :total="pageall">
        </el-pagination>
        <!-- 处理文件 -->
        <el-dialog @close="beforeClose('rulefile')" title="上传申诉文件" :visible.sync="batchRefund">
        <div class="betchBox">   
            <el-form  ref="rulefile" label-width="80px" :model="rulefile" status-icon :rules="filerule">
                <el-form-item
                    label="上传文件"
                    prop="upfiles">
                    <el-input size="small" v-model="rulefile.upfiles" disabled></el-input>
                </el-form-item>
            </el-form>
            <div class="btn">选择文件 <input accept=".doc,.docx" type="file" @change="checkimg" id="files" name="file1" class="upload" /></div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="batchres('rulefile')">确定</el-button>
            <el-button size="small" @click="batchRefund=false">取消</el-button>
        </div>
    </el-dialog>
    </div>
</template>
<script>
import { protest } from '../../util/tabledata';
import { moneyToNumValue, fmoney, formatDateTime, downloadfile, easyCopy, currencynum } from '../../util/commonality';
import {mapState} from 'vuex';
import upload from '../modules/uploader';
import classPost from '../../servies/classPost';
export default {
    components:{
        upload
    },
    data () {
        var selecttime = (rule, value, callback) => {
            let time = value[1]-value[0]
            let year = 90 * 24 * 60 * 60 * 1000
            if(value[0]&&value[1]){
                if(time>year){
                    callback('最大日期选择时间为90天')
                }else{
                    callback()
                }
            }else if(value[0]||value[1]){
                callback('请选择完整的时间')
            }else{
                callback()
            }
        }
        let that=this;
        let timeCheck1=function (time) {
            if(that.ruleForm.createTime[1]){
                return (time.getTime() > new Date(that.ruleForm.createTime[1]))
            }else{
                return (time.getTime() > Date.now())
            }
            
        }
        let timeCheck2=function (time) {
            return (time.getTime() > Date.now())||(time.getTime()<new Date(that.ruleForm.createTime[0]))
        }
        let timeCheck3=function (time) {
            if(that.ruleForm.protestTime[1]){
                return (time.getTime() > new Date(that.ruleForm.protestTime[1]))
            }else{
                return (time.getTime() > Date.now()) 
            }
        }
        let timeCheck4=function (time) {
            return (time.getTime() > Date.now())||(time.getTime()<new Date(that.ruleForm.protestTime[0]))
        }
        return {
            pageall:0,
            upfile:false,
            rulefile:{
                upfiles:''
            },
            filerule:{
                upfiles:[
                    {required:true,message:'请选择上传的文件',trigger:'change'}
                ]
            },
            selectedData:[],
            batchRefund:false,
            filename:'',
            hint:'您还没有设置查询条件',
            protestInfo:'',
            loading:false,
            protest,// 表格规则
            page:1,// 当前分页
            pagesize:10,
            cptype:'',
            ordeers:'desc',
            ruleForm:{// 表单的数据
                orderNumber:'',
                tradeType:'',
                accOrder:'',
                orderStatus:'',
                createTime:['',''],
                protestTime:['','']
            },
            timerule:{
                tradeType:[
                    {message:'请选择交易类型',trigger: 'blur'}
                ],
                orderStatus:[
                    {message:'请选择订单状态',trigger: 'blur'}
                ],
                accOrder:[
                    { trigger: 'blur'}
                ],
               orderNumber:[
                    { trigger: 'blur'}
               ],
                createTime:[
                    {validator: selecttime, trigger: 'blur'}
                ],
                protestTime:[
                    {validator: selecttime, trigger: 'blur'}
                ]
            },
            pickerOptions1: { // 时间框快捷按键
                 disabledDate(time) {
                    return timeCheck1(time)
                }
            },
            pickerOptions2: { // 时间框快捷按键
                 disabledDate(time) {
                    return timeCheck2(time)
                }
            },
            pickerOptions3: { // 时间框快捷按键
                 disabledDate(time) {
                    return timeCheck3(time)
                }
            },
            pickerOptions4: { // 时间框快捷按键
                 disabledDate(time) {
                    return timeCheck4(time)
                }
            },
            data:[ ]// 表格数据
        }
    },
    methods:{
        check_protest_time(){
            this.$refs['ruleForm'].validateField("protestTime");
        },
        check_create_time(){
            this.$refs['ruleForm'].validateField("createTime");
        },
        setOne(){
            this.page=1
        },
        sortTime(data){
            if(data.order==="descending"){
                this.loading=true   
                this.ordeers='desc'
                this.onSubmit({})
            }else if(data.order==="ascending"){
                this.loading=true   
                this.ordeers='asc'
                this.onSubmit({})
            }else{
                return false
            }
            
         
        },
        goDetail(scope){
            let id = scope.row.acsOrderId
            if(id){
                this.$router.push(`/home/tradeManage/orderDetails/${id}`)
            }
            
        },
        addList(){
            let arr = this.data.filter(item => item.value)
            let ary = []
            arr.forEach(item=>{
                ary.push(item.orderId)
            })
            this.selectedData=ary
        },
        checkimg(){
            this.$store.dispatch('removebase')
            let file =document.getElementById('files').files[0]
            this.rulefile.upfiles = file.name
            let obj = {
                orderId: this.protestInfo.orderId,
                uploadType: 'chargeback',
                cpType:this.protestInfo.cpType,
                refNo: this.protestInfo.refNo?this.protestInfo.refNo:null,
                batchNo: this.protestInfo.batchNo?this.protestInfo.batchNo:null,
                file: file
            }
            this.$store.dispatch('addbase', obj)
        },
        nodownload(){
            this.addList()
            if(!this.selectedData.length){
                this.$alert('请选择需要处理的记录',{
                    confirmButtonText: '确定',
                    type: 'info'
                })
            }else{
                 this.loading=true
                classPost.batch_noappeal({orderIds:this.selectedData})
                    .then((res)=>{
                        this.onSubmit({})
                    })
                    .catch((err)=>{
                        this.$alert(`处理失败，失败原因：${err.data.message}`,'批量处理失败',{
                            confirmButtonText: '确定',
                            type: 'error'
                        }).then(()=>{
                            this.onSubmit({})
                        })  
                    })
            }
            
        },
        batchres(form){
             this.$refs[form].validate((valid) => {
                if (valid) {
                    this.batchRefund = false
                    classPost.batch_appeal(this.upimgbase)
                        .then((res)=>{
                            this.$alert(`您已成功上传${this.protestInfo.orderNo}订单的申诉文件`, '上传成功', {
                                confirmButtonText: '确定',
                                type: 'success'
                            }).then(()=>{
                                this.onSubmit({})
                            })
                        })
                        .catch((err)=>{
                             this.$alert(`${this.protestInfo.orderNo}订单申诉文件上传失败，失败原因`+err.data.message, '上传失败', {
                                confirmButtonText: '确定',
                                type: 'error'
                            }).then(()=>{
                                this.onSubmit({})
                            })
                        })
                }
             })
        },
        appeal(){
            var a = document.createElement('a')
            a.href="../../../static/拒付订单申诉模版.docx"
            a.download="拒付订单申诉模板"
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        },
        changestatus(num){
            switch(num){
                case 0:
                    return '未处理';
                case 1:
                case 2:
                case 3:
                case 4:
                    return '处理中';
                case 5:
                    return '申诉失败';
                case 6:
                    return '申诉成功';
                case 7:
                    return '不申诉';
                case 8:
                    return '全部';
            }
        },
        exchangecase(num){
            switch(num){
                case '0':
                    return '历史数据拒付,请联系客服';
                case '1':
                    return '需要交易凭证';
                case '2':
                    return '未提供服务或未收到商品';
                case '3':
                    return '未授权';
                case '4':
                    return '重复处理/通过其他方式支付';
                case '5':
                    return '欺诈';
                case '6':
                    return '货物破损/有瑕疵货物、服务与描述不符';
                case '7':
                    return '不承认';
                case '8':
                    return '要求个人记录';
                case '9':
                    return '商品已退回未退款';
                case '10':
                    return '未收到退款';
                case '11':
                    return '金额不符';
                case '12':
                    return '未提供单据';
                case '13':
                    return '重复扣款';
                case '14':
                    return '已取消的循环交易';
                case '15':
                    return '假冒商品';
                case '16':
                    return '虚假陈述';
                case '17':
                    return '已取消的商品/服务';
            }
        },
        onSubmit(opt){// 提交查询
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.loading=true
                    let obj = Object.assign(this.initdata,opt)
                    classPost.chargeback(obj)
                        .then((res)=>{
                            let obj = {
                                value:false
                            }
                            if(res.data.dataList.length){
                                this.data=res.data.dataList.map((item)=>{
                                    item.tradeDate = item.tradeDate?formatDateTime(item.tradeDate):''
                                    item.tradeAmount = fmoney(item.tradeAmount?item.tradeAmount:0,currencynum(item.tranCurrencyCode))
                                    item.bouncedAmount = fmoney(item.bouncedAmount?item.bouncedAmount:0,currencynum(item.cpCurrencyCode))
                                    item.createDate = item.createDate?formatDateTime(item.createDate):''
                                    item.latestAnswerDate = item.latestAnswerDate?formatDateTime(item.latestAnswerDate):''
                                    item.status = this.changestatus(item.status)
                                    item.visableCode = this.exchangecase(item.visableCode)
                                    item = Object.assign(obj,item)
                                    return {...item}
                                })
                                this.pageall= Number(res.data.total)
                            }else{
                                this.data = []
                                this.pageall = 0
                                this.hint = "抱歉，暂时没有符合您的查找条件的单子，可以换个条件试试"
                            }
                            this.loading=false
                        })
                        .catch((err)=>{
                            this.loading=false
                        })
                }else{
                    return false
                }
            })
        },
      
        settime(){
            let end = new Date();
            let start = new Date();
            let year = start.getFullYear()
            let month = start.getMonth()
            let day = start.getDate()
            end = new Date(year,month,day,23,59,59);
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            end = end.getTime()
            start = start.getTime()
            this.ruleForm.createTime=[start,end]
            this.ruleForm.protestTime=[start,end]
        },
        handle(form,scope){// 点击处理
            this.protestInfo = scope
            this.batchRefund = true
        },
        beforeClose(form){
            this.$refs[form].resetFields()
            document.getElementById('files').value=''
        },
        download(){// 下载报表
            let obj = easyCopy(this.initdata)
            delete obj.pageBean
            classPost.chargeback_export(obj)
                .then((res)=>{
                    downloadfile(res,'拒付处理')
                })
                .catch((err)=>{
                    console.log(err)
                })
        },
       
        // 改变分页器当前页事件
        handleCurrentChange(val) {
           this.onSubmit({})
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
    computed:{
        ...mapState({
            'upimgbase': state => state.upload.upimgbase
        }),
       initdata(){
            return {
                orderNo:this.ruleForm.orderNumber,
                cpType:this.ruleForm.tradeType,
                acsOrderId:this.ruleForm.accOrder,
                status:this.ruleForm.orderStatus,
                beginTime:this.ruleForm.createTime[0]?this.setim(formatDateTime(this.ruleForm.createTime[0]),1):null,
                endTime:this.ruleForm.createTime[1]?this.setim(formatDateTime(this.ruleForm.createTime[1]),2):null,
                chargeBackBeginTime:this.ruleForm.protestTime[0]?this.setim(formatDateTime(this.ruleForm.protestTime[0]),1):null,
                chargeBackEndTime:this.ruleForm.protestTime[1]?this.setim(formatDateTime(this.ruleForm.protestTime[1]),2):null,
                "pageBean":{
                    "pageNumber":this.page,
                    "pageSize":this.pagesize,
                    "orderBy":`c.CREATE_DATE ${this.ordeers}`
                }
            }
       }
    },
    mounted(){
        this.settime()
        if(this.$route.query.type){
            let type = this.$route.query.type
            if(type=='待处理调单'){
                this.ruleForm.tradeType='1'
                this.ruleForm.createTime=['',''],
                this.ruleForm.protestTime=['','']
            }else if(type=='待处理拒付'){
                this.ruleForm.tradeType='0'
                this.ruleForm.createTime=['',''],
                this.ruleForm.protestTime=['','']
            }
            this.onSubmit({})
        }
    }
}
</script>
<style>
.repudiate{
    margin-top: 20px;
    padding: 0 20px 20px 20px;
    background: rgba(255, 255, 255, 1);
}
.repudiate .download{
    width: 106px;
    height: 32px;
    font-size: 16px;
    padding: 0;
}

.repudiate .content{
   padding-top: 20px;
}
.repudiate .down{
    margin:10px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.repudiate .txt{
    color: rgb(22, 155, 213);
}
.repudiate .space span:nth-child(2){
    margin-left: 10px;
}
.repudiate .up{
    display: flex;
    align-items: center;
}
.repudiate .up p{
    margin-right: 30px;
    display: flex;
    align-items: center;
}

.repudiate .up p span{
    width: 100px;
    line-height: 32px;
    display: block;
}
.repudiate .btn{
        width: 70px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background-color: RGBA(24, 144, 255, 1);
        color: white;
        border-radius: 4px;
        position: relative;
        margin-top: -10px;
        margin-left: 20px;
    }
.repudiate .btn .upload{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
.repudiate .betchBox{
    display: flex;
    align-items: center;
   justify-content: center;
}
</style>
