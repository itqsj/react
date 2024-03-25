// webpack.prod.js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(baseConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  plugins: [
    // 复制文件插件
    // 开发环境已经在**devServer**中配置了**static**托管了**public**文件夹,在开发环境使用绝对路径可以访问到**public**下的文件,但打包构建时不做处理会访问不到
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: source => {
            return !source.includes('index.html') // 忽略index.html
          }
        },
      ],
    }),
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css' // 抽离css的输出目录和名称
    }),
  ],
  // 调试希望看到源代码,而不是编译后的代码(生产希望是编译后的代码)
  // devtool: 'eval-cheap-module-source-map'
})
