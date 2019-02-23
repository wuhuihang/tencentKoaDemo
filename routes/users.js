const router = require('koa-router')()

router.prefix('/users')

router.get('/', function(ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/getRequest', function(ctx, next) {
  ctx.body = ctx.request
})

router.get('/get', function(ctx, next) {
  ctx.body = {
    username: '阿，希爸',
    age: 30
  }
})

router.post('/register', function(ctx, next) {
  ctx.body = ctx.request.body
})

module.exports = router
