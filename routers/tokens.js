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
    user.findOne({username: req.body.username}, function (err, doc) {
      if (!err) {
        if (doc) {
          if (doc.password === req.body.password) {
            const Token = createToken({username: username, userId: doc.id})
            res.send({
              success: true,
              message: '登录成功!',
              username,
              nickname: doc.nickname,
              userId: doc.id,
              role: doc.role,
              Token
            })
          } else {
            res.send({
              success: false,
              message: '密码错误!',
            })
          }
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

router.post('/register', (req, res) => {
  const oneModel = new user({
    ...req.body,
  })
  oneModel.save(err => {
    if (err) {
      res.send({
        success: false,
        message: '注册失败'
      })
    } else {
      res.send({
        success: true,
        message: '注册成功',
      })
    }
  })
})

// 获取用户信息接口
router.get('/userInfo', (req, res) => {
  user.findOne({_id: req.user.userId}, (err, doc) => {
    if (!err) {
      res.send({
        success: true,
        message: '获取成功!',
        data: doc,
      })
    }
  })
})

// 更新用户信息
router.post('/updateUserInfo', (req, res) => {
  user.updateMany({_id: req.user.userId}, req.body, (err, row) => {
    if (err) {
      res.send({
        success: false,
        message: '修改失败'
      })
    } else {
      res.send({
        success: true,
        message: '修改成功'
      })
    }
  })
})

// 获取用户列表
router.post('/userList', (req, res) => {
  user.find({
    $or: [{username: new RegExp(req.body.name, 'i')}, {nickname: new RegExp(req.body.name, 'i')}],
    role: 'user',
  }, (err, docs) => {
    if (err) {
      res.send({
        success: false,
        message: '查询失败',
      })
    } else {
      res.send({
        success: true,
        message: '查询成功',
        data: docs,
      })
    }
  })
})

// 删除用户
router.post('/deleteUser', (req,res) => {
  user.findByIdAndDelete(req.body.id).then(doc => {
    if (doc) {
      res.send({
        success: true,
        message: '删除成功',
      })
    } else {
      res.send({
        success: false,
        message: '删除失败',
      })
    }
  });
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