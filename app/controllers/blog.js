const Blog = require('../dbs/models/blog')

exports.getBlogs = async (ctx, next) => {
  let currentPage = parseInt(ctx.query && ctx.query.currentPage) || 1
  let pagesize = parseInt(ctx.query && ctx.query.pagesize) || 10
  try {
    let result = await Blog.find(
      {},
      { category: 1, id: 1, publishTime: 1, title: 1 }
    )
      .skip(--currentPage * pagesize)
      .limit(pagesize)
      .sort('publishTime')
    ctx.body = {
      code: 0,
      data: { list: result ? result : [], count: await Blog.find().count() }
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: '列表查询失败'
    }
  }
}

exports.getBlog = async (ctx, next) => {
  try {
    let result = await Blog.findOne({ id: ctx.params.id })
    if (result) {
      ctx.body = {
        code: 0,
        data: result
      }
    } else {
      ctx.body = {
        code: -1,
        data: {},
        msg: '博客不存在'
      }
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: e
    }
  }
}

exports.addBlog = async (ctx, next) => {
  let { category, publishTime, title, content } = ctx.request.body
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
      category,
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
      category,
      publishTime,
      title,
      content
    })
  }

  addResult = await blog.save()

  if (addResult && editResult) {
    ctx.body = {
      code: 0,
      msg: '创建成功'
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '创建失败'
    }
  }
}

exports.deleteBlog = async (ctx, next) => {
  await Blog.remove({ id: ctx.params.id }, function(err) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: '删除失败'
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '删除成功'
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
      msg: '编辑成功'
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '编辑失败'
    }
  }
}

exports.getDashboard = async (ctx, next) => {
  try {
    let result = await Blog.find({}, { category: 1, publishTime: 1 })
    if (result) {
      let curDate = new Date(Date.now() + 3600000 * 8)
      let year = curDate.getFullYear()
      let month = curDate.getMonth() + 1
      let line = {
        month: [],
        blogs: [0, 0, 0, 0, 0, 0]
      }
      let pie = []
      let pieObj = {}
      let categoryList = []
      for (let i = 0; i < 6; i++) {
        if (month < 1) {
          month = 12
          year--
        }
        line.month.push(`${year}-${(month < 10 ? '0' : '') + month--}`)
      }
      line.month.reverse()
      result.forEach(item => {
        let { category, publishTime } = item
        let yearMonth = publishTime.slice(0, 7)
        if (line.month.includes(yearMonth)) {
          let index = line.month.indexOf(yearMonth)
          line.blogs[index] = ++line.blogs[index]
        }
        if (!categoryList.includes(category)) {
          categoryList.push(category)
          pieObj[category] = 1
        } else {
          pieObj[category] = ++pieObj[category]
        }
      })
      for (key in pieObj) {
        pie.push({ name: key, value: pieObj[key] })
      }
      ctx.body = {
        code: 0,
        data: {
          newBlogs: line.blogs[5],
          line: line,
          pie: pie,
          date: curDate.toUTCString()
        }
      }
    } else {
      ctx.body = {
        code: -1,
        data: {},
        msg: '数据为空'
      }
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: e
    }
  }
}
