const Router = require('koa-router'); // 引入koa-router
// const router = new Router()
const { AdminDao } = require('@dao/admin');
const { Resolve } = require('@lib/helper');
const res = new Resolve();
const { LoginManager } = require('@service/login');
const { Auth } = require('@middlewares/auth');
const AUTH_ADMIN = 16;

const router = new Router({
  prefix: '/api/v1/admin'
})
// 指定一个url匹配
router.get('/register', async (ctx) => {
  const [err, data] = await AdminDao.create({
    email: "test1@163.com",//v.get('body.email'),
    password: "1234567890",//v.get('body.password2'),
    nickname: "test1",//v.get('body.nickname')
  });
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(data);

  } else {
    ctx.body = res.fail('err');
  }
})
// 管理登录
router.post('/login', async (ctx) => {
  const reqBody = ctx.request.body
  // const v = await new AdminLoginValidator().validate(ctx);
  const [err, token] = await LoginManager.adminLogin({
    email: reqBody.email,//v.get('body.email'),
    password: reqBody.password,//v.get('body.password')
  })
  console.log([err, token])

  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.json({ token });
  } else {
    ctx.body = res.fail(err, err.msg);
  }
});

// 获取用户信息
router.get('/auth', new Auth(AUTH_ADMIN).m, async (ctx) => {
  // 获取用户ID
  console.log('获取用户信息')
  const id = ctx.auth.uid;

  // 查询用户信息
  let [err, data] = await AdminDao.detail(id);

  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(data)
    // permissions,
    // username,
    // 'avatar|1': [
    //   'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
    //   'https://i.gtimg.cn/club/item/face/img/8/15918_100.gif',
    // ],
  } else {
    ctx.body = res.fail(err)
  }
})
module.exports = router
