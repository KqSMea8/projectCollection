<template>
    <p class="head">
        <!-- <b @click='clickIsCollapse'>≡</b> -->
        <b @click='changFlag'>≡</b>
        <!-- {{$route.meta.title?$route.meta.title:'用户管理'}} -->
        {{title?title:'用户管理'}}
    </p>
</template>
<script>
import {mapState, mapActions} from 'vuex';
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
            title: (state) => state.title.title
        })
    },
    methods: {
        ...mapActions(['changFlag'])
    }
};
</script>
<style scoped>
    .head{
        height: 40px;
        background: #fff;
        line-height: 40px;
        text-indent: 20px;
        font-size: 17px;
    }
</style>


