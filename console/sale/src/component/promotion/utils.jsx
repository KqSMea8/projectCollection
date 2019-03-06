// 乘法
export function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {
    console.log(e);
  }
  try {
    m += s2.split('.')[1].length;
  } catch (e) {
    console.log(e);
  }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
}
export function accDiv(arg1, arg2) {
  let t1 = 0;
  let t2 = 0;
  let r1;
  let r2;
  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    console.log(e);
  }
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    console.log(e);
  }
  try {
    r1 = Number(arg1.toString().replace('.', ''));
    r2 = Number(arg2.toString().replace('.', ''));
    return accMul((r1 / r2), Math.pow(10, t2 - t1));
  } catch (e) {
    console.log(e);
  }
}

export function toEscape(html) {
  if (!html) {
    return html;
  }
  // 1.首先动态创建一个容器标签元素，如DIV
  let temp = document.createElement('div');
  // 2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
  temp.innerHTML = html;
  // 3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
  const output = temp.innerText || temp.textContent;
  temp = null;
  return output;
}


