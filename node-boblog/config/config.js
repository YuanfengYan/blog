module.exports = {
  environment: 'dev',
  database: {
    dbName: 'blog',
    // host: 'localhost',
    host: '139.224.18.211',
    port: 3306,
    user: 'root',
    password: 'yanyuanfeng123'
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时 * 24
    expiresIn: 60 * 60 * 24
  }
}
