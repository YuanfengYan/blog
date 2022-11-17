module.exports = {
  environment: 'dev',
  database: {
    dbName: 'blog',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456'
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时 * 24
    expiresIn: 60 * 60 * 24
  }
}
