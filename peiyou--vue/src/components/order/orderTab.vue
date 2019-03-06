<template>
    <div>
        <el-table
            :data="datas"
            style="width: 100%"
            height="700">
            <el-table-column
                v-for="(v, k) in order"
                :key="k"
                :prop="k"
                :label="v[0]"
                width="180">
            </el-table-column>
            <el-table-column label="操作" align="center" width="280">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {order} from '../../assets/modules';
export default {
    data () {
        return {
            order
        };
    },
    methods: {
        ...mapActions(['getDatas'])
    },
    mounted () {
        this.getDatas();
    },
    computed: {
        ...mapState({
            datas: (state) => state.order.datas
        })
    }
};
</script>

<style>

</style>
