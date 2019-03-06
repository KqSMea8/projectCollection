<template>
  <div class="navbar" id="navb" ref="navb">
	
		<el-menu :router="true" :default-active="defaultroute" popper-class='wthpop' class="el-menu-vertical-demo" text-color="#fff" background-color="rgba(23, 89, 168, 1)" :unique-opened="true" :collapse-transition="true"  :collapse="isCollapse" >
				<p class="tap"><img :src="isCollapse?'../../../static/left-side.svg':'../../../static/right-side.svg'" class="small" @click="changenav" /></p>
			<el-submenu v-for="(item,index) of list" :key="index" :index="`${index}`" v-if="item.children">
				<template slot="title">
					<img :src="item.menuIcon">
					<span slot="title">{{item.name}}</span>
				</template>
				<el-menu-item-group>
					<el-menu-item v-for="(i,ind) of item.children" :key="ind"  :index="i.url">{{i.name}}</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-submenu :index="item.url" :key="index" v-else-if="!item.children&&isCollapse">
				<template slot="title">
					<img :src="item.menuIcon">
					<span slot="title">{{item.name}}</span>
				</template>
				<el-menu-item-group>
					<el-menu-item :key="index+'w'"  :index="item.url">{{item.name}}</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-menu-item v-else class="hspecial" :key="index" :index="item.url">
				<img :src="item.menuIcon">
				<span slot="title">{{item.name}}</span>
      </el-menu-item>
		</el-menu>
  </div>
</template>
<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import classPost from '../../servies/classPost'
export default {
    data() {
      return {
		isCollapse:true,
		list:[]
      };
    },
    // 跟methods相似，但缓存信息,一般在这里初始化state
    methods: {
    changenav(){
			this.isCollapse=!this.isCollapse
			setTimeout(() => {
				if(this.$route.path=='/home'){
					this.$eventBus.$emit('chart1',this.$refs['navb'].offsetWidth)
				}
				if(this.$route.path=='/home/tradeManage/tradeecharts'){
					this.$eventBus.$emit('chart2',this.$refs['navb'].offsetWidth)
				}
			}, 300);
    }, 
    debounce(fn, delay) {
      let timer = null;
      return function() {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
          fn.apply(context, args);
        }, delay);
      }
	},
	get_data(){
		classPost.security_mymenu({})
			.then((res)=>{
				sessionStorage.contrast = JSON.stringify(res.data.responseList)
					let arr = ['']
					res.data.responseList.forEach(item=>{
						if(item.children){
							let ary = item.children.filter(i=>i.name==='交易处理')
							if(ary.length>=1){
								arr=ary
							}
						}
					})
					sessionStorage.jurisdiction = JSON.stringify(arr[0])
					this.list = res.data.responseList
                    if(window.innerWidth > 1000 ) this.isCollapse=false
			})
			.catch((err)=>{
				console.log(err)
			})
	}
  },
  computed:{
    defaultroute(){
      return this.$route.fullPath
    }
  },
  mounted(){
		this.get_data()
		let _this = this
		this.$eventBus.$on('nav',function(){
			_this.list=[]
			_this.get_data()
		})
    // window.onresize = this.debounce(() => {
    //       (window.innerWidth <= 1350) ? this.isCollapse = true : this.isCollapse = false;
    //   },500);
  }
}

</script>
<style>
.navbar {
  width: auto;
	background: rgba(23, 89, 168, 1)
}
.el-tooltip__popper.is-dark {
    background: rgb(23, 89, 168);
    color: #fff;
}
.el-tooltip__popper .popper__arrow, .el-tooltip__popper .popper__arrow::after{
		border-right-color: rgb(23, 89, 168)!important;
}
.navbar .el-submenu__icon-arrow{
	color:RGBA(255, 255, 255, .45)
}
.navbar .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 256px;
    height: 100%;
  }
.navbar .el-menu .el-menu--collapse {
	width: 64px;
	height: 100%;
}
.el-menu-item{
	height: 42px;
	line-height: 42px;
	padding-left:25px!important;
}
.el-menu-item.is-active{
	color:rgba(255, 255, 255, 1)!important;
	background:rgba(28, 142, 212, 1)!important;
}
.el-menu-item:hover{
	background:rgba(28, 142, 212, 1)!important;
}
 .navbar .el-menu--inline .el-menu-item-group>ul{
	background:rgba(6, 73, 152, 1)!important;
}
.navbar .el-menu--inline .el-menu-item{
	padding-left:70px!important;
	background:rgba(6, 73, 152, .8)!important;
}
.navbar .el-submenu__title{
	height: 42px;
	line-height: 42px;
	border-top:rgba(0, 48, 147, 1) solid 1px;
}
.navbar .last{
	border-bottom:rgba(0, 48, 147, 1) solid 1px;
}
.navbar .el-menu-item:hover{
	background:rgba(28, 142, 212, 1)!important;
}
.navbar .el-menu .el-menu-item-group .is-active{
	background:rgba(28, 142, 212, 1)!important;
	color:rgba(255, 255, 255, 1)!important;
}
.navbar .el-menu .el-submenu__title:hover{
	background:rgba(28, 142, 212, 1)!important;
}
.navbar .tap{
	background:rgb(23, 89, 168);
	height:50px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-right: 15px;
	cursor: pointer;
}
.navbar .tap img{
	width:17px;
	height:26px;
}
.navbar .tap .small{
	transform:rotateY(180deg);
	transition:all 2s linear;
}
.navbar .el-submenu .el-menu-item{
	min-width:256px;
	height: 32px;
	line-height: 32px;
	margin-bottom: 4px;
}
.navbar .el-submenu .el-menu-item:last-child{
	margin-bottom: 0px;
}
.el-menu-item-group__title{
	padding:0px;
}
.navbar .el-menu .hspecial{
	border-top:rgba(0, 48, 147, 1) solid 1px;
	padding-left: 20px!important;
}
.navbar .el-menu{
	border-right: none;
}
.navbar .el-menu-item img{
	margin: 0 10px
}
.navbar .el-submenu__title img{
	margin: 0 10px
}
</style>
