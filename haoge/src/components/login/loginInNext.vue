<template>
  <div id="box">
      <div class="form">
        <LANG class="hlang"/>
        <Logo class="cen"></Logo>
          <el-form class="w300" :label-position="labelPosition" ref="numberValidateForm" :model="formLabelAlign">
              <el-form-item
                prop="email"
                label=""
                :rules="[{ required: true, message: '登录账号/邮箱不能为空', trigger: 'blur' }]">
              <el-input @blur="isDevice" class="mt" v-model="formLabelAlign.email" clearable placeholder="登录账号/邮箱"></el-input>
              </el-form-item>
              <el-form-item
                prop="region"
                label=""
                :rules="[{ required: true, message: '管理员/操作员名称不能为空', trigger: 'blur' }]">
              <el-input @blur="isDevice" class="mt" v-model="formLabelAlign.region" clearable placeholder="管理员/操作员名称"></el-input>
              </el-form-item>
              <el-form-item
                prop="pass"
                label=""
                :rules="[{ required: true, message: '登录密码不能为空', trigger: 'blur' }]">
              <el-input class="mt" type="password" v-model="formLabelAlign.pass" clearable placeholder="登录密码"></el-input>
              </el-form-item>
              <div v-if="!verification" class="mt verify">
                <el-form-item
                prop="verify"
                class="btnphone"
                label=""
                :rules="[{ required: true, message: '手机验证码不能为空', trigger: 'blur' }]">
                <el-input v-model="formLabelAlign.verify"  clearable placeholder="手机验证码"></el-input>
                </el-form-item>
                <el-button class="h40 btn" @click="getCode" :disabled="showtxt" type="primary">{{showtxt?num+"秒后重新获取":"获取手机验证码"}}</el-button>
              </div>
              <div class="remuber mt"><el-checkbox  v-model="checked">自动登录</el-checkbox><span class="forget" @click="forget">忘记密码</span></div>
              <el-button class="mt w300 h40" @click="login('numberValidateForm')" type="primary">登录</el-button>
          </el-form>
           <p class="footer">Copyright©2018 <span>ipayLinks</span>  All Rights Reserved</p>
      </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Logo from '../public/logo'
