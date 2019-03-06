<template>
  <div>
       <el-table
            :data='roleData'
            border
            style="width: 100%"
            align='center'
            >
            <el-table-column
            v-for='(v,k) in roleHeader'
            :key='k'
            v-if='k!=="roles"'
            :prop="k"
            :label="v[0]"
            align='center'
            >
            </el-table-column>
            <el-table-column
            fixed="right"
            label="权限管理"
           >
            <template slot-scope="scope">
                {{scope.row.roles.join(',')}}
            </template>
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
           >
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="delClick(scope.row)" :disabled="scope.row.username===username">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
         <el-dialog
            title="提示"
            :visible.sync="flag"
            width="30%"
            >
            <span>你确定要删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="flag = false">取 消</el-button>
                <el-button type="primary" @click="delSure(data)">确 定</el-button>
            </span>
        </el-dialog> 
  </div>
</template>
<script>
import { roleHeader } from '@/static/order.js';
import { mapState, mapActions } from 'vuex';
export default {
    name: 'roleList',
    data () {
        return {
            roleHeader,
            username: '',
            flag: false,
            data: []
        };
    },
    computed: {
        ...mapState({
            roleData: (state) => state.role.roleData
        })
    },
    methods: {
        ...mapActions(['setRoleData']),
        handleClick (row) {
            this.$emit('editRole', row);
        },
        delClick (row) {
            this.flag = true;
            this.data = row;
            // this.delSure(row);
        },
        delSure (row) {
            this.$http.post('http://localhost:8084/delRole', row).then((res) => {
                if (res.code) {
                    this.setRoleData();
                }
            });
            this.flag = false;
        }
    },
    mounted () {
        this.setRoleData();
        this.username = localStorage['username'];
    }
};
</script>
