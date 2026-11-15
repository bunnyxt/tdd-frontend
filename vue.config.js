const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { IgnorePlugin } = require('webpack');
const path = require("path");

for (const name of (['serve', 'build'].includes(process.argv[2])
  ? ['VUE_APP_API_BASE_URL', 'VUE_APP_LEGACY_API_BASE_URL'] : [])) {
  const value = process.env[name];
  if (!value || !/^(https?:\/\/[^\s/?#]+(?:\/[^\s?#]*)?|\/(?!\/)[^\s?#]*)$/.test(value)) {
    throw new Error(`${name} must be an explicit HTTP(S) URL or root-relative path for this mode`);
  }
}

// Only run the bundle analyzer when explicitly requested via `npm run analyz`
// (which sets npm_config_report). Otherwise a plain `npm run build` would start
// the analyzer server and pop open a browser tab every time.
const analyzerPlugins = process.env.npm_config_report
  ? [new BundleAnalyzerPlugin({ analyzerPort: 8887 })]
  : [];

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons.js')  // partial import icons
      }
    },
    plugins: [
      ...analyzerPlugins,
      new IgnorePlugin(/^\.\/locale$/, /moment$/),  // ignore moment.js locales
    ]
  },
  chainWebpack: config => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end();  // support i18n code block in single file component
  }
}
