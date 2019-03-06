<template>
    <div class="echarts">
        <div class="selt">
            <span>选择月份</span>
             <el-date-picker
                size="small"
                v-model="time"
                type="month"
                value-format="yyyy-MM"
                align="center"
                placeholder="选择月份"
                :picker-options="pickerOptions2">
            </el-date-picker>
            <el-button size="small" @click="select" type="primary">查询</el-button>
        </div>
        <div id="cas"></div>
    </div>
</template>
<script>
import classPost from '../../servies/classPost'
import {formatDateTime,showtime,ExportExcel} from '../../util/commonality'
export default {
    data () {
        return {
            time:'',
            defaultdata:[,'欺诈占比','未收到货占比','未收到退款占比','货不对板占比'],
            option:{
                tooltip: {
                  formatter:function(params){  
                    var relVal = params.name;  
                   
                    if( params.seriesName==='成功率'){
                        relVal += '<br/>' + params.seriesName + ' : ' + params.value+"%";  
                    }else if(params.seriesName==="成功笔数"){
                        relVal += '<br/>' + params.seriesName + ' : ' + params.value+"笔";  
                    }else if(params.seriesName==="成功金额"){
                        relVal += '<br/>' + params.seriesName + ' : ' + params.value+"千元"
                    }else{
                        relVal += '<br/>' + params.seriesName + ' : ' + params.value+"%"
                    } 
                    return relVal;  
                  }  
                },
               color:['#70D3BF','#B6E0FD','#EF848C','#37A2DA','#67E0E3','#32C5E9','#9FE6B8','#FFDB5C','#ff9f7f','#fb7293','#E062AE','#E690D1','#e7bcf3','#9d96f5','#8378EA','#96BFFF'],
                legend:[
                    {
                        top:'41%',
                        type:'scroll',
                        width:1000,
                        left:20,
                        data:[0]
                    },
                    {
                        top:30,
                        data:['成功率','成功笔数','成功金额']
                    },
                    {
                        top:'70%',
                        right:0,
                        orient: 'vertical',
                        data:['发卡行拒绝05','可用余额不足3084','风险订单0053','其他原因失败']
                    },
                    {
                        bottom:'10%',
                        left:250,
                        orient: 'vertical',
                        data:['欺诈','未收到货','未收到退款','货不对板']
                    }
                ],
                toolbox:{
                    feature: {
                        dataView: {
                            show: true,
                            lang:['数据图表','关闭','导出图表'],
                            readOnly: false,
                            contentToOption:function(){
                                ExportExcel('tableExcel_Day')
                            },
                             optionToContent: function(opt) {
                                var axisData = opt.xAxis[0].data;
                                var series = opt.series;
                                var table = '<table id="tableExcel_Day" rules=none style="width:80%;text-align:center"><tbody><tr>'
                                    + '<td>时间</td>'
                                    + '<td>' + series[0].name + '（笔）</td>'
                                    + '<td>' + series[1].name + '</td>'
                                    + '<td>' + series[2].name + '（千元）</td>'
                                    + '</tr>';
                                for (var i = 0, l = axisData.length; i < l; i++) {
                                    table += '<tr>'
                                    + '<td>' + axisData[i] + '</td>'
                                    + '<td>' + series[0].data[i] + '</td>'
                                    + '<td>' + series[1].data[i] + '%</td>'
                                    + '<td>' + series[2].data[i] + '</td>'
                                    + '</tr>';
                                }
                                if(series[3].data[0].value){
                                    table+='<tr style="height:20px"><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td></tr>'+'<tr>'+
                                        '<td>拒付原因</td>'+
                                        '<td>拒付原因占比</td>'
                                        +'</tr>'
                                    for (var i = 0; i < series[3].data.length; i++) {
                                        table += '<tr>'
                                        + '<td>' + series[3].data[i].name + '</td>'
                                        + '<td>' + series[3].data[i].value + '%</td>'
                                        + '</tr>';
                                    }
                                }
                                if(series[4].data[0].value){
                                     table+='<tr style="height:20px"><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td></tr>'+'<tr>'+
                                        '<td>前十大卡bin国家</td>'+
                                        '<td>前十大卡bin国家分布占比</td>'
                                        +'</tr>'
                                    for (var i = 0; i < series[4].data.length; i++) {
                                        table += '<tr>'
                                        + '<td>' + series[4].data[i].name + '</td>'
                                        + '<td>' + series[4].data[i].value + '%</td>'
                                        + '</tr>';
                                    }
                                }
                               if(series[5].data[0].value){
                                    table+='<tr style="height:20px"><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td><td style="border-top:1px solid #000"></td></tr>'+'<tr>'+
                                    '<td>主要失败原因</td>'+
                                    '<td>主要失败原因占比</td>'
                                    +'</tr>'
                                    for (var i = 0; i < series[5].data.length; i++) {
                                        table += '<tr>'
                                        + '<td>' + series[5].data[i].name + '</td>'
                                        + '<td>' + series[5].data[i].value + '%</td>'
                                        + '</tr>';
                                    }
                                }
                                table += '</tbody></table>';
                                return table;
                            }
                        },
                        saveAsImage: {show: true}
                    }
                },
                title: [{
                    text: '交易趋势图',
                    subtext:'暂无数据',
                    x: '50%',
                    y: 60,
                    textAlign: 'center'
                }, 
                {
                    text: '前10大卡bin国家分布',
                    subtext: '暂无数据',
                    x: '30%',
                    y: '44%',
                    textAlign: 'center'
                }, 
                {
                    text: '拒付原因占比图',
                    subtext:'暂无数据',
                    x: '50%',
                    y: '72%',
                    textAlign: 'center'
                }, 
                {
                    text: '主要失败原因占比',
                    subtext:'暂无数据',
                    x: '70%',
                    y: '44%',
                    textAlign: 'center'
                }],
                grid:[{ 
                    top:130,
                    width: '90%',
                    bottom: '65%',
                    left: 50
                }],
                yAxis: [
                    {
                    type: 'value',
                    name:'成功笔数', 
                    yAxisIndex:0,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                    {
                    type: 'value',
                    name:  '成功金额',
                     yAxisIndex:1,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }],
                xAxis: [{
                    type: 'category',
                    data:[],
                    axisLabel: {
                        interval: 0,
                        rotate: 30
                    },
                    axisPointer: {
                            type: 'shadow'
                        },
                    splitLine: {
                        show: false
                    }
                }],
                series: [
                {
                    type: 'line',
                    name: '成功笔数',
                    yAxisIndex:0,
                    stack: 'chart',
                    data: [0]
                },
                {
                    type: 'bar',
                    name:'成功率',
                    stack: 'chart',
                    
                    data:[0]
                },
                {
                    type: 'line',
                    name: '成功金额',
                    stack: 'chart',
                    yAxisIndex:1,
                    data: [0]
                },
                {
                    type: 'pie',
                    radius: [0, '20%'],
                    center: ['50%', '87%'],
                    data: [0]
                },
                {
                    type: 'pie',
                    radius: [0, '20%'],
                    center: ['30%', '61%'],
                    data: [0]
                },
                {
                    type: 'pie',
                    radius: [0, '20%'],
                    center: ['70%', '61%'],
                    data: [0]
                }]
            },
            back:[{
                name:'欺诈',  
            },
            {
                name:'未收到货',
            },
            {
                name:'未收到退款',
            },
            {
                name:'货不对板'
            }],
            reas:[{
                name:'风险订单0053'    
            },
            {
                name:"发卡行拒绝05",
            },
            {
                name:'可用余额不足3084'
            },
            {
                name:'其他原因失败'
            }],
            echats:'',
//            控住日期范围
            pickerOptions2: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
        } 
    },
   
    mounted(){
        let _this = this
        this.echats = echarts.init(document.getElementById('cas'))
        this.echats.setOption(this.option)
        this.settime()
        this.select()
        this.$eventBus.$on('chart2',function(width){
            document.getElementById('cas').width=window.innerWidth-width-40+'px'
            _this.echats.resize();
        })
        window.onresize = function(){
            _this.echats.resize();
        }
    },
    methods:{
        settime(){
            let time = formatDateTime(new Date(new Date().getFullYear(),new Date().getMonth()-1).getTime())//一会改回来 -1
            time = time.split(' ')[0];
            time = time.substring(0,time.lastIndexOf('-'))
            this.time = time
        },
        select(){
            this.echats.setOption(this.option)
            classPost.querytradereport({tradeMonth:this.time})
            .then((res)=>{
                let obj,obj1,obja,obj2,back,reas;
                if(res.data.chargeBackStat&&res.data.tradeFailReasonStat){
                    let {reason1,reason2,reason3,reason4} = res.data.chargeBackStat;
                    let {respCode0053,respCode05,respCode3084,respCodeOther}=res.data.tradeFailReasonStat
                    obj1 = {respCode0053,respCode05,respCode3084,respCodeOther}
                    obj = {reason1,reason2,reason3,reason4};
                    obja = Object.keys(obj)
                    obj2 = Object.keys(obj1)
                    
                    back = this.back.map((item, index)=>{
                        item = Object.assign(item,{'value':obj[obja[index]]})
                        return {...item}
                    })
                    reas = this.reas.map((item,index)=>{
                        item=Object.assign(item,{'value':obj1[obj2[index]]})
                        return {...item}
                    })         
                }
                this.echats.setOption({
                    legend:[
                        {
                            data:res.data.cardBinStat.length?res.data.cardBinStat.map(item=>{
                                return item.cardBinCountry
                            }):[]
                        }
                    ],
                    xAxis:[
                        {
                            data:res.data.tradeDailyStatList?res.data.tradeDailyStatList.map(item => {
                                item.tradeDate = showtime(item.tradeDate.toString())
                                return item.tradeDate
                            }):[0]
                        }
                    ],
                    yAxis:[
                        {
                            data:res.data.tradeDailyStatList.length?res.data.tradeDailyStatList.map(item => item.successNum):[0]
                        },
                        {
                            data:res.data.tradeDailyStatList.length?res.data.tradeDailyStatList.map(item => item.successNum/item.validNum*100?item.successNum/item.validNum*100:0):[0]
                        }
                    ],
                    title:[
                        {
                           subtext:res.data.tradeDailyStatList.length?'':'暂无数据'
                        },
                        {
                           subtext:res.data.cardBinStat.length?'':'暂无数据'
                        },
                        {
                           subtext:res.data.tradeFailReasonStat?'':'暂无数据'
                        },
                        {
                           subtext:res.data.chargeBackStat ?'':'暂无数据'
                       }
                    ],
                    series:[ 
                        {
                            data:res.data.tradeDailyStatList.length?res.data.tradeDailyStatList.map(item => item.successNum ):[0]
                        },
                        {
                            data:res.data.tradeDailyStatList.length?res.data.tradeDailyStatList.map(item => item.successNum/item.validNum*100?(item.successNum/item.validNum*100).toFixed(2):0 ):[0]
                        },
                        {
                            data:res.data.tradeDailyStatList.length?res.data.tradeDailyStatList.map(item => (item.successAmount/1000).toFixed(5)):[0]
                        },
                        {
                            data:back?back.map(item=>{
                                return {
                                    name:item.name,
                                    value:item.value=item.value.substring(0,item.value.lastIndexOf('%'))
                                }
                            }):[0]
                        },
                        {
                            data:res.data.cardBinStat.length?res.data.cardBinStat.map(item => {
                                return {
                                    name:item.cardBinCountry,
                                    value:item.percent = item.percent.substring(0,item.percent.lastIndexOf('%'))
                                }
                            }):[0]
                        },
                        {
                            data:reas?reas.map((item)=>{
                                return {
                                    name:item.name,
                                    value:item.value=item.value.substring(0,item.value.lastIndexOf('%'))
                                }
                            }):[0]
                        }
                    ]
                    })
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }
}
</script>
<style>
.echarts{
    margin-top: 20px;
    padding: 20px;
    background: RGBA(255, 255, 255, 1)
}
.echarts .selt .el-input{
    margin-left: 10px;
   
}
.echarts .selt .el-button{
    margin-left: 10px;
}

#cas{
    width: 100%;
    height: 1200px;
    margin-top: 20px;
}
</style>
