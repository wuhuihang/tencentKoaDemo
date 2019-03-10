const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  id: Number,
  userName: {
    type: String,
    require: true
  },
  hashedPassword: {
    type: String,
    require: true
  },
  salt: {
    type: String,
    require: true
  },
  role: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('User', User)
