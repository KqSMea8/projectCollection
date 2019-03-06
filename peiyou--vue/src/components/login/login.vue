<template>
  <div class="login" id="particles">
    <h1>学而思培优数据平台</h1>
    <form>
        <img src='../../assets/img/login_icon_urer@2x.png' class="login_icon_urer" />
        <input type="text" placeholder="请输入用户名" v-model="FormData.username" />
        <img src='../../assets/img/login_icon_password@2x.png' class="login_icon_password" />
        <input type="password" placeholder="请输入密码" v-model="FormData.password" />
        <p class="yz">{{this.errMsg}}</p>
        <button @click="loginClick">登录</button>
    </form>
</div>
</template>

<script>
export default {
    name: 'Login',
    data () {
        return {
            FormData: {},
            errMsg: ''
        };
    },
    methods: {
        loginClick (e) {
            e.preventDefault();
            // 数据请求
            let uPattern = /^[a-zA-Z0-9_-]{4,16}$/;// 帐号正则
            let pPattern = /^[a-zA-Z0-9_-]{6,}$/; // 密码正则
            if (uPattern.test(this.FormData.username)) {
                if (pPattern.test(this.FormData.password)) {
                    this.$http.post('http://localhost:8087/login', this.FormData).then((res) => {
                        if (!res.code) {
                            localStorage.setItem('token', res.token);
                            localStorage.getItem('token');
                            // 跳转路由
                            this.$router.push('/home');
                        }
                    });
                } else {
                    this.errMsg = '请输入正确的密码';
                }
            } else {
                this.errMsg = '账号或密码错误，请重新输入';
            }
        }
    },
    mounted () {
        particlesJS.load('particles', './src/components/login/particles.data');
    }
};
</script>
