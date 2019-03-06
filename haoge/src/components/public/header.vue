<template>
   <!-- template下最外层只能有一个div -->
   <div class="header">
       <Logo></Logo>
       <div class="ControlStrip color">
           <div class="lds" @click="gos">
            <el-popover
                v-if="info.length"
                popper-class="headpopover"
                placement="bottom"
                width="400"
                class="heads"
                trigger="hover">
                <div class="notice">
                    <h4>通知</h4>
                    <div class="evernotice hand">
                        <p v-for="(item, index) of info" :key="index" @click="goeverMine(item)" v-if="index<=8">
                            <img src="../../assets/icon/icon-announcement.svg"> <span class="fas"> <span>{{item.message}}</span> <span>{{item.starttime}}</span> </span> 
                        </p>
                        <p class="look" v-if="info.length>8"><span @click="goMine" class="hand">查看更多</span></p>
                    </div>
                </div>
                <el-badge :value="notread" :max="99" class="item mr"  slot="reference">
                 <i class="el-icon-bell"></i> 
                </el-badge>
            </el-popover>
             <i v-else class="el-icon-bell mr f18"></i>
             </div>
            <el-popover
                popper-class="headpopover"
                placement="bottom"
                class="use"
                trigger="hover">
                <div class="user hand">
                    <span @click="myMine"><img src="../../assets/icon/icon-account.svg">我的账号</span>
                    <span @click="logout"><img src="../../assets/icon/icon-quit.svg">退出登录</span>
                </div>
                    <div slot="reference" class="umr">
                        <img src="../../assets//images/photo-head.png" class="img" >
                        <span class="color">{{username}}</span>
                    </div>
                 
                </el-popover>
            <!-- <Lang class="headercon"></Lang>     -->
            |
            <span @click="goold" class="old color">切换旧版</span>
       </div>
   </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { getNowFormatDate} from '../../util/commonality'
import Lang from './lang'
import Logo from './logo'
import classPost from '../../servies/classPost'
export default {
    data () {
        return {
            username:localStorage.data?JSON.parse(localStorage.data).loginName:'用户',
            info:[
               
            ],
            notread:0
        }
    },
    components: {
        Lang,
        Logo
    },

    computed: {
        ...mapGetters(["count","name","isCollapse"]),
        upinfo(){
            return {
                "getNotReadCount": true,//是否返回未读数
                "readStatus": "0"
            }
        }
    },
    mounted() {
        let _this = this
        this.$eventBus.$on('upinfo',function (val) {
            _this.get_announcement()
        })
        this.get_announcement()
    },
    methods: {
        gos(){
            this.$router.push('/home/accountManage/myMessages')
        },
        goeverMine(item){
            if(item.message=='您的操作员账号存在风险，为了您的账号安全，请补全安全信息！'){
                this.$router.push('/home/accountManage/firstSet')
            }else{
                let id = `${item.id}-${item.readStatus}`
                this.$router.push(`/home/accountManage/myMessages/mesDetails/${id}`)
            }
            
        },
      ...mapActions([
          'handleAction'
      ]),
      goMine(){
          this.$router.push('/home/accountManage/myMessages')
      },
      goold(){
          if(JSON.parse(localStorage.data).env==='TEST'){
            window.open('http://mps.innertest3.ipaylinks.com/website/index.htm')
          }else if(JSON.parse(localStorage.data).env==='LIVE'){
            window.open('http://mps1.prodtestnew.ipaylinks.com/website/index.htm')
          }
      },
      get_announcement(){
        this.info=''
        classPost.announcement(this.upinfo)
        .then((res)=>{
            this.info = res.data.msgs.map((item)=>{
                item.message = item.message.indexOf('>')!==-1?item.message.substring(item.message.indexOf('>')+1,item.message.lastIndexOf('<')):item.message
                return {...item}
            })
            this.notread = res.data.notReadCount
        })
        .catch((err)=>{
            console.log(err)
        })
        },
      logout(){
          classPost.logout({})
            .then((res)=>{
                localStorage.removeItem('data')
                localStorage.removeItem('uname')
                localStorage.removeItem('current')
                sessionStorage.clear()
                this.$router.replace('/login')
            })
            .catch((err)=>{
                console.log(err)
            })
      },
      fullScreen(){
          var el = document.documentElement;
          var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;      
          if(typeof rfs != "undefined" && rfs) {
              rfs.call(el);
          };
          return;
      },
      myMine(){
          this.$router.push('/home/accountManage')
      },
      exitScreen(){
          if (document.exitFullscreen) {
              document.exitFullscreen();  
          } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();  
          } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();  
          } else if (document.msExitFullscreen) {
              document.msExitFullscreen();  
          }
          if(typeof cfs != "undefined" && cfs) {
              cfs.call(el);
          }
      }
  },
}

</script>

<style>
.notice h4{
    padding-left: 20px;
    height: 42px;
    line-height: 42px;
    color:rgba(0,0,0,.85);
    border-bottom: 1px solid rgba(232, 232, 232, 1);
}
.evernotice p{
    height: 50px;
    padding-left: 18px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid RGBA(232, 232, 232, 1);
}
.evernotice p img{
    width: 26px;
    height: 26px;
    margin-right: 10px;
}
.evernotice p .fas{
    height: 100%;
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.lds{
    height: 50px;
    display: flex;
    align-items: center;
}
.evernotice p .fas span:nth-child(1){
    color:rgba(0,0,0,.65);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.evernotice p .fas span:nth-child(2){
    font-size: 12px;
    color:rgba(0,0,0,.45)
}
.evernotice p:hover{
    background: rgba(230, 248, 255, 1);
}
.evernotice .look{
    
    display: flex;
    align-items: center;
    justify-content: center;
}
.evernotice .look:hover{
    background: white;
}
.evernotice .look span{
    color: RGBA(0, 0, 0, 0.85);
}
.evernotice .look span:hover{
    color:rgb(23, 89, 168)
}
.user{
    padding: 15px 0 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.headercon{
    margin-right: 15px;
}
.user span{
    display: flex;
    width: 100%;
    height: 30px;
    align-items: center;
    padding-left:10px;
    
}
.user span img{
    margin-right: 10px;
}
.user span:hover{
    background: rgba(230, 248, 255, 1);
}
.header {
    width: 100%;
    box-sizing: border-box;
    text-align: left;
    height: 70px;
    font-size: 16px;
    color: #000000;
    border-bottom: 2px solid #064998;
    background-color:#FFFFFF;
    display: flex;
    justify-content: space-between;
    padding-left: 29px;
}
.header span {
  display: inline-block;
}
.header .lang {
  float: right;
  padding: 20px;
  display: inline-block;
}
.btn-fullscreen {
  float: right;
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.ControlStrip{
    display: flex;
    align-items: center;
}
.img{
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-right: 8px;
}
.mr{
    
    margin-right: 32px;
}
.langerd{
    margin: 0 13px;
}
.old{
    margin-right: 49px;
    margin-left: 10px;
}
.color{
    color:#000000;
    cursor: pointer;
}
.umr{
    display: flex;
    align-items: center;
    margin-right: 34px;
}
.el-badge__content{
    background: red;
    line-height: 16px;
}
.header .item i{
    font-size: 18px
}
.headpopover{
    padding: 0;
}
.f18{
    font-size: 18px;
}
</style>
