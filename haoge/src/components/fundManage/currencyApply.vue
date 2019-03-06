<template>
    <div class="currencyApply">
        <el-form v-show="show==true" ref="currencyApplyForm" :rules="rules" :model="currencyApplyForm" label-width="130px" class="currencyApplyForm">
            <el-form-item label="选择账户：" prop="account">
                <el-select v-model="currencyApplyForm.account" placeholder="请选择提现账户"  @change="accttypeListSelect">
                    <el-option
                        v-for='(item,index) of accttypeList'
                		:key="index" 
                        :disabled="item.curCode==currencyApplyForm.targetCurrency"
                		:value="item.curCode"
                		:label = "`${item.curCodeName}(${item.curCode})`"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="可用余额：" prop="availableBalance">
                <span>{{availableBalance}} {{currencyApplyForm.account}}</span>
            </el-form-item>
            <el-form-item label="目标币种：" prop="targetCurrency">
                <el-select v-model="currencyApplyForm.targetCurrency" placeholder="请选择目标币种" clearable  @change="targetCurrencySelect">
                    <el-option 
                        v-for="(item,index) of targetCurrencyList" 
                        :key="index" 
                        :disabled="item.currencyCode==currencyApplyForm.account"
                        :label="`${item.currencyCodeName}(${item.currencyCode})`" 
                        :value="item.currencyCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="可兑换金额：">
                <span>{{convertibleAmount}} {{currencyApplyForm.targetCurrency}}</span>
            </el-form-item>
            <el-form-item label="当前汇率：">
                <span>{{excRate}}</span>
            </el-form-item>
            <el-form-item label="申请兑换金额：" prop="applyAmount">
                <el-input v-model="currencyApplyForm.applyAmount" placeholder="请输入兑换金额" clearable @blur="applyAmount">
                    <template slot="append">{{currencyApplyForm.targetCurrency}}</template>
                </el-input>
            </el-form-item>
            <el-form-item label="账户所需金额：">
                <span>{{requireAccAmount}} {{currencyApplyForm.account}}</span>
            </el-form-item>
            <el-form-item label="手续费：">
                <span>{{requireFee}} {{currencyApplyForm.account}}</span>
            </el-form-item>
            <el-form-item label="资金用途：" prop="use">
                <el-select v-model="currencyApplyForm.use" placeholder="请选择兑换用途" clearable>
                    <el-option label="商务活动" value="商务活动"></el-option>
                    <el-option label="劳务被聘工作" value="劳务被聘工作"></el-option>
                    <el-option label="留学" value="留学"></el-option>
                    <el-option label="培训" value="培训"></el-option>
                    <el-option label="咨询服务" value="咨询服务"></el-option>
                    <el-option label="其他" value="其他"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="checked">
                <el-checkbox  v-model="currencyApplyForm.checked"></el-checkbox> 我已阅读并同意
                <span style='color:#1890FF;text-decoration: none;cursor: pointer;' @click="show=false">《商户换汇须知》</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="submitForm('currencyApplyForm')">提交</el-button>
            </el-form-item>
        </el-form>

        <el-dialog
            title="换汇订单"
            width="40%"
            :visible.sync="dialogVisible"
            :before-close="handleClose">
            <el-form :model="currencyPopForm" :rules="rules" ref="currencyPopForm" label-width="140px" class="demo-currencyPopForm">
                <p style="margin:20px;">您本次换汇的原币种为{{accttypeName}}({{currencyApplyForm.account}})，目标币种为{{targetCurrencyName}}({{currencyApplyForm.targetCurrency}})</p>
                <el-form-item label="兑换金额">
                    <span>{{fmoney(currencyApplyForm.applyAmount,this.currencyApplyForm.targetCurrency)}} {{currencyApplyForm.targetCurrency}}</span>
                </el-form-item>
                <el-form-item label="手续费">
                    <span>{{requireFee}} {{currencyApplyForm.account}}</span>
                </el-form-item>
                <el-form-item label="支付密码" prop="password">
                    <el-input v-model="currencyPopForm.password" type="password" clearable placeholder="请输入支付密码" @change="pas=0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="currencyApplyCancel">取消</el-button>
                <el-button type="primary" @click="isSuccess('currencyPopForm')">确定</el-button>
            </span>
        </el-dialog>
        <div class="currencyAgree" v-show="show==false">
            <div>购结汇服务协议</div>
            <h1>一、概述</h1>
            <p>本协议中将简称为“甲方”，对使用甲方服务的企业或用户简称为“乙方”。</p>
            <p>乙方确认，在乙方注册成为甲方用户以接受甲方的服务，或乙方以其他甲方允许的方式实际使用甲方服务前，乙方已充分阅读、理解并接受本协议的全部内容，一旦乙方使用甲方服务，即表示乙方同意遵循本协议之所有约定。</p>
            <p>甲方提醒乙方认真阅读、充分理解本协议各条款，特别是以粗体标注部分。如乙方不同意接受本协议的任意内容，或者无法准确理解相关条款含义的，请不要进行后续操作。如果乙方对本协议的条款有疑问的，请通过甲方客服渠道进行询问，甲方将向乙方解释条款内容。。</p>
            <h1>二、主体内容</h1>
            <p>1、购结汇服务，指甲方将乙方外汇交易订单按照合作协议中的结算币种结算给乙方，因乙方有特定需要，申请外币结算。甲方根据乙方指定结算币种要求，视情况为乙方提供重新结算的购结汇服务，并收取相应的手续费用。</p>
            <p>2、乙方声明，乙方满足甲方网站上公布的注册用户的身份要求，且按照甲方要求通过了实名验证，具有签订和履行本协议的资格。</p>
            <p>3、乙方同意，发布在甲方网站支付页面的外汇牌价或甲方另行展示或安排的外汇牌价是乙方自愿接受的，而不论该外汇牌价是否是最新的或对乙方最有利的；一旦乙方确认使用甲方的购结汇服务，即代表乙方同意选择该外汇牌价中相应外汇的汇率进行购结汇汇率折算。</p>
            <p>4、目前，乙方使用本服务时无需承担外汇牌价中标明的汇率与实际购结汇时或支付时或收款时或发生退货时的汇率之间的汇兑损益（不承担汇兑损失也不享有汇兑收益）。乙方同意，甲方有权要求乙方自某一时刻起承担该汇兑损益，届时将以甲方网站发布的公告为准。</p>
            <p>5、乙方同意，甲方有权将乙方的身份信息、交易信息、购结汇明细等信息同步给甲方合作银行或为了向乙方提供购结汇服务而必须获得以上信息的有权机构</p>
            <p>6、乙方同意，甲方有权就本服务向乙方收取服务费，服务费收取时间及标准届时以甲方网站发布的公告为准。</p>
            <p>7、乙方同意，乙方使用本服务购结汇的限额等应符合相关法律法规及监管部门或甲方的规定。</p>
            <div class="back" @click="show=true">
                <el-button type="primary" size="small">返回</el-button>  
            </div>
        </div>
    </div>
