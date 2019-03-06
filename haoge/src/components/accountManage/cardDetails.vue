<template>
    <div class="wyx cardDetails">
        <!--<el-card>-->
        <!--<div slot="header" class="clearfix">-->
        <!--提现卡详情-->
        <!--</div>-->
        <el-form label-position="right" label-width="150px" style="margin-left: 100px">
            <el-form-item label="开户名：">{{dataArr.acctName}}</el-form-item>
            <el-form-item label="银行卡账户类型：">借记卡</el-form-item>
            <el-form-item label="对公对私：">
                <div v-html="dataArr.tradeType==0?'对私':'对公'"></div>
            </el-form-item>
            <el-form-item label="币种：">
                <div v-html="dataArr.countryType==0?'人民币':'非人民币'"></div>
            </el-form-item>
            <el-form-item label="银行名称：">{{dataArr.bankName}}</el-form-item>
            <el-form-item :label="dataArr.countryType==0?'开户银行所在地：':'开户银行地址：'">{{dataArr.bankAddress}}</el-form-item>
            <el-form-item v-if="dataArr.countryType!=1" label="开户行名称：">{{dataArr.bigBankName}}</el-form-item>
            <!--<el-form-item label="银行帐号：">{{dataArr.bankAcctAll.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ")}}</el-form-item>-->
            <el-form-item label="银行帐号：">{{dataArr.bankAcctAll}}</el-form-item>
            <el-form-item v-if="dataArr.countryType==1" label="SWIFT CODE：">{{dataArr.swiftCode}}</el-form-item>
            <!--<el-form-item>-->
                <!--<router-link to="/home/accountManage/cardManage">-->
                    <!--<el-button type="primary">返回提现卡管理</el-button>-->
                <!--</router-link>-->
            <!--</el-form-item>-->
        </el-form>
        <!--</el-card>-->
    </div>
</template>
<script>
    import '../../assets/css/wyxCard.css'
    import classPost from '../../servies/classPost'
    export default {
        data(){
            return {
                dataArr:{}
            }
        },
        mounted:function () {
            classPost.cardDetail({liquidateId:this.$route.params.liquidateId})
                .then((res)=>{
                    this.dataArr=res.data;
                    this.dataArr.bankAcctAll=this.dataArr.bankAcctAll.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
                    console.log(res)
                })
                .catch()
        }
    }
</script>
<style>
</style>
