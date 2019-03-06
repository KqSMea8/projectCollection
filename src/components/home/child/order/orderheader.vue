<template>
    <div class="u-header">
        用户姓名：<input type="text" placeholder="请输入用户的姓名" v-model="val" @keyup='changename(val)'>
        <button class="btn" @click='filterNames(val)'>查找</button>
    </div>
</template>
<script>
export default {
    name: 'u-header',
    data () {
        return {
            val: ''
        };
    },
    methods: {
        filterNames (val) {
            this.$store.dispatch('changName', val);
        },
        changename (val) {
            this.$store.dispatch('changName', val);
        }
    }
};
</script>
<style scoped>

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
