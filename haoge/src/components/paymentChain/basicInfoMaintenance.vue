<template>
  <div class="basicInfoMaintenance" v-loading="basicInfoLoading">
      <div class="commodityInfo"></div>
      <!--表格-->
        <el-table
        class="tableData"
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        empty-text=""
        >   
            <el-table-column
                prop="number"
                label="序号"
                type="index"
                align="center">
            </el-table-column>
            <el-table-column
                prop="pictureUrl"
                label="商户LOGO"
                align="center"
                >
                <template slot-scope="scope">
                    <div class="logo">
                        <img :src="scope.row.pictureUrl" alt=""> 
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="merchantSite"
                label="商户网址"
                align="center">
                <template slot-scope="scope">
                    <a :href="`http://${scope.row.merchantSite}`" target="_blank">{{scope.row.merchantSite}}</a>
                </template>
            </el-table-column>
            <el-table-column
                prop="contact"
                label="联系方式"
                align="center">
            </el-table-column>
            <el-table-column
                prop="shoptermsName"
                label="购物条款"
                align="center">
                <template slot-scope="scope">
                    <a :href="scope.row.shoptermsUrlSite" target="_blank">{{scope.row.shoptermsName}}</a>
                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                label="操作"
                align="center">
                <template slot-scope="scope"> 
                  <el-button  @click="modify(scope.row)" type="text" size="small">修改</el-button>
                  <el-button type="text" size="small" @click="basicInfoDelete(scope.$index, tableData,scope.row.pictureId)">删除</el-button>
                </template>
            </el-table-column>
            <div slot="empty" class="noData">
                <img src="../../assets/images/frown-o@2x.png" alt="">
                <p>尚未添加任何信息！</p>
            </div>
        </el-table>
        <div class="continueAdd"  v-if="tableData.length==0" @click="add"><i class="el-icon-plus" style="margin-right: 10px;"></i>添加</div>
        <div class="continueAdd"  v-if="tableData.length<4&&tableData.length!=0" @click="add"><i class="el-icon-plus" style="margin-right: 10px;"></i>继续添加</div>
      <el-dialog title="添加基本信息" :visible.sync="dialogFormVisible" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.2)">
          <el-form :model="addForm" :rules="rules" ref="addForm">
            <el-form-item label="商户LOGO：" :label-width="formLabelWidth" prop="logo"> 
                <div class="logoBox">
                    <i class="el-icon-plus"></i>
                    <input id="logo" type="file" @change="fileChange('addForm','logo','logo','logo')" />
                </div>
                <img :src="this.addForm.logoUrl" class="logoUrl" alt="">
                <el-input v-model="addForm.logo" v-show="false"></el-input>
                <p style="font-size: 12px;">提醒:支持文件扩展名.jpg,.jpeg,.png,.bmp,不能超过100kb</p>
            </el-form-item>
            <el-form-item label="商户网址：" :label-width="formLabelWidth" prop="website">
              <el-select v-model="addForm.website"  clearable>
                <el-option v-for="(item,index) in websiteDataList" :label="item.url" :key="index" :value="item.url"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系方式：" :label-width="formLabelWidth" prop="contactWay"> 
              <el-input v-model.number="addForm.contactWay" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="购物条款：" :label-width="formLabelWidth"  prop="term" style="margin-bottom: 0"> 
                <el-input style="width: 60%" :disabled="true" size="small" clearable placeholder="请选择上传文件" v-model="addForm.term"></el-input>
                <div class="fileBox">
                    <span class="el-icon-upload"></span>上传文件
                    <input id="term" type="file" @change="fileChange('addForm','term','term','file')" />
                </div>
                <p style="font-size: 12px;">提醒:上传文件不能大于5M,支持文件格式为PDF</p>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('addForm')" size="small">提交</el-button>
            <el-button @click="addFormCancel" size="small">取消</el-button>
          </div>
      </el-dialog>
      <el-dialog title="修改基本信息" :visible.sync="modifyFormVisible" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.2)">
          <el-form :model="modifyForm" :rules="modifyRules" ref="modifyForm">
            <el-form-item label="商户LOGO：" :label-width="formLabelWidth" prop="logo">
                <div class="logoBox">
                    <i class="el-icon-plus"></i>
                    <input id="logo2" type="file" @change="fileChange('modifyForm','logo','logo2','logo')" />
                </div>
                <img :src="this.modifyForm.logoUrl" class="logoUrl" alt=""> 
                <el-input v-model="modifyForm.logo" v-show="false"></el-input>
                <p style="font-size: 12px;">提醒:支持文件扩展名.jpg,.jpeg,.png,.bmp,不能超过100kb</p>
            </el-form-item>
            <el-form-item label="商户网址：" :label-width="formLabelWidth" prop="website">
              <el-select v-model="modifyForm.website"  clearable>
                <el-option v-for="(item,index) in websiteDataList" :label="item.url" :key="index" :value="item.url"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系方式：" :label-width="formLabelWidth" prop="contactWay"> 
              <el-input v-model.number="modifyForm.contactWay" auto-complete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="购物条款：" :label-width="formLabelWidth" prop="term"> 
                <el-input style="width: 60%" :disabled="true" size="small" clearable placeholder="请选择上传文件" v-model="modifyForm.term"></el-input>
                <div class="fileBox">
                    <span class="el-icon-upload"></span>上传文件
                    <input id="term2" type="file" style="" @change="fileChange('modifyForm','term','term2','file')" />
                </div>
                <p style="font-size: 12px;">提醒:上传文件不能大于5M,支持文件格式为PDF</p>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitModifyForm('modifyForm')" size="small">提交</el-button>
            <el-button @click="modifyFormCancel" size="small">取消</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import "../../assets/css/hmdCommon.css"
