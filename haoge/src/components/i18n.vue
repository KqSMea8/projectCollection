<template>
  <div>
    <div style="margin: 20px;">
      <h1>{{$t('LANG.message.title')}}</h1>
      <input :placeholder="$t('LANG.placeholder.enter')">
      <ul>
        <li v-for="(value, index) in $t('LANG.brands')" :key="index" >{{value}}</li>
      </ul>
    </div>
    <br><br>
    <router-link to="/home/hello">
      <a>另一个页面同时切换了语言，去看看>></a>
    </router-link>
    <br><br>
    <router-link to="/home">
      <a>返回首页>></a>
    </router-link>
</div>
</template>

<script>
export default {
  data () {
    return { 
        
    }
  },

  created: function () {
      
  },

  methods: {
    
  }
}
</script>

<style scoped>
li, ul {
  margin:0;
  padding:0;
  list-style:none;
}
ul {
  padding-top:20px;
}
li {
  padding:10px 0;
  border-bottom:1px solid #999
}
</style>