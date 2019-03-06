<template>
    <div v-loading="setLoading" element-loading-background="rgba(255,255,255,1)" class="filterSet">
            <el-card shadow="never" class="condition">
                <div slot="header" class="title">
                    <h3>过滤器配置</h3>
                     <i :class="showfilter?'el-icon-arrow-up':'el-icon-arrow-down'" @click="changeshow" class="hico hand"></i>
                </div>
                <div v-if="showfilter" id="abcd" class="content">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                        <el-form-item label="过滤器名称" prop="filtername">
                            <el-input v-model="ruleForm.filtername"></el-input>
                        </el-form-item>
                         <el-form-item label="每页显示条数" prop="filternum">
                            <el-input v-model="ruleForm.filternum"></el-input>
                        </el-form-item>
                        <el-form-item v-if="isshowinput" label="显示查询条件栏" prop="filtershow">
                            <el-switch v-model="ruleForm.filtershow"></el-switch>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            <el-card v-for="(item, index) of QueryConfiguration" :key="index" shadow="never" class="condition">
                <div slot="header" class="title">
                    <div class="lhead">
                        <span>{{item.name}}</span>
                        <div>只显示有效信息
                            <el-switch @change="canInfo" v-model="item.isshow"></el-switch>
                        </div>
                    </div>
                     <i :class="item.showinfo?'el-icon-arrow-up':'el-icon-arrow-down'" @click="changeinfo(index)" class="hico hand"></i>
                </div>
                <div v-if="item.showinfo" class="filterinfo">
                      <el-table
                        :data="item.tableDate">
                            <el-table-column
                                align="center"
                                header-align="center"
                                v-for="(i, index) of setTradeInfo"
                                v-if="i.isSelfDefined==='txt'"
                                :key="index"
                                :prop="i.prop"
                                :label="i.label">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                header-align="center"
                                v-else-if="i.isSelfDefined==='flag'"
                                :key="index"
                                :label="i.label">
                                <template slot-scope="scope">
                                    <el-switch
                                        v-if="scope.row.obj.showdisabled!=='9'"
                                        v-model="scope.row.disabled">
                                    </el-switch>
                                </template>
                            </el-table-column>
                             <el-table-column
                                align="center"
                                header-align="center"
                                v-else-if="i.isSelfDefined==='flags'"
                                :key="index"
                                :label="i.label">
                                <template slot-scope="scope">
                                    <el-switch
                                        v-if="scope.row.disabled&&scope.row.obj.showasCondition!=='9'"
                                        v-model="scope.row.asCondition">
                                    </el-switch>
                                </template>
                            </el-table-column>
                                <el-table-column
                                v-else
                                align="center"
                                header-align="center"
                                :key="index"
                                :label="i.label">
                                <template slot-scope="scope">
                                <span v-if="scope.row.defaultValue" @click="setDefault(scope)" class="handle hand">
                                    设置默认条件
                                </span>
                                </template>
                            </el-table-column>
                    </el-table>
                </div>
            </el-card>
            <div class="lasts">
                <el-button @click='submit("ruleForm")' size="small" type="primary">保存</el-button>
            </div>
            <el-dialog
                width="30%"
                :visible.sync="centerDialogVisible"
                :close-on-click-modal='false'
                :close-on-press-escape="false"
                :show-close="false">
                <div slot="title">
                     <span class="txtxs">{{dialogInfo.txtName}}：</span>
                </div>
                <div v-if="dialogInfo.type==='1'" class="inputbox">
                   <el-input v-model="dialogInfo.value" size="small" :placeholder="`请输入${dialogInfo.txtName}`"></el-input>
                </div>
                <div v-else-if="dialogInfo.type==='2'" class="checkbox">
                    <el-checkbox-group v-model="dialogInfo.value" :indeterminate="true">
                        <el-checkbox v-for="(item, index) of dialogInfo.initValue" v-if="dialogInfo.txtName==='交易类型'" :key="index" :value="item" :label="item">{{statusZh(item)}}</el-checkbox>
                        <el-checkbox v-else-if="dialogInfo.txtName==='交易状态'" :key="index" :value="item" :label="item">{{typeZh(item)}}</el-checkbox>
                        <el-checkbox v-else :key="index" :label="item" :value="item"></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div v-else class="selectbox">
                      <el-select size="small" v-model="dialogInfo.value"  multiple placeholder="请选择">
                        <el-option
                            v-for="(item,index) of dialogInfo.initValue"
                            v-if="dialogInfo.txtName==='交易币种'||dialogInfo.txtName==='结算币种'"
                            :key="index"
                            :label="`${item[Object.keys(item)[0]][1]}(${item[Object.keys(item)[0]][0]})`"
                            :value="item[Object.keys(item)[0]][0]">
                        </el-option>
                        <el-option
                            v-else-if="dialogInfo.txtName==='渠道类型'"
                            :key="index"
                            :label="payType(item)"
                            :value="item">
                        </el-option>
                        <el-option
                            v-else
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="centerDialogVisible=false">取消</el-button>
                    <el-button type="primary" size="small" @click="closeDialog">确定</el-button>
                </span>
            </el-dialog>
    </div>
