const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { IgnorePlugin } = require('webpack');

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerPort: 8887
      }),
      new IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
  }
}
