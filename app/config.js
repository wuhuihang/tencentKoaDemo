module.exports = {
  dbs:
    process.env.NODE_ENV === "'development'"
      ? 'mongodb://127.0.0.1:27017/test'
      : 'mongodb://huihui:1106062107hH@127.0.0.1:27017/admin',
  tokenSecret: 'test'
  // ,redis:{
  //   get host(){
  //     return '127.0.0.1'
  //   },
  //   get port(){
  //     return 6379
  //   }
  // }
}
