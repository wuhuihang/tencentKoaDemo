const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Blog = new Schema({
  id: Number,
  category: {
    type: String,
    require: true
  },
  publishTime: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true,
    default: ''
  },
  content: {
    type: String,
    require: true,
    default: ''
  },
  prevBlog: {
    id: Number,
    title: {
      type: String,
      default: ''
    }
  },
  nextBlog: {
    id: Number,
    title: {
      type: String,
      default: ''
    }
  }
})

module.exports = mongoose.model('Blog', Blog)
