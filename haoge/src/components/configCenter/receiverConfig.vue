<template>
    <div class="wyx receiverConfig">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>接收人</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            </div>
            <el-form label-position="right" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px"
                     :class="ruleForm.updateFlag?'demo-ruleForm':'null demo-ruleForm'">
                <el-button diabled v-show="!ruleForm.updateFlag" class="xiugai" type="text" @click="changeUpdateFlag">修改</el-button>
                <el-form-item label="接收人:">
                    <!--<el-input v-show="updateFlag" v-model="ruleForm.name" placeholder="请输入接收人名称"></el-input>-->
                    <span>{{monidata.notifyReceiverInfoDTO.name}}</span>
                </el-form-item>
                <el-form-item v-for="(item,index) in monidata.notifyWayDTOList" :key="index" :label="item.wayType=='EMAIL'?'接收人邮箱：':(item.wayType=='PHONE'?'接收人手机号:':'')" :prop="item.wayType">
                    <span v-show="!ruleForm.updateFlag">{{item.wayValue}}</span>
                    <el-input size="small" :clearable="true" v-show="ruleForm.updateFlag" v-model="ruleForm[item.wayType]"
                              :placeholder="'请输入接收人'+item.wayType"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" v-show="ruleForm.updateFlag" type="primary" @click="submitForm('ruleForm',success,error)">保存
                    </el-button>
                    <el-button size="small" v-show="ruleForm.updateFlag" type="default" @click="closeModify">取消
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="box-card" v-for="(item,index) in formArr" :key="index">
            <div slot="header" class="clearfix">
                <span>{{item.type}}接收配置</span>
                <el-switch
                        style="float: right"
                        v-model="item.switchBtn"
                        @change="switchChange(item)"
                        active-text="开启"
                        inactive-text="关闭">
                </el-switch>
            </div>
            <div class="emailConf">
                <span>消息推送类型:</span>
                <el-button v-show="!item.form.updateFlag" class="xiugai" type="text" @click="changeEmailUpdateFlag(index)">修改
                </el-button>
            </div>
            <el-form :model="item.form" :ref="item.form">
                <div v-if="!item.form.updateFlag">
                    <el-form-item>
                        <el-checkbox :disabled="!item.form.updateFlag" :indeterminate="item.form.isIndeterminate"
                                     v-model="item.form.checkAll">全选
                        </el-checkbox>
                        <el-checkbox-group v-model="item.form.checkOption">
                            <el-checkbox v-for="(city,index2) in item.form.cities" :label="city.id" :key="index2"
                                         :disabled="!item.form.updateFlag">{{city.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item>
                        <el-checkbox :indeterminate="item.form.isIndeterminate" v-model="item.form.checkAll"
                                     @change="handleCheckAllChange(item.form)">全选
                        </el-checkbox>
                        <el-checkbox-group v-model="item.form.checkedCities"
                                           @change="handleCheckedCitiesChange(item.form)">
                            <el-checkbox v-for="(city,index3) in item.form.cities" :label="city.id" :key="index3">{{city.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button size="small" v-show="item.form.updateFlag" type="primary" @click="saveEmail(index)">保存</el-button>
                    <el-button size="small" v-show="item.form.updateFlag" type="default" @click="cancelUpdateFlag(item,index)">取消
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import classPost from '../../servies/classPost'
    import {submitForm,getSubmitJson,reset} from '../../assets/js/submitForm'

    export default {
        data() {
            var delspace = (rule, value, callback) => {
                if (value.toString().trim() === '') {
                    callback(new Error('不能只输入空字符'));
                } else {
                    callback();
                }
            };
            var tel = (rule, value, callback) => {
                if (!/^\d+$/.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                } else {
                    callback();
                }
            };
            return {
//                修改接收人消息的表单
                ruleForm: {
                    EMAIL: '',
                    PHONE: '',
//        是否修改中
                    updateFlag: false
                },
                rules: {
                    EMAIL: [
                        {required: true, message: '接收人邮箱不能为空 请输入正确的邮箱', trigger: 'change'},
                        {validator: delspace, trigger: 'blur'}
                    ],
                    PHONE: [
                        {required: true, message: '接收人手机号不能为空', trigger: 'change'},
//                        {type: 'number', message: '请输入正确的手机号', trigger: 'blur'},
                        {validator: tel, trigger: 'blur'},
                        {validator: delspace, trigger: 'blur'}
                    ]
                },
                monidata: {
                    notifyReceiverInfoDTO:{
                        name: '张三',
                    },
                    notifyWayDTOList:[],
                },
//                接受消息所有类型
                formArr:[]
            }
        },
        methods: {
            submitForm,
//            取消修改信息按钮
            closeModify(){
                this.ruleForm.updateFlag=false;
                this.$message('您已取消修改接收人信息！')
            },
//      点击接收人信息修改按钮
            changeUpdateFlag() {
                if(this.monidata.notifyWayDTOList.length!=0){
                    this.ruleForm.EMAIL = this.monidata.notifyWayDTOList.filter((item)=>{
                        return item.wayType=='EMAIL';
                    })[0].wayValue;
                    this.ruleForm.PHONE = this.monidata.notifyWayDTOList.filter((item)=>{
                        return item.wayType=='PHONE';
                    })[0].wayValue;
                    this.ruleForm.updateFlag = true;
                }
            },
//      取消修改
            cancelUpdateFlag(item,index) {
                item.form.updateFlag = false;
                item.form.checkedCities = item.form.checkOption;
//                this.formArr[index].form.updateFlag = false;
                this.$message('您已取消修改配置！')
            },
//      提交修改
            success(children){
                let submitJson=getSubmitJson(children);
                submitJson.receiverId=this.$route.params.id;
                let arr=[];
                for(let i=0;i<this.monidata.notifyWayDTOList.length;i++){
                    arr.push({
                        "id": this.monidata.notifyWayDTOList[i].id,
                        "receiverId": this.$route.params.id,
                        "wayType": this.monidata.notifyWayDTOList[i].wayType,
                        "wayValue": submitJson[this.monidata.notifyWayDTOList[i].wayType]
                    });
                }
                console.log(arr)
                classPost.receiverMethods(arr)
                    .then((res)=>{
                        this.$message('修改成功');
                        classPost.receiverDetail({id:this.$route.params.id})
                            .then((res)=>{
                                this.monidata=res.data;
                                console.log(res)
                            })
                            .catch()
                        this.ruleForm.updateFlag = false;
                        console.log(res)
                    })
                    .catch()
            },
            error(){
                console.log('验证失败')
            },
//      点击配置类型的修改按钮
            changeEmailUpdateFlag(index) {
//                this.emailForm.checkedCities = this.monidata.emailroto;
                this.formArr[index].form.updateFlag = true;
                console.log(this.formArr[index])
            },
//      保存消息配置修改
            saveEmail(index) {
                this.formArr[index].form.updateFlag = false;//item.form.checkedCities
                let str='';
                for(let i=0;i<this.formArr[index].form.checkedCities.length;i++){
                    if((i+1)!=this.formArr[index].form.checkedCities.length){
                        str+=this.formArr[index].form.checkedCities[i]+';';
                    }else{
                        str+=this.formArr[index].form.checkedCities[i];
                    }
                }
                classPost.notifywaytotype({wayId:this.formArr[index].messId,typeIds:str})
                    .then((res)=>{
                        this.$message('保存成功');
                        console.log(res);
                        this.formArr[index].form.checkOption=this.formArr[index].form.checkedCities;
                    })
                    .catch()
            },
            handleCheckAllChange(obj) {
//                点全选是否全选
                obj.isIndeterminate = false;
                obj.checkedCities=obj.checkAll?obj.allOption:[];
            },
            handleCheckedCitiesChange(obj) {
//                点没项是否全选了
                let checkedCount = obj.checkedCities.length;
                obj.checkAll = checkedCount === obj.allOption.length;
                obj.isIndeterminate = checkedCount > 0 && checkedCount < obj.allOption.length;
            },
//            切换开关改变状态
            switchChange(obj){
                let submitJson={
                    id:obj.messId,
                    status:obj.switchBtn?1:0
                };
                classPost.wayStatus(submitJson)
                    .then((res)=>{
                        console.log(res);
                        this.$message('您已'+(obj.switchBtn?'打开':'关闭')+obj.type+'接受方式');
                    })
                    .catch()
            },
            queryData(){
                this.formArr=[];
                classPost.receiverDetail({id:this.$route.params.id})
                    .then((res)=>{
                        console.log(res)
                        this.monidata=res.data;
                        for(let i=0;i<this.monidata.notifyWayDTOList.length;i++) {
                            this.formArr.push({
                                type: this.monidata.notifyWayDTOList[i].wayType,
                                switchBtn: this.monidata.notifyWayDTOList[i].status=='0'?false:true,
                                messId:this.monidata.notifyWayDTOList[i].id,
                                messStatus:this.monidata.notifyWayDTOList[i].status,
                                form: {
                                    updateFlag: false,
                                    checkAll: false,
                                    checkedCities: [],
                                    cities: this.monidata.notifyWayDTOList[i].notfiyTypeList,
                                    isIndeterminate: true,
                                    allOption:[],
                                    checkOption:[]
                                }
                            })
                            let a=this.monidata.notifyWayDTOList[i].notfiyTypeList;
                            for(let j=0;j<a.length;j++){
                                this.formArr[i].form.allOption.push(a[j].id);
                                if(a[j].check=='1'){
                                    this.formArr[i].form.checkOption.push(a[j].id);
                                    this.formArr[i].form.checkedCities.push(a[j].id);
                                }
                            }
                        }
                    })
                    .catch()
            }
        },
        mounted:function () {
          this.queryData();
        }
    }
</script>

<style>
    .receiverConfig .demo-ruleForm .el-form-item {
        width: 45%;
        /*float: left;*/
    }

    .receiverConfig .xiugai {
        float: right;
        padding: 0;
    }

    .null .el-form-item__error {
        display: none;
    }
</style>
