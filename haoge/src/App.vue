
<template>
    <router-view v-if="show"></router-view>
</template>
<script>
export default {
  data(){
    return {
      show:true,
      time:''
    }
  },
  mounted() {
    this.time = setInterval(()=>{
      if(localStorage.uname&&sessionStorage.uname){
        if(localStorage.uname!==sessionStorage.uname){
          sessionStorage.uname=localStorage.uname
          this.show=false
          this.$nextTick(()=>{
           this.show=true
          })
        }
      }
    },1000)
  },
  destroyed(){
    clearInterval(this.time)
  }
  
}
</script>
<style>
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
  font-size: 14px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
  font-family: "Monospaced Number","Chinese Quote",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif;
}
body,html{
   height: 100%;
}
.hand{
  cursor: pointer;
}
.el-input .el-input__inner{
    height: 32px;
}
</style>