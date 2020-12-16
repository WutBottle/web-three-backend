const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const user = require('../MongoDB/collection/user');
const {createToken} = require('../commonFunc/jwt')
// 获取post请求的参数
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.post('/login', (req, res) => {
  //是否合法的参数
  const {username, password} = req.body;
  if (username == null || username.trim() === '' || password == null || password.trim() === '') {
    res.send({
      success: false,
      message: '用户名或密码不能为空!',
    })
  } else {
    user.findOne(req.body, function (err, doc) {
      if (!err) {
        if (doc) {
          const Token = createToken({username: username, userId: doc.id})
          res.send({
            success: true,
            message: '登录成功!',
            username,
            userId: doc.id,
            Token
          })
        } else {
          res.send({
            success: false,
            message: '该用户不存在!',
          })
        }
      } else {
        res.send({
          success: false,
          message: '数据库错误!',
        })
      }
    })
  }
})

const {addBlackList} = require('../commonFunc/blackList');
router.get('/logout', (req, res) => {
  addBlackList(req.headers.authorization); // 将token加入黑名单中
  res.send({
    success: true,
    message: '成功退出',
  })
})

module.exports = router;