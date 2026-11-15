<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> English | [简体中文](./README_zh-CN.md)

```
CAUTION: This program is related to VOCALOID CHINA, so the most of the documentations are written in Chinese. Sorry for inconvenience.
```

<h1 align="center">
<b>tdd-frontend</b>
</h1>

<div align="center">
Frontend of TianDian Daily (<a href="https://tdd.bunnyxt.com">https://tdd.bunnyxt.com</a>) using Vue.js, Ant Design and G2. Feel free to contact us via QQ group: <a href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a>！
</div>

## Introduction

[TianDian Daily](https://tdd.bunnyxt.com) is a personal project of bunnyxt, which hopes to enhance Vocaloid China related data exchange, providing complete and easily accessible data and data visualization for everyone who interests in VC data.

The project is made up with three different part, connect with center database, which are: 

- frontend: data presentation and interaction
- backend: data access api ([tdd-backend](https://github.com/bunnyxt/tdd-backend))
- spider: original data collection ([tdd-spider](https://github.com/bunnyxt/tdd-spider))

See the structure below

![TianDian Daily structure](./tdd-structure.png 'TianDian Daily structure')

## Development and API configuration

Use Node 22 (`nvm use`) and `npm ci`. Copy `.env.development.example` to
`.env.development.local`, set both `VUE_APP_API_BASE_URL` and
`VUE_APP_LEGACY_API_BASE_URL` to your backend, then run
`NODE_OPTIONS=--openssl-legacy-provider npm run serve`.
Both variables are required for serving or building. They accept an HTTP(S) URL
or a root-relative path and are embedded in the build; do not put secrets in them.

`npm run build` uses the explicit `.env.production` configuration. For a separate
environment, set both variables in `.env.<mode>.local` and use
`NODE_ENV=production NODE_OPTIONS=--openssl-legacy-provider npm run build -- --mode <mode>`.
Other modes have no production API fallback.
