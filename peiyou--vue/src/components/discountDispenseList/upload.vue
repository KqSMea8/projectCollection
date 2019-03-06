<template>
<div>
    <el-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
 </el-upload>
 <input type="file" value=""  id="file"  @change='onUpload'>
</div>
</template>

<script>
export default {
    data () {
        return {
            imageUrl: ''
        };
    },
    methods: {
        handleAvatarSuccess (res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload (file) {
            const isJPG = file.type === 'image/*' || 'excel' || '';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        onUpload (e) {
            let formData = new FormData();
            formData.append('file', e.target.files[0]);
            formData.append('type', 'test');
            this.$http.post('http://localhost:8087/upload', formData).then((res) => {
                console.log(res.body);
            });
            // $.ajax({
            //     url: '/ShopApi/util/upload.weixun',//这里是后台接口需要换掉
            //     type: 'POST',
            //     dataType: 'json',
            //     cache: false,
            //     data: formData,
            //     processData: false,
            //     contentType: false,
            //     success: (res) => {
            //         if (res.code === 200) {
            //             var img_tpl =`<div class="picture" style="width:108px;float:left;">
            //                 <img id="preview" src="${imgSrc}" style="width:48px;height:48px;float:left;background-size:cover;"/>
            //                 <span class="r-span" @click = "onDeletePicture()" style = "color:#49BDCC;display:block;float:left;margin-left:10px;line-height:48px;">删除</span>
            //             </div>`;
            //             $("#refund_img").after(img_tpl);
            //         }
            //     },
            //     error: function(err) {
            //         alert("网络错误");
            //     }
            // });
        }
    }
};
</script>

<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
