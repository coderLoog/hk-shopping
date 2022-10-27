module.exports = {

    //icon配置
        pwa : {
          iconPaths:{
              favicon32:"favicon.ico",
              favicon16:'favicon.ico',
              appleTouchIcon:'favicon.ico',
              maskIcon:'favicon.ico',
              msTileImage:'favicon.ico'
          }
        },
    // 基础路径
    publicPath: '/',
    // 开发服务器
    devServer: {
        // 代理
        proxy: {
            // 在路由中匹配的路径
            '/api': {
                target: 'http://demo.itlike.com/web/xlmc',   // 目标路径
                changeOrigin: true, // 允许跨域
                pathRewrite: {  // 重写
                    '^/api': '' // 将/api替换为空
                }
            },
            '/pay': {
                target: 'http://47.98.157.152/WXPayProject/pay',
                changeOrigin: true,
                pathRewrite: {
                    '^/pay': ''
                }
            }
        }
    }
}
