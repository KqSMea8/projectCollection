<template>
    <div class='order'>
        <orderheader />
        <ordermian />
        <el-pagination
        @size-change='sizeChange'
        @current-change='currentChangeAdd'
        :page-size="endIndex"
        layout="total, sizes, prev, pager, next, jumper"
        :total="length">
        </el-pagination>
    </div>
</template>

<script>
import orderheader from './orderheader';
import ordermian from './ordermian';
import { mapActions, mapState } from 'vuex';
// import mock from '@/mock/server'
export default {
    name: 'order',
    components: {
        orderheader,
        ordermian
    },
    computed: {
        // ...mapState(['endIndex', 'startIndex', 'length'])
        ...mapState({
            endIndex: (state) => state.order.endIndex,
            startIndex: (state) => state.order.startIndex,
            length: (state) => state.order.length
        })
    },
    mounted () {
        this.changeOrderData({startIndex: this.startIndex, endIndex: this.endIndex});
    },
    methods: {
        ...mapActions(['changeOrderData']), // this.$store.dispatch('currentChangeAdd',index)
        currentChangeAdd (startIndex) {
            this.changeOrderData({startIndex, endIndex: this.endIndex});
        },
        sizeChange (endIndex) {
            this.changeOrderData({startIndex: this.startIndex, endIndex});
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.order {
    display: flex;
    flex-direction: column;
    width: 95%;
    margin: 0 auto;
}

.u-header {
    height:40px;
    line-height:40px;
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
