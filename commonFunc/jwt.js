const {jwtSecret} = require('../config/index');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
//生成 token
const createToken = payload => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: 60 * 60 * 240 // 设置token的有效期 单位（秒）
  });
}

// 验证 token
const jwtAuth = expressJwt({
  secret: jwtSecret,
  algorithms: ["HS256"],
  credentialsRequired: true,
}).unless({
  path: ["/tokens/login"] //不需要校验的路径
});

module.exports = { jwtAuth, createToken };