// webpack.base.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)
module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'), // 入口文件
  // 打包文件出口
  output: {
    filename: 'static/js/[name].js', // 每个输出js的名称
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/' // 打包后文件的公共前缀路径
  },
  module: {
    rules: [
      // **loader**执行顺序是从右往左,从下往上（下方的use）
      {
        // exclude: [path.resolve(__dirname, '../node_modules')],
        include: [path.resolve(__dirname, '../src')], // 只对项目src文件的ts,tsx进行loader解析(缩小loader作用范围)
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        // **babel.config.js**是**babel-loader**的配置文件,会自动读取配置
        // thread-loader开启多线程也是需要启动时间,大约**600ms**左右,所以适合规模比较大的项目。
        // thread-loader放置在其他 **loader** 之前。放置在此 **loader** 之后的 **loader** 会在一个独立的 **worker** 池中运行
        use: ['thread-loader', 'babel-loader']
        // use: {
        //   loader: 'babel-loader',
        //   options: {
        //     // 预设执行顺序由右往左,所以先处理ts,再处理jsx
        //     presets: [
        //       [
        //         "@babel/preset-env", // **babel** 编译的预设,可以转换目前最新的**js**标准语法
        //         {
        //           // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        //           // "targets": {
        //           //  "chrome": 35,
        //           //  "ie": 9
        //           // },
        //           "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        //           "corejs": 3, // 配置使用core-js低版本
        //         }
        //       ],
        //       '@babel/preset-react', // 识别**jsx**语法
        //       '@babel/preset-typescript' // **ts**语法转换为 **js**
        //     ]
        //   }
        // }
      },
      // 如果node_moduels中也有要处理的语法，可以把js|jsx文件配置加上
      // {
      //  test: /.(js|jsx)$/,
      //  use: 'babel-loader'
      // }
      {
        test: /.(css|less)$/, //匹配 css和less 文件
        use: [
          'style-loader', // 把解析后的**css**代码从**js**中抽离,放到头部的**style**标签中(在运行时做的)
          'css-loader', // 解析**css**文件代码
          // {
          //   loader: 'postcss-loader', // 处理**css**时自动加前缀
          //   options: {
          //     postcssOptions: {
          //       plugins: ['autoprefixer'] // 决定添加哪些浏览器前缀到**css**中
          //     }
          //   }
          // },
          // **postcss.config.js**是**postcss-loader**的配置文件,会自动读取配置
          'postcss-loader', // 处理**css**时自动加前缀
          'less-loader' // 把**less**编译为**css**
        ]
      },
      // 处理图片文件
      {
        test:/.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/images/[name][ext]', // 文件输出目录和命名
        },
      },
      // 处理字体和媒体文件
      {
        test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/fonts/[name][ext]', // 文件输出目录和命名
        },
      },
      {
        test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/media/[name][ext]', // 文件输出目录和命名
        },
      }
    ]
  },
  resolve: {
    // 在引入模块时不带文件后缀时，会来该配置数组里面依次添加后缀查找文件
    extensions: ['.js', '.tsx', '.ts'],
    // 配置alias别名
    alias: {
      '@': path.join(__dirname, '../src')
    }
  },
  plugins: [
    // **webpack**需要把最终构建好的静态资源都引入到一个**html**文件中,这样才能在浏览器中运行
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    // 配置后会把值注入到业务代码里面去,webpack解析代码匹配到process.env.BASE_ENV,就会设置到对应的值
    // NODE_ENV默认有
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
    })
  ],
  cache: {
    // 第二次打包,通过对文件做哈希对比来验证文件前后是否一致,如果一致则采用上一次的缓存
    type: 'filesystem', // 使用文件缓存
  }
}
