<template>
    <div class="home" v-loading="homeload" element-loading-background="rgba(255,255,255,1)">
      <div class="tip">
         <el-carousel 
            height="41px"
            :interval=10000
            indicator-position='none'
            arrow="never">
          <el-carousel-item v-for="(item, index) of info" :key="index">
            <p class="tp" @click="goEverMine(item)"><img src="../../static/icon-message.svg" class="ic">{{ item.message }}</p>
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <div class="order" v-show="orderload">
          <div class="everindent hand" v-for="(item, index) of indent" :key="index" :style="{background:item.back}"  @click="goEver(item.path,item.indentType)"><span class="block">{{/^[A-Za-z]+$/.test(item.indentNum)?'':item.indentNum}}</span><span class="block">{{item.indentType}}</span></div>
      </div>
      <div class="account">
          <div class="dynamic" v-show="dynamicload" v-loading="dsynacy" element-loading-background="rgba(255,255,255,1)">
              <span class="tit">账户动态</span>
               <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="昨日" name="first">
                     <div class="billbox">
                          <span>总收入(USD)</span>
                          <div class="everbill" >
                            <span class="right">{{yesbill.successAmount}}</span> 
                            <p><img :src="yesbill.flag1?'../../static/icon-rise.svg':'../../static/icon-decline.svg'"/><span :class="!yesbill.flag1?'green':'red'">{{yesbill.successAccountPer}}</span></p>
                          </div>
                      </div>
                      <div class="billbox">
                          <span>退款(USD)</span>
                          <div class="everbill" >
                            <span class="right">{{yesbill.refundAmount}}</span>
                            <p><img :src="yesbill.flag2?'../../static/icon-rise.svg':'../../static/icon-decline.svg'"/><span :class="!yesbill.flag2?'green':'red'">{{yesbill.refundAccountPer}}</span></p>
                          </div>
                      </div>
                      <div class="billbox">
                          <span>订单总数(笔)</span>
                          <div class="everbill" >
                            <span class="right">{{yesbill.successNum}}</span>
                            <p><img :src="yesbill.flag3?'../../static/icon-rise.svg':'../../static/icon-decline.svg'"/><span :class="!yesbill.flag3?'green':'red'">{{yesbill.successNumPer}}</span></p>
                          </div>
                      </div>
                      <div class="billbox">
                          <span>退款(笔)</span>
                          <div class="everbill" >
                            <span class="right">{{yesbill.refundNum}}</span>
                            <p><img :src="yesbill.flag4?'../../static/icon-rise.svg':'../../static/icon-decline.svg'"/><span :class="!yesbill.flag4?'green':'red'">{{yesbill.refundNumPer}}</span></p>
                          </div>
                      </div>
                  </el-tab-pane>
                  <el-tab-pane label="本月" name="second">
                       <div class="billbox">
                          <span>总收入(USD)</span>
                          <div class="everbill" >
                            <span class="right">{{yesbill.successAmount}}</span>
                            <p><img :src="yesbill.flag1?'../../static/icon-rise.svg':'../../static/icon-decline.svg'"/><span :class="!yesbill.flag1?'green':'red'">{{yesbill.successAccountPer}}</span></p>
                          </div>
                      </div>
                      <div class="billbox">
                          <span>退款(USD)</span>
                          <div class="everbill" >
                            <span class="right">{{yesbill.refundAmount}}</span>
                            <p><img :src="yesbill.flag2?'../../static/icon-rise.svg':'../../static/icon-decline.svg'"/><span :class="!yesbill.flag2?'green':'red'">{{yesbill.refundAccountPer}}</span></p> 
                          </div>
                      </div>
                      <div class="billbox">
                          <span>订单总数(笔)</span>
                          <div class="everbill" >
                            <span class="right">{{yesbill.successNum}}</span>
                            <p><img :src="yesbill.flag3?'../../static/icon-rise.svg':'../../static/icon-decline.svg'"/><span :class="!yesbill.flag3?'green':'red'">{{yesbill.successNumPer}}</span></p>
                          </div>
                      </div>
                      <div class="billbox">
                          <span>退款(笔)</span>
                          <div class="everbill" >
                            <span class="right">{{yesbill.refundNum}}</span>
                            <p><img :src="yesbill.flag4?'../../static/icon-rise.svg':'../../static/icon-decline.svg'"/><span :class="!yesbill.flag4?'green':'red'">{{yesbill.refundNumPer}}</span></p>
                          </div>
                      </div>
                  </el-tab-pane>
                </el-tabs>
             
          </div>
          <div class="entrance" v-show="entranceload">
              <p v-for="(item,index) of short" :key="index" class="evershort dh hand" @click="goto(item.menuUrl)">
                <img :src="item.src"><span>{{item.menuName}}</span>
              </p>  
             
          </div>  
      </div> 
      <div class="chart" v-show="chartload">
          <div class="chartshead" id="ecs">
            <h3>交易统计</h3>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
              <el-form-item prop="time">
                  <el-date-picker
                    v-model="ruleForm.time[0]"
                    @change="setOne"
                    value-format="timestamp"
                    type="date"
                    size="small"
                    :picker-options="pickerOptions1"
                    placeholder="开始日期">
                  </el-date-picker>
                        -
                  <el-date-picker
                      v-model="ruleForm.time[1]"
                      @change="setOne"
                      value-format="timestamp"
                      type="date"
                      :picker-options="pickerOptions2"
                      size="small"
                      placeholder="结束日期">
                  </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
        <div id='myChart' ref="chars"></div>
      </div> 
    </div>