</template>
<script>
import { Message } from 'element-ui' //element Message 组件引入
import classPost from '../../servies/classPost'
import { currencynum ,fmoney,moneyToNumValue} from '../../util/commonality'
  export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                    callback(new Error('请输入支付密码'));
            } else {
                if(this.pas==='1'){
                    callback(this.info);
                }else{
                    callback()
                }
            }
        };
        var validateChecked = (rule, value, callback) => {
            if (value === false) {
                callback(new Error('请勾选阅读并同意'));
            } else {
               callback() 
            }
        };
        var checkApplyAmount = (rule, value, callback) => {
            value = value.toString();
            let num = currencynum(this.currencyApplyForm.targetCurrency)
            let arr = value.indexOf('.')!==-1?value.split('.'):value
            const reg = /[^\d]/g
            if(!value){
                callback(new Error('请输入交易金额'))
                this.requireAccAmount=0.00
                this.requireFee=0.00
              }else{
                if(num==='0'){
                  if(value.indexOf('.')!==-1){
                    callback('请输入合法的数值')
                  }else{
                    callback()
                  }
                }else{
                  if(typeof arr!=='string'){
                    if(arr.length > 2 || num < arr[1].length || reg.test(arr[1])||reg.test(arr[0])){
                      callback('请输入合法的数值')
                    }else if(value*1>moneyToNumValue(this.convertibleAmount)*1){
                      callback(new Error('您输入的金额大于可申请兑换最大金额'));
                    }else{
                      callback()
                    }
                  }else{
                    if( value*1<=0 ){
                      callback(new Error('金额不能为0或者小于0'))
                    }else if(reg.test(value)){
                      callback('请输入合法的数值')
                    }else if(value*1>moneyToNumValue(this.convertibleAmount)*1){
                      callback(new Error('您输入的金额大于可申请兑换最大金额'));
                    }else{
                        callback()
                    }
                  }
                 }

              }
        }    
        // var checkApplyAmount= (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请输入兑换金额'));
        //     } else {
        //         if(parseFloat(value)>parseFloat(this.convertibleAmount)){
        //             callback(new Error('您输入的金额大于可申请兑换最大金额'));
        //         }else{
        //             callback() 
        //         }
        //         callback() 
        //     }
        // };
      return {
        targetCurrencyName:"",
        accttypeName:'',
        show:true,
        dialogVisible:false,
        accttypeList:[],
        pas:'',
        info:'',
        availableBalance:0,//可用余额
        targetCurrencyList:[],
        convertibleAmount:0,//可兑换金额
        excRate:'',//当前汇率
        requireAccAmount:'0.00',//账户所需金额
        requireFee:'0.00',//手续费
        errorMsg:'',
        currencyApplyForm: {
            account:'',
            targetCurrency:'',
            applyAmount:'',
            use:'',
            checked:false,
        },
        currencyPopForm:{
            password:'',
        },
        rules: {
          account: [
            { required: true, message: '请选择账户', trigger: 'change' },
          ],
          targetCurrency: [
            { required: true, message: '请选择目标币种', trigger: 'change' }
          ],
          applyAmount: [
            { required: true, validator: checkApplyAmount, trigger: 'change' }
          ],
          use: [
            { required: true, message: '请选择资金用途', trigger: 'change' }
          ],
          checked: [
            { required: true, validator: validateChecked, trigger: 'change' }
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
        }
      };
    },
    mounted(){
        this.queryaccttypeList(); 
        //this.queryCapitalPoolManage();   
    },
    methods: {
        fmoney,
        moneyToNumValue,
        currencynum,
        //提现账户列表
        queryaccttypeList(){
            classPost.queryaccttypeList({acctType:1})
                .then((res)=>{
                    console.log(res)
                    this.accttypeList=res.data
                }).catch((err)=>{
                    console.log(err)
                })    
        },
        //选择账户
        accttypeListSelect(){
            this.accttypeName=this.accttypeList.filter((ele)=>{
                return ele.curCode==this.currencyApplyForm.account
            })[0].curCodeName
            classPost.accttypeListSelect({currencyCode:this.currencyApplyForm.account})
                .then((res)=>{
                    console.log(res);
                    this.availableBalance=fmoney(res.data,currencynum(this.currencyApplyForm.account))
                    this.queryCapitalPoolManage()

                    // this.targetCurrencySelect()
                    // this.applyAmount()
                    this.convertibleAmount=0
                    this.excRate=''
                    this.currencyApplyForm.applyAmount=''
                    this.currencyApplyForm.targetCurrency=''
                    this.requireAccAmount=0.00
                    this.requireFee=0.00
                }).catch((err)=>{
                    console.log(err)
            })      
        },
        //目标币种列表
        queryCapitalPoolManage(){
            classPost.queryCapitalPoolManage({})
                .then((res)=>{
                    console.log(res);
                    this.targetCurrencyList=res.data
                }).catch((err)=>{
                    console.log(err)
            })
        },
        //选择目标币种
        targetCurrencySelect(){
            this.targetCurrencyName=this.targetCurrencyList.filter((ele)=>{
                return ele.currencyCode==this.currencyApplyForm.targetCurrency
            })[0].currencyCodeName
            var obj={
                currencyCode:this.currencyApplyForm.account,
                targetCurrency:this.currencyApplyForm.targetCurrency
            }
            classPost.getswapbananceAndrate(obj)
                .then((res)=>{
                    console.log(res)
                    this.convertibleAmount=fmoney(res.data.convertibleAmount,currencynum(this.currencyApplyForm.account))
                    this.excRate=fmoney(res.data.excRate,currencynum(this.currencyApplyForm.account))
                    // this.accttypeListSelect()
                    // this.applyAmount()
                    this.currencyApplyForm.applyAmount=''
                    this.requireAccAmount=0.00
                    this.requireFee=0.00
                }).catch((err)=>{
                    console.log(err)
            })
        },
        //申请兑换金额
        applyAmount(){
            if(this.currencyApplyForm.applyAmount!=''){
                var obj={
                    currencyCode:this.currencyApplyForm.account,
                    targetCurrency:this.currencyApplyForm.targetCurrency,
                    amount:this.currencyApplyForm.applyAmount,
                }
                console.log(obj)
                classPost.getInfoByApplyAmount(obj)
                    .then((res)=>{
                        console.log(res)
                        this.requireAccAmount=fmoney(res.data.requireAccAmount,currencynum(this.currencyApplyForm.targetCurrency))
                        this.requireFee=fmoney(res.data.requireFee,currencynum(this.currencyApplyForm.targetCurrency))
                        // this.accttypeListSelect()
                        // this.targetCurrencySelect()
                    }).catch((err)=>{
                        console.log(err)
                }) 
            }   
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogVisible=true
                } else {
                console.log('error submit!!');
                return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        currencyApplyCancel(){
            this.dialogVisible = false
            this.resetForm('currencyPopForm')
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },  
        isSuccess(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var obj={
                        exchCurrencyCode:this.currencyApplyForm.account,
                        currencyCode:this.currencyApplyForm.targetCurrency,
                        exchAmount:moneyToNumValue(this.requireAccAmount),
                        orderAmount:this.currencyApplyForm.applyAmount,
                        tradeFee:moneyToNumValue(this.requireFee),
                        tradePwd:this.currencyPopForm.password
                    }
                    console.log(obj)
                    classPost.swapParitiesPay(obj)
                        .then((res)=>{
                            console.log(res)
                            this.dialogVisible=false
                            // if(res.status=="1"){
                                this.$alert('换汇成功', '提示', {
                                    confirmButtonText: '确定',
                                    type: 'success'
                                });
                                this.resetForm('currencyApplyForm');
                                this.resetForm('currencyPopForm');
                                this.targetCurrencyList=[]
                                this.availableBalance=0
                                this.convertibleAmount=0
                                this.excRate=''
                                this.requireAccAmount=0.00
                                this.requireFee=0.00
                            // }else{
                            // }    
                        }).catch((err)=>{
                            this.pas='1'
                            this.info=err.data.message
                            this.$refs[formName].validateField('password')
                    })
                     
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            
        }
    }
  }
</script>
<style>
.currencyApply{
    background: #fff;
    margin-top:20px;
    padding:50px 0;
}
.currencyApply .currencyApplyForm{
    width:400px;
    margin-left:200px;
}
.currencyApply .el-select{
    width:100%;
}
.el-dialog__body{
    padding:0 50px;
}
.currencyAgree{
    background: #fff;
    margin-top:20px;
    padding:20px;
} 
.currencyAgree div{
    text-align: center;
    font-size:25px;
}
.currencyAgree h1{
    margin:20px 0;
}
.currencyAgree p{
    line-height: 30px;
}
.currencyAgree .back{
     margin:20px 0;
}
</style>