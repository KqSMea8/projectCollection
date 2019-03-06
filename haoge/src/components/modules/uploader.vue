<template>
    <div id="upimg">
         <div class="btn">选择文件 <input :accept="types" type="file" @change="checkimg" id="files" name="file1" class="upload" /></div>
        <!-- <div class="check" @click="uploadPic">上传图片</div> -->
    </div>
</template>
<script>
import { mapState } from 'vuex';
import classPost from '../../servies/classPost'
export default {
    name:'uploader',
    data () {
        return {
            // userAgent: navigator.userAgent,//浏览器环境
            imgSrc:'',//获取图片路径
            isimg:true
        }
    },
    props:['types'],
    computed:{
        ...mapState({
            'upimgbase': state => state.upload.upimgbase
        }) // 上传图片的数组和展示图片的数组
    },
    mounted(){
        // 判断当前浏览器是否为IE 如果是挂在上ie下的转换方法
    //     let { userAgent, imgSrc } = this
    //     if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1) {
    //         let x= new ActiveXObject("Msxml2.XMLHTTP.6.0");
    //         x.onreadystatechange=function() {
    //             if (x.readyState < 4)return;
    //             let xml_dom = new ActiveXObject("MSXML2.DOMDocument");
    //             let tmpNode = xml_dom.createElement("tmpNode");
    //             tmpNode.dataType = "bin.base64";
    //             tmpNode.nodeTypedValue = x.responseBody;
    //             let base64string = tmpNode.text.replace(/\n/g, "");
    //             imgSrc = "data:image/jpeg;base64,"+base64string;
    //         };
    //     }
    //   console.log(this.upimgbase)
    //   console.log(this.showimg)
    },
    methods:{
        checkimg (e) {
            // 接触浏览器默认行为
            if(e.preventDefault){
                e.preventDefault();
            }else{
                window.event.returnValue=false;
            }
            // let judgereg = /^.*[^a][^b][^c]\.(?:png|jpg|bmp|gif|jpeg)$/
            // let values = document.getElementById('files').value;
            // let filename = values.substring(values.lastIndexOf("\\")+1);
            // let filetype = values.substring(values.lastIndexOf(".")+1);
            // let {userAgent, showimg, imgSrc, upimgbase} = this;
             let dispatch = this.$store.dispatch
            // this.isimg=true
            // if( !judgereg.test(values) ){
            //   this.isimg = false
            // }
            //     if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1) {
            //         showimg.push(values)
            //         x.open("GET",values,true);
            //         x.send("");
            //         imgSrc = imgSrc.replace(/\+/g, "%2B");
            //         imgSrc = imgSrc.replace(/\&/g, "%26");
            //         let obj = {
            //             upimg:{
            //                 "base":imgSrc,
            //                 "filename":filename,
            //                 "type":filetype
            //             },
            //             showimg:values
            //         }
            //         dispatch('addbase',obj)
            //     }else{
            let fileList = document.getElementById('files').files[0];
            // let imgurl =  window[window.URL ? 'URL' : 'webkitURL']['createObjectURL'](fileList);
            // let upimg = {
            //         "base":imgurl,
            //         "filename":fileList.name,
            //         "filetype":fileList.type,
            //         "filesize":fileList.size,
            //         "fileSelectTime":fileList.lastModifiedDate,
            //         fileList
            //     }    
            
            dispatch('addbase',{'file':fileList})
                //     let r = new FileReader();
                //     r.readAsDataURL(fileList);
                //     r.onload = function(){
                //         let imgbase = this.result
                //         imgbase = imgbase.replace(/\+/g, "%2B");
                //         imgbase = imgbase.replace(/\&/g, "%26");
                        
                //     }
                // }


        },
        // uploadPic(){
        //     classPost.upimg({"data":this.upimgbase})
        //     .then((res)=>{
        //         console.log(res)
        //     }).catch((err)=>{
        //         console.log(err)
        //     })
        // }
    }
}
</script>
<style>
    .btn,.check{
        width: 70px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background-color: rgba(22, 155, 213, 1);
        color: white;
        border-radius: 4px;
        position: relative;
    }
    .btn .upload{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
    .el{
        display: inline-block;
        width: 200px;
        height: 200px;
        position: relative;
    }
    .el img{
        width: 100%;
        height: 100%;
    }
    .el i{
        position: absolute;
        right: 0;
        top: 0;
        width: 15px;
        height: 20px;
        background: skyblue;
        border-bottom-left-radius: 100%;
        font-size: 12px;
        color: white;
        padding-left: 5px;
        line-height: 16px;
        opacity: 0;
        transition: opacity 1s;
    }
    .el:hover i{
        opacity: 1;
    }
</style>
