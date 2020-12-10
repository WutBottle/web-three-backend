const mongoose = require('../db'); // 引入数据库连接模块
const Schema = mongoose.Schema; // 拿到当前数据库相应的集合对象

const modelDataSchema = new Schema({ // 设计用户集合的字段以及数据类型
  modelDesc: {type: String},
  modelImgName: {type: String},
  modelFileName: {type: String},
  modelTitle: {type: String},
  ownerId: {type: String},
  isPublic: {type: Boolean},
  date: {type: Date, default: Date.now},
})

module.exports = mongoose.model('modelData', modelDataSchema, 'modelData');