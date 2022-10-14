const Router = require('koa-router'); // 引入koa-router
const router = new Router()
// 指定一个url匹配
router.get('/index', async (ctx) => {
  ctx.type = 'html';
  ctx.body = '<h1>hello world3</h1>';
})
module.exports = router
