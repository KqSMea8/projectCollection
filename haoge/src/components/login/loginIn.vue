<template>
  <div id="box" v-loading="loading" element-loading-background="rgba(255,255,255,1)">
      <div class="form">
        <!-- <LANG class="hlang hand"/> -->
        <Logo class="cen"></Logo>
          <el-form class="w300" :label-position="labelPosition" ref="numberValidateForm" :model="formLabelAlign">
              <el-form-item
                prop="email"
                label=""
                :rules="[{ required: true, message: nameerr, trigger: 'blur' }]">
                <el-input
                  :placeholder="$t('LANG.loginInfo.nickname')"
                  clearable
                  v-model="formLabelAlign.email">
                  <img slot="prefix" src="../../assets/icon/icon-Email.svg"  width="15" height="12">
                </el-input>
              </el-form-item>
              <el-form-item
                prop="region"
                label=""
                :rules="[{ required: true, message: nicknameerr, trigger: 'blur' }]">
                <el-input
                  :placeholder="$t('LANG.loginInfo.name')"
                  clearable
                  v-model="formLabelAlign.region">
                  <img slot="prefix" src="../../assets/icon/iocn-admin.svg"  width="15" height="12">
                </el-input>
              
              </el-form-item>
              <el-form-item
                prop="pass"
                label=""
                :rules="[{ required: true, message:passerr, trigger: 'blur' }]">
              <el-input type="password" v-model="formLabelAlign.pass" clearable :placeholder="$t('LANG.loginInfo.password')">
                 <img slot="prefix" src="../../assets/icon/icon-secret.svg"  width="15" height="12">
              </el-input>
              </el-form-item>
              <div class="verify">
                <el-form-item
                prop="verify"
                class="btnphone"
                label=""
                :rules="[{ required: true, message:vererr, trigger: 'blur' }]">
                <el-input v-model="formLabelAlign.verify"  clearable :placeholder="$t('LANG.loginInfo.verification')"></el-input>
                </el-form-item>
                <img class="picvalid" :src="piccode" @click="getCode">
              </div>
              <el-button class="w300 mt20" @click="login('numberValidateForm')" size="small" type="primary">{{$t('LANG.loginInfo.logbtn')}}</el-button>
          </el-form>
           <p class="footer">Copyright © 2015-2018 <span @click="website" class="hand">iPayLinks. </span> All rights reserved.</p>
      </div>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import Logo from '../public/logo'
import LANG from '../public/lang'
import classPost from '../../servies/classPost'
import axios from 'axios'
export default {
  data () {
    return {
      labelPosition:"right",
      piccode:'',
      loading:false,
      formLabelAlign: {
          email: '',
          region: '',
          pass: '',
          verify:''
        },
    }
  },
  components:{
    Logo,
    LANG
  },
  computed:{
    nameerr(){
      return this.$t('LANG.loginInfo.nicenameerr')
    },
    nicknameerr(){
      return this.$t('LANG.loginInfo.nameerr')
    },
    vererr(){
      return this.$t('LANG.loginInfo.varerr')
    },
    passerr(){
      return this.$t('LANG.loginInfo.passerr')
    },
    data(){
      return {
        "loginAccount": this.formLabelAlign.email,
        "loginDeviceId": localStorage.deviceId,
        "loginIp": "",
        "loginName": this.formLabelAlign.region,
        "loginPwd": this.formLabelAlign.pass,
        "loginType": "",
        "rememberMe": this.checked,
        "verifyCode": this.formLabelAlign.verify
      }
    }
  },
  methods: {
    login (formName) {
      let verification = this.verification
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading=true
          classPost.login(this.data)
          .then((res)=>{
              this.loading=false
              localStorage.data = JSON.stringify(res.data)
              localStorage.uname = res.data.loginName
              sessionStorage.uname = res.data.loginName
              localStorage.email = this.formLabelAlign.email
              localStorage.region = this.formLabelAlign.region
              this.$router.push('/home')    
          }).catch((err)=>{
            console.log(err)
            this.loading=false
            this.getCode()
          })
        } else {
          return false;
        }
      });
    },
    website(){
      window.open("http://www.ipaylinks.com")
    },
    // 获取验证码
    getCode () {
      classPost.getVerify()
        .then((res)=>{
            let blob = new Blob([res], {type: "application/vnd.ms-excel"}); 
　　　　　   let objectUrl = URL.createObjectURL(blob); 
            this.piccode = objectUrl
        })
    },
  },
  mounted(){
    if(localStorage.email){
      this.formLabelAlign.email = localStorage.email;
      this.$refs['numberValidateForm'].validateField('email');
    }
    if(localStorage.region){
      this.formLabelAlign.region = localStorage.region;
      this.$refs['numberValidateForm'].validateField('region');
    }
    sessionStorage.removeItem('contrast')
    this.getCode()
    this.$eventBus.$on('try',()=>{
      this.$refs['numberValidateForm']&&this.$refs['numberValidateForm'].resetFields()
    })
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
.mt20{
  margin-top:20px
}
#box{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.form{
  background: white;
  position: absolute;
  left: 50%;
  margin-left: -250px;
  top: 20%;
  padding: 50px 64px 60px;
  box-shadow: 0px 4px 8px 2px rgba(0, 0, 0, 0.22);
  border-radius: 5px;
}
.btnphone{
  width: 70%;
}
.w300{
  width: 368px;
}
#box .verify{
  display:flex;
  justify-content: space-between;
}
#box .el-autocomplete{
  width: 100%;
}
#box .verify .picvalid{
  margin-top: 3px;
  height: 32px;
  margin-left: 14px;
  font-size: 16px;
  display: block;
  text-align: center;
  padding: 0;
  cursor:pointer;
}
#box .forget{
  color:rgba(24, 144, 255, 1);
  cursor: pointer;
}
.cen{
  margin: 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cen .hj{
  display: none!important;
}
.form .footer{
  width: 100%;
  position: absolute;
  text-align: center;
  left: 50%;
  font-size: 12px;
  bottom: -3%;
  transform: translate3d(-50%,50px,0);
  color: rgba(255, 255, 255, 1);
  background: transparent;
}
#box .form .footer span{
  color:rgba(248, 231, 28, 1)
}
</style>
