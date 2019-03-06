<template>
  <div class="menuTop">
      <i class="el-icon-tickets" @click="handleClick"></i>
      <span>{{title}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import bus from '../basic';
export default {
    name: 'menuTop',
    computed: {
        ...mapState({
            title: (state) => state.title.title
        })
    },
    data () {
        return {
        };
    },
    methods: {
        handleClick () {
            bus.$emit('handleClick');
        }
    }
};
</script>

<style scoped>
    .menuTop{
        width: 100%;
        height: 67px;
        line-height: 67px;
        padding: 0 20px;
        background: #fff;
    }
</style>
