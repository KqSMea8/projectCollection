<template>
   <div class="blackList clearfix">
        <el-form :inline="true" :model="formInline" :rules="rules" ref="formInline" class="demo-form-inline">
            <el-form-item label="黑名单类型：" prop="blackListType">
            <el-select v-model="formInline.blackListType" placeholder="请选择黑名单类型" clearable>
                <el-option 
                    v-for="(item,index) of blacktypelist" 
                    :key="index" 
                    :label="item.name" 
                    :value="item.catalogId">
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="黑名单内容："  prop="blackListCon">
                <el-input v-model="formInline.blackListCon" clearable placeholder="请输入您要搜索的黑名单内容" style="width: 230px;"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" size="small" @click="submitForm('formInline')">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 下载列表 -->
        <div class="downloadList fr" @click="downloadblacklist">
            <el-button icon='el-icon-download' size="small">下载列表</el-button>
        </div>
        <div class="downloadList fr">
          <router-link to="/home/riskManage/addBlackList"><el-button type="primary" size="small">添加黑名单</el-button></router-link>
        </div>
        <div class="downloadList fr" @click="deleteblacks">
            <el-button type="primary" size="small">批量删除</el-button>
        </div>
        <!--表格-->
        <el-table
         ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        @select="handleSelectionChange"
        :default-sort = "{prop: 'date', order: 'descending'}"
        empty-text=""
        >   
            <el-table-column
                prop=""
                label=""
                type="selection"
                align="center"
                >
            </el-table-column>
            <el-table-column
                prop="blackListType"
                label="黑名单类型"
                align="center">
                    <template slot-scope="scope">
                        {{blackListTypeName}}
                    </template>
            </el-table-column>
            <el-table-column
                prop="value"
                label="黑名单内容"
                align="center">
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="创建时间"
                align="center">
            </el-table-column>
            <el-table-column
                prop="memo"
                label="创建人"
                align="center">
            </el-table-column>
            <el-table-column
                prop="operation"
                label="操作"
                align="center">
                <template slot-scope="scope">
                    <router-link to="">
                        <el-button type="text" size="small" @click="deleteblack(scope.row.value)">删除</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <div slot="empty" class="noData">
                <img src="../../assets/images/frown-o@2x.png" alt="">
                <p>暂无数据</p>
            </div>
        </el-table>
        <!--分页-->
        <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage4"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>        
