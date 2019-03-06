<template>
    <div class="wyx asynNotification">
        <el-alert
                title="在MPS操作后接收异步通知（在MPS交易处理模块进行交易处理操作后，如果需要接收异步通知，请在此处配置异步通知地址）"
                type="warning"
                show-icon
                :closable="false">
        </el-alert>
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="300px" class="demo-ruleForm"
                 style="width:50%">
            <el-form-item label="消费异步通知地址：" prop="a01">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a01" clearable
                          placeholder="请输入消费异步通知地址"></el-input>
            </el-form-item>
            <el-form-item label="退款异步通知地址：" prop="a03">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a03" clearable
                          placeholder="请输入退款异步通知地址"></el-input>
            </el-form-item>
            <el-form-item label="预授权异步通知地址：" prop="a04">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a04" clearable
                          placeholder="请输入预授权异步通知地址"></el-input>
            </el-form-item>
            <el-form-item label="预授权完成异步通知地址：" prop="a05">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a05" clearable
                          placeholder="请输入预授权完成异步通知地址"></el-input>
            </el-form-item>
            <el-form-item label="预授权撤销异步通知地址：" prop="a06">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a06" clearable
                          placeholder="请输入预授权撤销异步通知地址"></el-input>
            </el-form-item>

            <!--<el-form-item label="动态预授权审核通过异步通知地址：" prop="a14">-->
                <!--<el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a14" clearable-->
                          <!--placeholder="请输入动态预授权审核通过异步通知地址"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="动态预授权审核拒绝异步通知地址：" prop="a15">-->
                <!--<el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a15" clearable-->
                          <!--placeholder="请输入动态预授权审核拒绝异步通知地址"></el-input>-->
            <!--</el-form-item>-->

            <el-form-item label="创建Token异步通知地址：" prop="a08">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a08" clearable
                          placeholder="请输入创建Token异步通知地址"></el-input>
            </el-form-item>
            <el-form-item label="消费并创建Token异步通知地址：" prop="a09">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a09" clearable
                          placeholder="请输入消费并创建Token异步通知地址"></el-input>
            </el-form-item>
            <el-form-item label="预授权并创建Token异步通知地址：" prop="a10">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a10" clearable
                          placeholder="请输入预授权并创建Token异步通知地址"></el-input>
            </el-form-item>
            <el-form-item label="Token消费异步通知地址：" prop="a11">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a11" clearable
                          placeholder="请输入Token消费异步通知地址"></el-input>
            </el-form-item>
            <el-form-item label="Token预授权异步通知地址：" prop="a12">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a12" clearable
                          placeholder="请输入Token预授权异步通知地址"></el-input>
            </el-form-item>
            <el-form-item label="Token取消异步通知地址：" prop="a13">
                <el-input size="small" type="text" auto-complete="off" v-model="ruleForm2.a13" clearable
                          placeholder="请输入Token取消异步通知地址"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :disabled="disabledBtn" size="small" type="primary" @click="submitForm('ruleForm2',success,error)">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
    
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import {submitForm, getSubmitJson, reset} from '../../assets/js/submitForm'
    import classPost from '../../servies/classPost'

    export default {
        name: "asynNotification",
        // watch: {
        //     ruleForm2: {
        //         handler(newValue, oldValue) {
        //             console.log(this.$refs.ruleForm2)
        //         },
        //         deep: true
        //     }
        // },
        data(){
            var validateLength=(rule, value, callback)=>{
                if(value.length>200){
                    callback(new Error('通知地址长度不可超过200字符'));
                }else{
                    callback();
                }
            }
            var inputChange=(rule, value, callback)=>{
                if(value.length>200){
                    callback(new Error('通知地址长度不可超过200字符'));
                }else if(this.ruleForm2.a03==this.ruleForm1.a03 && this.ruleForm2.a05==this.ruleForm1.a05 && this.ruleForm2.a06==this.ruleForm1.a06
                    && this.ruleForm2.a14==this.ruleForm1.a14 && this.ruleForm2.a15==this.ruleForm1.a15 && this.ruleForm2.a01==this.ruleForm1.a01
                    && this.ruleForm2.a04==this.ruleForm1.a04 && this.ruleForm2.a08==this.ruleForm1.a08 && this.ruleForm2.a09==this.ruleForm1.a09
                    && this.ruleForm2.a10==this.ruleForm1.a10 && this.ruleForm2.a11==this.ruleForm1.a11 && this.ruleForm2.a12==this.ruleForm1.a12 && this.ruleForm2.a13==this.ruleForm1.a13){
                    this.disabledBtn=true;
                }else{
                    this.disabledBtn=false;
                }
                    callback();

            }
            return {
                ruleForm1:{
                    a01: '',
                    a03: '',
                    a04: '',
                    a05: '',
                    a06: '',
                    a14: '',
                    a15: '',
                    a08: '',
                    a09: '',
                    a10: '',
                    a11: '',
                    a12: '',
                    a13: ''
                },
                ruleForm2: {
                    a01: '',
                    a03: '',
                    a04: '',
                    a05: '',
                    a06: '',
                    a14: '',
                    a15: '',
                    a08: '',
                    a09: '',
                    a10: '',
                    a11: '',
                    a12: '',
                    a13: ''
                },
                rules2: {
                    a01: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a03: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a04: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a05: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a06: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a14: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a15: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a08: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a09: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a10: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a11: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a12: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ],
                    a13: [
                        // {validator: validateLength, trigger: 'blur'},
                        {validator: inputChange, trigger: 'change'}
                    ]
                },
                disabledBtn:true
            }
        },
        methods:{
            submitForm,
            success(children){
                let arrData=[];

                let submitJson = getSubmitJson(children);
                for (let item in submitJson){
                    arrData.push({
                        transType:item.replace("a",""),
                        url:submitJson[item]
                    })
                }
                console.log(arrData)
                classPost.notifyConfig({configUrlist:arrData})
                    .then((res)=>{
                        if(res.code=='0000'){
                            this.$message({
                                type:'success',
                                message:res.message
                            })
                            this.disabledBtn=true;
                        }else{
                            this.$message({
                                type:'error',
                                message:res.message
                            })
                        }
                        console.log(res)
                    })
                    .catch(()=>{

                    })
            },
            error(){

            }
        },
        mounted(){
            classPost.notifyQuery({})
                .then((res)=>{
                    if(res.data!=null){
                        res.data.forEach((item ,index)=>{
                            this.ruleForm2['a'+item.transType]=item.url==null?'':item.url;
                            this.ruleForm1['a'+item.transType]=this.ruleForm2['a'+item.transType];
                        })
                        // //退款
                        // let notify1=res.data.filter((item)=>{return item.transType=='03'});
                        // this.ruleForm2.a03=notify1.length==0?'':(notify1[0].url==null?'':notify1[0].url);
                        // this.ruleForm1.a03=this.ruleForm2.a03;
                        // //预授权完成
                        // let notify2=res.data.filter((item)=>{return item.transType=='05'});
                        // this.ruleForm2.a05=notify2.length==0?'':(notify2[0].url==null?'':notify2[0].url);
                        // this.ruleForm1.a05=this.ruleForm2.a05;
                        // //预授权撤销
                        // let notify3=res.data.filter((item)=>{return item.transType=='06'});
                        // this.ruleForm2.a06=notify3.length==0?'':(notify3[0].url==null?'':notify3[0].url);
                        // this.ruleForm1.a06=this.ruleForm2.a06;
                        // //动态预授权审核通过
                        // let notify4=res.data.filter((item)=>{return item.transType=='14'});
                        // this.ruleForm2.a14=notify4.length==0?'':(notify4[0].url==null?'':notify4[0].url);
                        // this.ruleForm1.a14=this.ruleForm2.a14;
                        // //动态预授权审核拒绝通知
                        // let notify5=res.data.filter((item)=>{return item.transType=='15'});
                        // this.ruleForm2.a15=notify5.length==0?'':(notify5[0].url==null?'':notify5[0].url);
                        // this.ruleForm1.a15=this.ruleForm2.a15;
                    }
                })
                .catch(()=>{

                })
        }
    }
</script>

<style>
.asynNotification form{
    margin-top: 20px;
}
</style>