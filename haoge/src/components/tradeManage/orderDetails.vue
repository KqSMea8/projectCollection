<template>
    <div class="orderDetails"  v-loading="loading" v-if="!loading"  element-loading-background="rgba(255,255,255,1)">
            <el-card class="box-card" shadow="never">
            <div slot="header" @click="changestatus(0)" class="clearfixwth">
                <span>订单信息</span>
                <i :class="isHide[0].flag?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </div>
            <div v-if="isHide[0].flag" class="content">
                <p v-if="data.order.merchantOrderId"><span>商户号订单号：</span><span>{{data.order.merchantOrderId}}</span></p>
                <p v-if="data.order.orderId"><span>交易流水号：</span><span>{{data.order.orderId}}</span></p>
                <p v-if="data.order.orderType"><span>交易类型：</span><span>{{statusZh(data.order.orderType)}}</span></p>
                <p v-if="data.order.gmtCreateTime"><span>创建时间：</span><span>{{formatDateTime(data.order.gmtCreateTime)}}</span></p>
                <p v-if="data.order.gmtCompleteTime"><span>完成时间：</span><span>{{formatDateTime(data.order.gmtCompleteTime)}}</span></p>
                <p v-if="data.orderContext.payType"><span>交易模式：</span><span>{{data.orderContext.payType}}</span></p>
                <p v-if="data.order.payChannel"><span>交易支付渠道：</span><span>{{data.order.payChannel}}</span></p>
                <p v-if="data.order.payMode"><span>支付方式：</span><span>{{data.order.payMode}}</span></p>
                <p v-if="data.order.outerStatus"><span>交易状态：</span><span>{{typeZh(data.order.outerStatus)}}</span></p>
                <p v-if="data.order.orderCurrency"><span>交易币种：</span><span>{{data.order.orderCurrency}}</span></p>
                <p><span>交易金额：</span><span>{{fmoney(data.order.orderAmount?data.order.orderAmount:0,currencynum(data.order.orderCurrency))}}</span></p>
                <p v-if="rsr.includes(statusZh(orderInfo.orderType))||psr.includes(statusZh(orderInfo.orderType))&&orderInfo.outerStatus==='success'"><span>{{psr.includes(statusZh(orderInfo.orderType))?'可完成金额':'可退金额：'}}</span><span>{{fmoney(data.order.orderAmount-data.order.invadeAmount,currencynum(data.order.orderCurrency))}}</span></p>
                <p v-if="data.order.terminalType"><span>终端类型：</span><span>{{data.order.terminalType}}</span></p>
                <p v-if="data.order.outerCode"><span>返回码：</span><span>{{data.order.outerCode}}</span></p>
                <p v-if="splitEn(data.order.outerMsg)"><span>返回码描述：</span><span>{{splitEn(data.order.outerMsg)}}</span></p>
            </div>
        </el-card>
        <div v-if="jurisdiction!==''" class="btn">
            <el-button v-if="orderInfo.outerStatus==='success'&&rsr.includes(statusZh(orderInfo.orderType))&&orderInfo.orderAmount-orderInfo.invadeAmount>0" @click="refundBtn('refundform')" size="small" type="primary">退款</el-button>
            <el-button v-if="orderInfo.orderAmount-orderInfo.invadeAmount>0&&psr.includes(statusZh(orderInfo.orderType))&&orderInfo.outerStatus==='success'" size="small" type="primary" @click="preOkBtn('preform')">预授权完成</el-button>
            <el-button v-if="orderInfo.orderAmount-orderInfo.invadeAmount>0&&psr.includes(statusZh(orderInfo.orderType))&&orderInfo.outerStatus==='success'" size="small" @click="preNoAlert=true" type="primary">预授权撤销</el-button>
            <el-button v-if="orderInfo.outerStatus==='pending_review'" @click="checkPre" size="small" type="primary">审核</el-button>
        </div>
        <el-card v-if="statusZh(data.order.orderType)==='消费'||statusZh(data.order.orderType)==='预授权'" class="box-card" shadow="never">
            <div slot="header" @click="changestatus(1)" class="clearfixwth">
                <span>支付信息</span>
                <i :class="isHide[1].flag?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </div>
            <div v-if="isHide[1].flag"  class="content">
                <p v-if="data.acquireOrderCardInfo.cardNo"><span>卡号：</span><span>{{data.acquireOrderCardInfo.cardNo}}</span><span class="hand" @click="addblack('卡号',data.acquireOrderCardInfo.cardNo)">添加黑名单</span></p>
                <p v-if="data.order.cardOrg"><span>卡组织：</span><span>{{data.order.cardOrg}}</span></p>
                <p v-if="data.order.issuerCountry"><span>发卡行所在国：</span><span>{{data.order.issuerCountry}}</span></p>
                <p v-if="data.acquireOrderCardInfo.lastName"><span>持卡人名：</span><span>{{data.acquireOrderCardInfo.lastName}}</span></p>
                <p v-if="data.acquireOrderCardInfo.firstName"><span>持卡人姓：</span><span>{{data.acquireOrderCardInfo.firstName}}</span></p>
            </div>
        </el-card>
        <el-card v-if="statusZh(data.order.orderType)!=='预授权撤销'&&statusZh(data.order.orderType)!=='预授权'" class="box-card" shadow="never">
            <div slot="header" @click="changestatus(2)" class="clearfixwth">
                <span>结算信息</span>
                <i :class="isHide[2].flag?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </div>
            <div v-if="isHide[2].flag"  class="content">
                <p class="curreny" v-if="data.orderContext.settlementCurrencyCode"><span>结算币种：</span><span>{{data.orderContext.settlementCurrencyCode}}</span></p>
                <div class="ib" v-if="sub_account" v-for="(item,ind) of sub_account" :key="ind">
                    <p><span>{{'分账账户'+(ind+1)}}</span><span>{{item.partnerId}}</span></p>
                    <p><span>分账币种</span><span>{{item.currencyCode}}</span></p>
                    <p><span>分账金额</span><span>{{fmoney(item.amount,currencynum(item.currencyCode))}}</span></p>
                </div>
            </div>
        </el-card>
        <el-card class="box-card" shadow="never">
            <div slot="header" @click="changestatus(3)" class="clearfixwth">
                <span>商户信息</span>
                <i :class="isHide[3].flag?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </div>
            <div v-if="isHide[3].flag"  class="content">
                <p class="border0" v-if="data.order.merchantId"><span>商户号：</span><span>{{data.order.merchantId}}</span></p>
                <p class="border0" v-if="data.order.carrierId"><span>交易主体ID：</span><span>{{data.order.carrierId}}</span></p>
            </div>
        </el-card>
        <el-card v-if="statusZh(data.order.orderType)==='消费'||statusZh(data.order.orderType)==='预授权'" class="box-card" shadow="never">
            <div slot="header" @click="changestatus(4)" class="clearfixwth">
                <span>商品信息</span>
                <i :class="isHide[4].flag?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </div>
            <div v-if="isHide[4].flag"  class="content once">
                <p class="oncep" v-if="data.orderContext.goodsName"><span>商品名称：</span><span>{{data.orderContext.goodsName}}</span></p>
                <p class="oncep border0" v-if="data.orderContext.goodsInfo"><span>商品描述：</span><span>{{data.orderContext.goodsInfo}}</span></p>
            </div>
        </el-card>
        <el-card v-if="statusZh(data.order.orderType)==='消费'||statusZh(data.order.orderType)==='预授权'" class="box-card" shadow="never">
            <div slot="header" @click="changestatus(5)" class="clearfixwth">
                <span>用户信息</span>
                <i :class="isHide[5].flag?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </div>
            <div v-if="isHide[5].flag"  class="content">
                <p v-if="data.cust.registerUserId"><span>注册会员号：</span><span>{{data.cust.registerUserId}}</span><span class="hand" @click="addblack('注册会员号',data.cust.registerUserId)">添加黑名单</span></p>
                <p v-if="data.cust.level"><span>会员级别：</span><span>{{data.cust.level}}</span></p>
                <p v-if="data.cust.registrationTime"><span>用户注册时间：</span><span>{{data.cust.registrationTime}}</span></p>
                <p v-if="data.cust.email"><span>用户邮箱：</span><span>{{data.cust.email}}</span><span class="hand" @click="addblack('邮箱',data.cust.email)">添加黑名单</span></p>
                <p v-if="data.cust.phoneNum"><span>用户联系电话：</span><span>{{data.cust.phoneNum}}</span><span class="hand" @click="addblack('电话',data.cust.phoneNum)">添加黑名单</span></p>
                <p v-if="data.cust.lastShoppingTime"><span>上次消费时间：</span><span>{{data.cust.lastShoppingTime}}</span></p>
            </div>
        </el-card>
        <el-card v-if="statusZh(data.order.orderType)==='消费'||statusZh(data.order.orderType)==='预授权'" class="box-card" shadow="never">
            <div slot="header"  @click="changestatus(6)" class="clearfixwth">
                <span>收货信息</span>
                <i :class="isHide[6].flag?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </div>
            <div v-if="isHide[6].flag"  class="content">
                <p v-if="data.ship.phoneNum"><span>收货联系电话：</span><span>{{data.ship.phoneNum}}</span><span class="hand" @click="addblack('电话',data.ship.phoneNum)">添加黑名单</span></p>
                <p v-if="data.ship.lastName"><span>收货人名：</span><span>{{data.ship.lastName}}</span></p>
                <p v-if="data.ship.firstName"><span>收货人姓：</span><span>{{data.ship.firstName}}</span></p>
                <p v-if="data.ship.streetstreet"><span>收货街道</span><span>{{data.ship.streetstreet}}</span><span class="hand" @click="addblack('收货地址',`${data.ship.country}&${data.ship.state}&${data.ship.city}&${data.ship.streetstreet}`)">添加黑名单</span></p>
                <p v-if="data.ship.postalCode"><span>收货邮编：</span><span>{{data.ship.postalCode}}</span></p>
                <p v-if="data.ship.city"><span>收货城市：</span><span>{{data.ship.city}}</span><span class="hand" @click="addblack('收货地址',`${data.ship.country}&${data.ship.state}&${data.ship.city}&${data.ship.streetstreet}`)">添加黑名单</span></p>
                <p v-if="data.ship.state"><span>收货省份：</span><span>{{data.ship.state}}</span><span class="hand" @click="addblack('收货地址',`${data.ship.country}&${data.ship.state}&${data.ship.city}&${data.ship.streetstreet}`)">添加黑名单</span></p>
                <p v-if="data.ship.country"><span>收货国家：</span><span>{{data.ship.country}}</span><span class="hand" @click="addblack('收货地址',`${data.ship.country}&${data.ship.state}&${data.ship.city}&${data.ship.streetstreet}`)">添加黑名单</span></p>
                <p v-if="data.ship.addressLastModifyTime"><span>收货地址最后修改地址：</span><span>{{data.ship.addressLastModifyTime}}</span></p>
            </div>
        </el-card>
        <el-card v-if="statusZh(data.order.orderType)==='消费'||statusZh(data.order.orderType)==='预授权'" class="box-card" shadow="never">
            <div slot="header" @click="changestatus(7)" class="clearfixwth">
                <span>账单信息</span>
                <i :class="isHide[7].flag?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </div>
            <div v-if="isHide[7].flag"  class="content">
                <p v-if="data.bill.street"><span>账单街道：</span><span>{{data.bill.street}}</span><span class="hand" @click="addblack('收货地址',`${data.bill.country}&${data.bill.state}&${data.bill.city}&${data.bill.streetstreet}`)">添加黑名单</span></p>
                <p v-if="data.bill.postalCode"><span>账单邮编：</span><span>{{data.bill.postalCode}}</span></p>
                <p v-if="data.bill.city"><span>账单城市：</span><span>{{data.bill.city}}</span><span class="hand" @click="addblack('收货地址',`${data.bill.country}&${data.bill.state}&${data.bill.city}&${data.bill.streetstreet}`)">添加黑名单</span></p>
                <p v-if="data.bill.state"><span>账单省份：</span><span>{{data.bill.state}}</span><span class="hand" @click="addblack('收货地址',`${data.bill.country}&${data.bill.state}&${data.bill.city}&${data.bill.streetstreet}`)">添加黑名单</span></p>
                <p v-if="data.bill.country"><span>账单国家：</span><span>{{data.bill.country}}</span><span class="hand" @click="addblack('收货地址',`${data.bill.country}&${data.bill.state}&${data.bill.city}&${data.bill.streetstreet}`)">添加黑名单</span></p>
            </div>
        </el-card>
        <el-card v-if="statusZh(data.order.orderType)==='消费'||statusZh(data.order.orderType)==='预授权'" class="box-card" shadow="never">
            <div slot="header" @click="changestatus(8)" class="clearfixwth">
                <span>其他信息</span>
                <i :class="isHide[8].flag?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </div>
            <div v-if="isHide[8].flag"  class="content">
                <!-- <p v-if="data.ship.phoneNum"><span>ip：</span><span>{{data.ship.phoneNum}}</span><span class="hand" @click="addblack('ip',data.order.cardNo)">添加黑名单</span></p>
                <p v-if="data.ship.lastName"><span>ip所属国：</span><span>{{data.ship.lastName}}</span></p>
                <p v-if="data.ship.firstName"><span>风险分数调节：</span><span>{{data.ship.firstName}}</span></p>
                <p v-if="data.ship.streetstreet"><span>重试次数：</span><span>{{data.ship.streetstreet}}</span></p>
                <p v-if="data.ship.streetstreet"><span>设备指纹：</span><span>{{data.ship.streetstreet}}</span></p> -->
            </div>
        </el-card>
     
         <!-- 输入退款金额的弹框 -->
         <el-dialog width="35%" :close-on-click-modal="false" title="交易退款" :visible.sync="refundAlert">
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
                <span>{{fmoney(orderInfo.orderAmount,currencynum(orderInfo.orderCurrency))}}    {{orderInfo.orderCurrency}}</span>
            </p>
             <p class="everinfo">
                <span>可退金额</span>
                <span>{{fmoney(orderInfo.orderAmount-orderInfo.invadeAmount,currencynum(orderInfo.orderCurrency))}}    {{orderInfo.orderCurrency}}</span>
            </p>
             <el-form class="form2" ref="refundform" :model="refundRuleInfo" status-icon :rules="refundrule">
                    <el-form-item
                        label="退款金额" 
                        prop="refundMoneyNum" >
                        <el-input clearable v-model="refundRuleInfo.refundMoneyNum" placeholder="请输入退款金额"></el-input>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="refundAlert=false">取消</el-button>
                <el-button type="primary" @click="refundSubmit('refundform')">提交</el-button>
            </div>
        </el-dialog>
        <!-- 预授权完成操作弹框 -->
        <el-dialog width="35%" :close-on-click-modal="false" title="预授权完成操作" :visible.sync="preOkAlert">
            <p class="everinfo">
                <span>交易金额</span><span>{{fmoney(orderInfo.orderAmount,currencynum(orderInfo.orderCurrency))}}     {{orderInfo.orderCurrency}}</span>
            </p>
            <p class="everinfo">
                <span>未完成金额</span><span>{{fmoney(orderInfo.orderAmount-orderInfo.invadeAmount,currencynum(orderInfo.orderCurrency))}}      {{orderInfo.orderCurrency}}</span>
            </p>
            <el-form class="form2" ref="preform" :model="preInfo" status-icon :rules="preRule">
                <el-form-item
                    label="完成金额"
                    prop="money" >
                    <el-input clearable v-model="preInfo.money" placeholder="请输入完成金额"></el-input>
                </el-form-item>
                <span @click="allmoney" class="all hand">全部金额</span>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="preOkAlert=false">取消</el-button>
                <el-button type="primary" @click="preConfirm('preform')">确定</el-button>
            </div>
        </el-dialog>
         <!-- 预授权撤销操作 -->
         <el-dialog width="35%" :close-on-click-modal="false" title="预授权撤销操作" :visible.sync="preNoAlert">
            <p class="everinfo">
                <span>商户订单号</span><span>{{orderInfo.merchantOrderId}}</span>
            </p>
            <p class="everinfo">
                <span>交易流水号</span><span>{{orderInfo.orderId}}</span>
            </p>
            <p class="everinfo">
                <span>预授权金额</span><span>{{fmoney(orderInfo.orderAmount-orderInfo.invadeAmount,currencynum(orderInfo.orderCurrency))}}    {{orderInfo.orderCurrency}}</span>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="preNoAlert = false">取消</el-button>
                <el-button type="primary" @click="preNoConfirm">确定</el-button>
            </div>
        </el-dialog>
        <!-- 审核弹框 -->
         <el-dialog width="35%" :close-on-click-modal="false" title="消费订单审核" :visible.sync="checkAlert">
            <p class="everinfo">
                <span>订单号</span><span>{{orderInfo.merchantOrderId}}</span>
            </p>
            <p class="everinfo">
                <span>风险原因</span><span>{{orderInfo.riskDescCn}}</span>
            </p>
            <p class="everinfo">
                <span>最晚处理时间</span><span>{{formatDateTime(orderInfo.latestAdjustTime)}}</span>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="checkOk">通 过</el-button>
                <el-button @click="checkNo">拒 绝</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import classPost from '../../servies/classPost'
