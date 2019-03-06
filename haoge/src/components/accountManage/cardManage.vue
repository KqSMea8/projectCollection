<template>
    <div class="cardManage">
        <div class="cardBox">
            <div v-show="number>0" class="addBankCard">
                <!--<router-link to="/home/accountManage/cardManage/addCardMessage">+&nbsp;&nbsp;添加提现银行账户</router-link>-->
                <router-link to="/home/fundManage/withdraw/addCardMessage">+&nbsp;&nbsp;添加提现银行账户</router-link>
            </div>
            <div v-for="(item,index) in dataArr" :key="index" class="cards">
                <div style="min-height: 30px;" class="left1" >
                    <div class="imgLogo" v-if="a[item.bankName]"><img :src="'https://apimg.alipay.com/combo.png?d=cashier&t='+a[item.bankName]"
                                              alt="">
                    </div>
                </div>
                <div class="left2">
                    <!--{{a[item.bankName]}}-->
                    <p v-if="!/^[\u4E00-\u9FA5]+$/.test(item.bankName)" class="bank">{{item.bankName}}</p>
                    <p>账户名称：{{item.acctName}}</p>
                    <!--<p v-html="item.bankAcct.slice(-1);"></p>-->
                    <!--<p style="word-break: break-all; line-height: 23px">**** **** **** {{item.bankAcctEND}}</p>-->
                    <p v-if="item.bankAcctAl=='null'||item.bankAcctAl==''"
                       style="word-break: break-all; line-height: 23px"></p>
                    <p class="cardNumber" v-else>
                        {{item.bankAcctAll.replace(/\s/g,'').replace(/([0-9a-zA-Z]{4})(?=[0-9a-zA-Z])/g,"$1 ")}}</p>
                </div>
                <div class="footer">
                    <p>
                        <el-button type="text default" @click="deleteCard(item.liquidateId)">删除</el-button>
                    </p>
                    <p>
                        <router-link
                                :to="{name:'LANG.router.fundManage.cardDetails',params:{liquidateId:item.liquidateId}}">
                            <el-button type="text">详情</el-button>
                        </router-link>
                    </p>
                </div>

                <!--可能待审核-->
                <div v-if="item.auditstatus==101">
                    <div class="shenhe">待审核</div>
                </div>
                <div v-else-if="item.auditstatus==102">
                    <div class="shenhe" style="color: green;">审核通过</div>
                </div>
                <div v-else-if="item.auditstatus==103">
                    <div class="shenhe">审核拒绝</div>
                </div>
                <div v-else-if="item.auditstatus==104">
                    <div class="shenhe">审核滞留</div>
                </div>
            </div>
        </div>
        <p class="over">您还可以添加{{number}}个提现银行账户</p>
    </div>
