<template>
    <div class="wyx mainManage">
        <!-- html这里开始 -->

        <!--交易主体管理-->
        <el-form :inline="true" :rules="rules" :model="formInline" class="demo-form-inline" ref="formInline">
            <el-form-item label="carrierID：" prop="carrierId">
                <el-input size="small" clearable :clearable="true" v-model="formInline.carrierId"
                          placeholder="请输入carrierID"></el-input>
            </el-form-item>
            <el-form-item label="主体类型" prop="siteType">
                <el-select size="small" clearable v-model="formInline.siteType" placeholder="请选择主体类型">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="网站域名" value="1"></el-option>
                    <!--<el-option label="APP" value="2"></el-option>-->
                </el-select>
            </el-form-item>
            <!--<el-form-item label="网站域名：" prop="url">-->
            <!--<el-input size="small" clearable :clearable="true" v-model="formInline.url"-->
            <!--placeholder="请输入网站域名"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="APP名称：" prop="appName">-->
            <!--<el-input size="small" clearable :clearable="true" v-model="formInline.appName"-->
            <!--placeholder="审批人"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="主体状态：" prop="status">
                <el-select size="small" clearable v-model="formInline.status" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="冻结" value="0"></el-option>
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="待审核" value="2"></el-option>
                    <el-option label="审核未通过" value="3"></el-option>
                    <el-option label="已删除" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建日期：" prop="startTime">
                <!--<el-date-picker-->
                <!--size="small"-->
                <!--clearable-->
                <!--v-model="formInline.createTime"-->
                <!--type="daterange"-->
                <!--value-format="yyyy-MM-dd"-->
                <!--start-placeholder="开始日期"-->
                <!--end-placeholder="结束日期"-->
                <!--:picker-options="pickerOptions2">-->
                <!--</el-date-picker>-->
                <el-date-picker
                        v-model="formInline.startTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始时间"
                        :picker-options="pickerOptions1"
                        :editable="false">
                </el-date-picker>
                -
                <el-date-picker
                        v-model="formInline.endTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束时间"
                        :picker-options="pickerOptions2"
                        :editable="false">
                </el-date-picker>
            </el-form-item>
            <!--<el-form-item label="入账结束时间：" prop="endTime">-->
            <!--<el-date-picker-->
            <!--v-model="formInline.endTime"-->
            <!--type="date"-->
            <!--value-format="yyyy-MM-dd"-->
            <!--placeholder="选择入账结束时间"-->
            <!--:picker-options="pickerOptions2"-->
            <!--:editable="false">-->
            <!--</el-date-picker>-->
            <!--</el-form-item>-->
            <el-form-item>
                <el-button size="small" type="primary" @click="submitForm('formInline',success,error)">查询</el-button>
            </el-form-item>
            <br>
            <el-form-item class="lastes">
                <el-button size="small" type="primary" @click="dialogFormVisible = true">添加</el-button>
                <el-button size="small" type="primary" @click="moreAdd = true">批量添加</el-button>
            </el-form-item>
        </el-form>


        <!--表格-->

        <el-table
                :data="tableData"
                style="width: 100%"
                :default-sort="{prop: 'date', order: 'descending'}"
                empty-text="没有您要找的提现记录，您可以换个条件试试哦！"
                v-loading="dynamicload"
        >
            <el-table-column
                    prop="carrierId"
                    label="carrierID"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="siteType "
                    label="类型"
                    align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.siteType==1">
                        网站域名
                    </div>
                    <div v-else-if="scope.row.siteType==2">
                        APP
                    </div>
                </template>
            </el-table-column>
            <!--<el-table-column-->
            <!--prop="url"-->
            <!--label="内容"-->
            <!--align="center">-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="gmtCreateTime"
                    label="创建时间"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="gmtModifyTime"
                    label="修改时间"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
                    :formatter="formatter">
                <template slot-scope="scope">
                    <div v-if="scope.row.status==1||scope.row.status==6">
                        <div class="yuanGreen"></div>
                        正常
                    </div>
                    <div v-else-if="scope.row.status==4">
                        <div class="yuanRed"></div>
                        已删除
                    </div>
                    <div v-else-if="scope.row.status==3">
                        <div class="yuanRed"></div>
                        审核未通过
                    </div>
                    <div v-else-if="scope.row.status==0">
                        <div class="yuan00025"></div>
                        冻结
                    </div>
                    <div v-else-if="scope.row.status==2||scope.row.status==5">
                        <div class="yuan00025"></div>
                        待审核
                    </div>
                    <!--<div :class="scope.row.status==1?'yuanGreen':'yuanRed'"></div>-->
                    <!--{{scope.row.address}}-->
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center">
                <template slot-scope="scope">
                    <el-button style="height:22px;" v-show="scope.row.status!=4" type="text" @click="open2(scope.row.id)">删除</el-button>
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
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="total">
        </el-pagination>


        <!--添加交易主体-->
        <el-dialog title="交易主体配置" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
            <el-form :model="addManage" ref="addManage" :rules="addManageRules">
                <el-form-item label="配置类型" :label-width="formLabelWidth" prop="siteType">
                    <el-select size="small" clearable v-model="addManage.siteType" placeholder="请选择配置类型">
                        <el-option label="请选择配置类型" value=""></el-option>
                        <el-option label="网站域名" value="1"></el-option>
                        <!--<el-option label="APP" value="2"></el-option>-->
                    </el-select>
                </el-form-item>
                <div v-if="addManage.siteType=='1'">
                    <el-form-item label="网站域名" :label-width="formLabelWidth" prop="carrierId">
                        <el-input size="small" clearable v-model="addManage.carrierId" auto-complete="off"
                                  placeholder="请输入主体配置的域名"></el-input>
                    </el-form-item>
                </div>
                <div v-if="addManage.siteType=='2'">
                    <el-form-item label="系统版本:" :label-width="formLabelWidth" prop="v">
                        <el-select size="small" clearable v-model="addManage.v" placeholder="请选择APP系统版本">
                            <el-option label="请选择APP系统版本" value=""></el-option>
                            <el-option label="ios" value="1"></el-option>
                            <el-option label="Android" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="APP应用商店名称" :label-width="formLabelWidth" prop="storeName">
                        <el-input size="small" clearable v-model="addManage.storeName" auto-complete="off"
                                  placeholder="请输入APP应用商店名称"></el-input>
                    </el-form-item>
                    <el-form-item label="APP名称" :label-width="formLabelWidth" prop="name">
                        <el-input size="small" clearable v-model="addManage.name" auto-complete="off"
                                  placeholder="请输入APP名称"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeWin('addManage')">取消</el-button>
                <el-button size="small" type="primary" @click="submitForm('addManage',addSuccess,error)">确定</el-button>
            </div>
        </el-dialog>
        <!--批量添加交易主体-->
        <el-dialog
                title="交易主体配置"
                :visible.sync="moreAdd"
                :close-on-click-modal="false"
                :show-close="false"
                width="530px">
            <p class="prompt">批量添加时请按照文件模版填写域名/APP信息，否则无法通过审核</p>
            <el-form :model="moreAddMes" label-width="100px" ref="moreAddMes" style="margin-bottom: 0">
                <el-form-item label="上传文件:" prop="file" :rules="[{required:true,message:'请选择文件',trigger:'change'},{validator: fileCheck,trigger: 'change'}]">
                    <el-input style="width: 60%" :disabled="true" size="small" clearable placeholder="请选择上传文件"
                              v-model="moreAddMes.file"></el-input>
                    <div class="fileBox">
                        <span class="el-icon-upload"></span>上传文件
                        <input id="files" type="file" @change="fileChange"/>
                    </div>
                </el-form-item>
                <el-form-item label="">
                    <a href="/static/主体批量配置模板.xls">
                        <el-button size="small" type="text">下载主体批量配置模版</el-button>
                    </a>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="closeWin('moreAddMes')">取消</el-button>
    <el-button size="small" type="primary" @click="submitForm('moreAddMes',addBatchByFile,error)">批量上传</el-button>
  </span>
        </el-dialog>

    </div>
