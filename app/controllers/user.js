const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const config = require('../config')
const User = require('../dbs/models/user')

let encryptPassword = (password, salt) => {
  if (!password || !salt) return ''
  var salt = new Buffer(salt, 'base64')
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64')
}

exports.login = async ctx => {
  let userName = ctx.request.body.username || '',
    password = ctx.request.body.password || ''
  if (!userName || !password) {
    ctx.body = {
      code: -1,
      msg: '用户名或密码不能为空'
    }
    return
  }
  try {
    // let result = await User.findOne({ userName: userName })
    new User({
      userName: 'admin',
      hashedPassword:
        'QTThQypCeRKFR6YAB67APDrVzYZNiFfK7mjmWUVt8BBqiZDrliHiRA09zAu95nGxRInwzk4TVSlnZv/eulhU7w==',
      salt: 'whh'
    }).save()
    let result = {
      hashedPassword:
        'QTThQypCeRKFR6YAB67APDrVzYZNiFfK7mjmWUVt8BBqiZDrliHiRA09zAu95nGxRInwzk4TVSlnZv/eulhU7w==',
      salt: 'whh'
    }
    if (result) {
      let hashedPassword = result.hashedPassword,
        salt = result.salt,
        hashPassword = encryptPassword(password, salt)
      if (hashedPassword === hashPassword) {
        // ctx.session.user = userName
        const userToken = {
          name: userName,
          id: result.id
        }
        const token = jwt.sign(userToken, config.tokenSecret, {
          expiresIn: '2h'
        })
        ctx.body = {
          code: 0,
          data: { token: token },
          msg: ''
        }
      } else {
        ctx.body = {
          code: -1,
          msg: '用户名或密码错误'
        }
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '用户名或密码错误'
      }
    }
  } catch (error) {
    ctx.body = {
      code: -1,
      msg: '查询数据出错'
    }
  }
}

exports.signOut = async ctx => {
  // ctx.session.user = null
  ctx.body = {
    code: 0,
    msg: ''
  }
}
