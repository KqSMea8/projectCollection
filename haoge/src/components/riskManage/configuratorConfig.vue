<template>
    <div class="configuratorConfig">
        <!-- html这里开始 -->
        <el-alert
            title="试运行阶段，规则不生效，若有其他风控需求，可联系cs@ipaylinks.com"
            type="warning"
            show-icon
            :closable="false">
        </el-alert>
        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>配置器信息</span>
            </div>
            <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="ruleForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="关联商户号：" prop="merchantNum">
                    <el-input v-model="ruleForm.merchantNum" readonly></el-input>
                </el-form-item>
                <el-form-item label="关联交易主体：" prop="carrierId" v-if="$route.query.flag=='single'">
                    <el-select v-model="ruleForm.carrierId"  clearable multiple size="small" collapse-tags placeholder="全部">
                        <el-option v-for="(item,index) in addSiteList"  :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联交易主体：" prop="carrierId" v-else>
                    <el-select v-model="ruleForm.carrierId"  clearable multiple size="small" collapse-tags placeholder="全部">
                        <el-option v-for="(item,index) in noUseSiteList"  :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作员：">
                    <span>{{operator}}</span>
                </el-form-item>
                <el-form-item label="更新时间：">
                    <span>{{updateTime}}</span>
                </el-form-item>
                <el-form-item label="启用：" prop="delivery">
                    <el-switch v-model="ruleForm.delivery" clearable></el-switch>
                </el-form-item>
            </el-form>  
        </el-card>  
        <el-card class="box-card" shadow="never"> 
            <div slot="header" class="clearfix">
                <span>评分卡分数说明</span>
                <span v-if="status==1"  style="float: right; padding: 3px 0" type="text">是否开通了动态授权：是</span>
                <span v-else style="float: right; padding: 3px 0" type="text">是否开通了动态授权：否</span>
            </div>
            <div class="scoreCard clearfix">
                <p class="fl" v-if="status==1"><span>通过：</span><span class="green">大于等于0，小于250</span></p>
                <p class="fl" v-else><span>通过：</span><span class="green">大于等于0，小于500</span></p>
                <p class="fl" v-if="status==1"><span>存疑：</span><span class="gray">大于等于250，小于500</span></p>
                <p class="fr"><span>拒绝：</span><span class="red">大于等于500</span></p>      
            </div>
        
        </el-card> 
       <div class="ruleConfigTitle clearfix">
           <p class="fl" style="font-size:16px;">限额限次型规则配置</p>
           <p class="fr"><el-checkbox v-model="checked" @change="changeStatus"></el-checkbox> 只显示开启</p>
       </div>
            <el-table
            :data="tableData"
            style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}"
            empty-text=""
            >   
                <el-table-column
                    prop=""
                    label="规则描述"
                    align="left"
                    width="800">
                    <template slot-scope="scope">
                        在 <el-input v-model="scope.row.timeConfigData" @change="changeTime(scope.row)"></el-input>
                        <el-select v-model="scope.row.timeConfigUnitData"  @change="changeDate(scope.row)">
                            <el-option v-for="(item,index) in scope.row.merchantRuleInfo.timeConfigUnit" :key="index" :label="item" :value="item"></el-option>
                        </el-select> 内 ,
                        相同 {{scope.row.merchantRuleInfo.fieldName1}} 
                        <span v-if='scope.row.merchantRuleInfo.ruleType=="flowCurrency"'>
                            累计
                            {{scope.row.merchantRuleInfo.fieldName2}}的交易金额，折算不超过
                        </span>
                        <span v-if='scope.row.merchantRuleInfo.ruleType=="flowCount"'>
                            最多允许
                        {{scope.row.merchantRuleInfo.fieldName2}}</span>
                        <el-input v-if='scope.row.merchantRuleInfo.ruleType=="flowCurrency"' v-model="scope.row.limitConfigData"  @change="changeCurrency(scope.row)"></el-input>
                        <el-input v-if='scope.row.merchantRuleInfo.ruleType=="flowCount"' v-model="scope.row.limitConfigData" @change="changeCount(scope.row)"></el-input>
                        <span v-if='scope.row.merchantRuleInfo.ruleType=="flowCurrency"'>
                            USD
                        </span>
                        <span v-if='scope.row.merchantRuleInfo.ruleType=="flowCount"'>
                            次
                        </span>
                    </template> 
                </el-table-column>
                <el-table-column
                    prop="score"
                    label="分数"
                    align="center">
                    <template slot-scope="scope">
                        <!-- <el-form :model="scoreForm" :rules="rules" :inline="true" ref="scoreForm">
                            <el-form-item  prop="score"> -->
                                <el-input style="width:100px;" v-model="scope.row.score"  clearable  @change="scoreChange(scope.row)"></el-input>
                            <!-- </el-form-item>
                        </el-form>   -->
                    </template>
                </el-table-column>
                <el-table-column
                    prop="actived"
                    label="开启"
                    align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.actived"
                            >
                    </el-switch>
                    </template>
                </el-table-column>
                <div slot="empty" class="noData">
                    <img src="../../assets/images/frown-o@2x.png" alt="">
                    <p>暂无数据</p>
                </div>
            </el-table>
        <div class="ruleConfigTitle clearfix">
           <p class="fl" style="font-size:16px;">判断型规则配置</p>
           <p class="fr"><el-checkbox v-model="check" @change="changeCheck"></el-checkbox> 只显示开启</p>
       </div>
       <el-table
            :data="tableDataMeasure"
            style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}"
            empty-text=""
            >   
                <el-table-column
                    prop="merchantRuleInfo.ruleName"
                    label="规则描述"
                    align="center"
                    width="400">
                </el-table-column>
                <el-table-column
                    prop="score"
                    label="分数"
                    align="center">
                    <template slot-scope="scope">
                        <el-input style="width:100px;" v-model="scope.row.score" clearable @change="scoreChange(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="actived"
                    label="开启"
                    align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.actived"
                            >
                    </el-switch>
                    </template>
                </el-table-column>
                <div slot="empty" class="noData">
                    <img src="../../assets/images/frown-o@2x.png" alt="">
                    <p>暂无数据</p>
                </div>
            </el-table>
        <div class="fr">
            <el-button  type="primary" size="middle" @click="save">保存</el-button>
             <el-button type="primary" size="middle">取消</el-button> 
        </div>
    </div>