</template>

<script>
    import {Message} from 'element-ui' //element Message 组件引入
    import '../../assets/css/wyxCard.css'
    import uploader from '../modules/uploader.vue'
    import {submitForm, getSubmitJson, reset} from '../../assets/js/submitForm'
    import classPost from '../../servies/classPost'
    import {mapState} from 'vuex';

    export default {
        data() {
            var requiredWebsite = (rule, value, callback) => {
                if (value != '') {
                    if (!/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g.test(value)) {
                        callback(new Error('请输入正确的网址'));
                    } else {
                        callback();
                    }
                } else {
                    callback(new Error('请输入网址'));
                }
            };
            var selecttime = (rule, value, callback) => {
                if (value != null) {
                    if(this.formInline.endTime==null){
                        callback(new Error('请选择入账结束时间'))
                    }else {
                        let time = new Date(this.formInline.endTime).getTime() - new Date(this.formInline.startTime).getTime()
//                let time = this.formInline.createTime[1] - this.formInline.createTime[0]
                        let year = 90 * 24 * 60 * 60 * 1000;
                        if (Math.abs(time) > year) {
                            callback(new Error('查询时间段最长为90天'))
                        } else {
                            callback();
                        }
                    }
                } else {
                    callback();
                }
            };
            var selecttime2 = (rule, value, callback) => {
                if (value != null) {
                    if(this.formInline.startTime==null){
                        callback(new Error('请选择入账开始时间'))
                    }else {
//                        let time = new Date(this.formInline.endTime).getTime() - new Date(this.formInline.startTime).getTime()
////                let time = this.formInline.createTime[1] - this.formInline.createTime[0]
//                        let year = 90 * 24 * 60 * 60 * 1000;
//                        if (Math.abs(time) > year) {
//                            callback(new Error('查询时间段最长为90天'))
//                        } else {
                        callback();
//                        }
                    }
                } else {
                    callback();
                }
            };
            let that=this;
            let timeCheck1=function (time) {
                if(that.formInline.endTime==null){
                    return time.getTime() > Date.now();
                }else{
                    return time.getTime() > new Date(that.formInline.endTime);
                }
            }
            let timeCheck2=function (time) {
                return (time.getTime() > Date.now())||(time.getTime()<(new Date(that.formInline.startTime)-1*24*60*60*1000));
            }

//            文件格式大小
            let fileCheck = (rule, value, callback) => {
                if (/.*\.xls/.test(value)) {
                    if (this.moreAddMes.size > 5 * 1024 * 1024) {
                        callback(new Error('文件不能超过5M'));
                    } else {
                        callback();
                    }
                } else {
                    callback(new Error('请选择xls文件'));
                }
            };
            return {
//                校验文件
                fileCheck:fileCheck,
                //加载
                dynamicload:true,
//                选哪个接口
                choosePara: {
                    pageNumber: 1,
                    pageSize: 10
                },
                pageSize: 10,
                pageNumber: 1,
                currentPage4: 2,
                formInline: {
                    carrierId: '',
                    url: '',
                    appName: '',
                    status: '',
//                    createTime: ['2018-5-21', '2018-6-21'],
                    startTime:'',
                    siteType: '0',
                    endTime:''
                },
                rules: {
                    carrierId: [],
                    url: [],
                    appName: [],
                    status: [],
                    startTime: [
                        {required: true, message: '请选择入账时间', trigger: 'blur'},
                        {validator: selecttime, trigger: 'change'}
                    ],
                    endTime: [
                        {required: true, message: '请选择时间', trigger: 'blur'},
                        {validator: selecttime2, trigger: 'change'}
                    ],
                },
                tableData: [],
                dialogFormVisible: false,
                moreAdd: false,
                addManage: {
                    carrierId: '',
                    v: '',
                    name: '',
                    storeName: '',
                    siteType: '',
                },
                addManageRules: {
                    carrierId: [
                        {required: true, message: '域名不能为空', trigger: 'blur'},
                        {validator: requiredWebsite, trigger: 'blur'}
                    ],
                    v: [
                        {required: true, message: '系统版本不能为空', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: 'APP名称不能为空', trigger: 'blur'}
                    ],
                    storeName: [
                        {required: true, message: '商店名称不能为空', trigger: 'blur'}
                    ],
                    siteType: [
                        {required: true, message: '类型不能为空', trigger: 'change'}
                    ],
                },
                formLabelWidth: '150px',
                moreAddMes: {
                    file: '',
                    size:0
                },
//                分页总数
                total: 0,
                pickerOptions1: {
                    disabledDate(time) {
                        return timeCheck1(time);
                    }
                },
                pickerOptions2: {
                    disabledDate(time) {
                        return timeCheck2(time);
                    }
                },
//                文件类型
                types: '.xls,.xlsx',
            }
        },
        methods: {
            submitForm,
            getSubmitJson,
            reset,
//            关闭二级窗口
            closeWin(form) {
                this.moreAdd = false;
                this.dialogFormVisible = false;
                this.reset(form)
            },
            success(children) {
                let submitJson = this.getSubmitJson(children);
                submitJson.endTime = this.formInline.endTime;
                submitJson.pageSize = this.pageSize;
                submitJson.pageNumber = 1;
//                delete submitJson.createTime;
                this.currentPage4 = 1;
                console.log(submitJson);
                this.choosePara = submitJson;
                this.queryData();
                console.log('验证通过')
            },
            error() {
                console.log('验证失败');
            },
//    添加单个交易主体配置
            addSuccess(children) {
                this.dialogFormVisible = false;
                let submitJson = this.getSubmitJson(children);
                this.reset('addManage');
                console.log(submitJson)
                this.currentPage4 = 1;
                classPost.addSingleSite(submitJson)
                    .then((res) => {
                        this.choosePara = {pageNumber: 1, pageSize: this.pageSize};
                        this.queryData();
                        this.$message({
                            type: 'success',
                            message: '添加成功!  您已成功添加该交易主体配置!'
                        });
                        console.log(res)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            },
            formatter(row, column) {
                return row.address;
            },
//            删除
            open2(id) {
                this.$confirm('您将要删除该交易主体配置<br/><span style="color: red;">删除后该配置将不能恢复</span>', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    classPost.deleteSite({id: id}).then((res) => {
                        console.log(res)
                        this.dynamicload=true;
//                        this.choosePara = {pageNumber: this.pageNumber, pageSize: this.pageSize};
                        this.queryData();
                    }).catch((err) => {
                        console.log(err)
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功!  您已成功删除该交易主体配置!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
//    分页用到
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
//            页数改变时
            handleCurrentChange(val) {
                this.dynamicload=true;
                this.pageNumber = val;
                this.choosePara.pageNumber = val;
                this.queryData();
//                classPost.querySite(this.choosePara).then((res) => {
//                    this.tableData = res.data.dataList;
//                    this.total = parseInt(res.data.total);
//                    console.log(res)
//                }).catch((err) => {
//                    console.log(err)
//                })
                console.log(`当前页: ${val}`);
            },
            handleClose(done) {
//      批量添加关闭
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
//            批量添加
            addBatchByFile() {
                let fileList = document.getElementById('files').files[0];
                this.$store.dispatch('addbase', {multipartFile: fileList});
                let data = this.upimgbase;
                this.reset('moreAddMes');
                classPost.addBatchByFile(data)
                    .then((res) => {
                        console.log(res)
                        this.$store.dispatch('removebase');
                        let a=document.getElementById("files");
                        a.value = "";
                        this.moreAdd = false;
                        this.$message({
                            message: '批量添加成功',
                            type: 'success'
                        });
                        this.currentPage4 = 1;
//                        重新查询
                        this.choosePara = {pageNumber: 1, pageSize: this.pageSize};
                        this.currentPage4 = 1;
                        this.queryData();
                    })
                    .catch((error) => {
                        this.$store.dispatch('removebase');
                        this.$message({
                            message: '文件中' + error.data.message,
                            type: 'error'
                        });

                    })
            },
            fileChange() {
                this.moreAddMes.file = document.getElementById('files').files[0].name;
                this.moreAddMes.size = document.getElementById('files').files[0].size;
            },
            queryData(){
                classPost.querySite(this.choosePara).then((res) => {
                    this.tableData = res.data.dataList;
                    this.total = parseInt(res.data.total);
                    this.dynamicload=false;
                    console.log(res)
                }).catch((err) => {
                    this.dynamicload=false;
                    console.log(err)
                })
            }
        },
        components: {
            uploader
        },
        computed: {
            ...mapState({
                'info': state => state.computed.info,
                'upimgbase': state => state.upload.upimgbase
            }),
        },
        mounted: function () {

//            默认时长
            let time = new Date();
            let time2 = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
            let now = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
            let go = `${time2.getFullYear()}-${time2.getMonth() + 1}-${time2.getDate()}`;
            this.formInline.startTime = go;
            this.formInline.endTime = now;


            this.choosePara = {pageNumber: 1, pageSize: this.pageSize};
            this.queryData();
        }
    }

</script>

<style>
    .mainManage .prompt {
        margin-bottom: 20px;
    }

    /* .mainManage .el-form {
        margin-bottom: 30px;
    } */

    
    .mainManage input[type=file] {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }

    .mainManage .fileBox {
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
        margin-top: 4px;
    }

    .mainManage .el-dialog__body {
        padding-bottom: 0;
    }
    .lastes{
        margin-bottom: 5px;
    }
</style>
