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

exports.getLatestBlogs = async (ctx, next) => {
  try {
    let result = await Blog.find({}, { id: 1, publishTime: 1, title: 1 }).sort(
      'publishTime'
    )
    ctx.body = {
      code: 0,
      data: { list: result ? result.reverse().slice(0, 3) : [] }
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      msg: '查询博客失败'
    }
  }
}

exports.getBlog = async (ctx, next) => {
  try {
    let result = await Blog.findOne({ id: ctx.params.id })
    let blogs = await Blog.find({}, { id: 1, title: 1 })
    let ids = blogs.map(item => item.id)
    let blogsLast = blogs.length - 1
    let blogIndex = ids.indexOf(parseInt(ctx.params.id))
    let blogBottom = {
      prevBlog: {
        title: blogIndex < 1 ? '' : blogs[blogIndex - 1].title,
        id: blogIndex < 1 ? '' : blogs[blogIndex - 1].id
      },
      nextBlog: {
        title: blogIndex === blogsLast ? '' : blogs[blogIndex + 1].title,
        id: blogIndex === blogsLast ? '' : blogs[blogIndex + 1].id
      }
    }
    if (result) {
      ctx.body = {
        code: 0,
        data: Object.assign(result, blogBottom)
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
  let blogs = await Blog.find({}, { id: 1 })
  let lastBlog = blogs.slice(-1)[0]
  let blog = new Blog({
    id: lastBlog ? lastBlog.id : 0,
    category,
    publishTime,
    title,
    content
  })
  let result = await blog.save()

  if (result) {
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
