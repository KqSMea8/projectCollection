<template>
    <div class="box">
        <Aside></Aside>
        <div class="container">
            <myHeade></myHeade>
            <main1></main1>
        </div>
    </div>
</template>

<script>
// import fetcher from 'Tools/fetcher.js';
import Aside from './aside/aside.vue';
import myHeade from './myHeade/myHeade.vue';
import main1 from './main/main.vue';
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
    components: {
        Aside,
        myHeade,
        main1
    },
    methods: {
        clickIsCollapse () {
            this.isCollapse = !this.isCollapse;
        }
    }
};
</script>

<style scoped>

.box {
    display: flex;
    width: 100%;
    height: 100%;
}

.container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #F6FAFA;
}
</style>