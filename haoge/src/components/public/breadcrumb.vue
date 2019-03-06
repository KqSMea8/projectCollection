<template>
    <div class="bread">
        <el-breadcrumb>
            <el-breadcrumb-item v-for="(item, index) in breadList" v-if="item.meta.title!=='首页'" :key="index">{{$t(item.name)}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs v-if="flag" v-model="aName" @tab-click="handleClick">
            <el-tab-pane v-for="(item, index) of tablist" :path="item.path" :label="$t(item.name)" :key="index" :name="item.path"></el-tab-pane>
        </el-tabs>
        <h3 class="htit" v-else v-show="$t(tit)!=='首页'&&$t(tit)!=='home page'">{{$t(tit)}}</h3>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    created() {
    },
    mounted(){
      
    },
    methods:{
        handleClick(tab,event){
            this.$router.history.push(tab.name)
        }
    },
    computed:{
      breadList:{
          get(){
              return this.$route.matched
          },
          set(newVal){
              this.$route.matched=newVal
          }
          
      },
      tablist:{
          get(){
            return this.$route.matched[2].meta.children
          },
          set(newVal){
              this.$route.matched[2].meta.children=newVal
          }
      },
      flag:{
          get(){
            return this.$route.meta.show
          },
          set(newVal){
            this.$route.meta.show=newVal
          }
        
      },
      tit:{
           get(){
            return this.$route.name
          },
          set(newVal){
            this.$route.name=newVal
          }
      }
    },
    data() {
        return {
           aName:this.$route.path
        }
    },
    watch:{
        "$route":{
            handler:function(val){
                this.aName=this.$route.path
            }
        }
    }
}
</script>
<style>
    .bread{
        padding:0 20px;
        background:rgba(255, 255, 255, 1);
        display:flex;
        justify-content: center;
        flex-direction: column;
         border-bottom: 1px solid #e4e7ed;
    }
    .bread .el-tabs__nav-wrap::after{
        height: 0;
    }
    .bread .el-breadcrumb{
        height: 50px;
        line-height: 50px;
    }
    .bread .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link{
        font-weight: normal;
        color:black
    }
    .bread .el-tabs__header{
        margin: 0;
    }
    .htit{
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
    }
</style>
