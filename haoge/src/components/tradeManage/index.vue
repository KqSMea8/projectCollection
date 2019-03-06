<template>
<keep-alive exclude="orderDetail,filterSet,filterList">
   <router-view></router-view>
</keep-alive>
 
</template>

<script>
import { Message } from 'element-ui' //element Message 组件引入

export default {
  data () {
    return {
      
    }
  },

  created: function () {
      
  },

  methods: {
     
  }
}

</script>

<style>

</style>
