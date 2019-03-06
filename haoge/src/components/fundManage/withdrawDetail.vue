<template>
    <div class="withdrawDetail">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>详情页</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="$router.back(-1)">返回</el-button> -->
            </div>
            <div class="detailBox">
                <div class="detailList" v-for="(item,index) in detailList" :key='index'>
                    <span>{{item.text}}</span>
                    <span>{{item.value}}</span>   
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import { Message } from 'element-ui' //element Message 组件引入
import classPost from '../../servies/classPost'
export default {
    data(){
        return{
        	orderId:'',
            detailList:[
                 {
                    text:'交易流水号 :',
                    value:"11111111111"
                 },
                 {
                    text:'金额 :',
                    value:"1,000,000USD"
                 },
                 {
                    text:'手续费 :',
                    value:"1000USD"
                 },
                 {
                    text:'交易状态 :',
                    value:"提现完成"
                 }, 
                 {
                    text:'创建时间 :',
                    value:"2018-05-26 10:32:51"
                 }, 
                 {
                    text:'完成时间 :',
                    value:"2018-05-26 10:32:51"
                 }, 
                 {
                    text:'提现账户 :',
                    value:"人民币基本结算账户"
                 },
                 {
                    text:'收款银行 :',
                    value:"中国民生银行"    
                 },
                 {
                    text:'收款开户行名称 :',
                    value:"中国民生银行榆树支行算账户"    
                 },
                 {
                    text:'收款银行卡户名 :',
                    value:"陈佳妮"    
                 },
                 {
                    text:'收款银行账户 :',
                    value:"**** **** **** 2891"    
                 },
                 {
                    text:'备注 :',
                    value:""    
                 }
            ]
        }
    },
    created: function () {
    	this.orderId = this.$route.query.id;
    	this.detail();
    },
    methods: {
    	detail(){
    		let obj = {
  				orderId:this.orderId
    		}
    		console.log(obj);
    		classPost.withdrawDetail(obj)
    			.then((res)=>{
                    console.log(res)
	  				this.detailList[0].value = res.data.orderId         //交易流水号
                    this.detailList[1].value = res.data.orderAmountStr + res.data.payerAcctcodeCurrency;    //金额
                    this.detailList[2].value = res.data.feeStr + res.data.payerAcctcodeCurrency;    //手续费
					this.detailList[3].value=res.data.orderStatusdesc;     //交易状态
					this.detailList[4].value=res.data.createDateStr ;     //创建时间
					this.detailList[5].value=res.data.createDateStr ;     //完成时间
					this.detailList[6].value=res.data.payerAcctcodeName;     //提现账户
					this.detailList[7].value=res.data.payeeBankname;     //收款银行
					this.detailList[8].value=res.data.payeeOpeningbankname  ;     //收款开户行名称
					this.detailList[9].value=res.data.payeeName;     //收款银行卡户名 
					this.detailList[10].value='**** **** ****'+res.data.maskpayeeBankacctcode;     //收款银行账户
					this.detailList[11].value='';     //备注
    			})
    			.catch()
    	}
    }
}
</script>
<style>
.withdrawDetail{
    background: #fff;
    margin-top:20px;
    padding:20px;
 } 
.withdrawDetail .el-card__header{
     background: rgba(24, 144, 255, 0.1);
    color:#000;
 }
.withdrawDetail .detailBox{
    background: #fff;
}
.withdrawDetail .detailList{
    height:50px;
    line-height: 50px;
    border-bottom:1px solid #E8E8E8;
    padding: 0 20px;
}
.withdrawDetail .detailList span{
    text-align: left;
}
.withdrawDetail .detailList span:nth-child(1){
    width:15%;
    display: inline-block;
    text-align: right; 
}
.withdrawDetail .detailList span:nth-child(2){
    width:25%;
    display: inline-block;
    margin-left: 10%;
}
.withdrawDetail .el-card__body{
    padding:0;
}
.withdrawDetail .el-card__header{
    padding:10px 20px;
}
.withdrawDetail .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover{
    -webkit-box-shadow: none; 
    box-shadow: none; 
}
</style>

