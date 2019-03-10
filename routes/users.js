const router = require('koa-router')()
const user = require('../app/controllers/user')

router.post('/login', user.login)
router.post('/signOut', user.signOut)

module.exports = router
