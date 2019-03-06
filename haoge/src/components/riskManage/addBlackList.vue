<template>
  <div class="addBlackList">
    <!-- html这里开始 -->
      
          <!-- <div slot="header" class="clearfix">
            <span>添加黑名单</span>
          </div> -->
          <el-form :model="addBlackListForm" :rules="rules" ref="addBlackListForm" label-width="150px" class="addBlackListForm">
                <el-form-item label="请选择黑名单类型：" prop="blackListType">
                    <el-select v-model="addBlackListForm.blackListType" placeholder="请选择黑名单类型" clearable @change="changeAddress">
                        <el-option 
                            v-for="(item,index) of blacktypelist" 
                            :key="index" 
                            :label="item.name" 
                            :value="item.catalogId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div v-if="this.blackListTypeName.indexOf('地址')!=-1">
                      <p style="font-size:20px;margin-bottom: 20px;margin-left: 50px;">地址内容</p>
                      <el-form-item label="国家：" prop="country">
                        <el-input v-model="addBlackListForm.country" clearable placeholder="请输入地址国家"></el-input>
                      </el-form-item>
                      <el-form-item label="州/省：" prop="province">
                        <el-input v-model="addBlackListForm.province" clearable placeholder="请输入地址所在州/省"></el-input>
                      </el-form-item>
                      <el-form-item label="城市：" prop="city">
                        <el-input v-model="addBlackListForm.city" clearable placeholder="请输入城市名"></el-input>
                      </el-form-item>
                      <el-form-item label="街道地址：" prop="address">
                        <el-input v-model="addBlackListForm.address" clearable placeholder="请输入街道详细地址"></el-input>
                      </el-form-item>
                </div>
                <div v-else>
                    <el-form-item label="黑名单内容：" prop="blackListCon">
                      <el-input v-model="addBlackListForm.blackListCon" clearable placeholder="请输入您要添加的黑名单内容"></el-input>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('addBlackListForm')">确定</el-button>
                    <el-button @click="$router.back(-1)">返回</el-button>
                </el-form-item>
            </el-form>

  </div>
</template>

<script>
import classPost from '../../servies//classPost'
  export default {
    data() {
      return {
        blackListTypeName:'',
        blacktypelist:[],
        addBlackListForm: {
          blackListType: '',
          blackListCon: '',
          country: '',
          province: '',
          city: '',
          address: '',
        },
        rules: {
          blackListType: [
            { required: true, message: '请选择黑名单类型', trigger: 'change' },
          ],
          blackListCon: [
            { required: true, message: '请输入黑名单内容', trigger: 'change' }
          ],
          country: [
            { required: true, message: '请输入国家', trigger: 'change' },
          ],
          city: [
            { required: true, message: '请输入城市名', trigger: 'change' },
          ],
          address: [
            { required: true, message: '请输入街道详细地址', trigger: 'change' }
          ],
        }
      };
    },
    mounted(){
      this.queryblacktypelist()  
    },
    methods: {
      changeAddress(){
        this.blackListTypeName=this.blacktypelist.filter((ele)=>{
            return ele.catalogId==this.addBlackListForm.blackListType;
        })
        console.log(this.blackListTypeName)
        this.blackListTypeName=this.blackListTypeName[0].name
        console.log(this.blackListTypeName)
      },
      //查询类型列表  
      queryblacktypelist(){
          classPost.queryblacktypelist({})
            .then((res)=>{
              console.log(res)
              this.blacktypelist=res.data.listRepos
                if(this.$route.query.type){
                  this.addBlackListForm.blackListType=this.$route.query.type
                  this.blackListTypeName = this.$route.query.type
                }
                if(this.$route.query.value){
                  console.log(1)
                  if(this.$route.query.type.includes('地址')){
                    console.log(1)
                    let arr = this.$route.query.value.split('&');
                    this.addBlackListForm.country=arr[0]
                    this.addBlackListForm.province=arr[1]
                    this.addBlackListForm.city=arr[2]
                    this.addBlackListForm.address=arr[3]
                  }else{
                    console.log(2)
                     this.addBlackListForm.blackListCon=this.$route.query.value
                  }
                }
            }).catch((err)=>{
              console.log(err)
          })
      },
      //添加黑名单
      addblackdata(){
        
        console.log(this.blackListTypeName)

        var obj={};
        
        if(this.blackListTypeName.indexOf("地址")!=-1){
            obj={
              catalogId: this.addBlackListForm.blackListType,
              dataList: [
                {
                  value: this.addBlackListForm.country +'/'+ this.addBlackListForm.province+'/'+this.addBlackListForm.city+'/'+this.addBlackListForm.address
                }
              ]
            }
        }else{
            obj={
              catalogId: this.addBlackListForm.blackListType,
              dataList: [
                {
                  value: this.addBlackListForm.blackListCon
                }
              ]
          }
        }
        console.log(obj)
        classPost.addblackdata(obj)
          .then((res)=>{
            console.log(res)
            if(res.code=="00000000"){
                this.$alert('您已成功添加该条黑名单', '添加成功', {
                confirmButtonText: '确定',
                type:'success',
                callback: action => {
                  this.resetForm('addBlackListForm');
                }
                });
            }else{
              this.$alert('该条黑名单添加失败', '添加失败', {
                confirmButtonText: '确定',
                type:'success',
                callback: action => {
                  // this.$message({
                  //   type: 'info',
                  //   message: `action: ${ action }`
                  // });
                }
                });
            }
          }).catch((err)=>{
            console.log(err)
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.open2();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      open2() {
        this.$confirm('确定添加此条黑名单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addblackdata()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消添加'
          });          
        });
      },
    }
  }
</script>

<style>
.addBlackList{
    margin-top:20px;
    background: #fff;
    color:#000;
 } 
 .addBlackListForm{
   padding: 30px 50% 20px 10%;
 }
 .addBlackListForm  .el-select{
     width:100%;
 }
</style>

