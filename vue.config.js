const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerPort: 8887
      })
    ]
  }
}
