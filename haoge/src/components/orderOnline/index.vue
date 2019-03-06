<template>
  <div class="orderonline">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="商品名称：" prop="productName">
            <el-input  clearable placeholder="请输入商品名称" v-model="ruleForm.productName"></el-input>
          </el-form-item>
          <el-form-item label="商品描述：" prop="describe">
            <el-input  clearable placeholder="请输入商品描述" v-model="ruleForm.describe"></el-input>
          </el-form-item>
           <el-form-item label="商品网站域名：" prop="website">
              <el-select v-model="ruleForm.website" placeholder="请选择商品网站域名">
                <el-option v-for="(item,index) of allwebsite" :key="index" :label="item.url" :value="item.url"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="商户订单号：" prop="orderNumber">
            <el-input clearable placeholder="请输入商户订单号" v-model="ruleForm.orderNumber"></el-input>
            <span v-if="autoflag" @click="autoNumber" class="auto hand">自动生成</span>
          </el-form-item>
          <el-form-item label="交易币种：" prop="currency">
            <el-select @change="checkAmount" v-model="ruleForm.currency" placeholder="请选择交易币种">
              <el-option v-for="(item,index) of allcurrent" :key="index" :label="`${item.zhCnMessage}(${item.alphaCode})`" :value="item.alphaCode"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="交易金额：" prop="amount">
            <el-input clearable placeholder="请输入交易金额" v-model="ruleForm.amount">
               <template slot="append">{{ruleForm.currency}}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="交易类型：" prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择交易类型">
              <el-option label="EDC-按交易币种支付" value="EDC"></el-option>
              <el-option label="DCC-按卡本币支付" value="DCC"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="卡号：" prop="cardcode">
            <el-input clearable placeholder="请输入卡号" v-model="ruleForm.cardcode"></el-input>
          </el-form-item>
          <el-form-item label="持卡人姓名：" class="father" required>
              <el-form-item class="small" prop="firstname">
                <el-input clearable placeholder="FirstName" v-model="ruleForm.firstname"></el-input>
              </el-form-item>
              <el-form-item class="small" prop="lastname">
                <el-input clearable placeholder="LastName" v-model="ruleForm.lastname"></el-input>
              </el-form-item>
          </el-form-item>
           <el-form-item label="有效期：" class="father" required>
              <el-form-item class="small" prop="month">
                <el-select @change="lookrule" v-model="ruleForm.month" placeholder="月">
                  <el-option v-for="(item,index) of monthnum" :key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="small" prop="year">
                <el-select @change="lookrule" id="yes" v-model="ruleForm.year" placeholder="年">
                  <el-option v-for="(item,index) of year" :key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
          </el-form-item>
          <el-form-item class="cvv" label="CVV验证码：" prop="trycode">
              <el-input inlength="3" clearable placeholder="请输入CVV验证码" v-model="ruleForm.trycode"></el-input>
               <p class="error">如有CVV验证码，请务必输入，否则容易会导致下单失败</p>
            </el-form-item>
          <el-form-item class="bts">
            <el-button type="primary" @click="submitForm('ruleForm')">提交订单</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
  </div>
</template>