</template>

<script>
import "../../assets/css/hmdCommon.css"
import { Message } from 'element-ui' //element Message 组件引入
import classPost from '../../servies//classPost'
export default {
  data () {
    var checkNumber = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('输入不能为空'));
        }
        setTimeout(() => {
            if (!(/^[1-9]\d*$/.test(value))) {
                callback(new Error('必须是正整数'));
            } else {
                callback();
            }
        }, 1000);
    };
    return {
        single:'',
        add:'',
        status:'',
        configId:'',
        operator: '',
        updateTime: '',
        siteLists:[],
        noUseSiteList:[],
        addSiteList:[],
        ruleList:[],
        ruleType:[],
        checked:false,
        check:false,
        value: '',
        centerDialogVisible:false,
        scoreForm:{
            score:""
        },
        rules:{
            score:[
               { min: 0, max: 1000, message: '长度在 0 到 1000 个字符', trigger: 'change' }
            ]    
        },
        ruleForm: {
          name: '',
          merchantNum: '',
          delivery:true,
          carrierId:'ALL'
        },
        rules: {
          name: [
            { required: true,message: '请输入规则集名称', trigger: 'change'} ,
            { min: 0, max: 60, message: '长度不得超过60个字符', trigger: 'change' }
          ],
        //   merchantNum: [
        //     { required: true, message: '请选择活动区域', trigger: 'change' }
        //   ],
        //   carrierId: [
        //     { required: true, message: '请选择活动资源', trigger: 'change' }
        //   ],
        //   operator: [
        //     { required: true, message: '请填写活动形式', trigger: 'blur' }
        //   ],
        //   updateTime: [
        //     { required: true, message: '请填写活动形式', trigger: 'blur' }
        //   ]
        },
        tableData:[
            { merchantRuleInfo: { timeConfigUnit:[] } }
        ],
        tableData2:[
            { merchantRuleInfo: { timeConfigUnit:[] } }
        ],
        tableDataMeasure:[],
        twoTableData:[]
    }
  },

  created: function () {
      this.configId=this.$route.query.configId
      this.queryruleset();
      this.queryuseablewebsiteconfig();
      this.isopendomainauthorization();
      console.log(this.ruleForm.carrierId)
  },

  methods: {
        changeStatus(){
            console.log(this.checked)
            if(this.checked){
                this.tableData=this.tableData2.filter((ele)=>{
                    return ele.actived==true;
                })
            }else{
                this.tableData=this.tableData2;
            }
      },
      changeCheck(){
          if(this.check){
                this.tableDataMeasure=this.tableDataMeasure2.filter((ele)=>{
                    return ele.actived==true;
                })
            }else{
                this.tableDataMeasure=this.tableDataMeasure2;
            }
      },
      //查询单个规则集
      queryruleset(){
            classPost.queryruleset({configId:this.configId})
                .then((res)=>{
                    console.log(res)
                    if(this.$route.query.flag=="add"){
                        this.ruleForm.name=""
                    }else{
                        this.ruleForm.name=res.data.configName
                    }
                    this.ruleForm.merchantNum=res.data.merchantId
                    this.ruleForm.delivery=res.data.actived
                    this.ruleForm.carrierId=res.data.siteList
                    this.operator=res.data.lastUpdateUserName
                    this.updateTime=res.data.lastUpdateTime
                    this.siteLists=res.data.siteList
                    console.log(this.siteLists)
                    this.ruleList=res.data.ruleList
                    this.tableDataMeasure=this.ruleList.filter((ele)=>{
                        return ele.merchantRuleInfo.ruleType=='measure'
                    })
                    this.tableData=this.ruleList.filter((ele)=>{
                        return ele.merchantRuleInfo.ruleType!='measure'
                    })
                    this.tableData2=this.tableData;
                    this.tableDataMeasure2=this.tableDataMeasure
                    console.log(this.tableData)
                    console.log(this.tableDataMeasure)
                }).catch((err)=>{
                    console.log(err)
            })   
      },
      //查询规则集未使用的域名列表
      queryuseablewebsiteconfig(){
          classPost.queryuseablewebsiteconfig({})
                .then((res)=>{
                    console.log(res)
                    this.noUseSiteList=res.data
                    this.addSiteList=this.siteLists.concat(this.noUseSiteList)
                }).catch((err)=>{
                    console.log(err)
            })
      },
      //查询是否开通动态预授权产品
      isopendomainauthorization(){
            classPost.isopendomainauthorization({})
                .then((res)=>{
                    console.log(res)
                    this.status=res.message
                }).catch((err)=>{
                    console.log(err)
            }) 
      },
      changeflag(){
          console.log(this.payTableData)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$alert('提交成功,规则将在12小时后生效', '', {
                confirmButtonText: '确定',
                type:"success",
                callback: action => {
                    this.centerDialogVisible=false
                //     this.$message({
                //     type: 'info',
                //     message: `action: ${ action }`
                // });
          }
        });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //保存
      save(){
            if(this.ruleForm.name==""){
                this.$refs['ruleForm'].validateField("name");
                return
            }
            this.twoTableData=this.tableData2.concat(this.tableDataMeasure2)
            var obj={
                actived:this.ruleForm.delivery,
                configId:this.configId,
                configName:this.ruleForm.name,
                lastUpdateTime:this.updateTime,
                lastUpdateUserName:this.operator,
                merchantId:this.ruleForm.merchantNum,
                ruleList:this.twoTableData,
                siteList:this.ruleForm.carrierId,
            }
            console.log(obj)
            if(this.$route.query.flag=="single"){
                //更新规则集
                classPost.updateruleset(obj)
                    .then((res)=>{
                        console.log(res)
                        if(res.code="00000000"){
                            this.$confirm('保存成功', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'success'
                                }).then(() => {
                                    this.$router.push("/home/riskManage")
                                    // this.$message({
                                    //     type: 'success',
                                    //     message: '删除成功!'
                                    // });
                                }).catch(() => {
                                    // this.$message({
                                    //     type: 'info',
                                    //     message: '已取消删除'
                                    // });          
                            });
                        }else{
                            this.$confirm('保存失败', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'success'
                                }).then(() => {
                                    // this.$message({
                                    //     type: 'success',
                                    //     message: '删除成功!'
                                    // });
                                }).catch(() => {
                                    // this.$message({
                                    //     type: 'info',
                                    //     message: '已取消删除'
                                    // });          
                            });
                        }
                    }).catch((err)=>{
                        console.log(err)
                }) 
            }else if(this.$route.query.flag=="add"){
                //创建规则集
                 classPost.createruleset(obj)
                    .then((res)=>{
                        console.log(res)
                        if(res.code="00000000"){
                            this.$confirm('创建成功', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'success'
                                }).then(() => {
                                    this.$router.push("/home/riskManage")
                                    // this.$message({
                                    //     type: 'success',
                                    //     message: '删除成功!'
                                    // });
                                }).catch(() => {
                                    // this.$message({
                                    //     type: 'info',
                                    //     message: '已取消删除'
                                    // });          
                            });
                        }else{
                            this.$confirm('创建失败', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'success'
                                }).then(() => {
                                    // this.$message({
                                    //     type: 'success',
                                    //     message: '删除成功!'
                                    // });
                                }).catch(() => {
                                    // this.$message({
                                    //     type: 'info',
                                    //     message: '已取消删除'
                                    // });          
                            });
                        }
                    }).catch((err)=>{
                        console.log(err)
                }) 
            }
      },
      scoreChange(value){
          if(!(/^\d+$/.test(value.score))){
            value.score=value.score.replace(/\D/g,'');
          }else if(parseInt(value.score)>500){
            value.score='500'
          } 
      },
      changeCurrency(value){
          if(!(/^\d+$/.test(value.limitConfigData))){
            value.limitConfigData=value.limitConfigData.replace(/\D/g,'');
          }else if(value.limitConfigData>1000000){
            value.limitConfigData=1000000
          }    
      },
      changeCount(value){
          if(!(/^\d+$/.test(value.limitConfigData))){
            value.limitConfigData=value.limitConfigData.replace(/\D/g,'');
          }else if(value.limitConfigData>10000){
            value.limitConfigData=10000
          }
      },
      changeTime(value){
          if(!(/^\d+$/.test(value.timeConfigData))){
            value.timeConfigData=value.timeConfigData.replace(/\D/g,'');
          }else if(value.timeConfigUnitData=="小时"&&value.timeConfigData>72){
               value.timeConfigData=72
          }else if(value.timeConfigUnitData=="分钟"&&value.timeConfigData>180){
                value.timeConfigData=180
          }else if(value.timeConfigUnitData=="天"&&value.timeConfigData>90){
                value.timeConfigData=90
          }
      },
      changeDate(value){
          if(value.timeConfigUnitData=="小时"&&value.timeConfigData>72){
            value.timeConfigData=72
          }else if(value.timeConfigUnitData=="分钟"&&value.timeConfigData>180){
            value.timeConfigData=180
          }else if(value.timeConfigUnitData=="天"&&value.timeConfigData>90){
            value.timeConfigData=90
          }
      }
  }
}

