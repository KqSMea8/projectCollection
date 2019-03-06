<template>
	<div>
      <span v-if="!langflag" @click="changelang('zh')">中文</span>
      <span v-else @click="changelang('en')">English</span>
  </div>
</template>

<script>

export default {
  data () {
    return {
        langflag:true
    }
  },

  created: function () {
      
  },
  mounted(){
    if(localStorage.lang=='en'){
      this.langflag = !this.langflag
    }
  },
  methods: {
    changelang(lang){
      this.langflag = !this.langflag
      localStorage.lang = lang
      this.$i18n.locale = lang;
      this.$eventBus.$emit('changeLang')
      this.$eventBus.$emit('try')
    }
  }
}
</script>