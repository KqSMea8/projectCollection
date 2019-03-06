<template>
    <div class="wyx contactInformation">
        <div class="container">
            <p class="p1">如有任何问题请联系我们，专属客服为您服务，让您的问题，得到快速、有效的响应与解决</p>
            <p class="p2">021-51827986</p>
            <div class="methods">
                <div class="box">
                    <p><img src="../../assets/images/icon-QQ.svg" alt=""></p>
                    <p>QQ:3145676659</p>
                    <p><a href="tencent://message/?uin=3145676659&Site=Sambow&Menu=yes">在线咨询</a></p>
                </div>
                <div class="box">
                    <p><img src="../../assets/images/ficon-eedbook.svg" alt=""></p>
                    <p>biz@ipaylinks.com</p>
                    <p><a href="mailto:biz@ipaylinks.com">问题反馈</a></p>
                </div>
                <div class="box">
                    <p><img src="../../assets/images/icon-wechat.svg" alt=""></p>
                    <p>iPayLinks2015</p>
                    <!--<p>官方微信公众号</p>-->
                    <el-popover
                            placement="bottom"
                            trigger="click">
                        <p style="text-align: center"><img width="112px" src="../../assets/images/wechat@2x.png" alt="">
                        </p>
                        <el-button type="text" slot="reference">官方微信公众号</el-button>
                    </el-popover>
                </div>
            </div>
            <div class="addressBox">
                <p class="ipay">iPayLinks 上海总部</p>
                <p class="tel">地址：上海市商城路518号内外联大厦18层</p>
                <p class="tel">电话：021-51827986</p>
                <p class="tel">邮编：200120</p>
            </div>
        </div>
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'

    export default {}
</script>

<style>
    .contactInformation .container {
        width: 62%;
        padding: 35px 0px 200px;
        margin: auto;
    }

    .contactInformation .container .p1 {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        text-align: center;
    }

    .contactInformation .container .p2 {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 29px;
        text-align: center;
        margin-top: 28px;
    }

    .contactInformation .container .methods {
        margin: 110px -90px 0;
        overflow: hidden;
    }

    .contactInformation .container .methods .box {
        width: 33.3%;
        float: left;
        text-align: center;
    }

    .contactInformation .container .methods .box p {
        text-align: center;
    }

    .contactInformation .container .methods .box p:nth-child(2) {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 20px;
        margin: 22px 0 5px;
    }

    .contactInformation .container .methods .box p:nth-child(3), .contactInformation .container .methods .box p:nth-child(3) a, .contactInformation .el-button--text {
        font-size: 16px;
        color: rgba(24, 144, 255, 1);
        line-height: 22px;
        padding: 0;
    }

    .contactInformation .el-button--text span {
        font-size: 16px;
    }

    .contactInformation .container .addressBox {
        margin-top: 140px;
    }

    .contactInformation .container .addressBox .ipay {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 32px;
        border-bottom: 2px solid rgba(232, 232, 232, 1);
        font-weight: bolder;
        margin-bottom: 5px;
    }

    .contactInformation .container .addressBox .tel {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 20px;
    }
</style>