</template>
<script>
import "../../assets/css/hmdCommon.css"
import { Message } from 'element-ui' //element Message 组件引入
import classPost from '../../servies//classPost'
export default {
  data () {
    return {
        blackListTypeName:'',
        pageNumber:1,
        pageSize:10,
        total:0,
        value:[],
        checked: false,
        currentPage4: 1,
        blacktypelist:[],//类型列表 
        formInline: {
            blackListType: '',
            blackListCon: '',
        },
        rules: {
          blackListType: [
            { required: true, message: '请选择黑名单类型', trigger: 'change' },
          ],
        },
        value6: '',
        tableData: [],
        multipleSelection: []
    }
  },

  mounted(){
      this.queryblacktypelist()
  },

  methods: {
    //查询类型列表  
    queryblacktypelist(){
        classPost.queryblacktypelist({})
          .then((res)=>{
            console.log(res)
            this.blacktypelist=res.data.listRepos
          }).catch((err)=>{
            console.log(err)
        })
    },
    //查询
    queryblacklist(){
        var obj={
            catalogId:this.formInline.blackListType,
            value:this.formInline.blackListCon,
            pageNumber:this.pageNumber,
            pageSize:this.pageSize
        }

        this.blackListTypeName=this.blacktypelist.filter((ele)=>{
            return ele.catalogId==this.formInline.blackListType;
        })
        this.blackListTypeName=this.blackListTypeName[0].name

        classPost.queryblacklist(obj)
          .then((res)=>{
            console.log(res)
            this.tableData=res.data.listRepoDatas
            this.total=res.data.total
          }).catch((err)=>{
            console.log(err)
        })
    },
    //用户手动勾选多选框获取数组value
    handleSelectionChange(val){
        let arr = []
        val.forEach((item)=>{
            arr.push({value:item.value})
        })
        this.value = arr
    },
    //下载
    downloadblacklist(){
        var obj={
            catalogId:this.formInline.blackListType,
            value:this.formInline.blackListCon,
            pageNumber:this.pageNumber,
            pageSize:this.pageSize,
            catalogName:this.blackListTypeName
        }
        classPost.downloadblacklist(obj)
          .then((res)=>{
            console.log(res)
                const content = res
　　            const blob = new Blob([content],{type:"application/vnd.ms-excel"})
　　            const fileName = '黑名单列表.xls'
　　            if ('download' in document.createElement('a')) { // 非IE下载
　　            　　const elink = document.createElement('a')
　　            　　elink.download = fileName
　　            　　elink.style.display = 'none'
　　            　　elink.href = URL.createObjectURL(blob)
　　            　　document.body.appendChild(elink)
　　            　　elink.click()
　　            　　URL.revokeObjectURL(elink.href) // 释放URL 对象
　　            　　document.body.removeChild(elink)
　　            } else { // IE10+下载
　　            　　navigator.msSaveBlob(blob, fileName)
　　            }
          }).catch((err)=>{
            console.log(err)
        })
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.pageNumber=1
                this.currentPage4=1
                this.queryblacklist();
            } else {
            console.log('error submit!!');
                return false;
            }
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    formatter(row, column) {
      return row.state;
    },
    //单个删除
    deleteblack(value) {
      this.$confirm('您将要删除黑名单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
          var obj={
              catalogId: this.formInline.blackListType,
              dataList: [
                {
                  value: value
                }
              ]
          }
        classPost.deleteblackdata(obj)
          .then((res)=>{
            console.log(res)
            if(res.code=="00000000"){
                this.$alert('您已成功删除黑名单', '删除成功', {
                  confirmButtonText: '确定',
                  type: 'success',
                  callback: action => {
                      this.queryblacklist();
                    // this.$message({
                    //   type: 'success',
                    //   message: `action: ${ action }`
                    // });
                  }
                });   
            }
          }).catch((err)=>{
            console.log(err)
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },
    //批量删除
    deleteblacks() {
      this.$confirm('您将要批量删除黑名单<br/>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
           var obj={
              catalogId: this.formInline.blackListType,
              dataList: this.value
          }
          console.log(obj)
          classPost.deleteblackdata(obj)
            .then((res)=>{
                if(res.code=="00000000"){
                    this.$alert('您已成功批量删除黑名单', '删除成功', {
                    confirmButtonText: '确定',
                    type: 'success',
                    callback: action => {
                        this.queryblacklist();
                        // this.$message({
                        //   type: 'success',
                        //   message: `action: ${ action }`
                        // });
                    }
                    });   
                }
            }).catch((err)=>{
                console.log(err)
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },
//    分页用到
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageNumber=val;
      this.queryblacklist();
    },
    allWithdraw(){
        // this.withdrawForm.amount=this.withdrawForm.message
        alert(1)
    },
    handleClick(tab, event) {
        console.log(tab, event);
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
.blackList{
    background: #fff;
    margin-top:20px;
    padding:20px;
}
.blackList .el-card__header,.blackList .el-table th{
background: rgba(24, 144, 255, 0.1);
color:#000;
}
.blackList .yuan{
display:inline-block;width: 8px;height: 8px;border-radius: 50%;
margin-right: 5px;
background: red
}
.blackList .el-pagination.is-background .el-pager li,.blackList .el-pagination.is-background .btn-prev,.blackList .el-pagination.is-background .btn-next{
background: #fff;
border:1px solid #dadada;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
border-radius: 4px;
}
.blackList .el-date-editor .el-range-separator{
    padding:0;
} 
.blackList .el-table .cell{
    text-align: center;
    padding:0;
}
.blackList .detail{
    text-decoration: none;
    border:0;
    color:#1890FF;
}
.blackList .downloadList{
    margin-left:10px;
    margin-bottom:10px;
}
</style>