<script>
import classPost from '../../servies/classPost'
import { random, currencynum } from '../../util/commonality'
export default {
    data() {
      var na = (rule,value,callback)=>{
        var reg=/^[a-zA-Z]+$/
        if(!value){
          callback('请输入您的名字')
        }else{
          if(!reg.test(value)){
            callback('请输入正确的名字')
          }else{
            callback()
          }
        }
      }
      var isNum = (rule, value, callback) => {
        let reg = /[^\d]/g
        if(!reg.test(value)){
          callback()
        }else{
          callback('请输入正确的号码')
        }
      }
      var me = (rule,value,callback) =>{
        var reg=/^[a-zA-Z]+$/
        if(!value){
          callback('请输入您的姓氏')
        }else{
          if(!reg.test(value)){
            callback('请输入正确的姓氏')
          }else{
            callback()
          }
        }
      }
      var time =  (rule, value, callback) => {
        let _this = this
        if(!value){
          callback(new Error('请选择正确时间'))
        }else{
          if(this.ruleForm.year&&this.ruleForm.month){
             let date = new Date(this.ruleForm.year,this.ruleForm.month).getTime()
             let nowdate = new Date().getTime()
             if(date-nowdate<=0){
               callback('请选择正确的有效期')
             }else{
               callback()
             }
          }
        }
      }
      var checkamount = (rule, value, callback) => {
        let num = currencynum(this.ruleForm.currency)
        let arr = value.indexOf('.')!==-1?value.split('.'):value
        const reg = /[^\d]/
        if(this.ruleForm.currency==''){
          callback(new Error('请先选择交易币种'))
        }else{
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
                if(arr.length > 2 || num < arr[1].length || reg.test(arr[1])){
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
        monthnum:[1,2,3,4,5,6,7,8,9,10,11,12],
        autoflag:true,
        allwebsite:'',
        allcurrent: JSON.parse(localStorage.current),
        ruleForm: {
          productName:'',
          describe:'',
          website:'',
          orderNumber:'',
          currency:'',
          amount:'',
          status:'EDC',
          cardcode:'',
          firstname:'',
          lastname:'',
          month:'',
          year:'',
          trycode:''
        },
        rules: {
          productName: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 1, max: 256, message: '请输入正确商品名称', trigger: 'blur' }
          ],
          describe: [
            { required: true, message: '请输入商品描述', trigger: 'blur' },
            { min: 1, max: 2000, message: '请输入正确商品描述', trigger: 'blur' }
          ],
          website:[
            { required: true, message: '请选择商品网址域名', trigger: 'blur' }
          ],
          orderNumber:[
            { required: true, message: '请输入商户订单号', trigger: 'blur' },
            { min: 1, max: 32, message: '请输入正确商户订单号', trigger: 'blur' },
            {validator:isNum,trigger:'blur'}
          ],
          currency:[
            { required: true, message: '请选择交易币种', trigger: 'blur' },
          ],
          status:[
            {required: true, message:'请选择交易类型',trigger:'blur'}
          ],
          amount:[
             { required: true, validator: checkamount, trigger: 'blur' }
          ],
          cardcode:[
            { required: true, message: '请输入卡号', trigger: 'blur' },
            { min: 4, max: 64, message: '请输入正确卡号', trigger: 'blur' },
            { validator:isNum, trigger:'blur'}
          ],
          firstname:[
            { required: true, validator: na, trigger: 'blur' },
            { min: 2, max: 64, message: '请输入正确的姓氏', trigger: 'blur' }
          ],
          lastname:[
            { required: true, validator: me, trigger: 'blur' },
            { min: 2, max: 64, message: '请输入正确的名字', trigger: 'blur' }
          ],
          month:[
             { required: true, validator: time, trigger: 'change' },
          ],
          year:[
             { required: true, validator: time, trigger: 'change' },
          ],
          trycode:[
            { message: '请输入CVV验证码', trigger: 'blur' },
            { min: 3, max: 4, message: '请输入正确的CVV验证码', trigger: 'blur' },
            {validator:isNum,trigger:'blur'}
          ]
        }
      };
    },
    computed:{
      year(){
        var date = new Date().getFullYear()
        let arr = []
        for(var i=date;i<date+22;i++){
          arr.push(i)
        }
        return arr
      },
      postdata(){
        return {
          cardExpirationMonth:this.ruleForm.month>=10?this.ruleForm.month:'0'+this.ruleForm.month,
          cardExpirationYear:this.ruleForm.year.toString().substr(2,2),
          cardHolderFirstName:this.ruleForm.firstname,
          cardHolderLastName:this.ruleForm.lastname,
          cardNo:this.ruleForm.cardcode,
          currencyCode:this.ruleForm.currency,
          siteId:this.ruleForm.website,
          orderId:this.ruleForm.orderNumber,
          goodsName:this.ruleForm.productName,
          goodsDesc:this.ruleForm.describe,
          orderAmount:this.ruleForm.amount,
          dcc:this.ruleForm.status,
          cvv:this.ruleForm.trycode
        }
      }
    },
    methods: {
      lookrule(){
        this.$refs['ruleForm'].validateField("month");
        this.$refs['ruleForm'].validateField("year");
      },
      checkAmount(){
        this.$refs['ruleForm'].validateField("amount");
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let load = this.$loading({
              lock: true,
              background:'rgba(0,0,0,.4)'
            })
            classPost.addVcc(this.postdata)
              .then((res)=>{
                  load.close()
                  this.$alert(`您的订单：${this.ruleForm.orderNumber}交易成功`, '交易成功', {
                    confirmButtonText: '确定',
                    type: 'success'
                  })
                  .then(()=>{
                    this.$refs[formName].resetFields()
                  })
              })
              .catch((err)=>{
                load.close()
                console.log(err)
              })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      get_website(){
        classPost.get_websit({})
          .then((res)=>{
            this.allwebsite=res.data.dataList
          })
          .catch((err)=>{
            console.log(err)
          })
      },
      autoNumber(){
        let date = new Date().getTime().toString()
        let num = random(19-date.length)
        date = `${date}${num}`
        this.autoflag=false
        this.ruleForm.orderNumber = date
        this.$refs['ruleForm'].validateField("orderNumber");
      }
    },
    mounted() {
      this.autoflag=true
      this.get_website()
    },
}

</script>

<style>
.orderonline{
  background: rgba(255, 255, 255, 1);
  padding: 20px;
  margin-top: 20px;
}
.orderonline .el-form-item .auto{
  position: absolute;
  right: -100px;
  top: 0;
  color:rgba(24, 144, 255, 1)
}
.orderonline .demo-ruleForm{
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.orderonline .demo-ruleForm .el-input .el-input__inner{
   height: 32px;
}
.orderonline .demo-ruleForm .el-input{
  width: 272px;
}
.orderonline .demo-ruleForm .el-form-item__label{
  width: 110px;
}
.orderonline .demo-ruleForm .el-form-item__content{
  width: 272px;
  display: flex;
  justify-content: space-between;
}
.orderonline .demo-ruleForm .el-form-item__content::before{
  content: none;
}
.orderonline .demo-ruleForm .el-form-item__content::after{
  content: none;
}
.orderonline .demo-ruleForm .el-form-item__content .small{
  width: 46%;
  margin-bottom: 0;

}
.orderonline .demo-ruleForm .el-form-item__content .small .el-form-item__content{
  width: auto;
}
.orderonline .demo-ruleForm .small .el-input {
  width: auto;
}
.orderonline .demo-ruleForm .cvv{
  position: relative;
  margin-bottom: 30px;
}
.orderonline .error{
  bottom:-28px;
  position: absolute;
  color:#f56c6c;
  font-size: 10px;
  text-align: right;
  word-break:keep-all;
  white-space:nowrap; 
}
.orderonline .demo-ruleForm .bts .el-form-item__content{
  justify-content: center;
}
</style>
