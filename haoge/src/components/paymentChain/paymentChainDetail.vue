<template>
  <div class="paymentChainDetail">
      <div class="commodityInfo">商品信息</div>
      <!-- 下载列表 -->
        <div class="queryPayment fr">
            <router-link to="/home/tradeManage">
                <el-button type="primary" size="small">查询支付链交易</el-button>
            </router-link>
        </div>
      <!--表格-->
        <el-table
        class="tableData"
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        empty-text=""
        >   
            <el-table-column
                prop="productname"
                label="商品名称"
                align="center">
            </el-table-column>
            <el-table-column
                prop="productspec"
                label="商品规格"
                align="center">
            </el-table-column>
            <el-table-column
                prop="productnum"
                label="数量"
                align="center">
            </el-table-column>
            <el-table-column
                prop="price"
                label="商品价格"
                align="center">
            </el-table-column>
            <el-table-column
                prop="currencyCode"
                label="交易币种"
                align="center">
            </el-table-column>
            <el-table-column
                prop="site"
                label="商品展示网址"
                align="center">
                <template slot-scope="scope">
                    <a :href="`http://${scope.row.site}`" target="_blank">{{scope.row.site}}</a>
                </template>
            </el-table-column>
            <div slot="empty" class="noData">
                <img src="../../assets/images/frown-o@2x.png" alt="">
                <p>暂无数据</p>
            </div>
        </el-table>
        <div class="commodityAmount">
             <span>商品金额：</span> 
             <span>{{productamount}} {{feecurrencycode}}</span>
             <span>{{otherfeename}}：</span> 
             <span>{{fee}}</span>  
        </div>
        <div class="totalAmount">
            <span>总计金额：</span> 
            <span>{{totalamount}} {{feecurrencycode}}</span>
        </div>
        <div class="commodityInfo">商户信息</div>
        <el-table
        :data="commodityInfoData"
        style="width: 100%"
        :show-header=false
        :default-sort = "{prop: 'date', order: 'descending'}"
        empty-text=""
        >   
            <el-table-column
                prop="logopath"
                align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.logopath" alt="" style="height: 50px;">
                </template>
            </el-table-column>
            <el-table-column
                prop="merchantsite"
                align="center">
                <template slot-scope="scope">
                    <a :href="`http://${scope.row.merchantsite}`" target="_blank">{{scope.row.merchantsite}}</a>
                </template>
            </el-table-column>
            <el-table-column
                prop="contact"
                align="center">
            </el-table-column>
            <el-table-column
                prop="shoptermsName"
                align="center">
            </el-table-column>
        </el-table>
        <div class="commodityInfo">其他信息</div>
        <div class="otherInfo">
            <p><span>支付链地址：</span><a :href="payLinkName" target="_blank">{{payLinkName}}</a></p>
            <div>
                <span>支付链状态：</span>
                <span v-if="status==0">生效</span>
                <span v-else>失效</span>
            </div>
            <div><span>创建时间：</span><span>{{createtime}}</span></div>
            <div><span>失效时长：</span><span style="color:#F5222D;"> {{invalidtimelong}} {{leftTimelong==""?'':'('+leftTimelong+')'}}</span></div> 
        </div>
        <p class="back"><router-link to="/home/paymentChain/paymentChainQuery"><img src="../../assets/images/icon-back@2x.png" alt="">返回列表</router-link></p>
  </div>
</template>

<script>
import "../../assets/css/hmdCommon.css"
import classPost from '../../servies//classPost'
export default {
  data () {
    return {
        status:'',
        currencyCode:'',
        payChainNo:'',
        otherfeename:'',
        productamount:'',
        totalamount:'',
        feecurrencycode:"",
        fee:'',
        payLinkName:'',
        createtime:'',
        invalidtimelong:'',
        leftTimelong:'',
        otherCost:1111,
        tableData: [
            ],
        commodityInfoData:[
        ]    
    }
  },
    created(){
        this.payChainNo=this.$route.query.name
        this.paymentChainDetail();
    },
    methods:{
       paymentChainDetail(){
          var obj={
              payChainNo:this.payChainNo
          }
          classPost.paymentChainDetail(obj)
            .then((res)=>{
                console.log(res)
                console.log(res.data);
                //表格
                this.tableData=res.data.payLinkAttribs  
                //其他渲染
                this.otherfeename=res.data.otherfeename
                this.productamount=res.data.productamount
                this.totalamount=res.data.totalamount
                this.feecurrencycode=res.data.feecurrencycode
                this.fee=res.data.fee
                this.payLinkName=res.data.payLinkName
                this.createtime=res.data.createtime
                this.invalidtimelong=res.data.invalidtimelong
                this.leftTimelong=res.data.leftTimelong
                this.status=res.data.status

                //商品信息
                var arr=[
                    {logopath:res.data.logopath,merchantsite:res.data.merchantsite,contact:res.data.contact,shoptermsName:res.data.shoptermsName},
                ]
                this.commodityInfoData=arr
            }).catch((err)=>{
                console.log(err)
        })
      }      
    },
    computed:{
        getCommodityAmount:function(){
            var sum=0
            for(var i=0;i<this.tableData.length;i++){
                sum+=this.tableData[i].productnum*this.tableData[i].price
            }
            return sum
        },
        getTotalAmount:function(){
            return this.getCommodityAmount + this.otherCost
        },
         
    },
}

</script>

<style>

a{
    text-decoration: none;
}
.clearfix:after{ content: ""; display: block;width:0; height: 0; clear: both; visibility: hidden; }
.clearfix { zoom: 1; }
.fl{
    float: left;
}
.fr{
    float: right;
}
.paymentChainDetail{
    background: #fff;
    margin-top:20px;
    padding:0 32px;
    overflow: hidden;
}

.commodityAmount,.totalAmount{
    width:100%;
    height:53px;
    line-height: 53px;
    border-bottom:1px solid #ebeef5;
    padding: 0 67px;
}
.commodityAmount span:nth-child(3){
    margin-left:15%;
}
.totalAmount span:nth-child(2){
    color:#FF6D33;
}
.paymentChainDetail .queryPayment{
    margin-right:10px;
    margin-bottom:10px;
}
.paymentChainDetail .commodityInfo{
    font-size:16px;
    color:rgba(0,0,0,0.85);
    margin:20px auto;
    font-weight: 700;
}
.paymentChainDetail .tableData.el-table th{
    background: rgba(24, 144, 255, 0.1);
    color:#000;
}
.otherInfo{
    border-bottom:1px dashed #ccc;
    padding:20px 0 100px 0;
}
.otherInfo p{
    line-height: 40px;
}
.otherInfo p span:nth-child(2){
    color:#1890FF;
}
.otherInfo div{
    display: inline-block;
    padding-right:70px;
    line-height: 40px;
}
.paymentChainDetail .back{
    text-align: center;
    margin:31px 0 138px 0;
}
.paymentChainDetail .back a{
    color:#1890FF;
}
.paymentChainDetail .back img{
    width: 11px;
    height: 8px;
    margin-right: 5px;
}
</style>