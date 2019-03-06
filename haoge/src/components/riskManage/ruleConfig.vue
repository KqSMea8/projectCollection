<template>
  <div class="ruleConfig">
    
    <!-- html这里开始 -->
        <div class="clearfix">
            <router-link :to="{path:'/home/riskManage/configuratorConfig',query:{configId:ruleForm.ruleName,flag:'add'}}">
                <el-button class="fr" style="margin-left:30px;margin-top:4px;" type="primary" size="small"><i class="el-icon-circle-plus-outline"></i> 新增规则集</el-button>     
            </router-link>
            <div  class="fr">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm">
                    <el-form-item label="基于" prop="ruleName">
                        <el-select v-model="ruleForm.ruleName">
                            <el-option  v-for="(item,index) of ruleNames" :key="index" :label="item.value" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form> 
            </div>
        </div> 
        <!--表格-->
        <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        empty-text=""
        v-loading="loading"
        >   
            <el-table-column
                prop="configName"
                label="规则集名称"
                align="center">
                <template slot-scope="scope">
                    <router-link :to="{path:'/home/riskManage/configuratorConfig',query:{configId:scope.row.configId,flag:'single'}}">{{scope.row.configName}}</router-link>
                    <!-- <router-link to="/home/riskManage/configuratorConfig">{{scope.row.configName}}</router-link> -->
                </template>
            </el-table-column>
            <el-table-column
                prop="merchantId"
                label="关联商户号"
                align="center">
            </el-table-column>
            <el-table-column
                prop="siteList"
                label="关联交易主体(carrierId)"
                align="center"
                width="200">
                <template slot-scope="scope">
                    <div  v-if="scope.row.siteList.length>1">
                        <el-popover
                            placement="top-start"
                            title=""
                            width="200"
                            trigger="hover">
                            <p v-for='(item,index) of scope.row.siteList' :key="index" v-html="item"></p>
                            <el-button slot="reference" type="text">{{scope.row.siteList[0]}}</el-button>
                        </el-popover>   
                    </div>
                    <div  v-else>
                        <div v-if="scope.row.siteList[0]=='ALL'">全部</div>
                        <div v-else>{{scope.row.siteList[0]}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="actived"
                label="状态"
                align="center">
                 <template slot-scope="scope">
                    <div v-if="scope.row.actived==true">
                        启用
                    </div>
                    <div v-else>
                        禁用
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="lastUpdateUserName"
                label="操作员"
                align="center">
            </el-table-column>
            <el-table-column
                prop="lastUpdateTime"
                label="更新时间"
                align="center">
            </el-table-column>
            <el-table-column
                prop="delete"
                label="操作"
                align="center">
                <template slot-scope="scope">
                    <div class="edit" v-if="scope.$index>0" @click="deleteRule(scope.row.configId)">
                        删除   
                    </div>
                </template>
            </el-table-column>
        </el-table>       
  </div>
</template>

<script>
import { Message } from 'element-ui' //element Message 组件引入
import classPost from '../../servies//classPost'
export default {
  data () {
    return {
        loading:true,
        ruleNames:'',
        value: '',
        ruleForm:{
          ruleName: '',
        },
        rules: {

        },
        tableData: [],
    }
  },

  created: function () {
      this.queryrulesetlist();
  },

  methods: {
      //查询规则集
      queryrulesetlist(){
            classPost.queryrulesetlist({})
                .then((res)=>{
                    this.loading=false
                    console.log(res)
                    this.tableData =res.data.ruleSetList
                    console.log(this.tableData)
                    var arr=[]
                    this.tableData.forEach((item)=>{
                        arr.push({
                            id:item.configId,
                            value:item.configName
                        })
                    })
                    this.ruleNames=arr 
                    this.ruleForm.ruleName=this.ruleNames[0].id;
                }).catch((err)=>{
                    console.log(err)
                    this.loading=false
          })   
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
            this.$refs[formName].resetFields();
      },
      deleteRule(configId){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    //删除规则集    
                    classPost.deleteruleset({configId:configId})
                        .then((res)=>{
                            this.loading=true
                            console.log(res)
                            this.queryrulesetlist();
                        }).catch((err)=>{
                            console.log(err)
                    })  
                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });          
            });
      },
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
.ruleConfig{
    background: #fff;
    margin-top:20px;
    padding:20px;
    overflow: hidden;
}
.ruleConfig .commodityInfo{
    font-size:16px;
    color:rgba(0,0,0,0.85);
    margin:20px auto;
    font-weight: 700;
}
.ruleConfig .el-card__header,.ruleConfig .el-table th{
background: rgba(24, 144, 255, 0.1);
color:#000;
}
.ruleConfig tbody tr td:nth-child(1) a{
    color: #1890FF;
    text-decoration: none;
}
.ruleConfig .edit{
    color: rgba(24, 144, 255, 1);
    cursor: pointer;
}
.ruleConfig .el-table .el-select{
    width:100px;
}
.ruleConfig .el-table .el-input--suffix .el-input__inner{
    border:none;
}
.ruleConfig .el-table--enable-row-hover .el-table__body tr:hover>td{
     background: #fff;
}
.ruleConfig .el-form .el-input{
    height:30px;
    margin:0 10px;
}
.ruleConfig .el-form p{
    line-height: 50px;
}
.ruleConfig .el-alert--info{
    width: 40%;
    float: right;
    margin-bottom: 20px;
    background:rgba(230,247,255,1);
}
.ruleConfig .el-alert__icon{
    color:#1890FF;
}
.ruleConfig .el-alert__title{
    color:rgba(0,0,0,0.65);
}
.ruleConfig input::-webkit-input-placeholder{
    color:#606266;
}
.ruleConfig input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#606266;
}
.ruleConfig input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#606266;
}
.ruleConfig inputt:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
    color:#606266;
}
.ruleConfig .el-select .el-input .el-select__caret{
     color:#606266;
}
.ruleConfig .el-form-item{
    margin-bottom: 10px;
}
</style>
