const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx371321e992a7d957',

    // 微信小程序 App Secret
    appSecret: 'ab0c8df390a19464736493611a2d3216',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: false,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: '172.21.0.11',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'jqzx8868716',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    serverHost: 'jiqizhixing.cn',
    tunnelServerUrl: 'https://tunnel.ws.qcloud.la',
    tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
    // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
    qcloudAppId: '1255987871',
    qcloudSecretId: 'AKIDiEVXKrCPK1Tq21cJZYHkxua0A3g3q0bq',
    qcloudSecretKey: '94kBON7dvymLkupWzDDyUnrgHdleIitq',
    wxMessageToken: 'bcdefgh'
}

module.exports = CONF
