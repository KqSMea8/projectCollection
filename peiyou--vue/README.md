# peiyou

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

"quotes": [
            "error",
            "single"
        ],//字符串必须使用单引号
      "semi": [2, "always"],//语句强制分号结尾
      "indent": [2, 4],//缩进风格
      "eqeqeq": 2,//必须使用全等
      "eol-last": 2,//文件以单一的换行符结束
      "curly": [2, "all"],//必须使用 if(){} 中的{}
      "camelcase": 2,//强制驼峰法命名
      "consistent-this": [2, "that"],//this别名
      "no-unused-vars": [2],//不能有声明后未被使用的变量或参数
      "no-alert": 0,//禁止使用alert confirm
      "no-new": 0,
      "no-undef": 0