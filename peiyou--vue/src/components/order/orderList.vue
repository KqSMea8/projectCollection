<template>
    <div class="order-head">
        <label>用户姓名:</label>
        <input type="text" placeholder="请输入用户姓名" v-model="inputVal"/>
        <button @click="searchClick">查找</button>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
    data () {
        return {
            inputVal: ''
        };
    },
    methods: {
        ...mapActions(['getSearch', 'getAllData']),
        searchClick (e) {
            e.preventDefault();
            // 获取input框里的值，然后进行筛选
            if (this.inputVal !== '') {
                this.getSearch(this.inputVal);
                this.getAllData();
            }
        }
    },
    mounted () {
        this.getSearch();
    },
    computed: {
        ...mapState({
            allData: (state) => state.order.allData
        })
    }
};
</script>

<style>
    .order-head{
        width: 100%;
        height: 67px;
        line-height: 67px;
        background: #fff;
        margin-bottom: 20px;
        padding-left: 20px;
    }
    label{
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: #333333;
        letter-spacing: 1.22px;
    }
    input{
        width: 205px;
        height: 35px;
        margin: 0 25px 0 10px;
        padding-left:5px;
        border: 0.5px solid #E8E8E8;
        border-radius: 2px;
    }
    input::-webkit-input-placeholder{
        color: #ccc;
    }
    button{
        width: 109px;
        height: 35px;
        border: none;
        background: #00D2C0;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 1.22px;
    }
</style>
