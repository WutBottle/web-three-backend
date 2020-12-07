const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const modelData = require('../MongoDB/collection/modelData');
// 获取post请求的参数
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/getModelList', (req, res) => {
  let modelList;
  switch (req.query.type) {
    case 'my':
      modelData.find({ownerId: req.user.userId}, (err, docs) => {
        if(!err) {
          if(docs.length) {
            res.send({
              success: true,
              message: '获取成功',
              data: docs,
            })
          }
        }else {
          res.send({
            success: false,
            message: '服务器错误',
          })
        }
      })
      break;
  }
})
module.exports = router;

