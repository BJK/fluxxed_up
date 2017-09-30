const webpackConfig = require('./webpack.config.js')
webpackConfig.devtool = 'inline-source-map'
webpackConfig.watch = true

module.exports = function(config) {
  config.set({
    basePath: '',
    webpack: webpackConfig,
    frameworks: ['es5-shim', 'mocha', 'chai', 'sinon-chai', 'chai-jquery', 'jquery-2.1.0'],
    files: [
      './test/index.js'
    ],
    preprocessors: {
      './test/index.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    client: {
      mocha: {
        reporter: 'html',
        ui: 'bdd'
      }
    }
  })
}
