const Koa = require('koa');
const parser = require('koa-bodyparser') //处理post参数解析
const cors = require('@koa/cors');//针对简单请求、预检请求分别处理不同的CORS头。
const InitManager = require("./core/init")
const ratelimit = require('koa-ratelimit');

require('module-alias/register') //别名注册

const app = new Koa();
// app.use(cors({
//   "origin":"*",
// }))
app.use(cors())
app.use(parser())

// const Router = require('koa-router'); // 引入koa-router
// const requireDirectory = require('require-directory')

// const router = new Router(); // 创建路由，支持传递参数

// 第一个参数参数固定为module，
// 第二个参数要加载的路由的文件路径
// 第三个参数：每次加载一个参数执行的函数
// const modules = requireDirectory(module, './api', {visit:ModuleLoad})
InitManager.initCore(app)

// 限流内存驱动，也可以缓存 Redis
// https://javascript.net.cn/articles/780
// 接口调用频率限制（Rate-Limiting）
// Rate limiter middleware for koa.
// https://github.com/koajs/ratelimit
const db = new Map();
app.use(ratelimit({
  driver: 'memory',
  db: db,
  duration: 60000,
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 100,
  disableHeader: false,
  whitelist: (ctx) => {
    // some logic that returns a boolean
  },
  blacklist: (ctx) => {
    // some logic that returns a boolean
  }
}));

app.listen(5000);
