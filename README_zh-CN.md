<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [English](./README.md) | 简体中文

<h1 align="center">
<b>tdd-fronted</b>
</h1>

<div align="center">
天钿Daily（<a href="https://tdd.bunnyxt.com">https://tdd.bunnyxt.com</a>）的前端部分，基于Vue.js、Ant Design以及G2。QQ群：<a href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a>，欢迎加入！
</div>

## 简介

[天钿Daily](https://tdd.bunnyxt.com)为bunnyxt的个人项目，意在推进VC相关数据交流，为任何对VC数据感兴趣的用户提供尽可能完备且易得的数据及其可视化展示。

整个项目天然解耦为三个部分，通过中心数据库相连，这三个部分分别是：

- 前端：数据展示与交互 
- 后端：数据获取接口（[tdd-backend](https://github.com/bunnyxt/tdd-backend)) 
- 爬虫：原始数据采集 ([tdd-spider](https://github.com/bunnyxt/tdd-spider)) 

整体结构如图所示

![天钿Daily整体结构](./tdd-structure.png '天钿Daily整体结构')

本仓库为天钿Daily项目的前端部分，即访问<https://tdd.bunnyxt.com>用户所看到的与之交互的部分，基于Vue.js，使用Ant Design框架，加上G2可视化工具，并进行了一系列针对移动端的适配。网站本身主要由以下几个部分组成：

- [视频](https://tdd.bunnyxt.com/video)，根据条件对视频进行搜索、筛选、排序，查看视频详情以及历史数据趋势、互动比例、排名信息等
- [UP主](https://tdd.bunnyxt.com/member)，根据条件对UP主进行搜索、筛选、排序，查看UP主详情以及其参与的视频列表、粉丝趋势、所有投稿的总数据趋势等
- [排行](https://tdd.bunnyxt.com/rank)，提供周榜、月榜等阶段的数据统计、排名

## 快速开始

1. 安装`Node.js`以及`npm`。具体需要的版本没有仔细研究过，我本地用的开发环境是`Node.js v12.18.2`以及`npm 6.14.6`，最新版本的应该也没问题
2. 克隆仓库，`git clone https://github.com/bunnyxt/tdd-frontend.git && cd tdd-frontend`
3. 填写配置，在`src/config/index.js`中，目前只需要填写`recaptchaSiteKey`，即配置[Google reCAPTCHA](https://www.google.com/recaptcha/about/)所用的客户端密钥
4. 安装依赖，`npm install`，这一步可能会花一点时间
5. 本地启动，`npm run serve`，默认会在`http://127.0.0.1:8080`启动开发环境，支持热加载
6. 打包构建，`npm run build`，最终产物存放于`dist`文件夹下，即可用于部署

## 项目结构

// TODO 项目中各目录的内容

## 开发指南

// TODO 一些约定，规则等

### 部分引入Ant Design的图标

Ant Design默认引入了所有的图标，打包后占据空间过大，实际上本项目只用到了一小部分图标，因此只需要部分引入即可。Ant Design官方没有给出部分引入的API，但参考<https://github.com/vueComponent/ant-design-vue/issues/1896#issuecomment-600530820>和<https://github.com/ant-design/ant-design/issues/12011#issuecomment-420038579>，可以通过以下方式实现部分引入。

第一步，新建文件`src/icons.js`，在里面将所有需要引入的图标，按照以下形式列出来。注意，包含Ant Design组件本身使用的图标，以及天钿Daily项目用到的图标，两个部分。

```javascript
export {
  default as TableOutline
} from '@ant-design/icons/lib/outline/TableOutline';
```

注意，我们项目中使用图标的方式是类似`<a-icon type="line-chart">`这样的，只需要制定图标类型`type`即可，而实际上我们并不清楚这个`line-chart`对应的是在哪个图标文件中，因此我编写了`script/get_icon_export.py`脚本，可以方便地根据图标类型`type`生成对应的`export`代码，使用方式如下所示：

```shell
$ python get_icon_export.py line-chart
export {
  default as LineChartOutline
} from '@ant-design/icons/lib/outline/LineChartOutline';
```

将输出的内容复制粘贴到`src/icons.js`文件内即可。注意，该脚本当前只支持线框风格（outline）的图标。

第二步，在`vue.config.js`文件中，添加以下配置：

```javascript
const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons.js')  // partial import icons
      }
    },
  }
}
```

到此为止，即可实现图标部分引入了。

注意，每次使用之前没用过的新图标时，都要按照此方式添加图标引入。

## 声明

本项目为本人的业余项目，限于能力与精力，项目本身难免存在很多疏漏，不能保证代码质量，欢迎各位大佬指点。

如果你对我或者我的项目感兴趣，欢迎通过以下方式联系我：

- 新浪微博 [@牛奶源29](https://www.weibo.com/nny29)
- Twitter [@bunnyxt29](https://twitter.com/bunnyxt29)
- Email <a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>

by. bunnyxt 2021-08-04
