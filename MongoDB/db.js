const mongoose = require('mongoose');
const {database} = require('../config/index');
mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true }).then(r => {});

mongoose.connection.on('connected', () => {
  console.log('数据库连接成功')
})

mongoose.connection.on('disconnected', () => {
  console.log('数据库断开')
})

mongoose.connection.on('error', () => {
  console.log('数据库连接异常')
})

// 将此文件作为一个模块
module.exports = mongoose;