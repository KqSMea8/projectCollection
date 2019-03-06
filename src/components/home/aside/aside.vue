<template>
    <div class="aside">
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse='flag'  router style="width:auto;" background-color='#474C60' text-color='#fff'>
            <el-submenu v-for='(data,k) in menu' :key='k' :index='data.menuName'>
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{data.menuName}}</span>
                </template>
                <el-menu-item-group v-for='(v,key) in data.childMenu' :key='key'>
                    <el-menu-item :index="v.route.path">{{v.menuName}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
// import Bus from 'Tools/bus';
export default {
    data () {
        return {
            isCollapse: true,
            fromData: {
                username: 'zs',
                password: '123'
            }
        };
    },
    computed: {
        ...mapState({
            flag: (state) => state.title.flag,
            menu: (state) => state.menu.menu
        })
    },
    methods: {
        ...mapActions(['munuList'])
    },
    mounted () {
        this.munuList();
        // this.$http.get('http://localhost:8084/getMenuList').then((result) => {
        //     if (result.successful) {
        //         this.menu = JSON.parse(result.data);
        //     };
        // });
    }
};
</script>
<style scoped>
    .aside{
        height: 100%;
        background: #474C60;
    }

</style>