</template>

<script>
import { mapState } from 'vuex';
import classPost from '../servies/classPost'
import { fmoney, formatDateTime, futuremon, ExportExcel, showtime, timeFordat } from '../util/commonality'
export default {
  computed:{
    surface(){
      return {
        'AUTH_TOKEN':localStorage.accessToken,
        'beginDate':this.ruleForm.time?timeFordat(formatDateTime(this.ruleForm.time[0]).split(' ')[0]):'',
        'endDate':this.ruleForm.time?timeFordat(formatDateTime(this.ruleForm.time[1]).split(' ')[0]):''
      }
    },
    postdata(){
      return {
        'AUTH_TOKEN':localStorage.accessToken
      }
    },
    upinfo(){
      return {
        "getNotReadCount": false,//是否返回未读数
        "pageSize": 5,
        "readStatus": ""
      }
    }
  },
  data () {
    var selecttime = (rule, value, callback) => {
          if(value!==null){
              let time = value[1]-value[0]
              let year = 90 * 24 * 60 * 60 * 1000
              if(time>year){
                  callback('最大日期选择时间为90天')
              }else{
                  callback()
              }
          }
        }
       let that=this;
        let timeCheck1=function (times) {
            if(that.ruleForm.time[1]){
                return (times.getTime() > new Date(that.ruleForm.time[1]))
            }else{
                return (times.getTime() > Date.now())
            } 
        }
        let timeCheck2=function (times) {
            return (times.getTime() > Date.now())||(times.getTime()<new Date(that.ruleForm.time[0]))
        }
    return {
      msg: '',
      homeload:true,
      orderload:false,
      dynamicload:false,
      entranceload:false,
      dsynacy:false,
      chartload:false,
      info:[],
      inputValue: 0,
      ruleForm:{
        time:[]
      },
      rules:{
        time:[
          {
            validator:selecttime,tigger:'blur'
          }
        ]
      },
      activeName: 'first',
      chart:'',
      indent:[
        {
          indentType:"风险订单",
          indentNum:'countRiskOrder',
          back:"#3497DD",
          path:'/home/riskManage/riskOrderAudit'
        },
        {
          indentType:"待审核订单",
          indentNum:'countCheckPendingOrder',
          back:"#8E44AD",
          path:'/home/tradeManage/dealDispose'
        },
        {
          indentType:"待处理调单",
          indentNum:'countSolvePendingOrder',
          back:"#32C5D2",
          path:'/home/tradeManage/protestDispose'
        },
        {
          indentType:"待处理拒付",
          indentNum:'countPayRefusedPendingOrder',
          back:"#E74F5A",
          path:'/home/tradeManage/protestDispose'
        }
      ],
      short:[
        {
          src:'../../static/icon-inquire.svg'
        },
        {
          src:'../../static/icon-conduct.svg'
        },
        {
          src:'../../static/icon-deposit.svg'
        },
        {
          src:'../../static/icon-close.svg'
        }
      ],
      yesbill:{
        flag1:true,
        flag2:true,
        flag3:true,
        flag4:true
      },
      pickerOptions1: {
          disabledDate(time) {
              return timeCheck1(time)
          }
      },
      pickerOptions2: {
          disabledDate(time) {
              return timeCheck2(time)
          }
      },
      option:{
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'cross',
                      crossStyle: {
                          color: '#999'
                      }
                  },
                  formatter:function(params){  
                    var relVal = params[0].name;  
                    for (var i = 0, l = params.length; i < l; i++) {  
                        if( params[i].seriesName==='成功率'){
                          relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value+"%";  
                        }else if(params[i].seriesName==="每日有效订单总笔数"){
                          relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value+"笔";  
                        }else{
                          relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value+"千元"
                        }
                      }  
                    return relVal;  
                  }  
              },
              color:['#B6E0FD','#70D3BF','#EF848C'],
              grid:{
                  x:70,
                  y:100,
                  x2:60,
                  y2:100
              },
              toolbox: {
                  feature: {
                      dataView: {
                        show: true, 
                        readOnly: false,
                        lang:['数据视图','关闭','导出数据'],
                        contentToOption:function(){
                          ExportExcel('tableExcel_Day')
                        },
                        optionToContent: function(opt) {
                          var axisData = opt.xAxis[0].data;
                          var series = opt.series;
                          var table = '<table id="tableExcel_Day" style="width:50%;text-align:center"><tbody><tr>'
                            + '<td>时间</td>'
                            + '<td>' + series[0].name + '</td>'
                            + '<td>' + series[1].name + '（笔）</td>'
                            + '<td>' + series[2].name + '（千元）</td>'
                            + '</tr>';
                          for (var i = 0, l = axisData.length; i < l; i++) {
                            table += '<tr>'
                            + '<td>' + axisData[i] + '</td>'
                            + '<td>' + series[0].data[i] + '%</td>'
                            + '<td>' + series[1].data[i] + '</td>'
                            + '<td>' + series[2].data[i] + '</td>'
                            + '</tr>';
                          }
                          table += '</tbody></table>';
                          return table;
                      }},
                      magicType: {show: true, type: ['line', 'bar']},
                      restore: {show: true}
                  },
                  padding: '15 15 15 15'
              },
              legend: {
                  data:['每日有效订单总笔数','成功率','成功金额']
              },
              xAxis: [
                  {
                      type: 'category',
                      data:[],
                       axisLabel: {
                          interval: 0,
                          rotate: 30
                      },
                      axisPointer: {
                          type: 'shadow'
                      }
                  }
              ],
              yAxis: [
                  {
                      type: 'value',
                      name: '成功率',
                      axisLabel: {
                          formatter: '{value}%'
                      }
                  },
                  {
                      type: 'value',
                      name: '成功金额',
                      axisLabel: {
                          formatter: '{value}'
                      }
                  }
              ],
              series: [
                  {
                      name:'成功率',
                      type:'bar',
                      data:[0]
                  },
                  {
                      name:'每日有效订单总笔数',
                      type:'line',
                      yAxisIndex: 1,
                      data:[0]
                  },
                  {
                      name:'成功金额',
                      type:'line',
                      yAxisIndex: 1,
                      data:[0]
                  }
                  
              ]
            }
     
    }
  },
  mounted() { 
    let _this = this
    this.init().then((res)=>{
      if(res=='ok'){
        this.homeload=false
        setTimeout(()=>{
          this.orderload=true
        },200)
        setTimeout(()=>{
          this.dynamicload=true
        },400)
        setTimeout(()=>{
          this.entranceload=true
        },600)
        setTimeout(()=>{
          this.chartload=true
          this.drawLine()
          this.get_month_trade_statistics()
          this.$nextTick(()=>{
            this.chart.resize()
          })
        },800)
      }
    })
    window.onresize = function(){
      _this.chart.resize();
    }
    this.$eventBus.$on('chart1',function(width){
      document.getElementById('myChart').width=window.innerWidth-width-40+'px'
      _this.chart.resize();
    })
  },
  methods: {
    async init(){
      let w1 = await this.time()
      let w2 = await this.get_announcement()
      let w3 = await this.get_yesterday()
      let w4 = await this.get_pending_schedule()
      let w5 = await this.get_menu_quick_entrance()
      if(w1&&w2&&w3&&w4&&w5) return 'ok';
    },
    setOne(){
      this.$refs['ruleForm'].validate((val)=>{
        if(val){
          if(this.ruleForm.time[0]&&this.ruleForm.time[1]){
            this.get_month_trade_statistics()
          }
        }
      })
    },
    goEver(url,type){
      this.$router.push({path:url,query:{type}})
    },
    goto(url){
      this.$router.push(url)
    },
    get_announcement(){
      let _this = this
      return new Promise(function(resolve,rej){
        classPost.announcement(_this.upinfo).
        then((res)=>{
          _this.info = res.data.msgs.map((item)=>{
            item.message = item.message.indexOf('>')!==-1?item.message.substring(item.message.indexOf('>')+1,item.message.lastIndexOf('<')):item.message
            return {...item}
          })
          resolve(true)
        }).catch((err)=>{
          console.log(err)
        })
      })
      
    },
    handleClick(tab, event) {
      this.dsynacy=true
      if(this.activeName==='first'){
        this.get_yesterday()
      }else{
        this.get_month()
      }
    },
    goEverMine(item){
      let id = `${item.id}-${item.readStatus}`
      this.$router.push(`/home/accountManage/myMessages/mesDetails/${id}`)
    },
    time(){
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      const arr = [start,end]
      this.ruleForm.time=arr
      return true
    },
    changedata(arr,obj){
      return new Promise(function(response,reject){
        arr.map((item)=>{
          item.indentNum = obj[item.indentNum]
            return {...item}
        })
        response(arr)
      })
    },
    mergedata(data, obj){
      return new Promise(function(res,rej){
        obj.flag1 = data.successAccountPer>=0?true:false
        obj.flag2 = data.refundAccountPer>=0?true:false
        obj.flag3 = data.successNumPer>=0?true:false
        obj.flag4 = data.refundNumPer>=0?true:false
        obj.refundAccountPer = isNaN(data.refundAccountPer)?'——':`${(Math.abs(data.refundAccountPer)*100).toFixed(2)}%`
        obj.refundNumPer = isNaN(data.refundNumPer)?'——':`${(Math.abs(data.refundNumPer)*100).toFixed(2)}%`
        obj.successNumPer = isNaN(data.successNumPer)?'——':`${(Math.abs(data.successNumPer)*100).toFixed(2)}%`
        obj.successAccountPer = isNaN(data.successAccountPer)?'——':`${(Math.abs(data.successAccountPer)*100).toFixed(2)}%`
        obj.refundAmount = fmoney(data.transactionSum.refundAmount)
        obj.refundNum = fmoney(data.transactionSum.refundNum)
        obj.successAmount = fmoney(data.transactionSum.successAmount)
        obj.successNum = fmoney(data.transactionSum.successNum)
        res(obj)
      })
    },
    // 获取昨日账号动态
    get_yesterday(){
      let _this = this
      return new Promise(function(resolve,rej){
        classPost.yesterday_trade(_this.postdata)
        .then((res)=>{
            _this.mergedata(res.data,_this.yesbill)
            _this.dsynacy=false
            resolve(true)
        })
        .catch((err)=>{
          console.log(err)
        })
      })
    },
    // 获取本月账号动态
    get_month(){
      classPost.month_trade(this.postdata).
        then((res)=>{
            this.mergedata(res.data,this.yesbill)
            this.dsynacy=false
        }).catch((err)=>{
          console.log(err)
        })
    },
    // 获取配置中心数据
    get_menu_quick_entrance(){
      let _this = this
      return new Promise(function(resolve,rej){
        classPost.menu_quick_entrance(_this.postdata)
        .then((res)=>{
          _this.short = _this.short.map((item,index)=>{
            item = Object.assign(item,res.data[index])
            return {...item}
          })
          resolve(true)
        }).catch((err)=>{
          console.log(err)
        })
      })
    },
    // 获取表数据
    get_month_trade_statistics(){
      classPost.month_trade_statistics(this.surface).
        then((res)=>{
            this.chart.setOption({
              xAxis: {
                data: res.data.responseList.map(item => {
                  item.tradeDate = showtime(item.tradeDate.toString())
                  return item.tradeDate
                })
              },
              yAxis: [
                {
                  data:res.data.responseList.map(item => item.successNum/item.validNum*100)
                },
                {
                  data:res.data.responseList.map(item => item.successNum)
                }
              ],
              series:[
                {
                  data:res.data.responseList.map(item => (item.successNum/item.validNum*100)?(item.successNum/item.validNum*100).toFixed(2):0)
                },
                {
                  data:res.data.responseList.map(item => item.successNum)
                },
                {
                  data:res.data.responseList.map(item => (item.successAmount/1000).toFixed(5))
                }
              ]
            })
        }).catch((err)=>{
          console.log(err)
        })
    },
    // 获取代办处理数据
    get_pending_schedule(){
      let _this = this
     return new Promise(function(resolve,rej){
       classPost.pending_schedule(_this.postdata)
       .then((res)=>{
            _this.changedata(_this.indent,res.data)
          resolve(true)
        }).catch((err)=>{
          console.log(err)
        })
     })
    },
    changewidth(){
      let width = _this.chart.getWidth()
    },  
    drawLine(){
          // 基于准备好的dom，初始化echarts实例
         this.chart = echarts.init(document.getElementById('myChart'))
          // 绘制图标
         this.chart.setOption(this.option)
      }
  }
}

