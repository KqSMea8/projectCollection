var pkg = require('./package.json');
var exec = require('child_process').execSync;
var isPub = process.argv[2] === 'pub';
var version = pkg.version;

function tryExec(command) {
  try {
    exec(command);
  } catch (e) {
    console.log('');
  }
}

console.warn(`请确认版本号${version}, 版本不对请及时修改，发布不成功请联系master添加master权限`);

exec(`git fetch`);
tryExec(`git tag -d ${version}`);
tryExec(`git tag -d ${version}`);

if (isPub) {
  console.warn('即将发布线上版本');
  tryExec(`git tag -d ${version}`);
  version = `publish/${version}`;
}
tryExec(`git tag -d ${version}`);
tryExec(`git push origin :${version}`);
exec(`git tag ${version}`);
exec(`git push origin ${version}:${version}`);

console.warn(`发布完成，请到蜻蜓继续编译`);
