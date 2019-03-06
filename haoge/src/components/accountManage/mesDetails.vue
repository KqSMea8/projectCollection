<template>
    <div class="wyx mesDetails">
        <div class="deBox">
            <p class="title">{{data.subject}}</p>
            <p class="time">
                <span style="margin-right: 20px">公告</span>
                <span>{{data.startTime}}</span>
            </p>
            <p class="con" v-html="data.message">
                {{data.message}}
            </p>
            <p class="return">
                <router-link to="/home/accountManage/myMessages"><span class="el-icon-caret-left"></span>返回列表
                </router-link>
            </p>
        </div>
    </div>
</template>

<script>
    import '../../assets/css/wyxCard.css'
    import classPost from '../../servies/classPost'

    export default {
        data(){
            return {
                id:'',
                readStatus:'',
                data:{}
            }
        },

        watch: {
            $route(){
                this.id=this.$route.params.id.split('-')[0];
                this.readStatus=this.$route.params.id.split('-')[1];
                classPost.messageDetail({id:this.id,readStatus:this.readStatus})
                    .then((res)=>{
                        this.data=res.data;
                        console.log(res)
                    })
                    .catch()
            }
        },
        mounted:function () {
            this.$eventBus.$emit('upinfo')
            this.id=this.$route.params.id.split('-')[0];
            this.readStatus=this.$route.params.id.split('-')[1];
            console.log(this.id)
            classPost.messageDetail({id:this.id,readStatus:this.readStatus})
                .then((res)=>{
                this.data=res.data;
                    console.log(res)
                })
                .catch()
        },
        beforeDestroy(){
            this.$eventBus.$emit('upinfo')
        }
    }
</script>

<style>
    .mesDetails .deBox {
        padding: 0 102px;
    }

    .mesDetails .deBox .title {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
        padding: 5px 0;
    }

    .mesDetails .deBox .time {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        margin-bottom: 23px;
    }

    .mesDetails .deBox .con {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 24px;
        margin-bottom: 92px;
    }

    .mesDetails .deBox .return {
        text-align: center;
        font-size: 14px;
        color: rgba(24, 144, 255, 1);
        line-height: 20px;
    }
</style>
