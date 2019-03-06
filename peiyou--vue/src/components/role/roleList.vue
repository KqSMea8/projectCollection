<template>
  <div class="roleList">
      <el-table
            border
            :data="tableData"
            style="width: 100%">
            <el-table-column
                align="center"
                v-for="(v, k) in role"
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
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage3"
            :page-size="5"
            layout="prev, pager, next, jumper"
            :total="6">
        </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {role} from '../../assets/modules';
import bus from '../basic';
export default {
    data () {
        return {
            role,
            currentPage1: 1,
            currentPage2: 1,
            currentPage3: 1,
            currentPage4: 1
        };
    },
    methods: {
        ...mapActions(['getRoleData']),
        handleEdit (row) {
            bus.$emit('emitRole', row);
        },
        handleDelete (index, row) {
            // 在数据中查找然后删除
            this.$http.get('http://localhost:8087/delect', row).then((res) => {
                if (res.successful) {
                    this.getRoleData();
                }
            });
        },
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange (val) {
            console.log(`当前页: ${val}`);
        }
    },
    mounted () {
        this.getRoleData();
    },
    computed: {
        ...mapState({
            tableData: (state) => state.role.tableData
        })
    }
};
</script>

<style>
    .roleList{
        background: #fff;
    }
</style>