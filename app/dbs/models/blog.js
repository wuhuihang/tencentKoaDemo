const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Blog = new Schema({
  id: Number,
  year: String,
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
  prevArchive: {
    id: Number,
    title: {
      type: String,
      default: ''
    }
  },
  nextArchive: {
    id: Number,
    title: {
      type: String,
      default: ''
    }
  }
})

module.exports = mongoose.model('Blog', Blog)