</script>

<style>
.home{
  display: flex;
  flex-direction: column;
}
.home .el-tabs__nav-wrap::after{ 
  height: 1px;
}
.ic{
  color: #106DE0;
  margin-right: 11px;
  font-size: 18px;
}
.tip{
  height: 41px;
  line-height: 41px;
  padding-left: 13px;
  background: #ffffff;
  color: #005BAC;
  margin-top: 9px;
  border-radius: 2px;
}
.tp{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
   cursor: pointer;
}
.block{
  float: right;
  display: block;
}
.order{
  background: white;
  margin-top: 16px;
  padding: 12px 16px 11px; 
  width: 100%;
  display: flex;
  justify-content: space-around;
  border-radius: 2px;
}
.everindent{
  width: 25%;
  margin-right:18px; 
  height: 102px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  overflow: hidden;
  padding: 16px 20px;
}
.everindent>span{
  color:#fff;
}
.everindent>span:nth-child(1){
  font-size: 30px;
}
.everindent>span:nth-child(2){
  font-size: 16px;
}
.everindent:nth-child(4){
  margin-right: 0px;
}
.account{
  margin-top: 21px;
  display: flex;
  justify-content: space-between;
}
.dynamic{
 background: #fff;
 flex:1;
  position: relative;
 border-radius: 2px;
}
.entrance{
  width: 300px;
  background: #fff;
  margin-left: 17px;
  display:flex;
  flex-wrap: wrap;
  border-radius: 2px;
}
.account .el-tabs__nav-scroll {
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    padding-right: 32px;
    height: 57px;
}
.account .el-tabs__nav-scroll .el-tabs__item{
  font-size: 16px;
  height: 57px;
  line-height: 57px;
}
.account .el-tabs__content{
  padding: 0 0 20px;
}
.tit{
  position: absolute;
  height: 57px;
  line-height: 57px;
  padding-left: 30px;
  color:RGBA(0, 0, 0, 0.85);
  font-size: 16px;

}
.billbox{
  width: 50%;
  padding: 15px 80px;
  display: inline-block;
  float: left;
}
.billbox span{
  font-size: 16px;
  color:RGBA(0, 0, 0, 0.65);
}
.everbill{
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.everbill p span{
  font-size: 16px;
}
.everbill p .red{
  color:RGBA(231, 79, 90, 1)
}
.everbill p .green{
   color:RGBA(34, 187, 35, 1);
}
.everbill p{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.everbill p img{
  margin-right: 10px;
}
.everbill .right{
  font-size: 20px;
  color:RGBA(0, 0, 0, 1);
}

.evershort{
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
   cursor: pointer;
}
.evershort:hover{
  box-shadow: 0px 3px 4px #ccc;
}
.evershort>img{
  width: 27px;
  height: 30px;
  margin-bottom: 15px; 
}
.evershort>span{
  font-size: 16px
}
.evershort:nth-child(1){
  width: 49.9%;
  border-bottom:1px solid transparent;
  border-right:1px solid #ECEDF2; 
}
.evershort:nth-child(4){
  width: 49.9%;
  border-top:1px solid #ECEDF2;
  border-left:1px solid transparent; 
}
.evershort:nth-child(2){
  width: 49.9%;
  border-bottom:1px solid transparent;
  border-left:1px solid transparent; 
}
.evershort:nth-child(3){
  width: 49.9%;
  border-top:1px solid #ECEDF2;
  border-right:1px solid #ECEDF2; 
}
.dh{
  transition: all .5s;
}
.chart{
  margin-top: 19px;
  border-radius: 2px;
  background: #fff;
}
#myChart{
  height:500px;
  padding-top: 15px;
  overflow: hidden;
}
.chartshead{
  height:80px;
  border-bottom: 1px solid #ECEDF2;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chartshead .el-form-item{
  margin-bottom: 0px;
}
.el-carousel{
    width: 100%;
    height:100%;
    overflow: hidden;
}
.el-carousel__container{
    position: absolute;
    left: 459px;
    top:41px;
    width: 41px;
    height: 500px!important;
    transform-origin: right top;
    transform: rotate(90deg);
}
.tp{
    width: 500px;
    height: 41px;
    display: flex;
    align-items: center;
    position: absolute;
    top: 500px;
    color:RGBA(0, 0, 0, 0.65);
    transform-origin: left top;
    transform: rotate(270deg)!important;
}

</style>