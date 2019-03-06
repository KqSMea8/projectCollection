<template>
  <div class="role">
    <el-button type="primary" @click="addUser">添加角色</el-button>
    <el-dialog :title="titleName" :visible.sync="dialogFormVisible">
        <RoleDialog @closeModule="closeModule" :datas="datas"/>
    </el-dialog>
    <role-list/>
  </div>
</template>

<script>
// 角色列表
import RoleList from './roleList';
import RoleDialog from './roleDialog';
import bus from '../basic';
export default {
    data () {
        return {
            dialogFormVisible: false,
            titleName: '',
            datas: {}
        };
    },
    components: {
        RoleList,
        RoleDialog
    },
    methods: {
        closeModule () {
            this.dialogFormVisible = false; // 通过自定义事件进行子-->父传值
        },
        addUser () {
            // 点击添加角色
            this.dialogFormVisible = true;
            this.titleName = '添加角色';
            this.datas = {
                password: '',
                rules: [],
                username: ''
            };
        }
    },
    mounted () {
        bus.$on('emitRole', (data) => {
            this.datas = data;
            // 将值传给子然后进行覆盖
            this.titleName = '编辑角色';
            this.dialogFormVisible = true;
        });
    }
};
</script>

<style>

</style>
