function submitForm(formName, success, error) {
    this.$refs[formName].validate((valid) => {
        if (valid) {
            success(this.$refs[formName].$children);
        } else {
            error();
            return false;
        }
    })
}

function getSubmitJson(children) {
    var submitJson = {};
    for (let i = 0; i < children.length; i++) {
        if (children[i].$options.propsData.prop) {
            submitJson[children[i].$options.propsData.prop] = children[i].fieldValue
        }
    }
    return submitJson;
}

function reset(formName) {
    this.$refs[formName].resetFields();
}

//            验证码倒计时
function timeOver(form){
    let time=60;
    let str='s后重新发送';
    form.text=time+str;
    let t=setInterval(function () {
        --time;
        form.text=time+str;
    },1000);
    setTimeout(function () {
        clearInterval(t);
        form.text="获取验证码";
        form.status=true;
    },60000);
}

export {
    submitForm,
    getSubmitJson,
    reset,
    timeOver
}
