<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <!-- 条件渲染v-if v-else v-show demo -->
    <p v-show="ok">这段行内display切换</p>

    <template v-if="ok">
    <p>如果ok为true显示这一段</p>
    <p>如果ok为true显示这一段</p>
    </template>
    <template v-else>
    <p>else显示这一段</p>
    <p>else显示这一段</p>
    </template>

    <div style="padding-bottom:20px;">
        <button @click="okshow">show</button>
        <button @click="okhide">hide</button>
    </div>

    <span>总价：</span><span>{{proPrice}}元</span><br><br>

    <!-- input v-model,.lazy demo -->
    <input v-model="vuerify.username" ref="username" placeholder="用户名"><span v-show="usernameTip">用户名错误</span><br>

    <input v-model="vuerify.phone" ref="phone" placeholder="手机号"><span v-show="phoneTip">手机号错误</span><br>

    <button @click="submit">提交</button><br><br>

    <router-link tag="li" to="/home">
    <a>返回首页>></a>
    </router-link>

  <!--<input class="useKeyBorad"></input>-->
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '这是hello页面',
      ok: true,
      vuerify: {
        username: '',
        phone: '',
      },
      usernameTip:false,
      phoneTip: false,
      proBuy : {
        number:0,
        price:50
      }
    }
  },

  created: function () {

  },

  // 监听input输入变化，数据变化
  watch: {
    // 监听整个对象
    // vuerify: {
    //    handler(val,oldval){

    //    },
    //    deep:true //深度监听
    // },

    // 监听对象属性，只是示例，可以采用框架验证表单
    "vuerify.username" : function(value){
        console.log(value)
    },

    "vuerify.phone" : function(value){
        console.log(value)
    }
  },

  // 计算属性，只有在以来的data(number、price改变时更新)
  computed: {
    // 有getter , setter 方法时的写法
    // proPrice: {
    //     set(){
    //         // 给proPrice赋值时触发
    //     },
    //     get(){
    //        return (this.proBuy.number * this.proBuy.price);
    //     }
    // }

    // 另一种写法
    proPrice: function(){
       return (this.proBuy.number * this.proBuy.price);
    }
  },

  // 方法
  methods:{
      okshow(){
          this.ok = true
      },
      okhide(){
          this.ok = false
      },
      submit(){


      }
  },
  // dom挂载
  mounted: function () {
      },
}

</script>


<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

button {
  width:100px;
  height:30px;
  background:#08d693
}
#myChart{
  width: 600px;
  height: 600px;
}
</style>