</template>
<script>
import { setTradeInfo } from '../../util/tabledata'
import { typeZh, statusZh, payType} from '../../util/commonality'
import classPost from '../../servies/classPost';
export default {
    name:'filterSet',
    methods:{
        typeZh,
        statusZh,
        payType,
        changeshow(){
            this.showfilter = !this.showfilter
        },
        canInfo(val){
            if(val){
                this.QueryConfiguration[0].tableDate=this.QueryConfiguration[0].data.filter(item=>item.disabled)
            }else{
                this.QueryConfiguration[0].tableDate=this.QueryConfiguration[0].data
            }
           
        },
        setDefault(scope){
            this.dialogInfo = Object.assign({'txtName':scope.row.itemName,'index':scope.$index},JSON.parse(scope.row.defaultValue))
            this.centerDialogVisible=true
        },
        submit(formName){
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.setLoading=true
                    if(this.$route.params.id==='a'){
                        classPost.config_save(this.postdata)
                        .then((res)=>{
                                this.$confirm('保存成功', {
                                    showClose:false,
                                    closeOnHashChange:false,
                                    showCancelButton:false,
                                    confirmButtonText: '确定',
                                    type: 'success'
                                })
                                .then(() => {
                                    this.setLoading=false
                                    this.$router.push('/home/tradeManage/filterList')
                                })
                        })
                        .catch((err)=>{
                            console.log(err)
                            this.$confirm('保存失败,请重新提交', {
                                showClose:false,
                                closeOnHashChange:false,
                                showCancelButton:false,
                                confirmButtonText: '确定',
                                type: 'error'
                            }).then(()=>{
                                this.setLoading=false
                            })
                        })
                    }else{
                        let obj = Object.assign(this.postdata,{id:this.$route.params.id.split('&')[0]})
                        classPost.config_update(obj)
                            .then((res)=>{
                                    this.$confirm('保存成功', {
                                        showClose:false,
                                        closeOnHashChange:false,
                                        showCancelButton:false,
                                        confirmButtonText: '确定',
                                        type: 'success'
                                    })
                                    .then(() => {
                                        this.setLoading=false
                                        this.$router.push('/home/tradeManage/filterList')
                                    });
                            })
                            .catch((err)=>{
                                this.$confirm('保存失败,请重新提交', {
                                    showClose:false,
                                    closeOnHashChange:false,
                                    showCancelButton:false,
                                    confirmButtonText: '确定',
                                    type: 'error'
                                }).then(()=>{
                                    this.setLoading=false
                                })
                            })
                    }
                }else{
                    document.querySelector('#abcd').scrollIntoView({block: "end", behavior: "smooth"})
                }
             })
        },
        changeinfo(ind){
            this.QueryConfiguration[ind].showinfo=!this.QueryConfiguration[ind].showinfo
        },
        closeDialog(){
            const num = this.dialogInfo.index
            this.QueryConfiguration[0].data[num].defaultValue = JSON.stringify(this.dialogInfo)
            this.centerDialogVisible=false
        },
        get_default_list(){
            if( this.$route.params.id==='a'){
                classPost.filter_list({})
                    .then((res)=>{
                        this.QueryConfiguration[0].data = res.data.map((item)=>{
                            item.obj = {
                                showasCondition:item.asCondition,
                                showdisabled:item.disabled,
                                showsort:item.sort
                            }
                            item.asCondition = item.asCondition!=='0'?true:false
                            item.disabled = item.disabled!=='0'?true:false
                            return {...item}
                        })
                        this.QueryConfiguration[0].tableDate = this.QueryConfiguration[0].data 
                        this.setLoading=false
                    })
                    .catch((err)=>{
                        this.setLoading=false
                        console.log(err)
                    })
            }else{
                classPost.config_list( { id:this.$route.params.id.split('&')[0] })
                    .then((res)=>{
                            this.ruleForm.filtername = res.data[0].filterName
                            this.ruleForm.filternum = res.data[0].pageSize
                            this.isshowinput = res.data[0].showToolbar==='9'?false:true
                            this.ruleForm.filtershow = res.data[0].showToolbar!=='0'?true:false
                            this.QueryConfiguration[0].data = res.data[0].filterConfigItems.map((item)=>{ 
                                item.obj = {
                                    showasCondition:item.asCondition,
                                    showdisabled:item.disabled,
                                    showsort:item.sort
                                }
                                item.asCondition = item.asCondition!=='0'?true:false
                                item.disabled = item.disabled!=='0'?true:false
                                return {...item}
                            })
                            this.QueryConfiguration[0].tableDate = this.QueryConfiguration[0].data
                            this.setLoading=false
                    })
                    .catch((err)=>{
                        this.setLoading=false
                        console.log(err)
                    })
            }
        }
    },
    mounted() {
        this.get_default_list()
    },
    computed:{
        postdata(){
            let arr = []
            this.QueryConfiguration[0].data.forEach(item => {
                const obj = {
                    asCondition: item.obj.showasCondition==='9'?'9':item.asCondition?'1':'0',
                    defaultValue: item.defaultValue?item.defaultValue:'',
                    disabled: item.obj.showdisabled==='9'?'9':item.disabled?'1':'0',
                    itemNameEn:item.itemNameEn,
                    filterStyle:item.filterStyle,
                    itemFieldName: item.itemFieldName,
                    itemName: item.itemName,
                    type:'T',
                    sort:item.obj.showsort,
                    status:this.QueryConfiguration[0].isshow?'1':'0'
                }
                arr.push(obj)
            });
            return {
                defaultSet: this.$route.params.id!=='a'?this.$route.params.id.split('&')[2]:'0',
                deletedInd: this.$route.params.id!=='a'?this.$route.params.id.split('&')[1]:'0',
                filterName: this.ruleForm.filtername,
                pageSize: this.ruleForm.filternum,
                showToolbar: this.isshowinput?this.ruleForm.filtershow?'1':'0':'9',
                filterConfigItems: arr
            }
        }
    },
    data () {
        var num = (rule,value,callback)=>{
            if(!value){
                callback('请输入每页显示条数')
            }else{
                if(!Number.isInteger(value*1)){
                    callback('请输入正整数')
                }else if(value*1>100||value*1<0){
                    callback('请输入准确条数')
                }else{
                    callback()
                }
            }
        }
        return {
            setLoading:true,
            centerDialogVisible:false,
            setTradeInfo,
            false:false,
            dialogInfo:{},
            isshowinput:true,
            showfilter:true,
            ruleForm:{
                filtername:'',
                filternum:'',
                filtershow:true
            },
            rules:{
                filtername: [
                    { required: true, message: '请输入过滤器名称', trigger: 'blur' }
                ],
                filternum: [
                    { required: true, validator: num, trigger: 'blur' }
                ]
            },
            QueryConfiguration:[
                {
                    name:"交易信息查询配置",
                    isshow:false,
                    showinfo:true,
                    tableDate:[],
                    data:[]
                }
            ]
        }
    }
}  
</script>
<style>
.filterSet{
    margin-top: 20px;
    background: RGBA(255, 255, 255, 1);
    padding: 20px
}
.filterSet .content .head{
    display: flex;
    align-items: center;
    border-radius: 3px;
    border: 1px dashed black;
    padding: 0 20px;
    width: 160px;
    height: 40px;
}
.filterSet .el-dialog__body{
    padding: 10px 20px;
}
.filterSet .content .head .el-icon-back{
   margin-right: 10px;
   font-size: 16px
}
.filterSet .checkbox .el-checkbox-group{
    margin-top: 10px;
}
.filterSet .el-checkbox{
    margin-right: 30px;
    margin-left: 0;
    margin-bottom: 5px;
    font-weight: normal;
}
.filterSet .inputbox{
    display: flex;
    align-items: center;
    justify-content: center
}
.filterSet .selectbox{
     display: flex;
    align-items: center;
    justify-content: center
}
.filterSet .inputbox .el-input{
    width: 300px;
}
.filterSet .condition .el-card__header{
    height: 40px;
    display: flex;
    align-items: center;
    background:rgba(24, 144, 255, 0.1)!important;
}
.filterSet .condition h3{
    font-size: 16px
}
.filterSet .condition .el-card__header .title{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.filterSet .condition:nth-child(2) .el-card__body{
    padding: 5px 0 0 0;
}
.filterSet .condition .el-card__header .title span{
    font-size: 18px;
}
.filterSet .condition .content{
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    width: 350px;
}
.filterSet .condition{
    margin-top: 30px;
}
.hico{
    float: right; 
    padding: 3px 0;
    color:RGBA(110, 127, 148, 1);
    font-size: 20px;
}
.lhead{
    display: flex;
    justify-content: center;
}
.filterSet .condition .el-card__header .lhead span{
    font-size:16px;
    font-weight: bold;
}
.filterSet .condition .el-card__header .lhead div{
    margin-left: 30px;
    font-weight: 600px;
}
.lasts{
    background: white;
    width: 82.7%;
    padding: 5px 20px 5px 0;    
    position: fixed;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
}
.filterSet .el-table th{
    background:RGBA(24, 144, 255, 0.02)!important;
    color:rgba(0, 0, 0, 0.85)!important;
}
.filterSet .handle{
    color:RGBA(24, 144, 255, 1);
     cursor: pointer;
}
.filterSet .filterinfo{
    border-top: 1px solid #ccc;
}
.txtxs{
    padding: 10px 0 0 0;
    font-size: 14px;
}
</style>
