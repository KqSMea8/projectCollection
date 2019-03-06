<template>
    <div id='login'>
      <div class="mock">
        <h1>学而思培优数据平台</h1>
        <div class="m">
          <el-form class="demo-ruleForm">
            <el-form-item>
              <el-input type="text" v-model="fromData.username" class="ipt"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="password" v-model="fromData.password" class="ipt"></el-input>
            </el-form-item>
            <p class='user' v-if="flag">账号或密码错误请重新输入</p>
            <el-form-item>
              <el-button type="primary" @click="checkuser">提交</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
</template>

<script>
// import fetcher from '../../fetcher'
// import particlesJS from 'particles.js';
// console.log(particlesJS);
// import { mapActions } from 'vuex';
export default {
    name: 'login',
    data () {
        return {
            fromData: {},
            userReg: /[a-zA-z0-9]{3-10}/,
            flag: true
        };
    },
    mounted () {
        particlesJS.load('login', '../../../src/particles/particles.json');
    },
    methods: {
        // ...mapActions(['munuList']),
        checkuser () {
            this.$http.post('http://localhost:8084/login', this.fromData).then((data) => {
                // res.json().then(data => {
                if (Number(data.code)) {
                    // console.log(data);
                    localStorage['token'] = data.token;
                    localStorage['username'] = this.fromData.username;
                    this.$router.push('/home');
                    // this.munuList();
                }
                // });
            });
        }
    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.el-input {
  width: 350px;
}

.el-form-item {
  margin: 10px 0;
}

.ipt {
  margin: 10px 0;
}

label {
  color: #fff;
}
/* #particles{
      position: absolute;
      width: 100%;
      height: 100%;
     background: url('../../assets/page.jpg');  
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50% 50%;
} */
.demo-ruleForm {
  width: 410px;
  height: 371px;
}

.user {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  color: #FF4040;
  letter-spacing: 1.1px;
  height: 30px;
  line-height: 30px;
}

  #login {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: url('../../assets/page.jpg');  
  background-size: cover;
  text-align: center;
}  
/* .particles-js-canvas-el{
  position: absolute;
  left: 0;
  top:0;
} */
#login .mock {
  position:absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 410px;
  height: 251px;
  background: rgba(255, 255, 255, .2);
  text-align: center;
}

#login h1 {
  font-family: MicrosoftYaHei-Bold;
  font-size: 34px;
  color: #FFFFFF;
  letter-spacing: 2.66px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -80px;
  width: 410px;
}
</style>
