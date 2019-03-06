<template>
    <div class="wyx addSuccess">
        <div class="result">
            <p><span class="el-icon-error" style='color: #F56C6C;font-size: 72px;margin: 86px 0 24px'></span></p>
            <p class="resultSuc">添加银行卡失败</p>
            <p class="resultTil">您的银行卡添加失败，查看
                <router-link to="/" style="color: #1890FF;">解决方法</router-link>
            </p>
            <router-link to="/home/accountManage/cardManage/addCardMessage">
                <el-button>继续添加体现银行卡</el-button>
            </router-link>
            <router-link to="/home/accountManage/cardManage">
                <el-button>返回提现卡管理</el-button>
            </router-link>
            <router-link to="/home/fundManage/withdraw">
                <el-button type="primary">我要提现</el-button>
            </router-link>
        </div>
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'

    export default {}
</script>


<style>

    .addSuccess .result {
        text-align: center;
        margin-bottom: 200px;
    }

    .addSuccess .resultSuc {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 32px;
    }

    .addSuccess .resultTil {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.43);
        line-height: 22px;
        margin: 8px 0 76px;
    }
</style>
