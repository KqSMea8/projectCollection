<template>
    <div class="withdrawApply">
        <el-form :model="withdrawApplyForm" :rules="rules" ref="withdrawApplyForm" label-width="110px" class="demo-withdrawApplyForm">
            <el-form-item label="提现账户：" prop="payerAcctcode">
                <el-select v-model="withdrawApplyForm.payerAcctcode" placeholder="请选择提现账户"  @change="accountSelectAfter(withdrawApplyForm.payerAcctcode)">
                	<el-option 
                		v-for='(item,index) of selectPutForwardAccount'
                		:key="index" 
                		:value="item.curCode"
                		:label = "`${item.curCodeName}(${item.curCode})`"
                	></el-option>
                </el-select>
                <span class="withdrawNumber">您今天还可以提现{{allowPaymentTimes}}次</span>
            </el-form-item>
            <el-form-item label="今日可提现：" prop="amountDay">
                <span>{{money}}{{currencyCode}}</span>
                <el-popover
                    placement="right-start"
                    width="300"
                    trigger="hover">
                        <div>
                            <p class="color">已扣除提现手续费{{ serviceCharge?serviceCharge:'**' }}{{ currencyCode?currencyCode:'**' }}</p>
                            <p class="color">可提现额小于账户余额，是由于存在提现周期T+N，具体请查看协议</p>
                        </div>
                    <img slot="reference" class="amountDayimgs" src="../../../static/icon-what.svg">
                </el-popover>
            </el-form-item>
            <el-form-item label="选择提现卡：" prop="card">
                <el-select v-model="withdrawApplyForm.card" placeholder="请选择提现银行卡" clearable no-data-text="请先选择提现账户">
                	<el-option v-for='(item,index) of bankCard' :key="index" :label="`${item.bankName}(尾号${item.bankAcctEND})`" :value="item.liquidateId"></el-option>
                </el-select>
                <router-link to="/home/fundManage/withdraw/cardManage" class="dcardManage">提现卡管理</router-link>
            </el-form-item>
            <el-form-item label="提现金额：" prop="amount" v-show="showHide">
                <el-input v-model="withdrawApplyForm.amount" clearable  placeholder='请输入提现金额'>
                    <template slot="append">{{withdrawApplyForm.payerAcctcode}}</template>
                </el-input>
                <span class="allWithdraw" @click="allWithdraw">全部提现</span>
                <el-popover
                    placement="right-start"
                    width="300"
                    trigger="hover">
                        <div>
                            <p class="color">我司出款金额与您操作的提现金额保持一致，如果实际到账金额小于提现金额，通常是由于中间行收取了手续费</p>
                        </div>
                    <img slot="reference" class="amountDayimg" src="../../../static/icon-what.svg">
                </el-popover>
            </el-form-item>
            <!-- <el-form-item label="提现手续费：" prop="charge">
               
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" size="small" :disabled = "disabled"  @click="submitForm('withdrawApplyForm')">提交</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            title="提现订单"
            :visible.sync="dialogVisible"
            :before-close="handleClose">
            <el-form :model="withdrawPopForm" :rules="frameRules" ref="withdrawPopForm" label-width="200px" class="demo-withdrawPopForm">
                <el-form-item :label="`您将从${aloneAccount}提现`">
                    <span> {{fmoney(withdrawApplyForm.amount)}} {{withdrawApplyForm.payerAcctcode}}</span>
                </el-form-item>
                <el-form-item label="手续费">
                    <span>{{ serviceCharge }}{{ currencyCode }}</span>
                </el-form-item>
                <el-form-item label="到账银行卡">
                    <span>{{aloneBank}}银行(尾号{{lastNumber}})</span>
                </el-form-item>
                <el-form-item label="支付密码" prop="password">
                    <el-input type="password" v-model.trim="withdrawPopForm.password" clearable placeholder="请输入支付密码" @change="pas=0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="withdrawApplyCancel">取消</el-button>
                <el-button type="primary" @click="isSuccess('withdrawPopForm')">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { Message } from 'element-ui' //element Message 组件引入
