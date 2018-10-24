import koaRouterApp from './router'
import parsebody from './libs/response'
import serverConfig from './serverConfig'
import md5 from './biz/utils/md5'
import dbFN from './db/dbFN'
import consts from './libs/consts'

const Koa = require('koa')
const koaBody = require('koa-body')
const KoaHelmet = require('koa-helmet') // 安全性相关的中间件

const app = new Koa()
let ENV = process.argv.splice(2, 1)[0] || 'development'
app.env = global.env = ENV
app.context.env = app.env
serverConfig.logFN(app)
app.context.$consts = global.$consts = consts
app.context.db = global.db = require('./db/connect').default(app).blogSequelize
app.context.entity = global.entity = require('./db/models').default(app)
app.context.parsebody = global.parsebody = parsebody
app.context.md5 = global.md5 = md5
app.context.findOne = dbFN.findOne
app.context.create = dbFN.create
app.context.findAndCountAll = dbFN.findAndCountAll
app.context.transaction = dbFN.transaction
app.context.op = require('sequelize').Op

// 常见9种安全隐患防御
app.use(KoaHelmet())
app.use(koaBody(serverConfig.koaBody))
app.use(serverConfig.reqParamsFN)
app.use(koaRouterApp.routes())

app.on('error', (err, ctx) => {
  // ErrLogger.error(`server error: ${err}. Context is ${JSON.stringify(ctx)}.`)
  console.log('--------', err)
  ctx.errLog.error('err---', err)
  ctx.response.body = ctx.parsebody('', -2, err)
})

app.listen(3000)
console.log('app started at port 3000...')
