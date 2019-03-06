<template>
  <div class="paymentChainInit">
      <div class="commodityInfo">商品信息</div>
      <div class="continueAdd" v-if="tableData.length==0" @click="dialogFormVisible=true"><i class="el-icon-plus" style="margin-right: 10px;"></i>添加</div>
      <div class="continueAdd" v-if="tableData.length<10&&tableData.length!=0" @click="dialogFormVisible=true"><i class="el-icon-plus" style="margin-right: 10px;"></i>继续添加</div>
      <el-dialog title="添加商品信息"  width="35%" custom-class="resetinput" :visible.sync="dialogFormVisible">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="商品名称：" :label-width="formLabelWidth" prop="name">
              <el-input v-model="form.name" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品规格：" :label-width="formLabelWidth" prop="specifications">
              <el-input v-model="form.specifications" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品数量：" :label-width="formLabelWidth" prop="number">
              <el-input v-model="form.number" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="交易币种：" :label-width="formLabelWidth" prop="currency">
              <el-select :disabled="tableData.length!=0" v-model="form.currency" placeholder="请选择活动区域" clearable  ref="currency">
                <el-option v-for="(item,index) in currencyList" :key="index" :label="`${item.zhCnMessage}(${item.alphaCode})`" :value="item.alphaCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品金额：" :label-width="formLabelWidth" prop="price"> 
              <el-input v-model="form.price" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品展示网址：" :label-width="formLabelWidth" prop="website">
              <el-input v-model="form.website" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="esc" size="small">取消</el-button>
            <el-button type="primary" @click="submitForm('form')" :disabled="a==false" size="small">确定</el-button>
          </div>
      </el-dialog>
      <el-dialog title="修改商品信息" width="35%" custom-class="resetinput" :visible.sync="editFormVisible">
          <el-form :model="editform" :rules="rules" ref="editform">
            <el-form-item label="商品名称：" :label-width="formLabelWidth" prop="name">
              <el-input v-model="editform.name" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品规格：" :label-width="formLabelWidth" prop="specifications">
              <el-input v-model="editform.specifications" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品数量：" :label-width="formLabelWidth" prop="number">
              <el-input v-model="editform.number" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="交易币种：" :label-width="formLabelWidth" prop="currency">
              <el-select :disabled="tableData.length!=0&&tableData.length>1" v-model="editform.currency" placeholder="请选择活动区域" clearable  ref="currency">
                <el-option v-for="(item,index) in currencyList" :key="index" :label="`${item.zhCnMessage}(${item.alphaCode})`" :value="item.alphaCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品金额：" :label-width="formLabelWidth" prop="price"> 
              <el-input v-model="editform.price" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品展示网址：" :label-width="formLabelWidth" prop="website">
              <el-input v-model="editform.website" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editFormVisible=false" size="small">取消</el-button>
            <el-button type="primary" @click="submitEditForm('editform')" size="small">确定</el-button>
          </div>
      </el-dialog>
          <!--表格-->
          <el-table
              class="tableData"
              :data="tableData"
              style="width: 100%"
              :default-sort = "{prop: 'date', order: 'descending'}"
              empty-text="">   
              <el-table-column
                  prop="name"
                  label="商品名称"
                  align="center">
              </el-table-column>
              <el-table-column
                  prop="specifications"
                  label="商品规格"
                  align="center">
              </el-table-column>
              <el-table-column
                  prop="number"
                  label="数量"
                  align="center">
              </el-table-column>
              <el-table-column
                  prop="price"
                  label="商品价格"
                  align="center">
              </el-table-column>
              <el-table-column
                  prop="currency"
                  label="交易币种"
                  align="center">
              </el-table-column>
              <el-table-column
                  prop="website"
                  label="商品展示网址"
                  align="center">
                  <template slot-scope="scope">
                    <a :href="`http://${scope.row.website}`" target="_blank">{{scope.row.website}}</a>
                  </template>
              </el-table-column>
              <el-table-column
                  prop="operation"
                  label="操作"
                  align="center"
                  width="150">
                  <template slot-scope="scope"> 
                    <el-button  @click="edit(scope.row.name,scope.row.specifications,scope.row.number,scope.row.price,scope.row.currency,scope.row.website,scope.$index)" type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small" @click="open6(scope.$index, tableData)">删除</el-button>
                  </template>
              </el-table-column>
              <div slot="empty" class="noData">
                  <img src="../../assets/images/frown-o@2x.png" alt="">
                  <p>您还没有添加商品信息</p>
              </div>
          </el-table>
          <div class="commodityAmount">
              <span>商品金额：</span> 
              <span>{{getCommodityAmount}}  {{currency}}</span>
          </div>
        <div class="cost">
            <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="137px" class="demo-ruleForm">
                <el-form-item label="其他费用：" prop="cost">
                  <el-select v-model="ruleForm.cost" placeholder="请选择" clearable @change="changeCost">
                    <el-option v-for="(item,index) in feeEnumsList" :key="index" :label="item.desc" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="其他费用金额：" prop="otherCost">
                  <el-input v-model="ruleForm.otherCost"  placeholder="请输入" style="width:180px;" clearable @change="changeOtherCost"></el-input>
                  <span style="color:rgba(0,0,0,0.45);margin-left:15px;">其他费用币种与商品交易币种一致</span>
                </el-form-item>
          </el-form>
        </div>
        <div class="totalAmount">
            <span>总计金额：</span> 
            <span>{{getTotalAmount/1000}}  {{currency}}</span>
        </div>
        <div class="commodityInfo">商户信息</div>
        <el-table
        class='commodityInfoTable'
        :data="commodityInfoData"
        style="width: 100%"
        :show-header=false
        :default-sort = "{prop: 'date', order: 'descending'}"
        empty-text=""
        >   
            <el-table-column
                prop="pictureId"
                align="center">
                <template slot-scope="scope">
                    <el-radio v-model="radio" :label="scope.row.pictureId">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column
                prop="pictureUrl"
                align="center">
                <template slot-scope="scope">
                    <div class="logo" style="height:50px;">
                        <img :src="scope.row.pictureUrl" alt=""> 
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="merchantSite"
                align="center">
                <template slot-scope="scope">
                    <a :href="`http://${scope.row.merchantSite}`" target="_blank">{{scope.row.merchantSite}}</a>
                </template>
            </el-table-column>
            <el-table-column
                prop="contact"
                align="center">
            </el-table-column>
            <el-table-column
                prop="shoptermsName"
                align="center">
                <template slot-scope="scope">
                    <a :href="scope.row.shoptermsUrl" target="_blank">{{scope.row.shoptermsName}}</a>
                </template>
            </el-table-column>
        </el-table>
        <div class="commodityInfo">其他信息</div>
        <div class="otherInfo">
            <el-form :inline="true" :model="otherInfoForm" :rules="rules" ref="otherInfoForm" label-width="100px" class="demo-otherInfoForm">
                <el-form-item label="失效时长：" prop="failureTime">
                  <el-input v-model="otherInfoForm.failureTime"  placeholder="请输入失效时长" style="width:160px;" clearable></el-input>
                  <span style="color:rgba(0,0,0,0.45);margin-left:15px;">不超过168小时</span>
                </el-form-item>
                <p class="generatingPaymentChain">
                  <el-button type="primary" size="small" @click="submitFormInit('otherInfoForm')" :disabled="b==false">生成支付链</el-button>
                </p>
          </el-form> 
        </div>
        <el-dialog
          title="提示"
          width="30%"
          :visible.sync="show">
          <span>您尚未设置基本信息，无法生成支付链</span>
          <span slot="footer" class="dialog-footer">
            <router-link to="/home/paymentChain/basicInfoMaintenance">
                <el-button type="primary">立即设置</el-button>
            </router-link>
          </span>
        </el-dialog>
  </div>
