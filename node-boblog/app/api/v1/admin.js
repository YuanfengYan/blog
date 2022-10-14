const Router = require('koa-router'); // 引入koa-router
const router = new Router()
const { AdminDao } = require('@dao/admin');
const { Resolve } = require('@lib/helper');
const res = new Resolve();

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
module.exports = router
