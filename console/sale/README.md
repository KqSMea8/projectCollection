# 口碑销售中台

## 环境

```
node = 4.x
```

## 代码风格

https://github.com/airbnb/javascript

## 开发流程

绑定 local.alipay.net 为 127.0.0.1

```
npm install tnpm@release-3 -g --registry=http://registry.npm.alibaba-inc.com
tnpm install
npm run start
```

访问 http://local.alipay.net:8008

## 服务器上调试

- 服务器代理本地端口调试需要先修改 `scripts > dev` 命令

```
"scripts": {
  "deploy": "rm -rf node_modules && tnpm install && qt deploy . kb",
  "start": "npm run local",
  "local": "dora -p 8001 --plugins atool-build?publicPath=/${npm_package_family}/${npm_package_name}/,proxy",
  "dev": "dora -p 8001 --plugins atool-build?publicPath=/${npm_package_family}/${npm_package_name}/${npm_package_version}/,proxy",
  "sit": "dora -p 8001 --plugins atool-build?publicPath=/g/${npm_package_family}/${npm_package_name}/${npm_package_version}/,proxy",
  "lint": "eslint --ext .js,.jsx src",
  "build": "rm -rf dist && atool-build --devtool=#source-map -o ./dist/${npm_package_family}/${npm_package_name}/${npm_package_version}/"
},
```

- 通过qingting工具，本地编译后服务器直接生效

  `npm run deploy`

- 通过本地代理调试（旧）

  本地执行 npm start

  浏览器代理到本地端口8989，chrome可以使用插件 [SwitchySharp](http://www.switchysharp.com/install.html)

  需要设置一个切换规则，如图

  ![img](https://os.alipayobjects.com/rmsportal/uDCByoXuPJbXTBY.png)

  证书问题：https://github.com/dora-js/dora-plugin-proxy/blob/master/docs/online-debug.md
  
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

然后到 http://gitlab.alipay.net/iat/kbservcenter/merge_requests 提交 mr, 指定相应人员 review, 根据反馈进一步修改提交.

由 review 人合并进主干后

```
git checkout master
git pull
```

更新自己主干结束本次需求开发。

### 切换代码源

```
git remote set-url origin URL
```
