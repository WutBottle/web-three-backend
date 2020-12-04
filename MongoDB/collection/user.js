const mongoose = require('../db'); // 引入数据库连接模块
const Schema = mongoose.Schema; // 拿到当前数据库相应的集合对象

// 设计用户表的集合
const userSchema = new Schema({ // 设计用户集合的字段以及数据类型
  userId: String,
  username: String,
  password: String,
})

module.exports = mongoose.model('user', userSchema);