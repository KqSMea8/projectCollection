<template>
        <div id="home">
            <Header></Header>
            <div class="bom">
                <Navbar id="vab"></Navbar>
                <div class="rit">
                    <div id="hboxss">
                        <Bread></Bread>
                        <div class="hhome" id="whom">
                            <router-view v-if="clang"></router-view>
                        </div>
                    </div>
                    <p class="footer">Copyright © 2015-2018<span class="hand" @click="website"> iPayLinks.</span> All rights reserved.</p>
                </div>
            </div>
        </div>
</template>
<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import Header from './public/header'
import Navbar from './public/navbar'
import Bread from './public/breadcrumb'
import classPost from '../servies/classPost'
export default {
  name: 'app', //相当于全局id，可不写
  data(){
  	return {
        clang:true
      }
  },
  computed:{
    addclass(){
        if(window.navigator.userAgent.includes('MSIE')){
            return true
        }else{
            return false
        }
    }
  },
  mounted(){
    this.get_current()
    let environment = window.navigator.userAgent
    document.getElementById('home').style.minHeight = document.body.clientHeight+'px'
    if(!environment.includes('Chrome')){
        window.onresize=function(){
            setTimeout(() => {
                this.$nextTick(()=>{
                    document.getElementById('whom').style.width=document.documentElement.clientWidth-document.getElementById('vab').getBoundingClientRect().width+'px'
                }) 
            }, 500);
        }
        this.$eventBus.$on('chart1',function(width){
            document.getElementById('whom').style.width=document.documentElement.clientWidth-document.getElementById('vab').getBoundingClientRect().width+'px'
        })   
    }
    let _this = this;
    this.$eventBus.$on('changeLang',function(){
        _this.reload()
    })
  },
  methods: {
    reload(){
        this.clang=false
        this.$nextTick(()=>{
            this.clang=true
        })
    },
    website(){
        window.open("http://www.ipaylinks.com");
    },
    get_current(){
        classPost.get_current({})
            .then((res)=>{
                localStorage.current = res.data
            })
            .catch((err)=>{
                console.log(err)
            })
    }
  },
  // 组件注册
  components: {
    Header,
    Navbar,
    Bread
  },
}
</script>
<style>
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
}
.hhome{
    padding:0 20px;
}
.footer span{
    color:#00A0E9;
    font-size: 12px;
}
.bom{
    height:100%;
    display:flex;
    background: #F0F2F5;
}
#home{
    width: 100%;
    background:rgb(240,242,245)
}
#hboxss{
    min-height: 790px;
    flex: 1;
}
</style>
