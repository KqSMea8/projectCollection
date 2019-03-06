<template>
    <div class="logo">
        <img src="../../assets/images/logo-color.svg" width="128" height="30.5" @click="website" >
        <small>|</small>
        <span>启赟站</span>
        <span v-if="location!=='null'&&location!==''" class="hj">{{location}}</span>
    </div>    
</template>
<script>
export default {
    computed:{
        location(){
            if(localStorage.data){
                return JSON.parse(localStorage.data).env
            }else{
                return ''
            }
        }
    },
    methods:{
        website(){
            window.open("http://www.ipaylinks.com")
        },
    }
}
</script>
<style>
.logo {
   display: flex;
   align-items: center;
}
.logo img{
    width: 125px;
    margin-right: 11px;
    cursor: pointer;
}
.logo span{
    margin-left: 12px;
    font-size: 18px;
    color:#6E7F94;
}
.logo .hj{
    background: rgba(239, 220, 56, 1);
    display: inline-block;
    font-size: 14px;
    color:white;
    width: 50px;
    height: 20px;
    border-radius: 5px;
    text-align: center;
    line-height: 20px;
}
</style>