</template>

<script>
import "../../assets/css/hmdCommon.css"
import classPost from '../../servies//classPost'
import { random, currencynum } from '../../util/commonality'
export default {
  data () {
    var checkNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入商品数量'));
        }
        setTimeout(() => {
          if (!(/^[1-9]\d*$/.test(value))) {
              callback(new Error('请输入正整数'));
            } else {
              if(this.form.number>100||this.editform.number>100){
                  callback(new Error('商品数量不能超过100个'));
              }else{
                  callback();
              }
            }
        }, 1000);
      };
      var checkPrice = (rule, value, callback) => {
        let num = currencynum(this.form.currency)
        let arr = value.indexOf('.')!==-1?value.split('.'):value
        const reg = /[^\d]/
        if(!value){
            callback(new Error('请输入商品金额'))
          }else{
            if(num==='0'){
              if(value.indexOf('.')!==-1){
                callback('请输入合法的数值')
              }else{
                callback()
              }
            }else{
              if(typeof arr!=='string'){
                if(arr.length > 2 || num < arr[1].length || reg.test(arr[1])){
                  callback('请输入合法的数值')
                }else{
                  callback()
                }
              }else{
                if( value*1<=0 ){
                  callback(new Error('金额必须大于0'))
                }else if(reg.test(value)){
                  callback('请输入合法的数值')
                }else{
                  callback()
                }
              }
             }
            
          }
      }
      var checkTime = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入失效时长'));
        }
        setTimeout(() => {
            if (!(/^[1-9]\d*$/.test(value))) {
              callback(new Error('请输入正整数'));
            } else {
              if(this.otherInfoForm.failureTime>168){
                  callback(new Error('不得超过168小时'));
              }else{
                  callback();
              }
            }
        }, 1000);
      };
     
      var checkotherCost = (rule, value, callback) => {
        let num = currencynum(this.form.currency)
        let arr = value.indexOf('.')!==-1?value.split('.'):value
        const reg = /[^\d]/
        if(this.ruleForm.cost!=''){
         if(!value){
           callback(new Error('请输入费用金额'));
         }else{
              if (!(/^\d+(?=\.{0,1}\d+$|$)/.test(value))) {
                callback(new Error('请输入数字值'));
              } else {
                  if(this.ruleForm.otherCost>10000){
                      callback(new Error('不得超过10000'));
                  }else{
                      if(this.form.currency!=''){
                        if(num==='0'){
                            if(value.indexOf('.')!==-1){
                              callback('请输入合法的数值')
                            }else{
                              callback()
                            }
                          }else{
                            if(typeof arr!=='string'){
                              if(arr.length > 2 || num < arr[1].length || reg.test(arr[1])){
                                callback('请输入合法的数值')
                              }else{
                                callback()
                              }
                            }else{
                              if( value*1<0 ){
                                callback(new Error('金额不能小于0'))
                              }else if(reg.test(value)){
                                callback('请输入合法的数值')
                              }else{
                                callback()
                              }
                            }
                        }
                      }
                  }
              }
         }
        }else{
            if (!(/^\d+(?=\.{0,1}\d+$|$)/.test(value))) {
                callback(new Error('请输入数字值'));
              } else {
                if(this.ruleForm.otherCost>10000){
                    callback(new Error('不得超过10000'));
                }else{
                   if(this.form.currency!=''){
                    if(num==='0'){
                          if(value.indexOf('.')!==-1){
                            callback('请输入合法的数值')
                          }else{
                            callback()
                          }
                        }else{
                          if(typeof arr!=='string'){
                            if(arr.length > 2 || num < arr[1].length || reg.test(arr[1])){
                              callback('请输入合法的数值')
                            }else{
                              callback()
                            }
                          }else{
                            if( value*1<=0 ){
                              callback(new Error('金额不能为0或者小于0'))
                            }else if(reg.test(value)){
                              callback('请输入合法的数值')
                            }else{
                              callback()
                            }
                          }
                        }
                   }
                }
              }
        }
       
      };
      var checkCost = (rule, value, callback) => {
        // console.log(value)
        if(this.ruleForm.otherCost!=''){
          if(value==''){
            callback(new Error('请选择费用类型'));
          }else{
            callback();
          }
        }else{
          callback();
        }

      };
    return {
        a:true,
        b:true,
        payChainNumber:'',
        index:"",
        payChainNo:'',
        currency:"",
        radio:"",
        editFormVisible:false,
        dialogFormVisible: false,
        currencyList:[],
        feeEnumsList:[],
        ruleForm: {
          cost: '',
          otherCost: '',
        },
        otherInfoForm:{
          failureTime:'',
        },
        form: {
          name: '',
          specifications: '',
          number: '',
          currency: '',
          price: '',
          website: '',
        },
        editform:{
          name: '',
          specifications: '',
          number: '',
          currency: '',
          price: '',
          website: '', 
        },
        currencyQuery:'',
        rules: {
          name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 1, max: 200, message: '商品名称不能超过200个字符', trigger: 'blur' }
          ],
          specifications: [
            { min: 0, max: 50, message: '商品规格不能超过50个字符', trigger: 'blur' }
          ],
          number: [
            { required: true, validator: checkNumber, trigger: 'change' },
          ],
          currency: [
            { required: true, message: '请输入交易币种', trigger: 'change' },
          ],
          price: [
            { required: true, validator: checkPrice, trigger: 'change' },
          ],
          failureTime: [
            { required: true, validator: checkTime, trigger: 'blur'},
          ],
          cost: [
            {validator: checkCost, trigger: 'change'},
          ],
          otherCost: [
            {validator: checkotherCost, trigger: 'blur'},
          ],
        },
        formLabelWidth: '120px',
        tableData: [
            ],
        commodityInfoData:[
        ],
        show:false
    }
  },
  created(){
    this.paymentChainIndex();
    this.payChainNumber=this.$route.query.name
    if(this.$route.query.name!=null){
        this.clone();
    }
    this.currencyList=JSON.parse(localStorage.current);
    console.log(this.currencyList)
    this.currencyQuery=this.$route.query.currency
    if(this.currencyQuery!=''){
      this.form.currency=this.currencyQuery
    }
  },
   methods: {
     changeCost(){
        this.$refs['ruleForm'].validateField("otherCost");
     },
     changeOtherCost(){
        this.$refs['ruleForm'].validateField("cost");
     },
     //支付链克隆
    clone(){
        var obj={
            payChainNo:this.payChainNumber
        }
        console.log(obj)
        classPost.paymentChainClone(obj)
            .then((res)=>{
                console.log(res)
                if(res.payChainNo!=""){
                    //this.currencyList=JSON.parse(res.data.currencyCodeEnums)
                    this.feeEnumsList=JSON.parse(res.data.feeEnums)

                    //商户信息
                    this.commodityInfoData=res.data.logoList
                    this.commodityInfoData.forEach((item)=>{
                      if(item.selectedFlag==null){
                          this.radio=this.commodityInfoData[0].pictureId;
                      }else{
                         this.radio=item.pictureId
                      }
                    })
                    //商品信息
                    this.tableData=res.data.payLinkAttribs
                    var data=[];
                    for(let i=0;i<this.tableData.length;i++){
                      data.push({
                          currency:this.tableData[i].currencyCode,
                          price:this.tableData[i].price,
                          name:this.tableData[i].productname,
                          number:this.tableData[i].productnum,
                          specifications:this.tableData[i].productspec,
                          website:this.tableData[i].site,
                      })
                    }
                    this.tableData=data
                    
                }
            }).catch((err)=>{
                console.log(err)
        })
    },
     //支付链生成页面初始化
      paymentChainIndex(){
          classPost.paymentChainIndex({})
            .then((res)=>{
                console.log(res.data)
                this.feeEnumsList=JSON.parse(res.data.feeEnums)
                console.log(res.data.logoList)
                this.commodityInfoData=res.data.logoList
                //this.radio=this.commodityInfoData[0].pictureId;
                if(this.commodityInfoData.length==0){
                  this.show=true;
                }else{
                  this.radio=this.commodityInfoData[0].pictureId;
                }
            }).catch((err)=>{
                console.log(err)
        })
      },
      //支付链生成点击按钮
      paymentChainInit(){
        // if((this.ruleForm.otherCost!=''&&this.ruleForm.cost=='')||(this.ruleForm.otherCost==''&&this.ruleForm.cost!='')){
        //   this.$message('2')
        // }else{
        //   // 可继续
        // }

          let data=[];
          for(let i=0;i<this.tableData.length;i++){
            data.push({
              currencyCode:this.tableData[i].currency,
              price:this.tableData[i].price,
              productname:this.tableData[i].name,
              productnum:this.tableData[i].number,
              productspec:this.tableData[i].specifications,
              site:this.tableData[i].website
            })
          }
          var obj={
              otherfeename:this.ruleForm.cost,
              fee:this.ruleForm.otherCost,
              payLinkAttribs:data,
              pictureId:this.radio,
              productamount:this.getCommodityAmount,
              totalamount:this.getTotalAmount/1000,
              invalidtimelong:this.otherInfoForm.failureTime
          }
          classPost.paymentChainInit(obj)
            .then((res)=>{
                console.log(res);
                this.payChainNo=res.data.payChainNo
                if(res.status==1){
                    this.$confirm('支付链生成成功!<h1 style="word-wrap: break-word;">'+res.data.payLinkName+'</h1>', '提示', {
                    confirmButtonText: '查看',
                    cancelButtonText: '继续添加',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    closeOnClickModal:false
                    }).then((res) => {
                        this.$router.push({name:'LANG.router.paymentChain.paymentChainQuery',params:{id:this.payChainNo}});
                    }).catch((res) => {
                        
                  });
                }else{
                    this.$confirm('支付链生成失败!<h1>失败原因'+res.message+'</h1>', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        }).then(() => {
                          // this.$message({
                          //   type: 'success',
                          //   message: '删除成功!'
                          // });
                        }).catch(() => {
                          // this.$message({
                          //   type: 'info',
                          //   message: '已取消删除'
                          // });          
                        });
                }
            }).catch((err)=>{  
        })
      },
      edit(name,specifications,number,price,currency,website,scope){
          this.index=scope
          this.editform.name=name
          this.editform.specifications=specifications
          this.editform.number=number
          this.editform.price=price
          this.editform.currency=currency
          this.editform.website=website
          this.editFormVisible=true
      },
      submitForm(formName) {
        this.a=false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //弹框消失
            this.dialogFormVisible=false;
            var obj={
              name: this.form.name,
              specifications: this.form.specifications,
              number: this.form.number,
              price: this.form.price,
              currency: this.form.currency,
              website: this.form.website,
            }
            this.tableData.push(obj);
            this.currency= this.form.currency;
            //弹框消失
            this.dialogFormVisible=false;
            //内容重新置空
            this.form.name=""
            this.form.specifications=""
            this.form.number=""
            this.form.price=""
            this.form.website=""
            this.a=true;
          } else {
             this.a=true;
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitEditForm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
                this.tableData[this.index].name=this.editform.name,
                this.tableData[this.index].specifications=this.editform.specifications,
                this.tableData[this.index].number=this.editform.number,
                this.tableData[this.index].price=this.editform.price,
                this.tableData[this.index].website=this.editform.website

                this.currency= this.editform.currency;
                //弹框消失
                this.editFormVisible=false;
            } else {
              console.log('error submit!!');
              return false;
            }
        });
      },
      esc(){
        this.dialogFormVisible = false;
        this.form.name=""
        this.form.specifications=""
        this.form.number=""
        this.form.price=""
        this.form.website=""
      },
      submitFormInit(formName) {
        this.b=false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.b=true
            this.paymentChainInit(); 
          } else {
            this.b=true
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      open6(index,rows) {
        this.$confirm('确认删除该商品信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          rows.splice(index, 1);

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    computed:{
      getCommodityAmount:function(){
        var sum=0
        for(var i=0;i<this.tableData.length;i++){
          sum+=this.tableData[i].number*this.tableData[i].price
        }
        console.log(sum)
        return sum
      },
      getTotalAmount:function(){
        return this.getCommodityAmount*1000 + (this.ruleForm.otherCost==''?0:this.ruleForm.otherCost)*1000
      }
    }
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
.resetinput .el-dialog__body{
  padding: 20px 80px;
}
.paymentChainInit{
    background: #fff;
    margin-top:20px;
    padding:0 20px;
    overflow: hidden;
}
.commodityAmount{
  border-bottom:1px solid #ebeef5;
}
.totalAmount{
  margin-bottom:60px;
}
.commodityAmount,.totalAmount{
    width:100%;
    height:53px;
    line-height: 53px;
    padding: 0 55px;
}
.totalAmount span:nth-child(2){
    color:#FF6D33;
}

.paymentChainInit .commodityInfo{
    font-size:16px;
    color:rgba(0,0,0,0.85);
    margin:20px auto;
    font-weight: 700;
}
.paymentChainInit .tableData.el-table th{
    background: rgba(24, 144, 255, 0.1);
    color:#000;
}
.otherInfo{
    padding-top:20px;
}
.paymentChainInit .generatingPaymentChain{
   margin:80px auto;
   text-align: center;
}
.continueAdd{
  width:100%;
  height:32px;
  line-height: 32px;
  border-radius:4px;
  border:1px dashed #D9D9D9;
  text-align: center;
  margin-bottom:20px;
  cursor: pointer;
}
.continueAdd:hover{
  background: #f5f7fa;
}
.paymentChainInit .el-select{
  width:100%;
}
.paymentChainInit .cost{
  margin-top:20px;
}
</style>
