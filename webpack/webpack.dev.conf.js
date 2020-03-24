const ifaces = require('os').networkInterfaces()
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    host: getMyIpV4Address(ifaces),
    port: '8081',
    overlay: {
      warnings: true,
      errors: true
    }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ]
}

module.exports = new Promise((resolve, reject) => {
  resolve(merge(baseWebpackConfig, devWebpackConfig))
})

function getMyIpV4Address (ifaces) {
  let myIpV4Address

  Object.keys(ifaces).forEach(dev => {
    ifaces[dev].filter(details => {
      if (details.family === 'IPv4' && details.internal === false) {
        myIpV4Address = details.address
      }
    })
  })

  return myIpV4Address
}
