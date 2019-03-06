<template>
    <div>
      <Header></Header>
      <div class="bom">
            <Navbar></Navbar>
            <div class="rit">
                <div class="box" id="hboxs">
                    <div class="hhome">
                      	<div class="error clearfix">
                          <img class="fl" src="../../assets/images/icon-404@2x.png" alt="">
                          <div class="fr errorCon">
                              <p>404</p>
                              <p>抱歉，你访问的页面不存在</p>
                              <router-link to="/home"><el-button type="primary">返回首页</el-button></router-link>
                          </div>
                        </div>
                    </div>
                 </div>
                <p class="footer">Copyright©2018 <span>ipayLinks</span>  All Rights Reserved</p>
            </div>
      </div>
  </div>
</template>

<script>
import Header from '../public/header'
import Navbar from '../public/navbar'
export default {
  data () {
    return { 
        
    }
  },

  created: function () {
      
  },

  methods: {
    
  },
  // 组件注册
  components: {
    Header,
    Navbar,
  },
}
</script>
<style>
.clearfix:after{ content: ""; display: block;width:0; height: 0; clear: both; visibility: hidden; }
.clearfix { zoom: 1; }
.fl{
  float: left;
}
.fr{
  float: right;
}
.error{
  background:rgba(240,242,245,1);
  padding:200px 20%;
  /* position: relative;
  top:-60px;
  z-index: 9999;
  margin:0 -20px; */

}
.error img{
  width:443px;
  height:340px;
}
.errorCon{
  margin-top:81px;
}
.errorCon p:nth-child(1){
  color:#434E59;
  font-size: 50px;
 
}
.errorCon p:nth-child(2){
  font-size:20px;
  color:rgba(0,0,0,0.45);
  margin-top:24px;
}
.errorCon .el-button{
  margin-top:24px;
}


#home{
    display: flex;
    flex-direction: column
}
.warpperLeft {
    left: 200px;
}
.footer{
    height: 42px;
    line-height: 42px;
    background: #fff;
    text-align: center;
    font-size: 12px;
    margin-top: 60px;
}
.rit{
    width: 100px;
    flex:1;
    display: flex;
    flex-direction: column;
}
.hhome{
    padding:0 20px;
}
.footer span{
  
    color:#00A0E9;
    font-size: 12px;
}
.bom{
  display: flex;
  background: #F0F2F5;
}
#container {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
#hboxs{
   min-height: 790px;
}
</style>