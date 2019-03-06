<template>
    <div class="wyx addCardMessage">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm hmd">
            <el-form-item label="开户名：" prop="acctName">
                <el-input size="small" clearable v-model="ruleForm.acctName"></el-input>
                <el-button class="addName" size="small" type="text" @click="addName">使用默认开户名</el-button>
                <p style="color:#606266;line-height: 20px;font-size: 12px;">如果您想修改开户名，则必须上传委托授权书，否则可能导致出款失败！
                </p>
            </el-form-item>
            <el-form-item label="银行卡账户类型：">
                <span>借记卡</span>
            </el-form-item>
            <el-form-item label="对公对私：" prop="tradeType">
                <el-select v-model="ruleForm.tradeType" clearable placeholder="请选择对公对私类型">
                    <el-option label="对公" value="1"></el-option>
                    <el-option label="对私" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择币种：" prop="countryType">
                <el-select v-model="ruleForm.countryType" clearable placeholder="请选择币种" @change="changeType">
                    <el-option label="人民币" value="0"></el-option>
                    <el-option label="非人民币" value="1"></el-option>
                </el-select>
            </el-form-item>
            <!---->
            <el-form-item v-if="ruleForm.countryType==1" label="银行名称：" prop="bankId">
                <el-autocomplete
                        style="width: 100%"
                        class="inline-input"
                        v-model="ruleForm.bankId"
                        :fetch-suggestions="querySearch2"
                        placeholder="请选择银行名称"
                        @select="handleSelect"
                        clearable
                        @change="bankNameChange"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item v-else label="银行名称：" prop="bankId">
                <el-select v-model="ruleForm.bankId" filterable clearable placeholder="请选择银行名称" @change="bankNameChange"
                           no-data-text="无数据，请先选择币种">
                    <el-option
                            v-for="(item,index) in bankList"
                            :key="index"
                            :label="item.orgName"
                            :value="item.orgCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="ruleForm.countryType!=1" label="开户银行所在地：" prop="country3">
                <!--<el-select style="width: 32%" clearable v-model="ruleForm.country" placeholder="请选择国家、地区"-->
                <!--@change="changeCountry">-->
                <!--<el-option v-for="(item,index) in countrylist" :key="index" :label="item.countryName"-->
                <!--:value="item.countryNum"></el-option>-->
                <!--</el-select>-->
                <el-select style="width: 48%" clearable v-model="ruleForm.country2" placeholder="请选择省、直辖市"
                           @change="changeProvince" no-data-text="无数据，请先选择币种">
                    <el-option v-for="(item,index) in provinceList" :key="index" :label="item.provincename"
                               :value="item.provincecode"></el-option>
                </el-select>
                <el-select style="width: 48%;float: right;" clearable v-model="ruleForm.country3" placeholder="请选择市区"
                           @change="changeCity" no-data-text="无数据，请先选择省或直辖市">
                    <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityname"
                               :value="item.citycode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="ruleForm.countryType!=1" label="开户行名称：" prop="bigBankName">

                <!--<el-autocomplete-->
                <!--style="width: 100%"-->
                <!--class="inline-input"-->
                <!--v-model="ruleForm.bigBankName"-->
                <!--:fetch-suggestions="querySearch"-->
                <!--placeholder="请选择开户行名称"-->
                <!--@select="handleSelect"-->
                <!--clearable-->
                <!--@change="changeBankBrancheList"-->
                <!--&gt;</el-autocomplete>-->

                <el-select v-model="ruleForm.bigBankName" clearable placeholder="请选择开户行名称" no-data-text="无数据，请先选择银行所在地和银行名称" @change="changeBankBrancheList">
                    <el-option v-for="item in bankBrancheList" :key="item.value" :label="item.bankkaihu" :value="item.bankkaihu"></el-option>
                </el-select>
                <p style="color:#606266;line-height: 20px;font-size: 12px;">
                    选择开户行名称错误，可能导致出款失败。如：高安支行，如果您无法确定，建议您致电银行客服询问。</p>
            </el-form-item>
            <el-form-item v-if="ruleForm.countryType==1" label="银行地址：" prop="bankAddress">
                <el-input size="small" clearable v-model="ruleForm.bankAddress" placeholder="请输入地址"></el-input>
            </el-form-item>
            <el-form-item label="银行账号：" prop="bankAcct">
                <el-input size="small" clearable v-model="ruleForm.bankAcct" placeholder="请输入银行账号"></el-input>
            </el-form-item>
            <el-form-item v-if="ruleForm.countryType==1" label="SWIFT CODE：" prop="swiftCode">
                <el-input size="small" clearable v-model="ruleForm.swiftCode"
                          placeholder="外币账户请务必提供SWIFT CODE/IBAN/ABA"></el-input>
            </el-form-item>
            <el-form-item v-if="show" label="授权委托书：" prop="dbrelativepath">
                <el-input style="width: 45%" :disabled="true" size="small" clearable placeholder="请选择上传文件"
                          v-model="ruleForm.dbrelativepath"></el-input>
                <div class="fileBox">
                    <span class="el-icon-upload"></span>上传文件
                    <input id="files" type="file" @change="fileChange"/>
                </div>
                <a href="/static/委托书模板.docx">
                    <el-button size="small" type="text">下载委托书模版</el-button>
                </a>
                <p style="color:#606266;line-height: 20px;font-size: 12px;">开户名与商户公司名称不同，必须上传授权委托书。<br/>请下载模板，填写信息加盖公章后上传扫描件，支持JPG、PNG格式，不大于2MB
                </p>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="submitForm('ruleForm',success,error)">确认添加</el-button>
                <router-link to="/home/fundManage/withdraw/cardManage">
                    <el-button size="small">取消</el-button>
                </router-link>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import '../../assets/css/wyxCard.css'
    import {submitForm, getSubmitJson, reset} from '../../assets/js/submitForm'
    import classPost from '../../servies/classPost'
    import {mapState} from 'vuex';

    export default {
        data() {
            let fileCheck = (rule, value, callback) => {
                if (/.*\.JPG$/.test(value) || /.*\.jpg$/.test(value) || /.*\.PNG$/.test(value) || /.*\.png$/.test(value) || /.*\.doc$/.test(value) || /.*\.docx$/.test(value)) {
                    if (this.ruleForm.size > 2 * 1024 * 1024) {
                        callback(new Error('文件不能超过2M'));
                    } else {
                        callback();
                    }
                } else {
                    callback(new Error('请选择doc、docx、png、jpg文件'));
                }
            };
            var bankCardAccount = (rule, value, callback)=>{
                value = value.replace(/\s/g,'').replace(/([0-9a-zA-Z]{4})(?=[0-9a-zA-Z])/g,"$1 ");
                this.ruleForm.bankAcct=value;
                if(!/^[0-9a-zA-Z]+$/.test(value.replace(/\s/g,''))){
                    callback(new Error('请输入正确的银行卡号'));
                }else{
                    if(value.replace(/\s/g,'').length>32||value.replace(/\s/g,'').length<4){
                        callback('长度在 4 到 32 个字符')
                    }else{
                        callback();
                    }
                }
                // if(!/^\d+$/.test(value)){
                //     callback(new Error('请输入正确的银行账号'));
                // }else{
                //     callback();
                // }
            }
            return {
                ruleForm: {
                    acctName: '',
                    type: '',
                    bankId: '',
                    location: [],
                    bankBrancheList: '',
                    bankAcct: '',
                    bigBankName: '',
                    swiftCode: '',
                    dbrelativepath: '',
                    tradeType: '',
                    country: '',
                    country2: '',
                    country3: '',
                    countryname: '',
//                    文件大小
                    size: 0,
//                    辅助
//                    银行名字
                    bankName: '',
//                    省名称
                    provincename: '',
//                    市名称
                    cityname: '',
//                    文件路径
                    filePath: '',
//                    form 中用到的
//                    银行类别 是否 中国大陆
                    countryType: '',
//                    非中国大陆是填的银行地址
                    bankAddress: ''
                },
                rules: {
                    countryType: [
                        {required: true, message: '请选择币种', trigger: 'blur'}
                    ],
                    bankAddress: [
                        {required: true, message: '请填写银行地址', trigger: 'blur'},
                        {min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur'}
                    ],
                    tradeType: [
                        {required: true, message: '请选择对公对私类型', trigger: 'blur'},
                    ],
                    acctName: [
                        {required: true, message: '请输入开户名', trigger: 'change'},
                    ],
                    bankId: [
                        {required: true, message: ' 银行不能为空', trigger: 'change'},
                    ],
                    country3: [
                        {required: true, message: '开户行所在地不能为空', trigger: 'change'},
                    ],
                    bigBankName: [
                        {required: true, message: '开户行名称不能为空', trigger: 'change'},
                        {min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: 'blur'}
                    ],
                    bankAcct: [
                        {required: true, message: '银行账号不能为空', trigger: 'blur'},
                        {validator:bankCardAccount}
                    ],
                    swiftCode: [
                        {required: true, message: '请输入SWIFT CODE', trigger: 'blur'},
                        {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                    ],
                    dbrelativepath: [
                        {required: true, message: '请选择文件', trigger: 'change'},
                        {validator: fileCheck,trigger: 'change'}
                    ]
                },
                options: [
                    {
                        value: 'landing',
                        label: '中国大陆',
                        children: [
                            {
                                value: 'shejiyuanze',
                                label: '设计原则',
                                children: [{
                                    value: 'yizhi',
                                    label: '一致'
                                }, {
                                    value: 'fankui',
                                    label: '反馈'
                                }, {
                                    value: 'xiaolv',
                                    label: '效率'
                                }, {
                                    value: 'kekong',
                                    label: '可控'
                                }]
                            }, {
                                value: 'daohang',
                                label: '导航',
                                children: [{
                                    value: 'cexiangdaohang',
                                    label: '侧向导航'
                                }, {
                                    value: 'dingbudaohang',
                                    label: '顶部导航'
                                }]
                            }]
                    }, {
                        value: 'Hong Kong',
                        label: '中国香港',
                        children: [
                            {
                                value: 'basic',
                                label: 'Basic',
                                children: [{
                                    value: 'layout',
                                    label: 'Layout 布局'
                                }, {
                                    value: 'color',
                                    label: 'Color 色彩'
                                }, {
                                    value: 'typography',
                                    label: 'Typography 字体'
                                }, {
                                    value: 'icon',
                                    label: 'Icon 图标'
                                }, {
                                    value: 'button',
                                    label: 'Button 按钮'
                                }]
                            }, {
                                value: 'form',
                                label: 'Form',
                                children: [{
                                    value: 'radio',
                                    label: 'Radio 单选框'
                                }, {
                                    value: 'checkbox',
                                    label: 'Checkbox 多选框'
                                }, {
                                    value: 'input',
                                    label: 'Input 输入框'
                                }, {
                                    value: 'input-number',
                                    label: 'InputNumber 计数器'
                                }, {
                                    value: 'select',
                                    label: 'Select 选择器'
                                }, {
                                    value: 'cascader',
                                    label: 'Cascader 级联选择器'
                                }, {
                                    value: 'switch',
                                    label: 'Switch 开关'
                                }, {
                                    value: 'slider',
                                    label: 'Slider 滑块'
                                }, {
                                    value: 'time-picker',
                                    label: 'TimePicker 时间选择器'
                                }, {
                                    value: 'date-picker',
                                    label: 'DatePicker 日期选择器'
                                }, {
                                    value: 'datetime-picker',
                                    label: 'DateTimePicker 日期时间选择器'
                                }, {
                                    value: 'upload',
                                    label: 'Upload 上传'
                                }, {
                                    value: 'rate',
                                    label: 'Rate 评分'
                                }, {
                                    value: 'form',
                                    label: 'Form 表单'
                                }]
                            }, {
                                value: 'data',
                                label: 'Data',
                                children: [{
                                    value: 'table',
                                    label: 'Table 表格'
                                }, {
                                    value: 'tag',
                                    label: 'Tag 标签'
                                }, {
                                    value: 'progress',
                                    label: 'Progress 进度条'
                                }, {
                                    value: 'tree',
                                    label: 'Tree 树形控件'
                                }, {
                                    value: 'pagination',
                                    label: 'Pagination 分页'
                                }, {
                                    value: 'badge',
                                    label: 'Badge 标记'
                                }]
                            }, {
                                value: 'notice',
                                label: 'Notice',
                                children: [{
                                    value: 'alert',
                                    label: 'Alert 警告'
                                }, {
                                    value: 'loading',
                                    label: 'Loading 加载'
                                }, {
                                    value: 'message',
                                    label: 'Message 消息提示'
                                }, {
                                    value: 'message-box',
                                    label: 'MessageBox 弹框'
                                }, {
                                    value: 'notification',
                                    label: 'Notification 通知'
                                }]
                            }, {
                                value: 'navigation',
                                label: 'Navigation',
                                children: [{
                                    value: 'menu',
                                    label: 'NavMenu 导航菜单'
                                }, {
                                    value: 'tabs',
                                    label: 'Tabs 标签页'
                                }, {
                                    value: 'breadcrumb',
                                    label: 'Breadcrumb 面包屑'
                                }, {
                                    value: 'dropdown',
                                    label: 'Dropdown 下拉菜单'
                                }, {
                                    value: 'steps',
                                    label: 'Steps 步骤条'
                                }]
                            }, {
                                value: 'others',
                                label: 'Others',
                                children: [{
                                    value: 'dialog',
                                    label: 'Dialog 对话框'
                                }, {
                                    value: 'tooltip',
                                    label: 'Tooltip 文字提示'
                                }, {
                                    value: 'popover',
                                    label: 'Popover 弹出框'
                                }, {
                                    value: 'card',
                                    label: 'Card 卡片'
                                }, {
                                    value: 'carousel',
                                    label: 'Carousel 走马灯'
                                }, {
                                    value: 'collapse',
                                    label: 'Collapse 折叠面板'
                                }]
                            }]
                    }, {
                        value: 'hanguo',
                        label: '韩国',
                        children: [
                            {
                                value: 'axure',
                                label: 'Axure Components'
                            }, {
                                value: 'sketch',
                                label: 'Sketch Templates'
                            }, {
                                value: 'jiaohu',
                                label: '组件交互文档'
                            }]
                    }, {
                        value: 'Japan',
                        label: '日本',
                        children: [
                            {
                                value: 'axure',
                                label: 'Axure Components'
                            }, {
                                value: 'sketch',
                                label: 'Sketch Templates'
                            }, {
                                value: 'jiaohu',
                                label: '组件交互文档'
                            }]
                    }, {
                        value: 'USA',
                        label: '美国',
                        children: [
                            {
                                value: 'axure',
                                label: 'Axure Components'
                            }, {
                                value: 'sketch',
                                label: 'Sketch Templates'
                            }, {
                                value: 'jiaohu',
                                label: '组件交互文档'
                            }]
                    }],
                bankList: [],
                bankBrancheList: [],
                countrylist: [],
                provinceList: [],
                cityList: [],
//                显示委托书上传
                show: false,
//                中国大陆银行地址拼接
                bankAddress: '',
//                联行号
                branchBankId: ''
            };
        },
        watch: {
            ruleForm: {
                handler: function (newVal, oldVal) {
                    if (newVal.acctName != JSON.parse(localStorage.data).name) {
                        this.show = true;
                    } else {
                        this.show = false;
                    }
                },
                deep: true
            }
        },
        methods: {
            submitForm,
//            改变银行类型
            changeType(value) {

                this.ruleForm.bankId = '';
                if (value == 0) {
                    console.log(1);
                    classPost.provinceList({countryId: 156})
                        .then((res) => {
                            this.provinceList = res.data;
                            // console.log(res)
                        })
                        .catch()
                }
            },
            success(children) {
                let submitJson = getSubmitJson(children);
                submitJson.createDate = new Date();
                submitJson.updateDate = new Date();
                submitJson.dbrelativepath = this.ruleForm.filePath;
                if(this.ruleForm.countryType==1){
                    let bankId=this.bankList.filter((item)=>{
                        return item.orgName==this.ruleForm.bankId;
                    })
                    submitJson.bankName = this.ruleForm.bankId;
                    submitJson.bankId = bankId.length==0?'':bankId[0].orgCode;
                }else{
                    submitJson.bankId = this.ruleForm.bankId;
                    submitJson.bankName = this.ruleForm.bankName;
                }
                // submitJson.branchBankId = this.branchBankId;
                submitJson.province = this.ruleForm.country2;
                submitJson.city = this.ruleForm.country3;
                submitJson.bankAcct = this.ruleForm.bankAcct.replace(/\s/g,'');
//                如果是中国大陆要组合银行地址
                if (this.ruleForm.countryType == 0) {
                    submitJson.bankAddress = this.ruleForm.provincename + '-' + this.ruleForm.cityname;
                } else {
                    submitJson.bankAddress = this.ruleForm.bankAddress;
                }

                delete submitJson.country3;
                console.log(submitJson);
                classPost.addBankCard({requestObj: submitJson})
                    .then((res) => {
                        this.$message({
                            type: 'success',
//                            message: '添加成功!  您已成功添加提现卡!'
                            message: '添加成功!  提现卡审核中……!'
                        });
                        this.$router.push('/home/fundManage/withdraw/cardManage');
                        console.log(res)
                    })
                    .catch()
            },
            error() {

            },
            fileChange() {
                this.ruleForm.dbrelativepath = document.getElementById('files').files[0].name;
                this.ruleForm.size = document.getElementById('files').files[0].size;
                let fileList = document.getElementById('files').files[0];
//                this.$store.dispatch('addbase', {file: fileList, uploadType: 'other'});
                this.$store.dispatch('addbase', {file: fileList, uploadType: 'auth'});
                let data = this.upimgbase;
                classPost.fileUpload(data)
                    .then((res) => {
                        console.log(res);
                        if( res.data.path==''|| res.data.path==null){
                            this.$message({
                                type:'error',
                                message:'文件上传失败，请重新上传'
                            })
                        }else{
                            this.ruleForm.filePath = res.data.path;
                        }
                        this.$store.dispatch('removebase');
                    })
                    .catch(()=>{
                        this.$store.dispatch('removebase');
                        this.$message({
                            message: error.data.message,
                            type: 'error'
                        });
                    })
            },
            addName() {
                this.ruleForm.acctName = JSON.parse(localStorage.data).name;
            },
            changeCountry(value) {
                this.provinceList = [];
                this.ruleForm.country2 = '';

                if (value != '') {
                    let now = this.countrylist.filter((a) => {
                        return a.countryNum == this.ruleForm.country;
                    });
                    this.ruleForm.countryname = now[0].countryName;
                }
            },
            changeProvince(value) {
                this.cityList = [];
                this.ruleForm.country3 = '';
                this.ruleForm.bigBankName = '';
                this.bankBrancheList = [];

                if (value != '') {
                    let now = this.provinceList.filter((a) => {
                        return a.provincecode == this.ruleForm.country2;
                    });
                    this.ruleForm.provincename = now[0].provincename;
                    classPost.cityList({provincecode: this.ruleForm.country2})
                        .then((res) => {
                            this.cityList = res.data;
                            // console.log(res)
                        })
                        .catch()
                }
            },
            changeCity(value) {
                this.ruleForm.bigBankName = '';
                this.bankBrancheList = [];
                if (value != '') {
                    //            选择支行列表
                    let now = this.cityList.filter((a) => {
                        return a.citycode == this.ruleForm.country3;
                    });
                    this.ruleForm.cityname = now[0].cityname;
                    classPost.bankBrancheList({
                        bankname: this.ruleForm.bankName,
                        province: this.ruleForm.provincename,
                        city: this.ruleForm.cityname
                    })
                        .then((res) => {
                            this.bankBrancheList = res.data;
                            for (let i = 0; i < this.bankBrancheList.length; i++) {
                                this.bankBrancheList[i].value = this.bankBrancheList[i].bankkaihu;
                            }
                        })
                        .catch()
                }
            },
            bankNameChange() {
//                修改银行后要获取银行的名字  并且  市区清空  支行清空
                let a = this.bankList.filter((a) => {
                    return a.orgCode == this.ruleForm.bankId;
                });
                this.ruleForm.bankName = a[0].orgName;
                this.ruleForm.country = null;
                this.ruleForm.country2 = null;
                this.ruleForm.country3 = null;
                this.ruleForm.bigBankName = '';
//                this.provinceList = [];
                this.cityList = [];
                this.bankBrancheList = [];
            },
//            改变支行
            changeBankBrancheList(value) {
                if (value != '') {
                    this.branchBankId = this.bankBrancheList;
//                    this.branchBankId = this.bankBrancheList.filter((ele) => {
//                        return ele.bankkaihu == this.ruleForm.bigBankName;
//                    })[0].banknumber;
                }
            },
//            搜索意见
            querySearch(queryString, cb) {
                var restaurants = this.bankBrancheList;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            querySearch2(queryString, cb) {
                var restaurants = this.bankList;
                console.log(restaurants)
                var results = queryString ? restaurants.filter(this.createFilter2(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.bankkaihu.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
                };
            },
            createFilter2(queryString) {
                return (restaurant) => {
                    // console.log(restaurant)
                    // return true;
                    return (restaurant.orgName.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
                };
            },
            handleSelect(item) {
                console.log(item);
            }
        },
        computed: {
            ...mapState({
                'info': state => state.computed.info,
                'upimgbase': state => state.upload.upimgbase
            }),
        },
        mounted: function () {
            this.addName();

            let id = JSON.parse(localStorage.data).memberId;
            classPost.queryCard({memberCode: id})
                .then((res) => {
                    if (res.data.dataList.length >= 10) {
                        this.$alert('提现卡数量已达上限！', '无法添加', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.$router.push('/home/fundManage/withdraw/cardManage');
                            }
                        });
                    }

                    // console.log(res.data.dataList.length)
                })
                .catch();


//            国家列表
            classPost.countrylist({})
                .then((res) => {
                    this.countrylist = res.data;
                    // console.log(res)
                })
                .catch()

//            选择银行列表
            classPost.queryBankList({})
                .then((res) => {
                    // console.log(res)
                    this.bankList = res.data;
                    this.bankList.forEach((item ,index)=>{
                        item.value=item.orgName;
                    })
                    //    orgName
                })
                .catch()
        }
    }
</script>
<style>
    .addCardMessage {
        margin-top: 20px;
    }

    .addCardMessage .el-card__header {
        background: rgba(24, 144, 255, 0.1);
        color: #000;
    }

    .addCardMessage .w10 {
        width: 10%;
    }

    .addCardMessage .hmd {
        /*padding:0 30%;*/
        width: 60%;
    }

    .addCardMessage .hmd .el-select {
        width: 100%;
    }

    .addCardMessage input[type=file] {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }

    .addCardMessage .fileBox {
        width: 100px;
        height: 32px;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        position: relative;
        text-align: center;
        line-height: 32px;
        overflow: hidden;
        float: left;
        margin-right: 10px;
        margin-top: 4px;
    }

    .addCardMessage .addName {
        position: absolute;
        right: -110px;
        top: 4px
    }
</style>
