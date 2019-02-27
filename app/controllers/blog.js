const Blog = require('../dbs/models/blog')

exports.getBlogs = async (ctx, next) => {
  try {
    let result = await Blog.find()
    ctx.body = {
      code: 0,
      data: result ? result : []
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      data: {}
    }
  }
}

exports.getBlog = async (ctx, next) => {
  try {
    let result = await Blog.findOne({ id: ctx.params.id })
    ctx.body = {
      code: 0,
      data: result ? result : {}
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      data: {}
    }
  }
}

exports.addBlog = async (ctx, next) => {
  let { publishTime, title, content } = ctx.request.body
  let year = publishTime.split('-')[0]
  let blogs = await Blog.find()
  let blog
  let addResult
  let editResult = true

  if (blogs.length !== 0) {
    let lastBlog = blogs[blogs.length - 1]
    lastBlogId = lastBlog.id
    lastBlogTitle = lastBlog.title
    blog = new Blog({
      id: lastBlogId + 1,
      year,
      publishTime,
      title,
      content,
      prevBlog: { id: lastBlogId, title: lastBlogTitle }
    })
    editResult = await Blog.update(
      { id: lastBlogId },
      {
        $set: {
          nextBlog: {
            id: lastBlogId + 1,
            title: title
          }
        }
      }
    )
  } else {
    blog = new Blog({
      id: 0,
      year,
      publishTime,
      title,
      content
    })
  }

  addResult = await blog.save()

  if (addResult && editResult) {
    ctx.body = {
      code: 0,
      msg: ''
    }
  } else {
    ctx.body = {
      code: -1,
      msg: 'fail'
    }
  }
}

exports.deleteBlog = async (ctx, next) => {
  await Blog.remove({ id: ctx.params.id }, function(err) {
    if (err) {
      ctx.body = {
        code: -1,
        data: {}
      }
    } else {
      ctx.body = {
        code: 0
      }
    }
  })
}

exports.updateBlog = async (ctx, next) => {
  let result = await Blog.update(
    { id: ctx.params.id },
    {
      $set: ctx.request.body
    }
  )
  if (result) {
    ctx.body = {
      code: 0,
      msg: ''
    }
  } else {
    ctx.body = {
      code: -1,
      msg: 'fail'
    }
  }
}
