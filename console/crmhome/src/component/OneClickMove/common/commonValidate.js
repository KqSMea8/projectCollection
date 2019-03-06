export const blockInvalidLetter = (r, v, cb) => {
  if (v && /[\\"]/.test(v)) {
    return cb('请勿输入特殊字符（英文双引号"反斜杠\\）');
  }
  cb();
};
