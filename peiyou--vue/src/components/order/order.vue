<template>
    <div class="order">
        <orderList/>
        <div class="order-bot">
            <order-tab/>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="9"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
// 订单列表
import { mapActions, mapState } from 'vuex';
import orderTab from './orderTab';
import orderList from './orderList';
export default {
    data () {
        return {
        };
    },
    methods: {
        ...mapActions(['setConditions', 'getDatas']),
        handleSizeChange (pageLength) {
            this.setConditions({pageLength});
            this.getDatas();
        },
        handleCurrentChange (pageSize) {
            this.setConditions({pageSize});
            this.getDatas();
        }
    },
    components: {
        orderList,
        orderTab
    },
    computed: {
        ...mapState({
            total: (state) => state.order.total
        })
    }
};
</script>
    
<style>
    .order-bot{
        width: 100%;
        height: 760px;
        background: #fff;
    }
</style>
