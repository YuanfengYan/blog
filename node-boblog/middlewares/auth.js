const basicAuth = require('basic-auth') //自动解析header中authorization的值
const jwt = require('jsonwebtoken')

class Auth {
  constructor(level) {
    this.level = level || 1;

    Auth.USER = 8;
    Auth.ADMIN = 16;
    Auth.SPUSER_ADMIN = 32;
  }
  getAuthorization(ctx){
    // console.log('ctx',ctx);  //结果
    let auth = ctx.request.header.authorization;    //http header的值
    auth = auth.split(' ')[1];  //有"basic "的前缀，用split分割空格取值
    auth = Buffer.from(auth, 'base64').toString().split(':')[0];    //解析base64，转化为字符串，而且他有一个“:”的符号，需要分割
    // console.log(auth);  //结果
    return auth
  }
  get m() {
    // token 检测
    // token 开发者 传递令牌
    // token body header
    // HTTP 规定 身份验证机制 HttpBasicAuth
    return async (ctx, next) => {
      const tokenToken = basicAuth(ctx);
      let errMsg = "无效的token";
      // 无带token
      if (!tokenToken || !tokenToken.name) {
        errMsg = "需要携带token值";
        throw new global.errs.Forbidden(errMsg);
      }

      try {
        var decode = jwt.verify(tokenToken.name, global.config.security.secretKey);

      } catch (error) {
        // token 不合法 过期
        if (error.name === 'TokenExpiredError') {
          errMsg = "token已过期"
        }

        throw new global.errs.Forbidden(errMsg);
      }

      if (decode.scope < this.level) {
        errMsg = "权限不足"
        throw new global.errs.Forbidden(errMsg);
      }

      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }

      await next()
    }
  }

}

module.exports = {
  Auth
}
