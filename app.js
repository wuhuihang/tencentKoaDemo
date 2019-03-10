const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongoose = require('mongoose')
const jwt = require('koa-jwt')
const tokenError = require('./app/middlreware/tokenError')
const config = require('./app/config')

const index = require('./routes/index')
const blogs = require('./routes/blogs')
const users = require('./routes/users')

// error handler
onerror(app)

mongoose.connect(config.dbs, {
  useNewUrlParser: true
})

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('-------connect-------')
})

// middlewares
app.use(tokenError())
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
  jwt({
    secret: config.tokenSecret
  }).unless({
    path: [/^\/login/, /^\/signOut/, /^\/outblogs/]
  })
)

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(blogs.routes(), blogs.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
