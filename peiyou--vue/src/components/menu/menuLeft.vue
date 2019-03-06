<template>
    <el-menu router text-color="#cecece" background-color="#474C60" class="el-menu-vertical-demo" :collapse='collapse'>
        <el-submenu  :index="val.menuName" v-for="(val, key) in menuLeft" :key="key" v-if="val.childMenu.length > 0">
            <template slot="title">
            <i :class="val.className"></i>
            <span slot="title">{{val.menuName}}</span>
            </template>
            <el-menu-item-group router v-for="(v, k) in val.childMenu" :key="k">
            <el-menu-item :index="v.route.path">{{v.menuName}}</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
</template>

<script>
import bus from '../basic';
export default {
    name: 'menuLeft',
    data () {
        return {
            menuLeft: [],
            collapse: false
        };
    },
    mounted () {
        this.getMenuList();
        bus.$on('handleClick', () => {
            this.collapse = !this.collapse;
        });
    },
    methods: {
        getMenuList () {
            this.$http.get('http://localhost:8087/getMenuList').then((res) => {
                if (Number(res.successful)) {
                    this.menuLeft = JSON.parse(res.data);
                }
            });
        }
    }
};
</script>


<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        height: 100%;
    }
</style>

