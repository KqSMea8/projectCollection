<template>
  <div class="accountBalance">
    <!-- html这里开始 -->
    <div class="merchant clearfix">
        <p class="fl">商户名称： <span>{{name}}</span></p>
        <p class="fl">商户号： <span>{{memberCode}}</span></p>
    </div>
    <div class="accountListBox">
       <transition-group name="fade">
        <div class="accountList" v-for="(item,index) of accountList" :key="index" v-if='index<num'>
            <p class="currency">{{item.curCodeNam}} ({{item.currencyCode}})</p>
            <div class="accountListCon clearfix">
              <div v-if="item.basicAcctList.length!=0" class="fl w200">
                <div v-for="(data,index) of item.basicAcctList" :key="index">
                    <p>基本户</p>
                    <p>余额：<span style="font-size: 16px" class="redColor">{{fmoney(data.balance)}}</span></p>
                    <p>冻结金额：<span style="font-size: 16px">{{fmoney(data.frozenAmount)}}</span></p>
                </div>
              </div>
              <div v-else class="fl w200">
                <div>
                    <p>基本户：</p>
                    <p>余额：<span style="font-size: 16px" class="redColor">0.000</span></p>
                    <p>冻结金额：<span style="font-size: 16px">0.000</span></p>
                </div>
              </div>
              <div class="fl"><router-link :to="{path:'/home/fundManage/withdraw',query: {id:item.currencyCode}}"><el-button type="primary" plain size="mini">提现</el-button></router-link></div>
              <!-- <div class="fl"><router-link to="/home/fundManage/withdraw"><el-button type="primary" plain size="mini">提现</el-button></router-link></div> -->
              <div v-if="item.cashAcctList.length!=0" class="fl">
                <div  v-for="(data,index) of item.cashAcctList" :key="index">
                    <p style="padding-left: 40px;">保证金户</p>
                    <div style="padding-left: 40px;">
                      <p>余额：<span style="font-size: 16px" class="redColor">{{fmoney(data.balance)}}</span></p>
                      <p>冻结金额：<span style="font-size: 16px">{{fmoney(data.frozenAmount)}}</span></p>
                    </div>
                </div>
              </div>
              <div v-else  class="fl">
                <div>
                    <p style="padding-left: 40px;">保证金户</p>
                    <div style="padding-left: 40px;">
                      <p>余额：<span style="font-size: 16px" class="redColor">0.000</span></p>
                      <p>冻结金额：<span style="font-size: 16px">0.000</span></p>
                    </div>
                </div>
              </div>
            </div>
        </div>
       </transition-group>
        <div>
          <p class="more" @click="more" v-if="accountList.length>5&&flag==false">查看更多</p>
          <p class="nomore" v-else><img src="../../../static/icon-no.svg"><span>已经到底了</span></p>
        </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui' //element Message 组件引入
import classPost from '../../servies//classPost'
import { fmoney} from '../../util/commonality'
export default {
  data () {
    return {
      name:'',
      memberCode:'',
      currencyCode:'',
      accountList:[] ,
      num:5,
      flag:false
    }
  },

  created: function () {
      this.queryacct()
      this.data=JSON.parse(localStorage.data)
      this.memberCode=this.data.memberId//商户号
      this.name=this.data.name//商户名
  },

  methods:{
    fmoney,
    queryacct(){
        classPost.queryacct({})
          .then((res)=>{
            console.log(res)
            this.accountList=res.data
          }).catch((err)=>{
            console.log(err)
        })
    },
    more(){
      if(this.num<=this.accountList.length){
        this.num+=5;
        if(this.num>=this.accountList.length){
          this.flag=true
        }
      }else{
        this.flag=true
      }
    },
  }
}

</script>

<style>
h1, h2, h3, h4, h5, h6 { font-size: .12rem; line-height: normal; font-style: normal; font-weight:normal; }
em, i{font-style: normal;}
.clearfix:after{ content: ""; display: block;width:0; height: 0; clear: both; visibility: hidden; }
.clearfix { zoom: 1; }
.fl{float: left;}
.fr{float: right;}
.w200{width:200px;}
.accountBalance{
  background: #fff;
  margin-top:20px;
}
.merchant{
  height:46px;
  line-height: 46px;
  border-bottom:1px solid rgba(217,217,217,1); 
  padding:0 20px; 
}
.merchant p{
 font-weight: bold;
  color:#000;
}
.merchant p:nth-child(2){
  margin-left:40%;
}
.merchant p span{
  color:rgba(0,0,0,0.85);
  font-size: 14px;
}
.accountList{
  margin-top:10px;
  background: #fff;
  border:1px solid rgba(232,232,232,1);
}
.currency{
  height:40px;
  line-height: 40px;
  background:rgba(241,247,255,1);
  padding:0 16px;
}
.accountListCon{
  padding:16px;
}
.accountListCon div p{
  line-height:30px;
}
.accountListCon>div:nth-child(2){
  margin-left:10%;
  margin-top:30px;
}
.accountListCon>div:nth-child(2) a{
  color:#fff;
  text-decoration:none;
}
.accountListCon>div:nth-child(3){
  margin-left:10%;
}
.accountListBox{
  padding:0 20px;
}
.more{
  text-align: center;
  height:80px;
  line-height:20px;
  color:#1890FF;
  margin-top: 20px;
  cursor: pointer;
}
.el-pagination{
  text-align: center;
}
.redColor{
  color:#FF6D33;
}
 .fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
.nomore{
  margin-top: 20px;
  display:flex;
  justify-content: center;
  padding-bottom:60px;
  color:RGBA(0, 0, 0, 0.5)
}
.nomore img{
  margin-right:10px
}
</style>