import classPost from '../../servies//classPost'
import { Message } from 'element-ui' //element Message 组件引入
import uploader from "../modules/uploader"
import { mapState } from 'vuex';
export default {
  data () {
      var validateLogo = (rule, value, callback) => {
        console.log(value)
        if (/.*\.jpg$/.test(value)||/.*\.jpeg$/.test(value)||/.*\.png$/.test(value)||/.*\.bmp$/.test(value)) {
           if(this.addForm.logosize>100*1024){
              callback(new Error('文件不能超过100kb'));
            }else{
              callback();
            }
          }else{
            callback(new Error('只能选择.jpg,.jpeg,.png,.bmp'));
          }
      };
      var validateModifyLogo = (rule, value, callback) => {
        if (/.*\.jpg$/.test(value)||/.*\.jpeg$/.test(value)||/.*\.png$/.test(value)||/.*\.bmp$/.test(value)) {
            if(this.modifyForm.logosize>100*1024){
              callback(new Error('文件不能超过100kb'));
            }else{
              callback();
            }
          }else{
            callback(new Error('只能选择.jpg,.jpeg,.png,.bmp'));
          }
      };
      var changeFile = (rule, value, callback) => {
          if (/.*\.pdf$/.test(value)||/.*\.PDF$/.test(value)) {
            console.log(this.addForm.size)
            if(this.addForm.size>5*1024*1024){
              callback(new Error('文件不能超过5M'));
            }else{
              callback();
            }
          }else{
            callback(new Error('请选择PDF文件'));
          }
      };
      var changeModifyFile = (rule, value, callback) => {
          if (/.*\.pdf$/.test(value)||/.*\.PDF$/.test(value)) {
            console.log(this.addForm.size)
            if(this.modifyForm.size>5*1024*1024){
              callback(new Error('文件不能超过5M'));
            }else{
              callback();
            }
          }else{
            callback(new Error('请选择PDF文件'));
          }
      };
    return {
        loading: false,
        basicInfoLoading:true,
        imagelist:"",
        index:'',
        siteId:"",
        pictureId:'',
        imageUrl:'',
        dialogFormVisible: false,
        modifyFormVisible: false,
        websiteDataList:[],
        shoptermsName:[],
        addForm: {
          logo: '',
          website: '',
          contactWay: '',
          term: '',
          shoptermsUrl:'',
          logoUrl:'',
          logoPath:'',
          fileUrl:'',
          filePath:'',
          size:0,
          logosize:0
        },
        modifyForm:{
          logo: '',
          website: '',
          contactWay: '',
          term: '',
          shoptermsUrl:'',
          logoUrl:'',
          logoPath:'',
          fileUrl:'',
          filePath:'',
          size:0,
          logosize:0
        },
        rules: {
          logo: [
            { required: true, message:'请选择商户logo', trigger: 'change' },
            { validator: validateLogo, trigger: 'change' },
          ],
          website:[
            {required: true,message: '请选择商户网址', trigger: 'change'}
          ],
          contactWay: [
            { required: true, message: '请添加售后联系方式，可以为邮箱或者电话等联系方式', trigger: 'change' },
          ],
          term: [
            { required: true, message: '选择购物条款', trigger: 'change' },
            { validator: changeFile, trigger: 'change' },
          ]
        },
        modifyRules:{
            logo: [
              { required: true, message:'请选择商户logo' ,trigger: 'change' },
              { validator: validateModifyLogo, trigger: 'change' },
            ],
            website:[
              {required: true,message: '请选择商户网址', trigger: 'change'}
            ],
            contactWay: [
              { required: true, message: '请添加售后联系方式，可以为邮箱或者电话等联系方式', trigger: 'change' },
            ],
            term: [
              { required: true, message: '选择购物条款', trigger: 'change' },
              { validator: changeModifyFile, trigger: 'change' },
            ]
        },
        formLabelWidth: '120px',
        tableData: [
        ], 
    }
  },
  methods: {
    //基本信息初始化
    basicInfoQuery(){
          classPost.basicInfoQuery({})
            .then((res)=>{
              console.log(res)
              this.tableData=res.data.dataList
              this.basicInfoLoading=false
            }).catch((err)=>{
              console.log(err)
              this.basicInfoLoading=false
        })
      },
    //网址初始化
    website(){
        classPost.website({})
            .then((res)=>{
              console.log(res);
              this.websiteDataList=res.data.dataList
            }).catch((err)=>{
              console.log(err)
          })
     },
     // 文件上传
     myFileUpload(form,item,id,type){
        let fileList = document.getElementById(id).files[0];
        this.$store.dispatch('addbase', {file: fileList,uploadType:item});
        let data = this.upimgbase;
        classPost.fileUpload(data).then((res) => {
                this.loading=false
                this.$store.dispatch('removebase');
                this[form][item]=fileList.name //商品名
                this[form][type+'Path']=res.data.path;//商品路径
                this[form][type+'Url']=res.data.url;//图片路径
            })
            .catch((err)=>{
                this.$store.dispatch('removebase');
            })
     },
     fileChange(form,item,id,type) {
        if(document.getElementById(id).files.length!=0){
            this.loading=true
            // this[form][item+'Path']=document.getElementById(id).files[0].name;
            this[form][item]=document.getElementById(id).files[0].name //商品名
            if(type=='logo'){
              this[form].logosize=document.getElementById(id).files[0].size;
              if(document.getElementById(id).files[0].size>100*1024){
                this.$refs[form].validateField(item);
                this.loading=false;
              }else{
                this.myFileUpload(form,item,id,type);
              }
            }else{
              this[form].size=document.getElementById(id).files[0].size;
              if(document.getElementById(id).files[0].size>5*1024*1024){
                this.$refs[form].validateField(item);
                this.loading=false;
              }else{
                this.myFileUpload(form,item,id,type);
              }
              
            }
            console.log(this[form])
            }
      },
     //修改
     modify(row){
       this.modifyFormVisible=true;
       this.$nextTick(()=>{
        if(document.getElementById('logo2').files!=undefined){
         document.getElementById("logo2").value='';
        }
       })
      //  this.modifyForm.website=this.websiteDataList.filter((ele)=>{
      //     return ele.url==row.merchantSite
      //   })[0].id
        this.pictureId=row.pictureId
        this.modifyForm.contactWay=row.contact
        this.modifyForm.term=row.shoptermsName
        this.modifyForm.logoUrl=row.pictureUrl;
        this.modifyForm.filePath=row.shoptermsUrl;
        this.modifyForm.logo=row.picturePath;
        this.modifyForm.website=row.merchantSite;
        this.modifyForm.logoPath=row.picturePath
        console.log(this.modifyForm)

     },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
                // 新增基本信息
                var obj={
                  contact:this.addForm.contactWay,
                  picturePath:this.addForm.logoPath,
                  shoptermsName:this.addForm.term,
                  shoptermsUrl:this.addForm.filePath,
                  merchantSite:this.addForm.website,
                }
                console.log(obj)
                classPost.basicInfoAdd(obj)
                    .then((res)=>{
                      console.log(res)
                      this.basicInfoQuery();
                      this.resetForm("addForm");
                    }).catch((err)=>{
                      console.log(err)
                })
                 // 弹框消失
                this.dialogFormVisible=false;
          } else {
              console.log('error submit!!');
              return false;
          }
        });
      },
       submitModifyForm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
                var obj={
                    contact:this.modifyForm.contactWay,
                    picturePath:this.modifyForm.logoPath,
                    shoptermsName:this.modifyForm.term,
                    shoptermsUrl:this.modifyForm.filePath,
                    merchantSite:this.modifyForm.website,
                    pictureId:this.pictureId,
                }
                console.log(obj)
                classPost.basicInfoModify(obj)
                  .then((res)=>{
                    console.log(res)
                      this.basicInfoQuery();
                  }).catch((err)=>{
                    console.log(err)
                })
                //弹框消失
                this.modifyFormVisible=false;
            } else {
              console.log('error submit!!');
              return false;
            }
        });
      },
      addFormCancel(){
        this.dialogFormVisible = false;
        this.resetForm("addForm");
      },
      modifyFormCancel(){
        this.modifyFormVisible = false;
        this.resetForm('modifyForm');
      },
      add(){
        this.dialogFormVisible=true
        if(document.getElementById("logo").files!=undefined){
          document.getElementById("logo").value = "";
        }
        if(document.getElementById("term").files!=undefined){
         document.getElementById("term").value = "";
        }
      },
      resetForm(formName) {
        this.addForm.term='';
        this.modifyForm.term='';
        // this.dialogImageUrl='';
        this.addForm.logoUrl="";
        this.$refs[formName].resetFields();
      },
      basicInfoDelete(index,rows,pictureId) {
        this.$confirm('确认删除该商品信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
              //基本信息删除
              this.pictureId=pictureId
              var obj={
                pictureId:this.pictureId
              }
              classPost.basicInfoDelete(obj)
                  .then((res)=>{
                    this.basicInfoQuery();
                    console.log(res)
                  }).catch((err)=>{
                    console.log(err)
              })
        }).catch(() => {
        });
      },
    },
    mounted(){
          this.basicInfoQuery();
          this.website();
          // console.log(this.upimgbase)
          // console.log(this.showimg)
    },
    computed:{
      ...mapState({
                'info': state => state.computed.info,
                'upimgbase': state => state.upload.upimgbase
        }),
        filename(){
            this.form.filename=this.upimgbase.filename?this.upimgbase.filename:'';
            return this.upimgbase?this.upimgbase.filename:''
        },
        uploadDisabled:function() {
            return this.imagelist.length >0
        }

    },
    components:{
      uploader
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
.basicInfoMaintenance{
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
.basicInfoMaintenance .queryPayment{
    width:138px;
    height:32px;
    background:rgba(24,144,255,1);
    border-radius:4px;
    line-height: 32px;
    text-align: center;
    color:#fff;
    margin-right:10px;
    margin-bottom:10px;
}
.basicInfoMaintenance .commodityInfo{
    font-size:16px;
    color:rgba(0,0,0,0.85);
    margin:20px auto;
}
.basicInfoMaintenance .tableData.el-table th{
    background: rgba(24, 144, 255, 0.1);
    color:#000;
}
.otherInfo{
    padding-top:20px;
}
.continueAdd{
  width:100%;
  height:32px;
  line-height: 32px;
  border-radius:4px;
  border:1px dashed #D9D9D9;
  text-align: center;
  margin-bottom:20px;
  margin-top:20px;
}
.basicInfoMaintenance .el-select{
  width:100%;
}
.basicInfoMaintenance .cost{
  margin-top:20px;
}
.uploaderPic{
  background: #ccc;
  border:1px dashed #ccc;
  width:200px;
  height:200px;
}
.el-upload-list{
    position: absolute;
    top: 0;
    left: 160px;
}
.upFile{
  display: flex;
  align-items: flex-start;
}
.upFile .el-input{
    width:100px;
    margin-right: 30px;
}
.upFile .el-input .el-input__inner{
  border:none;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .disabled .el-upload--picture-card {
    display: none;
}


.basicInfoMaintenance input[type=file]{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        opacity:0;
    }
    .basicInfoMaintenance .fileBox{
        width: 100px;
        height: 32px;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        position: relative;
        text-align: center;
        line-height: 32px;
        overflow: hidden;
        float: right;
        margin-right: 35px;
        margin-top: 4px;
    }
    .logoBox{
      display: inline-block;
      width:150px;
      height:150px;
      border:1px dashed #ccc;
      text-align: center;
      line-height: 150px;
      margin-right:10px;
    }
    .logoBox i{
        font-size: 30px;
        color:#ccc;
    }
    .logoUrl{
      width:150px;
      height:150px;
      vertical-align: middle;
    }
</style>

