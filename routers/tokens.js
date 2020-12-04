const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const user = require('../MongoDB/collection/user');

// 获取post请求的参数
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.post('/login', (req, res) => {
  user.find(req.body,function (err, docs){
    if(!err) {
      if(docs.length) {
        res.send({
          success: true,
          message: '登录成功!',
        })
      }else {
        res.send({
          success: false,
          message: '登录失败!',
        })
      }
    }
  })

})
module.exports = router;