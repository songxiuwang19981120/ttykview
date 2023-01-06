let url

if (process.env.NODE_ENV == "development") {
    // 开发环境中
    url = "http://192.168.4.30:8087/api/"
} else {
    // 生产环境中
        url = "http://192.168.4.30:8087/api/"

    // url = "http://47.245.30.4:8086/api/"
}
export default {
    'BASE_URL': url,
    'TIMEOUT': 60000,
    'TOKEN_NAME': 'ua_jot',
    'PUBKEY_NAME': 'ua_publicKay',
    'USERINFO': 'ua_userinfo',
  }