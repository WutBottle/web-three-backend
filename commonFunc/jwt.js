const {jwtSecret} = require('../config/index');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {clearBlackList} = require('./blackList');
const {tokenInBlackList} = require('./blackList');
//生成 token
const createToken = payload => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: 60 * 60 * 240 // 设置token的有效期 单位（秒）
  });
}

// 每次验证的回调
const isRevokedCallback = (req, payload, done) => {
  if(tokenInBlackList(req.headers.authorization)) {
    return done(null, true)  // token在黑名单中则不通过
  }else {
    return done(null, false)  // token不在黑名单中则通过
  }
}

// 验证 token
const jwtAuth = expressJwt({
  secret: jwtSecret,
  algorithms: ["HS256"],
  credentialsRequired: true,
  isRevoked: isRevokedCallback,
}).unless({
  path: ["/tokens/login", "/tokens/register"] //不需要校验的路径
});

// 重置token黑名单
clearBlackList();

module.exports = { jwtAuth, createToken };