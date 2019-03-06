# 商家中心
# 所有发布crmhome版本变更上线，均须通知@赤邑 或 @河力完成。
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## 环境
```
node = 4.x
```


## 添加提交规范化工具
http://web.npm.alibaba-inc.com/package/commitizen
通过```git cz```代替```git commit``` 进行自动补充提交

```
npm install commitizen -g
```

## 代码风格

https://github.com/airbnb/javascript

## 开发流程

请先阅读[kb-crmhome开发流程规范](http://gitlab.alipay-inc.com/kbservcenter/kb-crmhome/issues/19)

绑定 local.alipay.net 为 127.0.0.1

```
npm install tnpm@release-3 -g --registry=http://registry.npm.alibaba-inc.com
tnpm install
npm run local
```

访问 http://local.alipay.net:8981/index.htm#你的子路由

## 服务器上调试

服务器代理本地端口调试需要先修改 `scripts > dev` 命令

```
"scripts": {
  "start": "npm run dev",
  "dev": "dora -p 8001 --plugins atool-build?publicPath=/${npm_package_family}/${npm_package_name}/${npm_package_version}/,proxy",
  "lint": "eslint --ext .js,.jsx src",
  "build": "rm -rf dist && atool-build -o ./dist/${npm_package_family}/${npm_package_name}/${npm_package_version}/"
  "tag": "node tag.js"
}
```

- 通过qingting工具，本地编译后服务器直接生效

  `qt deploy . kb`

- 通过本地代理调试

  本地执行 npm start

  浏览器代理到本地端口8989，chrome可以使用插件 [SwitchySharp](http://www.switchysharp.com/install.html)

  需要设置一个切换规则，如图

  ![img](https://os.alipayobjects.com/rmsportal/uDCByoXuPJbXTBY.png)

- 通过本地代理调试（新）

  新版本的 chrome 代理插件已经不能处理 https 请求，需要用新的方式代理资源
  
  - 本地执行 `npm run proxylocal` （第一次运行需要根据提示设置信任证书）

### 提交代码

自己从 master 新开一个分支开发

```
git checkout -b xx-feature
```

开发完成后,

```
git add --all
git commit -am "描述"
git pull --rebase origin master
// 解决冲突
git push origin xx-feature:xx-feature
```

然后到 http://gitlab.alipay-inc.com/kbservcenter/kb-crmhome/merge_requests 提交 mr, 指定相应人员 review, 根据反馈进一步修改提交.

由 review 人合并进主干后

```
git checkout master
git pull
```

### 发布
- 需要发布时打tag
调用npm run tag

- 发布线上版本
调用npm run tag pub

更新自己主干结束本次需求开发.
