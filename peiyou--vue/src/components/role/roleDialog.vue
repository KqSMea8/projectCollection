<template>
    <div>
        <el-form :model="form">
            <el-form-item label="角色名称" :label-width="formLabelWidth">
                <el-input v-model="form.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" :label-width="formLabelWidth">
                <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="权限名称" :label-width="formLabelWidth">
                <el-select v-model="form.rules" multiple placeholder="请选择">
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
            <el-button @click="destoryClick">取 消</el-button>
            <el-button type="primary" @click="roleSubmit">确 定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['datas'],
    data () {
        return {
            form: {
                id: 0,
                password: '',
                rules: [],
                username: ''
            },
            formLabelWidth: '120px',
            options: [{
                value: '首页管理',
                label: '首页管理'
            }, {
                value: '权限管理',
                label: '权限管理'
            }, {
                value: '订单管理',
                label: '订单管理'
            }, {
                value: '财务管理',
                label: '财务管理'
            }, {
                value: '优惠券',
                label: '优惠券'
            }]
        };
    },
    mounted () {
        this.form = this.datas;
    },
    beforeUpdate () {
        this.form = this.datas;
    },
    methods: {
        roleSubmit () {
            // 点击确定的时候fetch请求，然后将数据发送  --》 fetch 同时还要关闭模态框 将数据存到本地
            // 将this.datas添加到数据库中
            this.$http.get('http://localhost:8087/addMsg', this.datas).then((res) => {
                console.log(res);
                // if (res.successful) {
                //     console.log(this.getRoleData());
                // }
            });
            this.$emit('closeModule');
        },
        destoryClick () {
            // 点击取消 关闭模态框
            this.$emit('closeModule');
        }
    }
};
</script>

<style>

</style>
