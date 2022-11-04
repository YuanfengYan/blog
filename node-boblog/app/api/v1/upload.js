const qiniu = require('qiniu')
const ACCESS_KEY = 'Nktde-YGxmyXaVrFFgIebVzED854N7C4-c4VMfeJ';
const SECRET_KEY = 'tNy9TVFClSi1z87Vvpk7gAq7dZHoDBy3fXyim7XJ';
const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);

const { Auth } = require('@middlewares/auth');
const AUTH_ADMIN = 16;

const { Resolve } = require('@lib/helper');
const res = new Resolve();

const Router = require('koa-router')

const router = new Router({
    prefix: '/api/v1'
})

// 创建回复
router.post('/upload/token', new Auth(AUTH_ADMIN).m, async (ctx) => {
    // console.log('mac', mac)
    const options = {
        scope: 'kanananablog',
        expires: 7200
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    ctx.response.status = 200;
    const data = {
        token: putPolicy.uploadToken(mac)
    }
    ctx.body = res.json(data)
})

module.exports = router

