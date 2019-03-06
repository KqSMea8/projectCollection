<template>
    <div class='role'>
        <el-button @click='clickDiag'>点击</el-button>
        <el-dialog :title="editType" :visible.sync="dialogFormVisible">
            <roledialog :dialogFormVisible = 'dialogFormVisible' @changeFlag='changeFlag' :roleRow='roleList'></roledialog>
        </el-dialog>
       <roleList @editRole='editRole'/>
       <el-pagination
      :page-sizes="[1, 2, 3, 4]"
      :page-size="1"
      layout="total, sizes, prev, pager, next, jumper"
      :total="10">
    </el-pagination>
    </div>
</template>
<script>
import roleList from './roleList';
import roledialog from './roledialog';
import { mapActions } from 'vuex';
export default {
    name: 'role',
    data () {
        return {
            editType: '添加角色',
            roleList: '',
            data: [],
            dialogFormVisible: false
        };
    },
    components: {
        roleList,
        roledialog
    },
    methods: {
        ...mapActions(['setRoleData', 'munuList']),
        changeFlag (data) {
            if (this.editType === '编辑角色') {
                this.$http.post('http://localhost:8084/getEnitRole', data).then((res) => {
                    if (res.code) {
                        this.setRoleData();
                        this.munuList();
                    }
                });
            } else {
                // console.log('添加');
                this.$http.post('http://localhost:8084/addRoleData', data).then((res) => {
                    if (res.code) {
                        // console.log(res);
                        this.setRoleData();
                        this.munuList();
                    }
                });
            }
            this.dialogFormVisible = false;
        },
        editRole (data) {
            this.editType = '编辑角色';
            this.roleList = data;
            this.dialogFormVisible = true;
        },
        clickDiag () {
            this.editType = '添加角色';
            this.roleList = {
                username: '',
                password: '',
                roles: []
            };
            this.dialogFormVisible = true;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
