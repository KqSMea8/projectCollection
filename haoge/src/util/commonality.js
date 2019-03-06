// 获取当前时间 YYYY-MM-DD hh:mm:ss格式的时间
 export function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}
// 转化数字金钱化
export function fmoney(s, n=3)   
{   
   n = n >= 0 && n <= 20 ? n : 2;   
   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
   let l = s.split(".")[0].split("").reverse(),   
   r = s.split(".")[1],
   t = "";   
   for (var i = 0; i < l.length; i ++ ) {   
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
   }   
   r = r?`.${r}`:''
   return t.split("").reverse().join("") + r;   
}
//货币格式转换成数值
export function moneyToNumValue(val) {
    var num = val.trim();
    var ss = num.toString();
    if (ss.length == 0) {
        return "0";
    }
    return ss.replace(/,/g, "");
}
// 获取几个月后的时间戳 
/*
    @param {number} num 数字代表几个月之后 如果不输入返回当前时间戳
*/
export function futuremon(num){
    let data = new Date()
    let nowtime = data.getTime()
    if( num!==undefined ){
        let year = data.getFullYear()
        let month = data.getMonth()+num
        let day = data.getDate()
        let date = new Date(year,month,day)
        let time = date.getTime()
        return time
    }else{
        return nowtime
    }
    
}
// 时间戳转化成yyyy-mm-dd的时间
export function formatDateTime(inputTime) {    
    var date = new Date(inputTime);  
    var y = date.getFullYear();    
    var m = date.getMonth() + 1;    
    m = m < 10 ? ('0' + m) : m;    
    var d = date.getDate();    
    d = d < 10 ? ('0' + d) : d;    
    var h = date.getHours();  
    h = h < 10 ? ('0' + h) : h;  
    var minute = date.getMinutes();  
    var second = date.getSeconds();  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;   
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;    
}

export function downloadfile(file,fileName){
　　  const blob = new Blob([file],{type:"application/vnd.ms-excel"})
　　  if ('download' in document.createElement('a')) { // 非IE下载
　　    const elink = document.createElement('a')
        elink.download = fileName
　　    elink.style.display = 'none'
　　    elink.href = URL.createObjectURL(blob)
　　    document.body.appendChild(elink)
　　    elink.click()
　　    URL.revokeObjectURL(elink.href) // 释放URL 对象
　　    document.body.removeChild(elink)
　　  } else { // IE10+下载
　　    navigator.msSaveBlob(blob, fileName)
　　  }
}
// 转化时间格式
export function timeFordat(time){
    return time.split('-').join('')
}
// 转化时间显示格式
export function showtime (time) {
    return String.raw({raw:time},'','','','-','','-')
}
// 返回固定位数的随机数
export function random(num){
    var str = ''
    for(var i=0;i<num;i++){
        str+=Math.floor(Math.random()*10)
    }
    return str
}
// 返回不同币种的精确值
export function currencynum (str) {
    let num = ''
    JSON.parse(localStorage.current).forEach((item)=>{
        if(item.alphaCode==str){
            num = item.minorUnit
        }
    })
    return num
}

function  getExplorer() {
    var explorer = window.navigator.userAgent ;
    //ie 
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox 
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
    }
    //Opera
    else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
    }
    //Safari
    else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
    }
}
export function ExportExcel(tableid) {//整个表格拷贝到EXCEL中
    if(getExplorer()=='ie')
    {
        var curTbl = document.getElementById(tableid);
        var oXL = new ActiveXObject("Excel.Application");
        //创建AX对象excel 
        var oWB = oXL.Workbooks.Add();
        //获取workbook对象 
        var xlsheet = oWB.Worksheets(1);
        //激活当前sheet 
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        //把表格中的内容移到TextRange中 
        sel.select;
        //全选TextRange中内容 
        sel.execCommand("Copy");
        //复制TextRange中内容  
        xlsheet.Paste();
        //粘贴到活动的EXCEL中       
        oXL.Visible = true;
        //设置excel可见属性
        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
            console.log(fname)
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            //xls.visible = false;
            oXL.Quit();
            oXL = null;
            //结束excel进程，退出完成
            //window.setInterval("Cleanup();",1);
            idTmr = window.setInterval("Cleanup();", 1);
        }
    }
    else
    {
        tableToExcel(tableid);
    }
}
function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function() {
      var uri = 'data:application/vnd.ms-excel;base64,',
      template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g,
            function(m, p) { return c[p]; })}
        return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
      }
})()
/*将100000转为100,000.00形式*/
export function conversionNumber (money){
    if(money && money!=null){
        money = String(money);
        var left=money.split('.')[0],right=money.split('.')[1];
        right = right ? (right.length>=2 ? '.'+right.substr(0,2) : '.'+right+'0') : '.00';
        var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
        return (Number(money)<0?"-":"") + temp.join(',').split('').reverse().join('')+right;
    }else if(money===0){   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
        return '0.00';
    }else{
        return "";
    }
}
/*将100,000.00转为100000形式*/
export function undoNubmer(money){
    if(money && money!=null){
        money = String(money);
        var group = money.split('.');
        var left = group[0].split(',').join('');
        return Number(left+"."+group[1]);
    }else{
        return "";
    }
}

// 交易类型转换中文
export function statusZh(val){
    switch(val){
        case 'sale':
            return '消费';
        case 'refund':
            return '退款';
        case 'authorization':
            return '预授权';
        case 'capture':
            return '预授权完成';
        case 'auth_void':
            return '预授权撤销';
        case 'create_token':
            return 'token创建';
        case 'create_token_sale':
            return 'token创建并消费';
        case 'create_token_auth':
            return 'token创建并预授权';
        case 'token_sale':
            return 'token消费';
        case 'token_auth':
            return 'token预授权';
    }
}
// 状态转换中文
export function typeZh (val) {
    switch(val){
        case 'received':
            return '交易开始';
        case 'pending':
            return '处理中';
        case 'pending_review':
            return '待审核';
        case 'success':
            return '交易成功';
        case 'canceled':
            return '已撤销';
        case 'failed':
            return '交易失败';
        case 'expired':
            return '交易过期';
    }
}
export function easyCopy(p) {
　　var c = {};
　　for (var i in p) { 
　　　　c[i] = p[i];
　　　　}
　　return c;
}
// 退款状态
export function isRefund(val){
    switch(val){
        case 'FULL':
            return '全部退款'
        case 'NO':
            return '否'
        case 'PART':
            return '部分退款'
    }
}
// 支付方式
export function payType(val){
    switch(val){
        case 'scan_qr_code':
            return '二维码正扫支付'
        case 'quick_pass':
            return '快捷支付'
        case 'online_banking':
            return '网银支付'
        case 'atm':
            return '线下ATM机支付'
        case 'OTC':
            return '线下柜台支付'
        case 'atm_online':
            return '线上atm银行卡支付'
        case 'dcb':
            return '短信支付（接收）'
        case 'psms':
            return '短信支付（发送）'
        case 'e_wallet':
            return '钱包支付'
        case 'cashcard':
            return '点卡支付'
        case 'prepaid_credits':
            return '预付卡支付'
        case 'credit_card':
            return '国际信用卡'
        default:
            return val
    }
}
