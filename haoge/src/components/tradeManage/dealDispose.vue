<template>
    <div class="dealDispose">
            <div class="content">
                <el-form :model="ruleForm" status-icon ref="ruleForm" :inline="true"  label-width="100px" :rules="timerule">
                    <el-form-item label="商户订单号：" prop="orderNumber">
                        <el-input @change="setOne" clearable placeholder="请输入商户订单号" v-model="ruleForm.orderNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="交易类型：" prop="tradeType">
                        <el-select @change="setOne" v-model="ruleForm.tradeType">
                            <el-option label="全部" value="sale,authorization,capture,create_token_sale,create_token_auth,token_sale,token_auth"></el-option>
                            <el-option label="消费" value="sale,create_token_sale,token_sale"></el-option>
                            <el-option label="预授权" value="authorization,create_token_auth,token_auth"></el-option>
                            <el-option label="预授权完成" value="capture"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单状态：" prop="orderStatus">
                        <el-select @change="setOne" v-model="ruleForm.orderStatus">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="交易开始" value="received"></el-option>
                            <el-option label="支付中" value="pending"></el-option>
                            <el-option label="待审核" value="pending_review"></el-option>
                            <el-option label="交易成功" value="success"></el-option>
                            <el-option label="已撤销" value="canceled"></el-option>
                            <el-option label="交易失败" value="failed"></el-option>
                            <el-option label="交易过期" value="expired"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间：" prop="createTime">
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
                    <el-form-item>
                          <el-button :disabled="loading"  size="small" type="primary" @click="onSubmit({})">查询</el-button>    
                    </el-form-item>
                </el-form>
            </div>
        <div class="down">
            <el-button class="download" size="small" type="primary" @click="downloadall"> 下载批量退款模板</el-button>
            <el-button class="download" size="small" type="primary" @click="upfile"> 批量退款</el-button>
            <el-button class="download" size="small" @click="download"> <img src="../../assets/icon/down.svg"/> 下载报表</el-button>
        </div>
            <el-table
            v-loading="loading"
            @sort-change="changeSort"
            element-loading-background="rgba(255,255,255,1)"
            :data="data">
                <div slot="empty">
                    <div class="tablebox">
                        <img src="../../assets/icon/frown-o.svg" alt="" />
                    </div>
                    <p :style="{'marginTop': '15px'}">{{hint}}</p>
                </div>
            <el-table-column
            v-for="(item,index) of dealList"
            :key="index"                
            align="center"
            header-align="center"
            v-if="item.isSelfDefined==='txt'&&item.prop!=='orderAmount'&&item.prop!=='gmtCreateTime'"
            :prop="item.prop"
            :label="item.label">
            </el-table-column>
            <el-table-column
            :key="index"                
            align="center"
            header-align="center"
            v-else-if="item.prop==='gmtCreateTime'"
            sortable="custom"
            :prop="item.prop"
            :label="item.label">
            </el-table-column>
            <el-table-column
            :key="index"                
            align="center"
            header-align="center"
            v-else-if="item.prop=='orderAmount'"
            :label="item.label">
                <template slot-scope="scope">
                    <span>{{scope.row.orderAmount}}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-else-if="item.isSelfDefined==='goto'"
                :key="index"
                align="center"
                header-align="center"
                :label="item.label">
                  <template slot-scope="scope">
                      <span @click="goDetail(scope)" class="txt hand">{{scope.row.merchantOrderId}}</span>
                  </template>
            </el-table-column>
            <el-table-column
                v-else-if="item.isSelfDefined==='many'"
                :key="index"
               :width="item.width"
                header-align="center"
                align="center"
                :label="item.label">
                  <template slot-scope="scope">
                      <div class="space">
                        <p v-if="scope.row.showVoidBtn"> 
                            <span class="txt hand" @click="okpre(scope,'refundform2')">完成</span>
                            <span class="txt hand" @click="annul(scope)">撤销</span>
                        </p>
                        <span v-if="scope.row.showApprovalBtn" class="txt hand" @click="check(scope)" >审核</span>
                        <span v-if="scope.row.showRefundBtn&&scope.row.availableAmount*1>0" class="txt hand" @click="refund(scope,'refundform')">退款</span>
                      </div>
                  </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @current-change="handleCurrentChange"
            background
            :current-page.sync="page"  
            :page-size="pagesize"
            layout="total, prev, pager, next, jumper"
            :total="allnum">
        </el-pagination>
        
        <!-- 输入退款金额的弹框 -->
         <el-dialog title="交易退款" width="35%" :close-on-click-modal="false" :visible.sync="outerVisible">
             <p class="everinfo">
                <span>交易流水号</span>
                <span>{{orderInfo.orderId}}</span>
            </p>
             <p class="everinfo">
                <span>商户订单号</span>
                <span>{{orderInfo.merchantOrderId}}</span>
            </p>
             <p class="everinfo">
                <span>交易金额</span>
                <span>{{orderInfo.orderAmount}}    {{orderInfo.orderCurrency}}</span>
            </p>
             <p class="everinfo">
                <span>可退金额</span>
                <span>{{orderInfo.availableAmount}}    {{orderInfo.orderCurrency}}</span>
            </p>
             <el-form class="form2" ref="refundform" :model="refundinfo" status-icon :rules="refundrule">
                <el-form-item
                    label="退款金额" 
                    prop="refundMoneyNum" >
                        <el-input clearable v-model="refundinfo.refundMoneyNum" placeholder="请输入退款金额"></el-input>
                </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="outerVisible=false">取消</el-button>
                <el-button type="primary" @click="refundNext('refundform')">提交</el-button>
            </div>
        </el-dialog>
        <!-- 预授权完成操作弹框 -->
        <el-dialog title="预授权完成操作" width="35%" :close-on-click-modal="false" :visible.sync="preok">
            <p class="everinfo">
                <span>交易金额</span><span>{{orderInfo.orderAmount}}     {{orderInfo.orderCurrency}}</span>
            </p>
            <p class="everinfo">
                <span>未完成金额</span><span>{{orderInfo.availableAmount}}      {{orderInfo.orderCurrency}}</span>
            </p>
            <el-form class="form2" ref="refundform2" :model="pre" status-icon :rules="prerule">
                <el-form-item
                    label="完成金额"
                    prop="okmoney" >
                    <el-input clearable v-model="pre.okmoney" placeholder="请输入完成金额"></el-input>
                </el-form-item>
                <span @click="allmoney" class="all hand">全部金额</span>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="preok = false">取消</el-button>
                <el-button type="primary" @click="confirm('refundform2')">确定</el-button>
            </div>
        </el-dialog>
        <!-- 预授权撤销操作 -->
        <el-dialog title="预授权撤销操作" width="35%" :close-on-click-modal="false" :visible.sync="revocation">
            <p class="everinfo">
                <span>商户订单号</span><span>{{orderInfo.merchantOrderId}}</span>
            </p>
            <p class="everinfo">
                <span>交易流水号</span><span>{{orderInfo.orderId}}</span>
            </p>
            <p class="everinfo">
                <span>预授权金额</span><span>{{orderInfo.availableAmount}}    {{orderInfo.orderCurrency}}</span>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="revocation = false">取消</el-button>
                <el-button type="primary" @click="ensure">确定</el-button>
            </div>
        </el-dialog>
        <!-- 审核弹框 -->
         <el-dialog title="消费订单审核" width="35%" :close-on-click-modal="false" :visible.sync="precheck">
            <p class="everinfo">
                <span>订单号</span><span>{{orderInfo.merchantOrderId}}</span>
            </p>
            <p class="everinfo">
                <span>风险原因</span><span>{{orderInfo.riskDescCn}}</span>
            </p>
            <p class="everinfo">
                <span>最晚处理时间</span><span>{{this.orderInfo.latestAdjustTime?formatDateTime(this.orderInfo.latestAdjustTime):''}}</span>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="via">通过</el-button>
                <el-button @click="reject">拒绝</el-button>
            </div>
        </el-dialog>
        <!-- 批量退款 -->
        <el-dialog @close="beforclose('rulefile')" width="35%" :close-on-click-modal="false"  title="批量退款" :visible.sync="batchRefund">
            <div class="betchBox">   
                <el-form  ref="rulefile" label-width="80px" :model="rulefile" status-icon :rules="filerule">
                    <el-form-item
                        label="上传文件"
                        prop="upfiles">
                        <el-input size="small" v-model="rulefile.upfiles" disabled></el-input>
                    </el-form-item>
                </el-form>
                <div class="btn">选择文件 <input accept=".xls,.xlsx" type="file" @change="checkimg" id="files" name="file1" class="upload" /></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="batchres('rulefile')">确定</el-button>
                <el-button size="small" @click="batchrej('rulefile')">取消</el-button>
            </div>
        </el-dialog>
        <!-- 退款结果展示 -->
        <el-dialog title="批量退款结果" width="35%" :close-on-click-modal="false" :visible.sync="loseBatch">
           <p class="returnInfo">批量退款上传结果：成功<span class="successinfo">{{suc}}</span>条   |    上传失败<span class="errorInfo">{{err}}</span>条</p>
            <el-table
                id="table_s"
                :data="batch_table"
                max-height="500">
                <el-table-column
                prop="orderId"
                label="订单号">
                    <template slot-scope="scope">
                        <div>
                            <span v-show>’</span>
                            {{scope.row.orderId}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                prop="remark"
                label="失败原因">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="closeBatch">关闭</el-button>
                <el-button size="small" @click="downexal"> <img src="../../assets/icon/down.svg"/>  下载报表</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { dealList } from '../../util/tabledata'
import { moneyToNumValue, typeZh, payType, statusZh, isRefund, fmoney, ExportExcel, easyCopy, formatDateTime, downloadfile, currencynum } from '../../util/commonality'
import { mapState } from 'vuex'
import classPost from '../../servies/classPost'
export default {
    data () {
        var checkamount = (rule, value, callback) => {
            value = value.toString()
            let num = currencynum(this.orderInfo.orderCurrency)
            let money = moneyToNumValue(this.orderInfo.availableAmount)
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
                            if(arr.length > 2 || num < arr[1].length || reg.test(arr[1])||reg.test(arr[0])){
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
        // 日期选择器不能选择大于90天
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
        return {
            css:{'mso-number-format':'\@'},
            rulefile:{
                upfiles:''
            },
            filerule:{
                upfiles:[
                    {required:true,message:'请选择上传文件',trigger:'blur'}
                ]
            },
            batch_table:false,
            batch_table:[],
            suc:'',
            hint:'您还没有设置查询条件',
            err:'',
            loseBatch:false,
            filename:'',
            batchRefund:false,
            precheck:false,
            files:'',
            allnum:0,
            orderss:'desc',
            merchantId:JSON.parse(localStorage.data).merchantId,
            orderInfo:'',
            revocation:false,// 预授权撤销
            preok:false,// 预授权完成弹框
            dealList,// 表格规则数据
            pre:{// 预授权操作信息
                okmoney:'',
            },
            prerule:{
                okmoney:[
                    { required:true, validator: checkamount, trigger: 'change' }
                ]
            },
            outerVisible:false,// 点击退款显示退款操作弹框
            outerVisible2:false,// 退款密码的弹框
            refundinfo:{ // 退款弹框默认信息   
                refundMoneyNum:''
            },
            loading:false,
            page:1,// 当前分页
            pagesize:10,
            ruleForm:{// 表单的数据
                orderNumber:'',
                tradeType:'sale,authorization,capture,create_token_sale,create_token_auth,token_sale,token_auth',
                orderStatus:'',
                createTime:['','']
            },
            timerule:{ 
                orderNumber:[
                    {trigger:'blur'}
                ],
                createTime:[
                    {validator: selecttime, trigger: 'blur'}
                ],
                tradeType:[
                    {message:'请选择交易类型',trigger: 'blur'}
                ],
                orderStatus:[
                    {message:'请选择订单状态',trigger: 'blur'}
                ]
            },
            refundrule:{ //退款弹框的验证规则
               
                refundMoneyNum:[
                    { required:true, validator: checkamount, trigger: 'change'}
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
            data:[ // 表格数据
                
            ]
        }
    },
    methods:{
        fmoney,
        currencynum,
        beforclose(form){
            this.$refs[form].resetFields()
            document.getElementById('files').value=''
        },
        check_create_time(){
            this.$refs['ruleForm'].validateField("createTime");
        },
        setOne(){
            this.page=1
        },
        closeBatch(){
            this.loseBatch=false
        },
        changeSort(data){
            if(data.order==="descending"){
                this.loading=true   
                this.orderss='desc'
                this.onSubmit({})
            }else if(data.order==="ascending"){
                this.loading=true   
                this.orderss='asc'
                this.onSubmit({})
            }else{
                return false
            }
        },
        downexal(){
             ExportExcel('table_s')
            this.loseBatch=false
        },
        goDetail(scope){
            let id = scope.row.orderId
            this.$router.push(`/home/tradeManage/orderDetails/${id}`)
        },
        batchres(form){
             this.$refs[form].validate((valid) => {
                if (valid) {
                     let load = this.$loading({
                        lock: true,
                        background:'rgba(0,0,0,.4)'
                    })
                    this.batchRefund = false
                    classPost.batch(this.upimgbase)
                        .then((res)=>{
                            console.log(res)
                            load.close()
                            this.batch_table = res.data.errorList
                            this.suc = res.data.successCount
                            this.err = res.data.errorList.length
                            if(res.data.successCount>0&&!res.data.errorList.length){
                                this.$alert('共上传'+(res.data.successCount+res.data.errorList.length)+'条，上传成功'+res.data.successCount+'条', '批量退款结果', {
                                    confirmButtonText: '确定',
                                    type: 'success'
                                })
                            }else{
                                this.loseBatch = true
                            }
                           
                        })
                        .catch((err)=>{
                            load.close()
                            this.$alert('您上传批量退款文件添加失败，失败原因：'+err.data.message, '添加失败', {
                                confirmButtonText: '确定',
                                type: 'error'
                            })
                            this.batchRefund = false
                            this.$refs[form].resetFields()
                        })
                }
             })
        },
        batchrej(form){
            this.batchRefund = false
            this.$refs[form].resetFields() 
        },
        checkimg(){
            this.$store.dispatch('removebase')
            let file = document.getElementById('files').files[0]
            this.rulefile.upfiles = file.name
            this.$store.dispatch('addbase',{"multipartFile":file})
        },
        downloadall(){
            let a = document.createElement('a')
            a.download='批量退款模板'
            a.href = '../../../static/批量退款模板.xls'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        },
        upfile(){
            this.batchRefund = true
        },
        via(){// 审核通过
            this.precheck=false
            setTimeout(()=>{
                this.$confirm('审核通过后，订单将于T+1日内清算至会员账户！', '确定通过该笔待审核订单？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     let load = this.$loading({
                            lock: true,
                            background:'rgba(0,0,0,.4)'
                        })
                     classPost.accept({"orderId":this.orderInfo.orderId})
                    .then((res)=>{
                            load.close()
                            this.$alert('您已成功通过了该笔待审核订单，订单交易成功', '审核成功', {
                                confirmButtonText: '确定',
                                type: 'success'
                            }).then(()=>{
                                this.onSubmit({})
                            })
                    })
                    .catch((err)=>{
                        load.close()
                         this.$alert('该笔待审核订单的审核失败，失败原因：'+err.data.message, '审核失败', {
                            confirmButtonText: '确定',
                            type: 'error'
                        })
                        .then(()=>{
                            this.onSubmit({})
                        })
                    })
                })
            },300)
        },
        reject(){// 审核拒绝
            this.precheck=false
            setTimeout(()=>{
                this.$confirm('审核拒绝后，将冻结持卡人额度，且该订单将不会被清算', '确定拒绝该笔待审核订单？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     let load = this.$loading({
                            lock: true,
                            background:'rgba(0,0,0,.4)'
                        })
                    classPost.reject({"orderId":this.orderInfo.orderId})
                        .then((res)=>{
                            load.close()
                                this.$alert('您已成功拒绝了该笔待审核订单', '操作成功', {
                                    confirmButtonText: '确定',
                                    type: 'success'
                                }).then(()=>{
                                    this.onSubmit({})
                                })
                        })
                        .catch((err)=>{
                            load.close()
                            this.$alert('该笔待审核订单的拒绝操作失败，失败原因'+err.data.message, '操作失败', {
                                confirmButtonText: '确定',
                                type: 'error'
                            })
                            .then(()=>{
                                    this.onSubmit({})
                            })
                        })
                })
            },300)
            
        },
        check(scope){// 点击审核事件
            classPost.risk_reason({riskCode:scope.row.riskCode})
                .then((res)=>{
                    console.log(res)
                    this.precheck = true
                    this.orderInfo = Object.assign(scope.row,{riskDescCn:res.data?res.data[0].riskDescCn:''})
                    console.log(this.orderInfo)
                })
                .catch((err)=>{
                    console.log(err)
                })
        },
        // 赋值事件
        assignment(scope, assignmentArr){
            Object.assign(assignmentArr,scope)
        },
        // 提交查询事件
        onSubmit (opt) {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.loading=true
                    let obj = Object.assign(this.postdata,opt)
                    classPost.tradeSelect(obj)
                        .then((res)=>{
                            if(res.data){
                                this.data = res.data.dataList.map((item)=>{
                                    item.gmtCreateTime = item.gmtCreateTime?formatDateTime(item.gmtCreateTime):''
                                    item.latestAdjustTime = item.latestAdjustTime?formatDateTime(item.latestAdjustTime):''
                                    item.orderAmount = this.fmoney(item.orderAmount?item.orderAmount:0,currencynum(item.orderCurrency))
                                    item.outerStatus = typeZh(item.outerStatus)
                                    item.orderType = statusZh(item.orderType)
                                    item.refundStatus = isRefund(item.refundStatus)
                                    item.payChannel = payType(item.payChannel)
                                    item.availableAmount = this.fmoney(item.availableAmount?item.availableAmount:0,currencynum(item.orderCurrency))
                                    return {...item}
                                })
                                this.allnum = Number(res.data.total)
                            }else{
                                this.data = []
                                this.allnum = 0
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
        ensure(){// 撤销确定事件
            let load = this.$loading({
                lock: true,
                background:'rgba(0,0,0,.4)'
            })
            this.revocation=false
            let obj="merchantOrderId="+this.orderInfo.merchantOrderId;
            classPost.auth_void(obj)
                .then((res)=>{
                    load.close()
                    this.$alert('您已成功撤销订单:'+this.orderInfo.merchantOrderId+'的预授权', '预授权撤销成功', {
                        confirmButtonText: '确定',
                        type: 'success'
                    })
                    .then(()=>{
                        this.onSubmit({})
                    })
                })
                .catch((err)=>{
                    load.close()
                    this.$alert('该笔订单预授权撤销失败，失败原因：'+err.data.message, '预授权撤销失败', {
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                    .then(()=>{
                        this.onSubmit({})
                    })
                })
          
        },
        annul(scope){ // 撤销事件
            this.orderInfo = scope.row
            this.revocation=true 
        },
        // 输入全部金额
        allmoney(){
            this.pre.okmoney = moneyToNumValue(this.orderInfo.availableAmount) 
        },
        okpre(scope,form){ // 完成操作
            this.orderInfo = scope.row
            this.$refs[form]&&this.$refs[form].resetFields()
            this.preok=true
        },
        setTime(){ //设置初始时间
            let end = new Date();
            let start = new Date();
            let year = start.getFullYear()
            let month = start.getMonth()
            let day = start.getDate()
            end = new Date(year,month,day,23,59,59);
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            start=start.getTime()
            end=end.getTime()
            this.ruleForm.createTime = [start, end]
        },
        confirm (formName) { //完成操作点击确定
             let _this = this
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.preok=false
                    let load = this.$loading({
                        lock: true,
                        background:'rgba(0,0,0,.4)'
                    })
                    classPost.capture(this.predata)
                        .then((res)=>{
                            load.close()
                                _this.$alert('剩余预授权未完成金额：'+ this.fmoney(this.orderInfo.availableAmount-this.pre.okmoney, this.currencynum(this.orderInfo.orderCurrency))+this.orderInfo.orderCurrency, '预授权完成操作成功', {
                                    confirmButtonText: '关闭',
                                    type: 'success'
                                })
                                .then(()=>{
                                   this.onSubmit({})
                                })
                        })
                        .catch((err)=>{
                            load.close()
                            _this.$alert('您提交的预授权完成操作失败，失败原因：'+err.data.message, '预授权操作失败', {
                                confirmButtonText: '确定',
                                type: 'error'
                            }) 
                            .then(()=>{
                                this.onSubmit({})
                            })
                        })
             
                } else {
                    return false;
                }
            });
        },
        // 下载事件
        download () {
            let obj = easyCopy(this.postdata)
            delete obj.pageBean
            classPost.export_deal(obj)
                .then((res)=>{
                    downloadfile(res,'交易处理')
                })
                .catch((err)=>{
                    console.log(err)
                })
        },
        // 退款事件
        moneyToNumValue,
        refund (scope ,form) {
            this.orderInfo = scope.row
            this.$refs[form]&&this.$refs[form].resetFields()
            this.outerVisible=true
        },
        // 输入退款金额弹框的提交事件
        refundNext(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.outerVisible=false
                    this.$confirm('您好，您要退款的金额为'+this.fmoney(this.refundinfo.refundMoneyNum,this.currencynum(this.orderInfo.orderCurrency))+this.orderInfo.orderCurrency, '退款确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '返回',
                        type: 'warning'
                    }).then(()=>{
                        let load = this.$loading({
                            lock: true,
                            background:'rgba(0,0,0,.4)'
                        })
                        classPost.refund(this.refunddata)
                            .then((res)=>{
                                load.close()
                                    this.$alert('您的退款提交已成功，退款金额为：'+ this.fmoney(this.refundinfo.refundMoneyNum,this.currencynum(this.orderInfo.orderCurrency))+this.orderInfo.orderCurrency, '提交成功', {
                                        confirmButtonText: '确定',
                                        type: 'success'
                                    }).then(()=>{
                                        
                                        this.onSubmit({})
                                    })
                            })
                            .catch((err)=>{
                                load.close()
                                this.$alert('您的退款失败了,失败原因：'+err.data.message, '提交失败', {
                                    confirmButtonText: '确定',
                                    type: 'error'
                                })
                                .then(()=>{
                                     
                                     this.onSubmit({})
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
        },
        formatDateTime
    },
    computed:{
        ...mapState({
            upimgbase:state => state.upload.upimgbase
        }),
        refunddata(){
            return {
                merchantOrderId:this.orderInfo.merchantOrderId,
                orderId:this.orderInfo.orderId,
                availableAmount: this.orderInfo.availableAmount,
                refundAmount: this.refundinfo.refundMoneyNum
            }
        },
        predata(){
            return {
                merchantOrderId:this.orderInfo.merchantOrderId,
                availableAmount:this.orderInfo.availableAmount,
                captureAmount:this.pre.okmoney
            }
        },
        postdata(){
            return {
                merchantOrderId: this.ruleForm.orderNumber,
                tradeType: this.ruleForm.tradeType,
                orderStatus: this.ruleForm.orderStatus,
                startTime: this.ruleForm.createTime[0]?this.setim(formatDateTime(this.ruleForm.createTime[0]),1):null,
                endTime: this.ruleForm.createTime[1]?this.setim(formatDateTime(this.ruleForm.createTime[1]),2):null, 
                "pageBean":{
                    "pageNumber":this.page,
                    "pageSize":this.pagesize,
                    "orderBy":`o.gmt_Create_Time ${this.orderss}`
                }
            }
        },
        
    },
    mounted(){
        this.setTime()
        if(this.$route.query.type){
            let type = this.$route.query.type
            if(type=='待审核订单'){
                this.ruleForm.orderStatus="pending_review"
                this.ruleForm.createTime=['','']
                this.onSubmit({})
            }
        }
    }
}
</script>
<style>
.tablebox img{
   width:36px;
   height:36px;
}
.dealDispose{
    margin-top: 20px;
    padding:0 20px 20px 20px;
    background: rgba(255, 255, 255, 1);
}
.dealDispose .content{
    padding-top:20px
}
.dealDispose .download{
    font-size: 14px;
}
.dealDispose .down{
    margin:10px 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.dealDispose .txt{
    color: rgb(22, 155, 213);
}
.dealDispose .space span:nth-child(2){
    margin-left: 10px;
}
.dealDispose .everinfo{
    height: 50px;
    display: flex;
    align-items: center;
    padding-left:20px;
}

.dealDispose .everinfo span:nth-child(1){
        width: 110px;
        text-align: right
    }
.dealDispose .everinfo span:nth-child(2){
    margin-left: 20px;
}
.dealDispose .form2{
    display: flex;
    align-items: center;
}
.dealDispose .form2 .el-form-item{
    padding-left: 65px;
    display: flex;
    align-items: center;
    margin-top: 10px;
}
.dealDispose .form2 .el-input{
    margin-left: 10px;
}
.dealDispose .form2 .el-form-item__error{
    left: 10px;
}
.dealDispose .pl50{
    padding-left: 50px;
}
.dealDispose .pl30{
    padding-left: 30px;
}
.dealDispose .all{
    margin-left: 30px;
    margin-top: -10px;
    color: rgb(22, 155, 213);
}
.dealDispose .btn{
        width: 70px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background-color: RGBA(24, 144, 255, 1);
        color: white;
        border-radius: 4px;
        position: relative;
        margin-top: -20px;
        margin-left: 20px;
    }
.dealDispose .btn .upload{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
.dealDispose .betchBox{
    display: flex;
    align-items: center;
   justify-content: center;
}
.dealDispose .returnInfo{
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    border-radius: 3px;
    background: rgba(230, 247, 255, 1);
    border: 1px solid rgba(145, 213, 255, 1);
    margin-bottom: 15px;
}
.dealDispose .returnInfo .successinfo{
    color:#1890FF;
    display: inline-block;
    margin: 0 2px;
}
.dealDispose .returnInfo .errorInfo{
    color:#FF0000;
    display: inline-block;
    margin: 0 2px;
}
</style>
