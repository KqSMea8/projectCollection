<template>
  <div>
      <el-form :model="form">
            <el-form-item label="角色名称" :label-width="formLabelWidth">
                <el-input v-model="form.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色密码" :label-width="formLabelWidth">
                <el-input v-model="form.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="权限管理" :label-width="formLabelWidth">
            <el-select v-model="form.roles" multiple placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">取 消</el-button>
            <el-button type="primary" @click="CdialogFormVisible">确 定</el-button>
        </div>
         
  </div>
</template>
<script>
// import Bus from 'Tools/bus.js';
export default {
    name: 'roledialog',
    props: ['dialogFormVisible', 'roleRow'],
    data () {
        return {
            form: {
                username: '',
                password: '',
                roles: []
            },
            options: [
                {
                    value: '首页管理',
                    label: '首页管理'
                },
                {
                    value: '权限管理',
                    label: '权限管理'
                },
                {
                    value: '订单管理',
                    label: '订单管理'
                },
                {
                    value: '商品管理',
                    label: '商品管理'
                },
                {
                    value: '财务管理',
                    label: '财务管理'
                },
                {
                    value: '优惠券',
                    label: '优惠券'
                }
            ],
            formLabelWidth: '120px'
        };
    },
    methods: {
        CdialogFormVisible () {
            this.$emit('changeFlag', this.form);
        },
        cancelDialog () {
            console.log('取消');
        }
    },
    beforeUpdate () {
        this.form = this.roleRow;
    },
    mounted () {
        this.form = this.roleRow;
    }
};
</script>

