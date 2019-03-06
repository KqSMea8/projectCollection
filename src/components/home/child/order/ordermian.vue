<template>
  <div>
    <el-table
        :data="filterData.length?filterData:data"
        :height='600'
        >
        <el-table-column 
            v-for='(v,k) in orderHeader'
            :key='k'
            :prop="k"
            :label="v[0]"
            :width="v[1]">
        </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { orderHeader } from '@/static/order.js';
// import mock from '@/mock/mock';
import { mapState, mapGetters } from 'vuex';
export default {
    name: 'order',
    data () {
        return {
            orderHeader
        };
    },
    computed: {
        ...mapState({
            endIndex: (state) => state.order.endIndex,
            startIndex: (state) => state.order.startIndex,
            data: (state) => state.order.data
        }),
        ...mapGetters(['filterData'])
    }
};
</script>