import base64 from 'js-base64'
import LANG from '../public/lang'
import classPost from '../../servies//classPost'
import axios from 'axios'
export default {
  data () {
    return {
      labelPosition:"right",
      showtxt:false,// 点击获取验证码切换文字开启计时器
      checked:false,// 自动登录的是否被选中
      verification:true, // 判断用户是否为信任用户
      num:60,
      formLabelAlign: {
          email: 'awfawf',
          region: 'awgagwgfaw',
          pass: 'awfgawfawef',
          verify:''
        },
    }
  },
  components:{
    Logo,
    LANG
  },
  computed:{
    accessed(){
      return {
        "deviceId": localStorage.deviceId,
        "loginAccount": this.formLabelAlign.email,
        "operatorName": this.formLabelAlign.region
      }
    },
    vaildcode(){
      return {
        "clientIp": "string",
        "deviceId": localStorage.deviceId,
        "loginAccount": this.formLabelAlign.email,
        "loginName": this.formLabelAlign.region
      }
    },
    data(){
      return {
        "loginAccount": this.formLabelAlign.email,
        "loginDeviceId": localStorage.deviceId,
        "loginIp": "string",
        "loginName": this.formLabelAlign.region,
        "loginPwd": this.formLabelAlign.pass,
        "loginType": "string",
        "rememberMe": this.checked,
        "smsCode": this.formLabelAlign.verify
      }
    }
  },
  created: function () {
      Message(this.$t('LANG.loginInfo.login')) // 生命周期中使用国际化
  },
  methods: {
    forget(){
      console.log(1)
    },
    isDevice(){
      let email = this.formLabelAlign.email
      let region = this.formLabelAlign.region
      if(email !=='' && region !== ''){
        classPost.isdevice(this.accessed)
          .then((res)=>{
            if(res.code!==200||res.data.responseCode!=='000000000'||!res.data.result){
              this.verification=false
              console.log(1)
            }
            console.log(res)
          }).catch((err)=>{
            console.log(err)
          })
      }
    },
    login (formName) {
      let verification = this.verification
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
             lock: true,
             background:'rgba(255,255,255,1)'
          })
          classPost.login(this.data)
          .then((res)=>{
            if(res.code=='200'){
              loading.close()
               localStorage.accessToken = res.data.token
              console.log(this.setuser())
                if(!verification){
                  let obj = {
                    "deviceId": localStorage.deviceId,
                    "merchantId": res.data.merchantId,
                    "operatorId": res.data.operatorId
                  }
                  this.$confirm('若信任，当你下次登录时，系统将不再要求你提供验证码。', '是否信任此浏览器', {
                    confirmButtonText: '信任',
                    cancelButtonText: '稍后处理',
                    type: 'warning',
                    center: true
                  }).then(() => {
                    classPost.device(obj)
                      .then((res)=>{
                        if(res.code=='200'){
                          // this.$router.push('/home')
                        }
                      }).catch((err)=>{
                        console.log(err)
                      })
                  }).catch(() => {
                    // this.$router.push('/home')
                  });
                }else{

                  // this.$router.push('/home')
                }     
            }else{
              this.setuser()
              this.$refs[formName].resetFields()
              this.verification=true
              this.num=60
              this.checked=false
              this.showtxt=false
              Message(res.message)
              loading.close()
            }  
          }).catch((err)=>{
            console.log(err)
          })
        } else {
          return false;
        }
      });
    },
    // 获取验证码
    getCode () {
      var _this = this
      this.showtxt = true;
      let jsq = setInterval(() => {
          if (_this.num <= 0){
            _this.num=60
            _this.showtxt=false
            clearInterval(jsq);
          }
          _this.num--;
      }, 1000)
      classPost.getValidCode(this.vaildcode)
        .then((res)=>{
          console.log(res)
        }).catch((err)=>{
          console.log(err)
        })
    },
    setuser(){
      let num = Math.floor(Math.random()*100)
      let str = `${this.formLabelAlign.email}&&${this.formLabelAlign.region}&&${this.formLabelAlign.pass}`,
          passStr = new Buffer(str);
      passStr = `${num}.${passStr.join('.')}.${num}`
      return passStr
    },
  
  },
  mounted(){
    
    // var a =base64.encode('151516')
    // var b = new Buffer(a.split('.').toString())
    console.log(base64)
    // classPost.autologin({})
    //   .then(()=>{

    //   }).catch(()=>{

    //   })
   
  }
}

</script>


<style>
#box .form .hlang{
  position: absolute;
  right: 0;
  top: -40px;
  color: rgba(255, 255, 255, 1);
  border:1px solid rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  width: 85px;
  height: 28px;
  line-height: 26px;
  text-align: center;
}
.form .hlang:hover{
  cursor: pointer;
}
#box{
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url('../../assets/images/back.png');
  background-size:100% 100%;
  background-repeat: no-repeat;
}
.form{
  background: white;
  position: absolute;
  left: 50%;
  width: 500px;
  margin-left: -250px;
  top: 20%;
  padding: 50px 64px 60px;
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.22);
  border-radius: 5px;
}
.user{
  display: block;
  text-align: center;
  font-size: 16px;
  color:#000000;
}
.btnphone{
  width: 70%;
}
.mt{
  margin-top: 20px;
}
.w300{
  width: 368px;
}
#box .el-form-item{
  margin-bottom:0 ;
}
#box .el-form-item__error{
  position: static;
}
#box .h40{
  height: 40px;
}
#box .verify{
  display:flex;
  justify-content: space-between;
}
#box .remuber{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#box .remuber span{
  font-size: 14px;
}
#box .verify .btn{
  margin-left: 14px;
  width: 122px;
  font-size: 16px;
  color:rgba(24, 144, 255, 1);
  background: rgba(236, 245, 255, 1);
  border: 1px solid rgba(179, 216, 255, 1);
  text-align: center;
  padding: 0;
}
#box .forget{
  color:rgba(24, 144, 255, 1);
}
#box .forget:hover{
  cursor: pointer;
}
.cen{
  margin: 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form .footer{
  width: 100%;
  position: absolute;
  text-align: center;
  left: 50%;
  font-size: 12px;
  bottom: -50px;
  transform: translate3d(-50%,50px,0);
  color: rgba(255, 255, 255, 1);
  background: transparent;
}
#box .form .footer span{
  color:rgba(248, 231, 28, 1)
}
</style>