import { random, currencynum, moneyToNumValue, conversionNumber} from '../../util/commonality'
import classPost from '../../servies/classPost'
export default {
  data () {
  	//提现金额规则
  	    var moneyRule = (rule, value, callback) => {
            value = value.toString();
            let num = currencynum(this.withdrawApplyForm.payerAcctcode)
            let arr = value.indexOf('.')!==-1?value.split('.'):value
            const reg = /[^\d]/g
            if(!value){
                callback(new Error('请输入交易金额'))
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
                    }else if(value*1> moneyToNumValue(this.money)*1){
                      callback(new Error('您输入的提现金额大于可提现最大金额'));
                    }else{
                      callback()
                    }
                  }else{
                    if( value*1<=0 ){
                      callback(new Error('金额不能为0或者小于0'))
                    }else if(reg.test(value)){
                      callback('请输入合法的数值')
                    }else if(value*1> moneyToNumValue(this.money)*1){
                      callback(new Error('您输入的提现金额大于可提现最大金额'));
                    }else{
                        callback()
                    }
                  }
                 }

            }
        } 
  	//密码校验
	var passwordTest = (rule, value, callback) => {
		// const reg = /^[A-Za-z0-9]+$/
		if (!value) {
            callback('请输入密码');
        // }else if(!reg.test(value) ){
        // 	callback('请输入合法的数值')
        }else{
            if(this.pas==='1'){
                callback(this.info);
            }else{
                callback()
            }
        	// classPost.validatetradePwd({tradePwd:this.withdrawPopForm.password})
        	// 	.then((res)=>{
        	// 		if(res.code=="00000000"){
            //             callback();
            //         }else{
            //             callback(res.message);
            //         }
        	// 	})
        	// 	.catch((error)=>{
		    // 		callback(error.data.message);
		    // 	})
        }
	}

    return {
        pas:'',
        info:'',
    	initialCurCode:'', //初始币种
    	initialCurCodeName:'',//初始账户
    	disabled:false,  //按钮是否禁用
    	showHide:false,
    	selectPutForwardAccount:[], //提现账户
        dialogVisible:false,
        money:0,
        currencyCode:'',
        allowPaymentTimes:'**',   //当天提现次数
        dayLimitAmount:'', //每天限额
        serviceCharge:0,//提现手续费
        acctCode:'',
        maximumCashBalance:'',// 最大可提现余额 ,
        monthLimitAmount:'', // 每月限额 ,
        monthLimitTimes:'',// 当月允许交易的次数 ,
        payeeBankacctcode:'',// 收款方银行账号 ,
        payeeBankaccttype:'',  //收款方银行账号类型 ,
        payeeBankcity:'',   // 收款行所在城市代码 ,
        payeeBankcityname:'', // 收款行所在城市名称 ,
        payeeBankcode:'',// 收款银行代码 
        payeeBankname:'',//收款银行名称 ,
        payeeBankprovince:'',// 收款行所在省份代码 ,
        payeeBankprovincename:'',// 收款行所在省份名称 ,
        payeeName:'',// 收款方名称 ,
        payeeOpeningbankname:'', // 收款方开户行名称 ,
        payerName:'',// 付款方名称 ,
        paymentReason:'',// 付款理由 ,
        tradeType:'',
        withdrawPopForm:{
            password:'',
        },
        acccount:'',
        bankCard:[],//银行卡
        aloneAccount:'',   //弹框账户名称
        aloneBank:'',  //弹框银行卡
        lastNumber:'',
        bankInfo:'',
        withdrawApplyForm: {
          payerAcctcode: '',
          amountDay:'',
          card: '',
          amount:'',
          charge:'',
        },
        rules: {
          payerAcctcode: [
            { required: true, message: '请选择提现账户', trigger: 'change' },
          ],
          card: [
            { required: true, message: '请输入提现银行卡', trigger: 'change' },
          ],
          amount: [
            { required: true, validator: moneyRule, trigger: 'change' }
          ],
        },
        //
        frameRules:{
        	password: [
            	{ required: true, validator: passwordTest, trigger: 'blur' }
          	],
        },
        curCode:''
    }
  },

  created: function () {
    if(this.$route.query.id!=null){
        this.initialCurCode = this.$route.query.id;
        this.withdrawApplyForm.payerAcctcode=this.initialCurCode;
        if(this.withdrawApplyForm.payerAcctcode!=''){
            this.showHide = true;
        }
        var obj={
            currencyCode: this.initialCurCode
        }
        classPost.accountSelectAfterCall(obj)
			.then((res)=>{
				if(res.status=="1"){  
					this.money = conversionNumber(res.data.maximumCashBalance/1000);
					this.currencyCode = res.data.currencyCode;
					this.allowPaymentTimes = res.data.allowPaymentTimes;  //提现次数
					this.dayLimitAmount = res.data.dayLimitAmount;   //每天限额
					this.maximumCashBalance = res.data.maximumCashBalance;
					this.monthLimitAmount=res.data.monthLimitAmount;// 每月限额 ,
					this.monthLimitTimes = res.data.monthLimitTimes;
					this.serviceCharge = res.data.requestFee;
					
					if( this.allowPaymentTimes === 0 ){
						this.disabled = true ;
					}
				}else{
                    this.$alert('<p>'+res.message+'</p>', '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                        callback: action => {
                            this.resetForm('withdrawApplyForm');
                            this.money=0
                            this.serviceCharge=0
                        }
                    });
                }
				console.log(res);
			})
			.catch()
    }
    this.putForwardAccount();
    this.putForwardCard();
    
  },

  methods: {
    fmoney(s, n=2){   
        n = n > 0 && n <= 20 ? n : 2;   
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
        let l = s.split(".")[0].split("").reverse(),   
        r = s.split(".")[1],
        t = "";   
        for (var i = 0; i < l.length; i ++ ) {   
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
        }   
        return t.split("").reverse().join("") + "." + r;   
    },
  	//提现账户选择列表
  	putForwardAccount(){
  		var obj = {
  			acctType: 1  //基本户
  		}
  		classPost.accountSelect(obj)
  			.then((res)=>{
  				if(res.code == "00000000"){
  					console.log(res);
  					this.selectPutForwardAccount = res.data;
  				}
  			})
  			.catch()
  	},
  	//账户选择后掉用接口
  	accountSelectAfter(obj){
  		let accountCode = this.withdrawApplyForm.payerAcctcode;
  		console.log(obj);
  		var data = {
  			currencyCode:obj
  		}
		if( obj == accountCode ){
			 this.showHide = true;
		}
		classPost.accountSelectAfterCall(data)
			.then((res)=>{
				if(res.status=="1"){  
					this.money = conversionNumber(res.data.maximumCashBalance/1000);
					this.currencyCode = res.data.currencyCode;
					this.allowPaymentTimes = res.data.allowPaymentTimes;  //提现次数
					this.dayLimitAmount = res.data.dayLimitAmount;   //每天限额
					this.maximumCashBalance = res.data.maximumCashBalance;
					this.monthLimitAmount=res.data.monthLimitAmount;// 每月限额 ,
					this.monthLimitTimes = res.data.monthLimitTimes;
					this.serviceCharge = res.data.requestFee;
					
					if( this.allowPaymentTimes === 0 ){
						this.disabled = true ;
					}
				}else{
                    this.$alert('<p>'+res.message+'<p>', '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                        callback: action => {
                            this.resetForm('withdrawApplyForm');
                            this.money=0
                            this.serviceCharge=0
                        }
                    });
                }
				console.log(res);
			})
			.catch()
  	},
  	//请选择提现卡
 	putForwardCard(){
 		classPost.queryCard({})
 			.then((res)=>{
 				if(res.code=='00000000'){
 					this.bankCard = res.data.dataList;
 				}
 			})
 			.catch()
 	},
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
            	//传账户名称
            	this.acccount = this.selectPutForwardAccount.filter(item=>item.curCode==this.withdrawApplyForm.payerAcctcode);
            	this.aloneAccount = this.acccount[0].curCodeName;      //传银行卡
            	this.acctCode = this.acccount[0].acctCode; 
            	this.bankInfo = this.bankCard.filter( item => item.liquidateId == this.withdrawApplyForm.card );
            	this.aloneBank = this.bankInfo[0].bankName;				//银行名称
            	this.lastNumber = this.bankInfo[0].bankAcctEND;			//后四位
            	this.payeeBankacctcode = this.bankInfo[0].bankAcct; // 收款方银行账号 ,
            	this.payeeBankaccttype=this.bankInfo[0].accountMode; //收款方银行账号类型 ,
            	this.payeeBankcity=this.bankInfo[0].city;    // 收款行所在城市代码 ,
            	this.payeeBankcityname=this.bankInfo[0].city; // 收款行所在城市名称 ,
            	this.payeeBankcode = this.bankInfo[0].bankId;  // 收款银行代码 ,
            	this.payeeBankname=this.bankInfo[0].bankName;  //收款银行名称 ,
            	this.payeeBankprovince= this.bankInfo[0].province; // 收款行所在省份代码 ,
            	this.payeeBankprovincename= this.bankInfo[0].province;// 收款行所在省份名称 ,
				this.payeeName= this.bankInfo[0].acctName;// 收款方名称 ,
				this.payeeOpeningbankname= this.bankInfo[0].bigBankName; // 收款方开户行名称 ,
				this.payerName= this.bankInfo[0].acctName;// 付款方名称 ,
				/*this.paymentReason= this.bankInfo[0].// 付款理由 ,*/
				this.tradeType= this.bankInfo[0].tradeType;// 0对私1对公
                this.dialogVisible=true ;
            } else {
	            console.log('error submit!!');
	            return false;
            }
        });
    },
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
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    allWithdraw(){
        this.withdrawApplyForm.amount=moneyToNumValue(this.money)
    },
    cardManage(){
        
    },
    handleClick(tab, event) {
        console.log(tab, event);
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    withdrawApplyCancel(){
        this.dialogVisible = false
        this.resetForm('withdrawPopForm')
    },
    isSuccess(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {
                let obj = {
                    acctCode: this.acctCode, //提现账户 
                    allowPaymentTimes: this.allowPaymentTimes, //当前允许付款次数 ,
                    currencyCode: this.currencyCode, //币种 ,
                    dayLimitAmount:this.dayLimitAmount,// 每天限额 
                    maximumCashBalance: this.maximumCashBalance, // 最大可提现余额 ,
                    monthLimitAmount: this.monthLimitAmount, // 每月限额 ,
                    monthLimitTimes: this.monthLimitTimes, // 当月允许交易的次数 ,
                    payeeBankacctcode:this.payeeBankacctcode,// 收款方银行账号 ,
                    payeeBankaccttype:this.payeeBankaccttype, //收款方银行账号类型 ,
                    payeeBankcity:this.payeeBankcity,// 收款行所在城市代码 ,
                    payeeBankcityname:this.payeeBankcityname,// 收款行所在城市名称 ,
                    payeeBankcode:this.payeeBankcode, // 收款银行代码 ,
                    payeeBankname:this.payeeBankname, //收款银行名称 ,
                    payeeBankprovince:this.payeeBankprovince, // 收款行所在省份代码 ,
                    payeeBankprovincename:this.payeeBankprovincename,// 收款行所在省份名称 ,
                    payeeName:this.payeeName,// 收款方名称 ,
                    payeeOpeningbankname:this.payeeOpeningbankname, // 收款方开户行名称 ,
                    payerName:this.payerName,// 付款方名称 ,
                    /*paymentReason:this.paymentReason,// 付款理由 ,*/
                    requestAmount:this.withdrawApplyForm.amount , //提现金额 ,
                    tradePwd:this.withdrawPopForm.password,// 支付密码 ,
                    tradeType:this.tradeType// 0对私1对公
                }
                classPost.transactionPassword(obj)
                    .then((res)=>{
                        if(res.status == '1'){
                            this.$alert('您的提现申请己成功，请关注银行卡余额变动', '提现成功', {
                                confirmButtonText: '确定',
                                type:'success',
                                callback: action => {
                                    this.dialogVisible=false
                                    this.resetForm('withdrawApplyForm');
                                    this.resetForm('withdrawPopForm');
                                    this.money=0
                                    this.serviceCharge=0
                                    this.currencyCode=''
                                    this.allowPaymentTimes='**'
                                    // this.$message({
                                    //   type: 'success',
                                    //   message: `action: ${ action }`
                                    // });
                                }
                            });
                        }else{
                            this.$alert( res.message, '提现失败', {
                                confirmButtonText: '确定',
                                type:'error',
                                callback: action => {
                                    this.dialogVisible=false
                                    // this.$message({
                                    //   type: 'success',
                                    //   message: `action: ${ action }`
                                    // });
                                }
                            });
                        }
                    })
                    .catch((err)=>{
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
.withdrawApply{
    margin-top:20px;
    background: #fff;
}
.withdrawApply{
    padding:50px 50% 50px 15%;
}
.withdrawApply .el-select{
    width:100%;
}
.withdrawApply .withdrawNumber{
    width: 300px;
    position: absolute;
    right: -330px;
    top: 0px;
    color: rgba(0,0,0,.5);
    cursor: pointer;
}
.amountDayimg{
   display: block;
   margin-top:10px;
}
.amountDayimgs{
    display: block;
}

.dcardManage{
    position: absolute;
    right: -100px;
    top: 0px;
    color: #1890FF;
    cursor: pointer;
    text-decoration:none;
    border:0;
}
.withdrawApply .allWithdraw{
    position: absolute;
    right: -85px;
    top: 0px;
    color: #1890FF;
    cursor: pointer;
}  
.el-dialog__body{
    padding:0 140px;
}
.color{
    color:RGBA(0, 0, 0, 0.65);
}
</style>


