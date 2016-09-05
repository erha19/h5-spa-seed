# 部署说明

## 运行

首先进入要存放文件的文件夹路径

运行`npm install`安装运行依赖

运行`bower install`安装前端依赖

安装完毕后可运行

`npm start` --开发模式

`npm run build` --编译模式（将项目文件输出为上线文件）

运行过一次`npm start`，后期可以直接用`gulp serve`进入快速开发模式

## 相关资料

- 库函数

[Dot.js](http://olado.github.io/doT/index.html) -- 全局的模板工具，注意区分`Compile time evaluation`和`Runtime evaluation`

[Router](https://github.com/progrape/router) -- 全局路由

[Zepto](https://github.com/madrobby/zepto) -- DOM操作


## 框架目录

主要功能目录

* gulp 脚本管理
* src  项目源文件
* vendor.base.json 前端启动依赖文件(打包会随源文件一同压缩)，在使用`bower`或者`npm`安装了新模块后，相关的文件需要写进该文件内，文件会被工程自动打包进`src/vendor/vendor.js`
* package.json 编译模块依赖文件以及项目配置--新增模块请注意加上 `npm install --save-dev 新安装模块`

## 源文件

### app目录

主要文件

* assets   静态资源文件`*.{gif,jpg,png...}`
* chat     等页面业务相关模块
* lib      存放工具函数
* index.js 全局入口文件
* resource 定义API与存放全局数据
* router   定义Router属性


## Issue

* 如果需要修改`index.html`中js的加载顺序，可以进入`/gulp/base.js:99`修改相关配置
* `npm install`过程出现其他异常请尝试更新node版本或执行`npm update npm -g`
* gulp文件执行需要在`node --harmony`模式执行,请设置`alias node = "node --harmony"`默认执行

### Gulp

目录结构

--gulp

* --base.js    配置基本项目依赖
* --build.js   生成上线版本脚本
* --config.js  全局配置文件
* --server.js  代理服务器/服务器启动脚本

详细配置见文件注释

