const jwt = require('jsonwebtoken'); // 引入json web token
const mongoose = require('../db'); // 引入数据库连接模块
const Schema = mongoose.Schema; // 拿到当前数据库相应的集合对象

// 设计用户表的集合
const userSchema = new Schema({ // 设计用户集合的字段以及数据类型
  userId: String,
  username: String,
  password: String,
})
//秘钥
const signKey = 'this_is_zp_app';
//生成token
const setToken = function (username) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({
      username: username
    }, signKey, { expiresIn:  60 * 60 * 24 * 3 });
    console.log('token',token);
    resolve(token);
  })
}
//验证token
const verToken = function (token) {
  return new Promise((resolve, reject) => {
    var info = jwt.verify(token, signkey ,(error, decoded) => {
      if (error) {
        console.log(error.message)
        return
      }
      console.log(decoded)
    });
    resolve(info);
  })
}
module.exports = mongoose.model('user', userSchema);