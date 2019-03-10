const router = require('koa-router')()
const blog = require('../app/controllers/blog')

router.get('/outblogs', blog.getBlogs)

router.get('/outblogs/:id', blog.getBlog)

router.get('/blogs', blog.getBlogs)

router.get('/blogs/:id', blog.getBlog)

router.post('/blogs', blog.addBlog)

router.del('/blogs/:id', blog.deleteBlog)

router.put('/blogs/:id', blog.updateBlog)

module.exports = router