</template>
<script>
    //  import '../../assets/css/wyxCard.css'
    import classPost from '../../servies/classPost'

    export default {
        data() {
            return {
                dataArr: [],
                number: 10,
                a: {
                    "深圳农村商业银行": "SRCB",
                    "广西北部湾银行": "BGB",
                    "上海农村商业银行": "SHRCB",
                    "北京银行": "BJBANK",
                    "威海市商业银行": "WHCCB",
                    "周口银行": "BOZK",
                    "库尔勒市商业银行": "KORLABANK",
                    "平安银行": "SPABANK",
                    "顺德农商银行": "SDEB",
                    "湖北省农村信用社": "HURCB",
                    "无锡农村商业银行": "WRCB",
                    "朝阳银行": "BOCY",
                    "浙商银行": "CZBANK",
                    "邯郸银行": "HDBANK",
                    "中国银行": "BOC",
                    "东莞银行": "BOD",
                    "中国建设银行": "CCB",
                    "遵义市商业银行": "ZYCBANK",
                    "绍兴银行": "SXCB",
                    "贵州省农村信用社": "GZRCU",
                    "张家口市商业银行": "ZJKCCB",
                    "锦州银行": "BOJZ",
                    "平顶山银行": "BOP",
                    "汉口银行": "HKB",
                    "上海浦东发展银行": "SPDB",
                    "宁夏黄河农村商业银行": "NXRCU",
                    "广东南粤银行": "NYNB",
                    "广州农商银行": "GRCB",
                    "苏州银行": "BOSZ",
                    "杭州银行": "HZCB",
                    "衡水银行": "HSBK",
                    "湖北银行": "HBC",
                    "嘉兴银行": "JXBANK",
                    "华融湘江银行": "HRXJB",
                    "丹东银行": "BODD",
                    "安阳银行": "AYCB",
                    "恒丰银行": "EGBANK",
                    "国家开发银行": "CDB",
                    "江苏太仓农村商业银行": "TCRCB",
                    "南京银行": "NJCB",
                    "郑州银行": "ZZBANK",
                    "德阳商业银行": "DYCB",
                    "宜宾市商业银行": "YBCCB",
                    "四川省农村信用": "SCRCU",
                    "昆仑银行": "KLB",
                    "莱商银行": "LSBANK",
                    "尧都农商行": "YDRCB",
                    "重庆三峡银行": "CCQTGB",
                    "富滇银行": "FDB",
                    "江苏省农村信用联合社": "JSRCU",
                    "济宁银行": "JNBANK",
                    "招商银行": "CMB",
                    "晋城银行JCBANK": "JINCHB",
                    "阜新银行": "FXCB",
                    "武汉农村商业银行": "WHRCB",
                    "湖北银行宜昌分行": "HBYCBANK",
                    "台州银行": "TZCB",
                    "泰安市商业银行": "TACCB",
                    "许昌银行": "XCYH",
                    "中国光大银行": "CEB",
                    "宁夏银行": "NXBANK",
                    "徽商银行": "HSBANK",
                    "九江银行": "JJBANK",
                    "农信银清算中心": "NHQS",
                    "浙江民泰商业银行": "MTBANK",
                    "廊坊银行": "LANGFB",
                    "鞍山银行": "ASCB",
                    "昆山农村商业银行": "KSRB",
                    "玉溪市商业银行": "YXCCB",
                    "大连银行": "DLB",
                    "东莞农村商业银行": "DRCBCL",
                    "广州银行": "GCB",
                    "宁波银行": "NBBANK",
                    "营口银行": "BOYK",
                    "陕西信合": "SXRCCU",
                    "桂林银行": "GLBANK",
                    "青海银行": "BOQH",
                    "成都农商银行": "CDRCB",
                    "青岛银行": "QDCCB",
                    "东亚银行": "HKBEA",
                    "湖北银行黄石分行": "HBHSBANK",
                    "温州银行": "WZCB",
                    "天津农商银行": "TRCB",
                    "齐鲁银行": "QLBANK",
                    "广东省农村信用社联合社": "GDRCC",
                    "浙江泰隆商业银行": "ZJTLCB",
                    "赣州银行": "GZB",
                    "贵阳市商业银行": "GYCB",
                    "重庆银行": "CQBANK",
                    "龙江银行": "DAQINGB",
                    "南充市商业银行": "CGNB",
                    "三门峡银行": "SCCB",
                    "常熟农村商业银行": "CSRCB",
                    "上海银行": "SHBANK",
                    "吉林银行": "JLBANK",
                    "常州农村信用联社": "CZRCB",
                    "潍坊银行": "BANKWF",
                    "张家港农村商业银行": "ZRCBANK",
                    "福建海峡银行": "FJHXBC",
                    "浙江省农村信用社联合社": "ZJNX",
                    "兰州银行": "LZYH",
                    "晋商银行": "JSB",
                    "渤海银行": "BOHAIB",
                    "浙江稠州商业银行": "CZCB",
                    "阳泉银行": "YQCCB",
                    "盛京银行": "SJBANK",
                    "西安银行": "XABANK",
                    "包商银行": "BSB",
                    "江苏银行": "JSBANK",
                    "抚顺银行": "FSCB",
                    "河南省农村信用": "HNRCU",
                    "交通银行": "COMM",
                    "邢台银行": "XTB",
                    "中信银行": "CITIC",
                    "华夏银行": "HXBANK",
                    "湖南省农村信用社": "HNRCC",
                    "东营市商业银行": "DYCCB",
                    "鄂尔多斯银行": "ORBANK",
                    "北京农村商业银行": "BJRCB",
                    "信阳银行": "XYBANK",
                    "自贡市商业银行": "ZGCCB",
                    "成都银行": "CDCB",
                    "韩亚银行": "HANABANK",
                    "中国民生银行": "CMBC",
                    "洛阳银行": "LYBANK",
                    "广东发展银行": "GDB",
                    "齐商银行": "ZBCB",
                    "开封市商业银行": "CBKF",
                    "内蒙古银行": "H3CB",
                    "兴业银行": "CIB",
                    "重庆农村商业银行": "CRCBANK",
                    "石嘴山银行": "SZSBK",
                    "德州银行": "DZBANK",
                    "上饶银行": "SRBANK",
                    "乐山市商业银行": "LSCCB",
                    "江西省农村信用": "JXRCU",
                    "中国工商银行": "ICBC",
                    "晋中市商业银行": "JZBANK",
                    "湖州市商业银行": "HZCCB",
                    "南海农村信用联社": "NHB",
                    "新乡银行": "XXBANK",
                    "江苏江阴农村商业银行": "JRCB",
                    "云南省农村信用社": "YNRCC",
                    "中国农业银行": "ABC",
                    "广西省农村信用": "GXRCU",
                    "中国邮政储蓄银行": "PSBC",
                    "驻马店银行": "BZMD",
                    "安徽省农村信用社": "ARCU",
                    "甘肃省农村信用": "GSRCU",
                    "辽阳市商业银行": "LYCB",
                    "吉林农信": "JLRCU",
                    "乌鲁木齐市商业银行": "URMQCCB",
                    "中山小榄村镇银行": "XLBANK",
                    "长沙银行": "CSCB",
                    "金华银行": "JHBANK",
                    "河北银行": "BHB",
                    "鄞州银行": "NBYZ",
                    "临商银行": "LSBC",
                    "承德银行": "BOCD",
                    "山东农信": "SDRCU",
                    "南昌银行": "NCB",
                    "天津银行": "TCCB",
                    "吴江农商银行": "WJRCB",
                    "城市商业银行资金清算中心": "CBBQS",
                    "河北省农村信用社": "HBRCU"
                }
            }
        },
        methods: {
            deleteCard(liquidateId) {
                this.$confirm('此操作将永久删除提现卡, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log('删除' + liquidateId)
                    classPost.deleteCard({liquidateId: liquidateId})
                        .then((res) => {
                            if (res.status == '1') {
                                classPost.queryCardAll({memberCode: JSON.parse(localStorage.data).memberId})
                                    .then((res) => {
                                        this.dataArr = res.data.dataList;
                                        this.number = 10 - this.dataArr.length;
                                    })
                                    .catch();
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                            } else {
                                this.$message.error('删除有误，' + res.message);
                            }
                            console.log(res)
                        })
                        .catch();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }
        },
        mounted: function () {
            let id = JSON.parse(localStorage.data).memberId;
            classPost.queryCardAll({memberCode: id})
                .then((res) => {
                    this.dataArr = res.data.dataList;
                    this.number = 10 - this.dataArr.length;
                    console.log(res)
                })
                .catch();
        }
    }
</script>
<style>
    .cardManage {
        width: 100%;
        margin-top: 20px;
        padding: 0 20px;
    }

    .cardManage a {
        text-decoration: none;
        color: inherit;
    }

    .cardManage .cardBox {
        /*display: flex;*/
        /*justify-content: space-between;*/
        /*flex-wrap: wrap;*/
        overflow: hidden;
    }

    .cardManage .addBankCard {
        width: 364px;
        height: 190px;
        line-height: 190px;
        text-align: center;
        background: #fff;
        border: 1px dashed #D9D9D9;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        margin: 20px 10px;
        float: left;
    }

    .cardManage .addBankCard:hover {
        background: #f9f9f9;
    }

    .cardManage .addBankCard a {
        width: 100%;
        height: 100%;
        display: inline-block;
        color: #000;
        text-decoration: none;
    }

    .cardManage .cards {
        width: 364px;
        height: 190px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.09);
        border-radius: 2px;
        border: 1px solid rgba(233, 233, 233, 1);
        position: relative;
        padding: 10px 25px 0;
        margin: 20px 10px;
        float: left;
    }

    .cardManage .over {
        height: 24px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        line-height: 24px;
        margin-top: 9px;
    }

    .cardManage .cards .footer {
        width: 100%;
        height: 48px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: rgba(247, 249, 250, 1);
        border-radius: 0px 0px 2px 2px;
        border-top: 1px solid rgba(233, 233, 233, 1);
        margin: 0;
    }

    .cardManage .cards .footer p {
        display: inline-block;
        width: 50%;
        float: left;
        /*margin: 13px 0 0;*/
        height: 100%;
    }

    .cardManage .cards .footer p button {
        width: 100%;
        height: 100%;
        /*padding-top: 15px;*/
    }

    .cardManage .cards .footer p button:hover {
        background: #f3f3f3;
    }

    .cardManage .cards .footer p:first-child {
        border-right: 1px solid #E8E8E8;
    }

    .cardManage .left1 {
        /*width: 50px;*/
        /*height: 36px;*/
        /*background: #f1f1f1;*/
        /*margin-bottom: 14px;*/
    }

    .cardManage p {
        font-size: 14px;
        height: 25px;
        line-height: 25px;
        color: rgba(0, 0, 0, 0.65);
    }

    .cardManage .bank {
        color: rgba(0, 0, 0, 0.65);
        height: 24px;
        /*width: 260px;*/
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        line-height: 24px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
    }

    .cardManage .cardNumber {
        word-break: break-all;
        font-size: 18px;
        font-weight: 600;
        color: rgba(39, 42, 51, 1);
        line-height: 22px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
    }

    .cardManage .shenhe {
        position: absolute;
        top: 13px;
        right: 24px;
        font-size: 14px;
        color: #F56C6C;
        line-height: 22px;
    }

    .cardManage .footer span {
        font-size: 14px;
    }
</style>