</script>

<style>
.clearfix:after{ content: ""; display: block;width:0; height: 0; clear: both; visibility: hidden; }
.clearfix { zoom: 1; }
.fl{
    float: left;
}
.fr{
    float: right;
}
.configuratorConfig{
    background: #fff;
    margin-top:20px;
    padding:20px;
    overflow: hidden;
}
.configuratorConfig .el-table{
    margin:20px 0;
}
.configuratorConfig .el-card__header{
    padding: 10px 20px;
}
.configuratorConfig .el-card__header,.configuratorConfig .el-table th{
background: rgba(24, 144, 255, 0.1);
color:#000;
}
.configuratorConfig .edit{
    color: rgba(24, 144, 255, 1);
}
.configuratorConfig .el-alert--warning{
    width: 45%;
    float: right;
    margin-bottom: 20px;
    background:rgba(230,247,255,1);
}
.configuratorConfig .el-alert__icon{
    color:#1890FF;
}
.configuratorConfig .el-alert__title{
    color:rgba(0,0,0,0.65);
}
.el-card{
    width:100%;
    font-size: 16px;
    margin-top:20px;
    /* font-weight: bolder; */
}
.scoreCard p:nth-child(2){
    margin:0 25%;
}
.scoreCard .green{
    color:green;
}
.scoreCard .gray{
    color: rgba(0, 0, 0, 0.25);
}
.scoreCard .red{
    color: red;
}
.configuratorConfig .el-form.demo-form-inline .el-input{
    width:100px;
    height:30px;
    margin:0 10px;
}
.configuratorConfig .el-form.demo-form-inline p{
    line-height: 50px;
}
.ruleConfigTitle{
    font-size: 16px;
    color: rgba(0,0,0,0.85);
    margin: 30px auto 20px;
}
.configuratorConfig .el-table__body .el-input{
    width:100px;
}
.configuratorConfig .el-select{
    width: 240px;
}
</style>
