/**
 * webpack.config.js webpack的配置文件
 *  作用：指示webpack做哪些事情（当你运行webpack指令时，会加载里面的配置）
 * 
 *  所有构建工具都是基于nodejs平台运行～模块化默认采用commonjs
 * 
 *  打包命令：webpack5需要全局安装webpack、webpack-cli才能使用webpack；局部安装使用npx webpack
 * 
 *  loader使用：1下载；2使用
 *  plugins使用：1下载；2引入；3使用
 */

const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 构造函数
const path = require('path')

const config = {
    /**
     * 1、入口entry，用法:
     * （1）单入口语法：entry:string
     * （2）多页面应用程序：（对象语法）entry:{a: string path; b: string path}
     */
    entry: './src/index.js',
    /**
     * 2、出口output，用法：值为object，包含filename(输出文件的文件名)、path(目标输出目录的绝对路径)
     * __dirname，nodejs的变量，代表当前文件【所属目录】的绝对路径
     * __filename，nodejs的变量，代表【当前文件】的绝对路径
     */
    output: {
        filename: 'js/build.js', // 输出到build/js文件夹
        path: resolve(__dirname, 'build')
    },
    // 3、loader的配置
    module: {
        rules: [
            // 详细的loader配置
            {
                // 匹配哪些文件
                test: /\.css$/,
                // 使用哪些loader进行处理，use数组，执行顺序：从后到前
                use: [
                    'style-loader', // 创建style标签，将js中的样式资源，插入到head中生效(即将css-loader解析后的内容挂载到html页面中)
                    'css-loader', // 将css文件变成commonjs模块，加载到js文件中，里面内容是样式字符串
                ]
            },
            {
                // 匹配哪些文件
                test: /\.less$/,
                // 使用哪些loader进行处理，use数组，执行顺序：从后到前
                use: [
                    'style-loader', // 创建style标签，将js中的样式资源，插入到head中生效(即将css-loader解析后的内容挂载到html页面中)
                    'css-loader', // 将css文件变成commonjs模块，加载到js文件中，里面内容是样式字符串
                    'less-loader', // 将less文件编译为css文件
                ]
            },
            {
                test: /\.(jpg|png|gif)$/, // 问题：处理不了html中的img图片
                type: "asset",
                parser: {
                    // 转为base64的条件:小于40kb，转为base64打包到build.js中，否则打包为一个个图片资源
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 40kb
                    },
                },
                // 设置打包目录
                generator: {
                    filename: 'imgs/[name].[hash:10][ext]', //打包后输出name:001.d12074a035.jpg
                }
            },
            // {
            //     test: /\.(jpg|png|gif)$/, // 问题：处理不了html中的img图片
            //     use: [{
            //         loader: 'url-loader', // 需要下载url-loader、file-loader
            //         options: {
            //             // 图片大小小于8kb，就会被base64处理；优点：减少请求数量，减轻服务器压力；缺点：图片体积变大，文件请求数量变慢
            //             limit: 8 * 1024,
            //             /**
            //              * 使用url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
            //              * 问题：打包后解析文件图片路径为[object Module]
            //              * 解决：关闭url-loader的es6模块化，使用commonjs解析
            //              */
            //             esModule: false,
            //             // 图片重命名。ext：取文件原扩展名，名字长体积大
            //             name: 'imgs/[name].[hash:10][ext]'
            //         },
            //     }],
            // },
            {
                test: /\.html$/,
                loader: 'html-loader', // 处理html中的img图片，（负责引入img，从而能被url-loader处理）
            },
            // 打包其他资源（除了js.|css.|html之外）
            {
                exclude: /\.(js|css|less|html|jpg|png|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[hash:10].[ext]',
                        outputPath: 'media', // 输出到build/media下
                    }
                }],
            }
        ]
    },
    // 4、plugins的配置
    plugins: [
        /**
         * html-webpack-plugin，功能：创建一个空的html，自动引入打包输出的所有资源；
         * 参数config:{}
         */
        new HtmlWebpackPlugin({
            template: './src/index.html', // 复制./src/index.html文件，并自动引入打包输出的所有资源
        })
    ],
    // 5、mode
    mode: 'development',
    // mode: 'production'
    /**
     * 开发服务器devServer
     * 特点：只会在内存中编译打包，不会有任何输出。（使用webpack-dev-server服务器启动时，打包生成的文件在内存中，而使用webpack命令打包生成的bundle.js默认是在build目录下，页面引用的时候路径不同）
     * webpack5.0改了~不支持inline，也不支持contentBase这些
     * 
     * 启动devServer命令：npx webpack-dev-server
     */
    devServer: {
        // 项目构建后目录
        // static: {
        //     directory: resolve(__dirname, 'build')
        // },
        watchFiles: ['./src/index.html'],
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 3000,
        // 自动打开浏览器
        open: true
    }
}

module.exports = config