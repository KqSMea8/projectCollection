<template>
<div class="filterlist">
        <div class="content">
            <div class="head"><el-button @click="addfilter" size="small" type="primary" icon="el-icon-circle-plus-outline">新增过滤器</el-button></div>
             <el-table
                v-loading="loading"
                element-loading-background="rgba(255,255,255,1)"
                :data="date">
                    <el-table-column
                        align="center"
                        header-align="center"
                        label="默认">
                        <template slot-scope="scope">
                            <input type="radio" :value="scope.row.filterName" @change="changeval(scope)" name="list" v-model="audio">
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        header-align="center"
                        prop="filterName"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        header-align="center"
                        label="显示选择">
                        <template slot-scope="scope">
                             <el-switch
                                 v-if="scope.row.deletedInd!=='99'"
                                v-model="scope.row.showToolbar"
                                @change="changeflag(scope)">
                            </el-switch>
                        </template>
                    </el-table-column>
                        <el-table-column
                        width="150"
                        label="操作">
                        <template slot-scope="scope">
                           <div class="handle">
                               <span @click="goSet(scope.row.id,scope.row.deletedInd,scope.row.defaultSet)">修改</span>
                               <span v-if="scope.row.deletedInd!=='99'" @click="deleteItem(scope)">删除</span>
                           </div>
                        </template>
                    </el-table-column>
            </el-table>
        </div>
</div>
</template>
<script>
import classPost from '../../servies/classPost';
export default {
    name:'filterList',
    data () {
        return {
            audio:"",
            loading:true,
            date:[]
        }
    },
    methods:{
        changeval(scope){
            let obj = {
                id:scope.row.id,
                defaultSet:'1'
            }
            this.loading=true
            this.listUpdata(obj)
        },
        deleteItem(scope){
            this.$confirm('您确定要删除该条配置吗','删除',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(()=>{
                const obj = {
                    id:scope.row.id,
                    deletedInd:'1'
                }
                this.loading=true
                this.listUpdata(obj)
            })
        },
        changeflag(scope){
            const obj = {
                id:scope.row.id,
                showToolbar:scope.row.showToolbar?'1':'0'
            }
            this.loading=true
            this.listUpdata(obj)
        },
        goSet(id,ind,def){
            this.$router.push(`/home/tradeManage/filterSet/${id}&${ind}&${def}`)
        },
        listUpdata(obj){
            classPost.config_update(obj)
                .then((res)=>{
                    this.get_list()
                })
                .catch((err)=>{
                    console.log(err)
                })
        },
        addfilter(){
            this.$router.push(`/home/tradeManage/filterSet/a`)
        },
        get_list(){
            classPost.config_list({})
            .then((res)=>{
                this.loading=false
                this.audio = res.data.filter(item=>item.defaultSet!=='0')[0].filterName
                this.date = res.data.map((item)=>{
                    item.showToolbar = item.showToolbar!=='0'?true:false
                    return {...item}
                })
            })
            .catch((err)=>{
                console.log(err)
            })  
        }
    },
    mounted() {
       this.get_list()
    },
}
</script>
<style>
.filterlist{
   background: RGBA(255, 255, 255, 1);
    padding: 20px;
    margin-top: 20px;
}
.filterlist .head{
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
    cursor: pointer;
}
.filterlist .head p{
    border: 1px dashed black;
    border-radius: 3px;
    height: 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding:0 20px;
}
.filterlist .head p i{
    margin-right: 10px;
    font-size: 16px;
}

.filterlist .el-table th{
    background:rgba(24, 144, 255, 0.1)!important;
    color:rgba(0, 0, 0, 0.85)!important
}
.filterlist .handle span{
    color: rgba(24, 144, 255, 1);
    font-size: 14px;
}
.filterlist .handle span:nth-child(2){
    margin-left: 10px;
}
</style>
