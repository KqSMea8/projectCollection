<template>
    <div class="wyx keyManagement">
        <div class="first">
            <el-alert
                    title="请注意！目前系统不支持MD5密钥和RSA密钥同时使用，您只能选择使用其中一种。您获取其他密钥后，原密钥将会失效"
                    type="warning"
                    show-icon
                    :closable="false">
            </el-alert>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>MD5密钥</span>
                <span v-show="show==0" style="float: right; color: #409EFF;font-weight: normal" type="text">正在使用</span>
            </div>
            <div class="content">
                <img src="../../assets/images/icon-key.svg" alt="">
                <div class="conRight">
                    <p v-show="key.MD5!=''&&key.reMD5==''">
                        <span><b>MD5密钥</b></span><br/>
                        <el-button type="primary" plain size="mini" @click="open1('MD5','RSA','reMD5')">重置密钥</el-button>
                    </p>
                    <p v-show="key.MD5==''&&key.reMD5==''">
                        <span>没有MD5密钥，快去获取密钥吧</span><br/>
                        <el-button type="primary" plain size="mini" @click="open2('MD5','RSA','reMD5')">获取密钥</el-button>
                    </p>
                    <p v-show="key.reMD5!=''">
                        <span style="margin-right: 10px"><b>您的MD5密钥为：</b></span>
                        <br/>{{key.reMD5}}
                        <el-button style="margin-left: 15px" type="text" class="copy" :data-clipboard-text="key.reMD5"
                                   @click="open5(key.reMD5)">复制密钥
                        </el-button>
                        <br/><span class="tishi">请您妥善保管您的密钥，为了保障您的数据安全，页面刷新或重新打开后密钥将不显示，遗失后将无法找回当前密钥，如果您的密钥不慎遗失，请重置MD5密钥。</span>
                    </p>
                </div>
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>RSA密钥</span>
                <span style="padding-left:10px;color: #e6a23c;font-size:12px;">（需升级到2.0及以上接口）</span>
                <!--<i  style="float: right; padding: 3px 0">正在使用</i>-->
                <span v-show="show==1" style="float: right;color: #409EFF;font-weight: normal" type="text">正在使用</span>
            </div>
            <div class="content">
                <img src="../../assets/images/icon-key.svg" alt="">
                <div class="conRight">
                    <p v-show="key.RSA!=''&&key.reRSA==''" style="margin-bottom: 10px">
                        <span style="line-height: 24px;"><b>您的iPayLinks公钥为：</b></span><br/>{{key.RSA}}
                        <el-button style="margin-left: 15px" type="text" class="copy" :data-clipboard-text="key.RSA" @click="open5">复制密钥</el-button>
                        <br/>
                        <!--<el-button type="primary" plain size="mini" @click="open1('RSA','MD5','','reMD5')">重置密钥-->
                        <!--</el-button>-->
                    </p>
                    <p v-show="key.RSA==''&&key.reRSA==''">
                        <span>没有RSA密钥，快去获取密钥吧</span><br/>
                        <el-button type="primary" plain size="mini" @click="open2('RSA','MD5','','reMD5')">获取密钥
                        </el-button>
                    </p>
                    <p v-show="key.reRSA!=''">
                        <span style="margin-right: 10px"><b>您的RSA密钥为：</b><br/>{{key.reRSA}}</span>
                        <el-button type="text" class="copy" :data-clipboard-text="key.reRSA" @click="open5">复制密钥
                        </el-button>
                        <br/><span class="tishi">请您妥善保管您的密钥，为了保障您的数据安全，页面刷新或重新打开后密钥将不显示，遗失后将无法找回当前密钥，如果您的密钥不慎遗失，请重置MD5密钥。</span>
                    </p>
                    <p v-show="key.RSA!=''||key.reRSA!=''">
                        <span><b>商户公钥：</b></span>
                        <el-button v-show="!uploadOk" type="text" @click="dialogFormVisible=true">上传公钥</el-button>
                        <span style="color: #0FBB56;" v-show="uploadOk"><i class="el-icon-circle-check-outline"></i>已上传</span>
                        <el-button v-show="uploadOk" type="text" @click="dialogFormVisible=true">替换公钥</el-button>
                    </p>
                </div>
            </div>
        </el-card>

        <!--上传公钥-->
        <el-dialog title="接收密钥上传" :visible.sync="dialogFormVisible" width="30%" :close-on-click-modal="false">
            <el-form :model="formData" ref="formData" :rules="rule">
                <el-form-item label="密钥" :label-width="formLabelWidth" prop="merchantRSAPublicKey" label-width="100px">
                    <el-input size="small" v-model="formData.merchantRSAPublicKey" auto-complete="off" placeholder="请输入密钥"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeWin('formData')">取消</el-button>
                <el-button size="small" type="primary" @click="submitForm('formData',uploadKey,error)">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import {submitForm, getSubmitJson, reset} from '../../assets/js/submitForm'
    import classPost from '../../servies/classPost'
    //    复制
    import Clipboard from 'clipboard';

    export default {
        data() {
            return {
                key: {
                    MD5: '',
                    reMD5: '',
                    RSA: '',
                    reRSA: '',
                },
                dialogFormVisible: false,
                formData: {
                    merchantRSAPublicKey: ''
                },
                rule: {
                    merchantRSAPublicKey: [
                        {required: true, message: '请输入密钥', trigger: 'blur'}
                    ]
                },
                formLabelWidth: '50px',
                uploadOk: false,
                show: 0
            }
        },
        methods: {
            submitForm,
            reset,
//            关闭二级窗口
            closeWin(form){
                this.dialogFormVisible = false;
                this.reset(form);
            },
            open1(type1, type2, type3) {
                type3 = type3 == '' ? type1 : type3;
                this.$confirm('您将重置当前密钥，重置后当前密钥将会失效。', '重置密钥提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false
                }).then(() => {
//                    重置密钥
                    classPost.keyGenerate({type: type1})
                        .then((res) => {
                            this.key[type3] = res.data;
                            this.key[type2] = '';
                            console.log(res)
                        }).catch((err) => {
                        console.log(err)
                    })
                    this.$message({
                        type: 'success',
                        message: '重置成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置'
                    });
                });
            },
//      获取MD5密钥
            open2(type1, type2, type3, type4) {
                type3 = type3 == '' ? type1 : type3;
                let title = '';
                let con = '';
                if (this.key.MD5 == '' && this.key.RSA == '') {
                    title = '获取' + type1 + '密钥';
                    con = '首次获取密钥后请妥善保存，遗失后将无法找回';
                } else {
                    title = '切换密钥';
                    con = '切换密钥后原' + type2 + '密钥将不能继续使用！';
                }
                this.$confirm(con, title, {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false
                }).then(() => {
//                    获取密钥
                    classPost.keyGenerate({type: type1})
                        .then((res) => {
                            this.key[type3] = res.data;
                            this.key[type1]=res.data;
                            this.key[type2] = '';
                            this.key[type4] = '';
                            if (type1 == 'RSA') {
                                this.show = 1;
                            } else if (type1 == 'MD5') {
                                this.show = 0;
                            } else {
                                this.show = -1;
                            }
                            this.uploadOk=false;
                            console.log(res)
                        }).catch((err) => {
                        console.log(err)
                    })
                    this.$message({
                        type: 'success',
                        message: '获取成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消获取'
                    });
                });
            },
//      复制密钥
            open5() {
                console.log(1)
                var clipboard = new Clipboard('.copy')
                clipboard.on('success', e => {
                    this.$message('复制成功');
                    // 释放内存
                    clipboard.destroy()
                })
                clipboard.on('error', e => {
                    this.$message('复制失败');
                    // 释放内存
                    clipboard.destroy()
                })
            },
            uploadKey(children) {
//                上传公钥
                let submitJson = getSubmitJson(children);
                submitJson.type = 'RSA';
                this.dialogFormVisible = false;
                classPost.publicKey(submitJson)
                    .then((res) => {
                        if (res.code == "00000000") {
                            this.reset('formData');
                            this.uploadOk = true;
                            this.$message({
                                message: '已成功上传公钥',
                                type: 'success'
                            });
                            console.log(res)
                        }else{
                            this.$message({
                                message: '上传公钥失败，稍后操作',
                                type: 'error'
                            });
                        }
                    })
                    .catch();
            },
            error() {

            }
        },
        mounted: function () {
            classPost.keyQuery()
                .then((res) => {
                    if (res.data.keyType == 'RSA') {
                        this.show = 1;
                        this.uploadOk = res.data.merchantKeyIndex == null ? false : true;
                    } else if (res.data.keyType == 'MD5') {
                        this.show = 0;
                    } else {
                        this.show = -1;
                    }
                    this.key[res.data.keyType] = res.data.keyText;
                })
                .catch()
        }
    }
</script>
<style>
    .keyManagement .content {
        /*margin-right: 20px;*/
        overflow: hidden;
    }

    .keyManagement .el-button.el-button--primary {
        margin: 15px 0px;
    }

    .keyManagement .content .conRight {
        width: 90%;
        float: left;
        margin-top: 22px;
    }

    .keyManagement .content .conRight p {
        word-wrap: break-word;
    }

    .keyManagement .content img {
        margin-top: 15px;
        margin-right: 15px;
        float: left;
    }

    .keyManagement .tishi {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
        line-height: 17px;
    }

    .keyManagement .first {
        margin-bottom: 20px;
    }
</style>
