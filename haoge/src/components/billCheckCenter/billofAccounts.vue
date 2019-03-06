<template>
    <div class="wyx billofAccounts">
        <!-- html这里开始 -->
        <!--<el-card class="box-card">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span>结算对账单下载</span>-->
        <!--</div>-->
        <el-form :model="billofAccountsForm" :rules="rules" ref="billofAccountsForm" label-width="100px"
                 class="billofAccountsForm">
            <el-form-item label="选择币种：" prop="currencyCode">
                <el-select v-model="billofAccountsForm.currencyCode" placeholder="请选择币种" clearable>
                    <el-option label="全部" value="ALL"></el-option>
                    <!-- 循环币种-->
                    <el-option v-for="(item,index) in money" :key=index :label="item.curCodeName" :value="item.curCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="下载类型：" prop="downType">
                <el-radio-group v-model="billofAccountsForm.downType" @change="changeDate">
                    <el-radio label="1">按月下载</el-radio>
                    <el-radio label="2">按日下载</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="time.label" prop="downDate">
                <el-date-picker
                        v-model="billofAccountsForm.downDate"
                        :type="time.type"
                        :value-format="type"
                        :placeholder="time.label"
                        :picker-options="pickerOptions2">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="submitForm('billofAccountsForm',success,error)">下载</el-button>
            </el-form-item>
        </el-form>
        <!--</el-card>-->

    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import {submitForm, getSubmitJson, reset} from '../../assets/js/submitForm'
    import classPost from '../../servies/classPost'

    export default {
        data() {
            var that=this;
            var checkTime = (rule, value, callback) => {
                if (!value) {
                    if (this.time.label == "选择月份：") {
                        return callback(new Error('请选择对账单月份'));
                    } else {
                        return callback(new Error('请选择对账单日期'));
                    }
                } else {
                    callback();
                }
            };
            var aaa=function (time) {
                if(that.time.type=='month') {
                    var myDate = new Date();
                    var thisyear = myDate.getFullYear();
                    var thismonth = myDate.getMonth() + 1;
                    return time.getTime() >= new Date(thisyear + '-' + thismonth + '-01 00:00:00');
                }else{
                    return time.getTime() > Date.now() - 24*60*60*1000
                }
            }
            return {
                time: {
                    label: "选择月份：",
                    type: 'month',
                },
                billofAccountsForm: {
                    currencyCode: 'ALL',
                    downType: "1",
                    downDate: '',
                },
                rules: {
                    currencyCode: [
                        {required: true, message: '请选择币种', trigger: 'change'},
                    ],
                    downType: [
                        {required: true, message: '请选择下载类型', trigger: 'change'},
                    ],
                    downDate: [
                        {required: true, message: '请选择下载时间', trigger: 'change'},
                        {validator: checkTime, trigger: 'change'}
                    ]
                },
                money:[],
                type:'yyyy-MM',
                bizhong:[],
//                控制不可选时间
                pickerOptions2: {
                    disabledDate(time) {
                         return aaa(time)
//                        return time.getTime() > Date.now() - 8.64e6 - 24*60*60*1000
                    }
                },
            };
        },
        methods: {
//            pickerOptions2(time){
//                console.log(time)
////                return {
////                    disabledDate(time) {
////                        return time.getTime() > Date.now() - 8.64e6 - 24*60*60*1000
////                    }
////                }
//            },
            submitForm,
            success(children) {
                let submitJson = getSubmitJson(children);
                console.log(submitJson)
                classPost.downpartnerreconcile(submitJson)
                    .then((res) => {
                    if(res.code=='09000001') {
                        this.$confirm(res.message, '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        }).then(() => {
                        }).catch(() => {
                        });
                    }else if(res.code=='00000000') {
                        this.$message({
                            type: 'success',
                            message: '下载成功!'
                        });
                        let a=document.createElement('a');
                        a.href=res.data;
                        a.click();
                    }
                        console.log(res)
                    })
                    .catch()

            },
            error() {

            },
            changeDate(date) {
                if (date == "1") {
                    this.time.label = "选择月份："
                    this.time.type = "month";
                    this.billofAccountsForm.downDate='';
                    this.type='yyyy-MM'
                } else {
                    this.time.label = "选择日期："
                    this.time.type = "date";
                    this.billofAccountsForm.downDate='';
                    this.type='yyyy-MM-dd'
                }
            }
        },
        mounted: function () {
//            获取币种 从 localstorage中获取
//            this.money=JSON.parse(localStorage.current);
            classPost.curCode({memberCode:JSON.parse(localStorage.data).merchantId,acctType:1})
                .then((res)=>{
                    this.money=res.data;
                    console.log(res)
                })
                .catch();
        }
    }
</script>

<style>
    .billofAccounts {
        margin-top: 20px;
    }

    .billofAccounts .el-card__header {
        background: rgba(24, 144, 255, 0.1);
        color: #000;
    }

    .billofAccounts .el-card__header span {
        font-size: 16px;
        font-weight: 700;
    }

    .billofAccountsForm {
        padding: 0 50% 0 15%;
    }

    .billofAccountsForm .el-select {
        width: 100%;
    }

    .billofAccountsForm .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }
</style>
