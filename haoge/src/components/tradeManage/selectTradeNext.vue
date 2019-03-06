<template>
    <div class="trademanage">
        <div class="filter">
            <div class="downinput">
                过滤器
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="(item, index) in options"
                    :key="index"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </div>
            <i class="el-icon-setting"></i>
            <el-button type="primary" icon="el-icon-search">查询</el-button>
            <i class="el-icon-download"></i>
        </div>
        <el-card shadow="never" class="condition">
            <div slot="header">
                <i :class="showfilter?'el-icon-arrow-up':'el-icon-arrow-down'" @click="changeshow" class="hico"></i>
            </div>
            <div v-show="showfilter" class="filtercond">
                <div class="everfilter" v-for="(item, index) of ruleform" :key="index" v-if="item.type == 'input'">
                    <span>{{item.label}}</span>
                    <el-input class="hip" v-model="item.value"></el-input>
                </div>
                <div class="everfilter" :key="index" v-else-if="item.type == 'time'">
                    <span>{{item.label}}</span>
                        <el-date-picker
                        class="hip"
                        v-model="item.value"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions2">
                        </el-date-picker>
                </div>
                <div class="everfilter" :key="index" v-else>
                    <span>{{item.label}}</span> 
                        <el-select  class="hip" v-model="item.value" multiple placeholder="请选择">
                        <el-option
                        v-for="(i, index) in item.opt"
                        :key="index"
                        :label="i"
                        :value="i">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </el-card>
        <div class="htable">
            <el-table
            :data="data">
                <el-table-column
                    v-for="(item, index) of filterTable"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :render-header="item.changehead?renderHeader:null">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import {filterTable} from '../../util/tabledata'
import { mapState } from 'vuex'
export default {
    data () {
        return {
            value:'',
            options: ['信用卡','支付链'],
            showfilter:true,
            ruleform:[
                {
                    label:'商户订单号',
                    value:'',
                    type:'input'
                },
                {
                    label:'交易类型',
                    value:[],
                    type:'checkbox',
                    opt:["消费","退款","预授权","预授权完成","预授权撤销","token创建","token创建并消费","token创建并预授权","token消费","token预授权"]
                },
                {
                    label:'交易状态',
                    value:[],
                    type:'checkbox',
                    opt:["成功","失败","处理中","待审核"]
                },
                {
                    label:'创建时间',
                    value:'',
                    type:'time'
                },
                {
                    label:'完成时间',
                    value:'',
                    type:'time'
                },
                {
                    label:'交易币种',
                    value:[],
                    type:'checkbox',
                    opt:["USD","USN"]
                }
            ],
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            filterTable,
            data:[
                {
                    orderNumber:103180607113582861,
                    seriaNumber:103180607113582861,
                    createTime:"2018-03-13 12:21:41 CST",
                    okTime:"2018-03-13 12:21:41 CST",
                    tradeCurrency:'USD',
                    tradeMoney:"31,000.00",
                    CardOrganization:'VISA',
                    status:'成功',
                    lastNum:1684,
                    telNumber:123456798
                },
                {
                    orderNumber:103180607113582861,
                    seriaNumber:103180607113582861,
                    createTime:"2018-03-13 12:21:41 CST",
                    okTime:"2018-03-13 12:21:41 CST",
                    tradeCurrency:'USD',
                    tradeMoney:"31,000.00",
                    CardOrganization:'VISA',
                    status:'成功',
                    lastNum:1684,
                    telNumber:123456798
                }
            ]
        }
    },
    methods:{
        changeshow(){
            this.showfilter = !this.showfilter
        },
        renderHeader(createElement, { column, _self }) {
            let label = column.label;
            let labelArr = label.split(' ');
            let _this = this
             return createElement(
                'div',
                {
                'class': 'header-center'
                },
                [
                    createElement('span', 
                        {
                            attrs: { type: 'text' },
                        }, [labelArr[0]]
                        ),
                    createElement('i', 
                        {
                            class: {
                                'el-icon-search':true
                            },
                            on: {
                                click(){ _this.showcontent(column)}
                            }
                        }
                        )
                ]
            );
        },
        showcontent(val){
            console.log(val)
        }
   },
   computed:{
      
   }
}
</script>
<style>
.header-center{
    width: 100%;  
}
.header-center span{
   font-size: 12px;
}
.header-center i{
    margin-left: 10px;
     cursor: pointer;
}
.trademanage .box-card{
    margin-top: 20px;
}
.trademanage .box-card h3{
    font-size: 18px
}
.trademanage .box-card .el-card__body{
    padding: 0
}
.trademanage .box-card .el-card__header{
    background: rgba(204, 204, 204, 1)
}
.trademanage .condition .el-card__header{
    background: rgba(232, 232, 232, 1);
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.trademanage .condition{
    margin-top: 20px
}

.filter{
    display: flex;
    align-items: center;
    padding: 20px 0 0 20px;
}

.downinput .el-select{
    margin-left: 10px;
    width: 130px;
}
.filter .el-icon-setting,.filter .el-icon-download{
    margin-left: 30px;
    font-size:30px;
    color:rgba(18, 150, 219, 1);
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px
}
.filter .el-button{
    margin-left: 30px;
}
.filter .el-button i,.filter .el-button span{
    font-size: 16px;
}
.filtercond{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-bottom: 15px;
}
.everfilter{
    margin-top: 15PX;
    display: flex;
    width: 30%;
    align-items: center;
}
.everfilter .hip{
    margin-left: 10px;
    width: 250px;
}
.hico{
    float: right; 
    padding: 3px 0;
    color:rgba(18, 150, 219, 1);
    font-size: 30px;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
}
.trademanage .htable{
    width: 500px;
    margin: 30px 0 30px 0;
    overflow: hidden;
}
.trademanage .el-table .cell{
    font-size: 12px;
    display: flex;
    align-items: center;
}
.trademanage .el-table th{
      background:rgba(24, 144, 255, 0.1)!important;
      color:rgba(0, 0, 0, 0.85)!important
}
.trademanage .el-table th div{
    padding-left: 5px;
}

</style>
