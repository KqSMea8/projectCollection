<template>
    <div class='user'>
        <div class="u-header">
            用户姓名：<input type="text" placeholder="请输入用户的姓名">
            <button class="btn">查找</button>
        </div>
    </div>
</template>

<script>


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user {
    display: flex;
    flex-direction: column;
    width: 95%;
    margin: 0 auto;
}

.u-header {
    height: 67px;
    line-height: 67px;
    background: #fff;
    text-indent: 20px;
}
.u-header input{
    width: 210px;
    height: 25px;
}
.btn {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 1.22px;
    width: 109px;
    height: 31px;
    background: #00D2C0;
    border-radius: 2px;
}
</style>
