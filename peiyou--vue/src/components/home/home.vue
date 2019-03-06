<template>
    <div class="home">
        <menu-left/>
        <div class="right">
            <menu-top/>
            <main class="main">
                <router-view/>
            </main>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
import menuLeft from '../menu/menuLeft'
import menuTop from '../menu/menuTop'
    export default {
        name: 'home',
        components: {
            menuLeft,
            menuTop
        },
        data () {
            return {

            }
        }
    }
</script>

<style scoped>
    
.home{
  width: 100%;
  height: 100%;
  background: #ccc;
  display: flex;
}
.right{
    flex: 1;
}
.main{
    margin: 20px;
    height: 850px;
}
</style>