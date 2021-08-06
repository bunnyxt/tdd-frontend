const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { IgnorePlugin } = require('webpack');
const path = require("path");

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons.js')  // partial import icons
      }
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerPort: 8887
      }),
      new IgnorePlugin(/^\.\/locale$/, /moment$/),  // ignore moment.js locales
    ]
  }
}