import { moneyToNumValue, fmoney, ExportExcel, typeZh, statusZh, formatDateTime, currencynum } from '../../util/commonality'
export default {
    name:'orderDetail',
    data () {
         // 退款金额的规则
         var checkamount = (rule, value, callback) => {
            value = value.toString()
            let num = currencynum(this.orderInfo.orderCurrency)
            let money = this.orderInfo.orderAmount*1000-this.orderInfo.invadeAmount*1000
            let arr = value.indexOf('.')!==-1?value.split('.'):value
            const reg = /[^\d]/
            if(!value){
                callback('请输入交易金额')
            }else{
                if(num=='0'){
                if(value.indexOf('.')!==-1){
                    callback('请输入合法的数值')
                }else{
                    if(value*1>money/1000){
                        callback('退款金额不能大于可退金额')
                    }else{
                        callback()
                    }  
                }
                }else{
                    if(value*1>money/10){
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
        return {
            jurisdiction:JSON.parse(sessionStorage.jurisdiction),
            orderInfo:{
                accSplitData:'',
                accessType:"",
                actAmount:"",
                actCurrency:"",
                avsDesc:'',
                avsResult:'',
                billEmail:'',
                cardNo:'',
                cardOrg:'',
                carrierId:"",
                doingInvadeAmount:'',
                gmtCompleteTime:'',
                gmtCreateTime:'',
                gmtUpdateTime:'',
                goodsDesc:'',
                goodsName:'',
                innerCode:'',
                innerDetailStatus:'',
                innerMsg:'',
                invadeAmount:'',
                ip:'',
                issuerCountry:'',
                latestAdjustTime:'',
                memberId:"",
                merchantId:"",
                merchantOrderId:"",
                orderAmount:"",
                orderCurrency:"",
                orderId:"",
                orderType:"",
                oriMerchantOrderId:'',
                oriOrderId:"",
                outerCode:"",
                outerMsg:"",
                outerStatus:"",
                payChannel:'',
                payMode:"",
                payType:'',
                phoneNo:'',
                processNode:'',
                riskCode:'',
                settlementCurrency:'',
                terminalType:'',
                token:'',
                tokenInvalidDate:'',
                traceId:"",
                version:''
            },
            rsr:['消费','预授权完成','token创建并消费','token消费'],
            psr:['token预授权','预授权','token创建并预授权'],
            sub_account:'',
            loading:true,
            checkAlert:false,
            preNoAlert:false,
            preRule:{
                money:[
                    { required:true, validator: checkamount, trigger: 'change' }
                ]
            },
            refundRuleInfo:{
                refundMoneyNum:''
            },
            preInfo:{
                money:''
            },
            refundrule:{
                refundMoneyNum:[
                    { required:true, validator: checkamount, trigger: 'change'}
                ]
            },
            refundAlert:false,//退款弹框
            preOkAlert:false,//预授权完成弹框
            data:{
                acquireOrderCardInfo:{
                    billingDesc:'',
                    cardNo:'',
                    cvv:'',
                    expMonth:'',
                    expYear:'',
                    firstName:'',
                    gmtCreateTime:'',
                    gmtModifyTime:'',
                    id:'',
                    indexCn:'',
                    indexCvv:'',
                    indexEm:'',
                    indexEy:'',
                    indexFn:'',
                    indexLn:'',
                    lastName:'',
                    orderId:'',
                    secretData:''
                },
                acquireOrderHisList:{
                    afterInnerDetailStatus:'',
                    afterInnerStatus:'',
                    afterOuterStatus:'',
                    beforeInnerDetailStatus:'',
                    beforeInnerStatus:'',
                    beforeOuterStatus:'',
                    changeMeno:'',
                    changeType:'',
                    code:'',
                    effectOrderId:'',
                    gmtCreateTime:'',
                    gmtModifyTime:'',
                    id:'',
                    merchantOrderId:'',
                    msg:'',
                    operator:'',
                    orderId:'',
                    status:'',
                    traceId:'',
                },
                acquireOrderInfoList:{
                    gmtCreateTime:'',
                    gmtModifyTime:'',
                    id:'',
                    infoKey:'',
                    infoValue:'',
                    orderId:''
                },
                acquireTokenInfo:{
                    bindOrderId:'',
                    cardInfo:'',
                    gmtCreateTime:'',
                    gmtModifyTime:'',
                    id:'',
                    merchantId:'',
                    registerUserId:'',
                    status:'',
                    token:'',
                    unBindOrderId:''
                },
                bill:{
                    city:'',
                    country:'',
                    email:'',
                    firstName:'',
                    lastName:'',
                    phoneNo:'',
                    postalCode:"",
                    state:'',
                    street:''
                },
                cust:{
                    email:'',
                    ip:'',
                    lastShoppingTime:'',
                    level:'',
                    phoneNum:'',
                    registerUserId:'',
                    registrationTime:''
                },
                goods:{},
                order:{
                    accSplitData:'',
                    accessType:"",
                    actAmount:"",
                    actCurrency:"",
                    avsDesc:'',
                    avsResult:'',
                    billEmail:'',
                    cardNo:'',
                    cardOrg:'',
                    carrierId:"",
                    doingInvadeAmount:'',
                    gmtCompleteTime:'',
                    gmtCreateTime:'',
                    gmtUpdateTime:'',
                    goodsDesc:'',
                    goodsName:'',
                    innerCode:'',
                    innerDetailStatus:'',
                    innerMsg:'',
                    invadeAmount:'',
                    ip:'',
                    issuerCountry:'',
                    latestAdjustTime:'',
                    memberId:"",
                    merchantId:"",
                    merchantOrderId:"",
                    orderAmount:"",
                    orderCurrency:"",
                    orderId:"",
                    orderType:"",
                    oriMerchantOrderId:'',
                    oriOrderId:"",
                    outerCode:"",
                    outerMsg:"",
                    outerStatus:"",
                    payChannel:'',
                    payMode:"",
                    payType:'',
                    phoneNo:'',
                    processNode:'',
                    riskCode:'',
                    settlementCurrency:'',
                    terminalType:'',
                    token:'',
                    tokenInvalidDate:'',
                    traceId:"",
                    version:''
                },
                orderContext:{
                    accSplitData:"",
                    actAmount:"",
                    actCurrency:"",
                    carrierId:"",
                    echoParameter:"",
                    email:"",
                    expiration:'',
                    gmtCreateTime:'',
                    gmtModifyTime:'',
                    goodsInfo:"",
                    goodsName:"",
                    mark:"",
                    noticeUrl:"",
                    orderAmount:"",
                    orderCurrency:"",
                    orderId:"",
                    payType:"",
                    phone:"",
                    redirectUrl:"",
                    reserved:"",
                    settlementCurrencyCode:""
                },
                ship:{
                    addressLastModifyTime:'',
                    city:'',
                    country:'',
                    email:'',
                    firstName:'',
                    lastName:'',
                    phoneLastModifyTime:'',
                    phoneNum:'',
                    postalCode:'',
                    state:'',
                    street:''
                }
            },
            isHide:[
                {flag:true},
                {flag:true},
                {flag:true},
                {flag:true},
                {flag:true},
                {flag:true},
                {flag:true},
                {flag:true},
                {flag:true}
            ]
        }
    },
   
    mounted() {
        this.get_data()
    },
    computed:{
        refunddata(){
            return {
                merchantOrderId:this.orderInfo.merchantOrderId,
                orderId:this.orderInfo.orderId,
                availableAmount: this.orderInfo.orderAmount-this.orderInfo.invadeAmount,
                refundAmount: this.refundRuleInfo.refundMoneyNum
            }
        },
        predata(){
            return {
                merchantOrderId:this.orderInfo.merchantOrderId,
                availableAmount:this.orderInfo.orderAmount-this.orderInfo.invadeAmount,
                captureAmount:this.preInfo.money
            }
        },
    },
    methods:{
        currencynum,
        checkPre(){
            classPost.risk_reason({riskCode:this.orderInfo.riskCode})
            .then((res)=>{
                this.orderInfo = Object.assign(this.orderInfo,{riskDescCn:res.data[0].riskDescCn})
                this.checkAlert = true
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        splitEn(val){
            let va = val
            if(val){
                if(val.indexOf(':')!==-1){
                    va = val.split(':')[1]
                }else if(val.indexOf('：')!==-1){
                    va = val.split(':')[1]
                }
            }
            return va
        },
        formatDateTime,
        fmoney,
        preNoConfirm(){
            this.preNoAlert=false
            let load = this.$loading({
                lock: true,
                background:'rgba(0,0,0,.4)'
            })
            let obj="merchantOrderId="+this.orderInfo.merchantOrderId;
            classPost.auth_void(obj)
            .then((res)=>{
                load.close()
                this.$alert('您已成功撤销订单:'+this.orderInfo.merchantOrderId+'的预授权', '预授权撤销成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                }).then(()=>{
                    this.get_data()
                })  
            })
            .catch((err)=>{
                load.close()
                this.$alert('该笔订单预授权撤销失败，失败原因'+err.data.message, '预授权撤销失败', {
                    confirmButtonText: '确定',
                    type: 'error'
                }).then(()=>{
                    this.get_data()
                })
            })
        },
        checkOk(){
            this.checkAlert=false
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
                            this.get_data()
                        })
                    })
                    .catch((err)=>{
                        load.close()
                         this.$alert('该笔待审核订单的审核失败，失败原因：'+err.data.message, '审核失败', {
                            confirmButtonText: '确定',
                            type: 'error'
                        })
                        .then(()=>{
                            this.get_data()
                        })
                    })
                })
            },300)
        },
        checkNo(){
            this.checkAlert=false
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
                            this.get_data()
                        })
                    })
                    .catch((err)=>{
                        load.close()
                        this.$alert('该笔待审核订单的拒绝操作失败，失败原因：'+err.data.message, '操作失败', {
                            confirmButtonText: '确定',
                            type: 'error'
                        }).then(()=>{
                            this.get_data()
                        })
                    })
                })
            },300)
        },
        preOkBtn(form){
            this.preInfo.money=''
            this.$refs[form]&&this.$refs[form].resetFields();
            this.preOkAlert=true
        },
        allmoney(){
            let money = this.orderInfo.orderAmount*1000-this.orderInfo.invadeAmount*1000
            this.preInfo.money = (money/1000).toFixed(this.currencynum(this.orderInfo.orderCurrency))
        },
        refundBtn(form){
            this.refundRuleInfo.refundMoneyNum=''
            this.$refs[form]&&this.$refs[form].resetFields();
            this.refundAlert=true
        },
        preConfirm(formName){
             let _this = this
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    let load = this.$loading({
                        lock: true,
                        background:'rgba(0,0,0,.4)'
                    })
                    _this.preOkAlert=false
                    classPost.capture(this.predata)
                    .then((res)=>{
                        load.close()
                            _this.$alert('剩余预授权未完成金额：'+this.fmoney(this.orderInfo.orderAmount-this.orderInfo.invadeAmount-this.preInfo.money,this.currencynum(this.orderInfo.orderCurrency))+this.orderInfo.orderCurrency, '预授权完成操作成功', {
                                confirmButtonText: '确定',
                                type: 'success'
                            })
                            .then(()=>{
                                this.get_data()
                            })
                    })
                    .catch((err)=>{
                        load.close()
                        _this.$alert('您提交的预授权完成操作失败，失败原因：'+err.data.message, '预授权操作失败', {
                            confirmButtonText: '确定',
                            type: 'error'
                        })
                        .then(()=>{
                            this.get_data()
                        })
                    })
                } else {
                    return false;
                }
            });
        },
        refundSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.refundAlert=false
                    this.$confirm('您好，您要退款的金额为'+this.fmoney(this.refundRuleInfo.refundMoneyNum,this.currencynum(this.orderInfo.orderCurrency))+this.orderInfo.orderCurrency, '退款确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '返回',
                        type: 'warning'
                    })
                    .then(()=>{
                        let load = this.$loading({
                            lock: true,
                            background:'rgba(0,0,0,.4)'
                        })
                        classPost.refund(this.refunddata)
                        .then((res)=>{
                            load.close()
                            this.$alert('您的退款已成功，退款金额为：'+this.fmoney(this.refundRuleInfo.refundMoneyNum,this.currencynum(this.orderInfo.orderCurrency))+this.orderInfo.orderCurrency, '提交成功', {
                                confirmButtonText: '确定',
                                type: 'success'
                            }).then(()=>{
                                this.get_data()
                            })
                        })
                        .catch((err)=>{
                            load.close()
                            this.$alert('您的退款失败了,失败原因：'+err.data.message, '提交失败', {
                                confirmButtonText: '确定',
                                type: 'error'
                            }).then(()=>{
                                this.get_data()
                            })
                        })
                    }).catch(()=>{
                        this.refundAlert=true
                    })
                } else {
                    return false;
                }
            })
        },
        addblack(t,v){
            this.$router.push({path:'/home/riskManage/addBlackList',query:{type:t,value:v}})
        },
        changestatus (ind) {
           this.isHide[ind].flag=!this.isHide[ind].flag
        },
        typeZh,
        statusZh,
        get_data(){
            this.loading=true
            let obj = 'orderId='+this.$route.params.id
            classPost.transaction_detail(obj)
            .then((res)=>{
                let arr = Object.keys(res.data)
                arr.forEach(item=>{
                    this.data[item]=res.data[item]?res.data[item]: this.data[item]
                })
                this.orderInfo = res.data.order? res.data.order:this.orderInfo
                this.sub_account =  res.data.orderContext?res.data.orderContext.accSplitData?JSON.parse(res.data.orderContext.accSplitData):'':''
                this.loading=false
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }
        
}    
</script>
<style>
    .orderDetails{
        background: rgba(255, 255, 255, 1);
        padding: 33px;
        margin-top: 24px;
    }
    .orderDetails .el-card__header{
        background: rgba(24, 144, 255, 0.1);
        padding: 0;
    }
    .orderDetails .box-card{
        margin-bottom: 30px;
        overflow: initial;
    }
     .orderDetails .btn{
        margin: 20px 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
     }  
    .orderDetails .box-card .clearfixwth{
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        justify-content: space-between;
    }
    .orderDetails .box-card .clearfixwth i{
        font-size: 20px;
    }
    .orderDetails .box-card .clearfixwth span{
        font-size: 14px;
        font-weight: bold;
    }
    .orderDetails .box-card .content{
        display: flex;
        flex-wrap: wrap;
    }
    .orderDetails .box-card .once{
        display: flex;
        flex-direction: column;
    }
    
    .orderDetails .box-card .content p{
        width: 33.33%;
        height: 50px;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        display: flex;
        align-items: center;
        padding-left:10px;
    }
    .orderDetails .box-card .content .border0{
        border:0
    }
    .orderDetails .box-card .content span:nth-child(1){
        display: inline-block;
        word-break:keep-all;      /* 不换行 */
        white-space:nowrap;       /* 不换行 */
    }
    .orderDetails .box-card .content span:nth-child(2){
        margin-left: 10px;
    }
    .orderDetails .box-card .el-card__body{
        padding: 0;
    }
    .orderDetails .box-card .content p:last-child{
        border: none;
    }
    .orderDetails .ib{
        width: 100%;
        display: flex;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        align-items: center;
    }
    .orderDetails .ib:last-child{
        border: 0px;
    }
    .orderDetails  .box-card .content .ib p{
        width: 33%;
        display: flex;
        align-items: center;
        border-bottom: none;
    }
    .orderDetails .box-card .content .curreny{
        width: 100%;
    }
    .orderDetails .box-card .content span:nth-child(3){
        margin-left: 15px;
        width: 84px;
        border: 1px solid rgba(163, 208, 253, 1);
        background: rgba(230, 241, 252, 1);
        color:rgba(25, 137, 250, 1);
        text-align: center;
        border-radius: 3px;
        font-size: 12px;
        height: 24px;
        line-height: 22px;
    }
     .orderDetails .el-button{
         width: 84px;
         height: 32px;
         padding: 0;
    }
    .orderDetails .box-card .content .oncep{
        width: 100%;
    }
    .orderDetails .el-form{
    display: flex;
    flex-wrap: wrap;
    }
    .orderDetails .form2 .el-form-item{
    padding-left: 65px;
    display: flex;
    margin-top: 10px;
    }
    .orderDetails .form2 .el-input{
        margin-left: 10px;
    }
    .orderDetails .form2 .el-form-item__error{
        left: 10px;
    }
    .orderDetails .everinfo{
    height: 50px;
    display: flex;
    align-items: center;
    padding-left:20px;
    }
    .orderDetails .all{
        margin-left: 30px; 
        margin-top: 20px;
        color: rgb(22, 155, 213);
    }
    .orderDetails .everinfo span:nth-child(1){
            width: 110px;
            text-align: right
        }
    .orderDetails .everinfo span:nth-child(2){
        margin-left: 20px;
    }
</style>
