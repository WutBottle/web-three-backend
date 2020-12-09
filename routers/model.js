const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const modelData = require('../MongoDB/collection/modelData');
// 获取post请求的参数
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/getModelList', (req, res) => {
  switch (req.query.type) {
    case 'my':
      modelData.find({ownerId: req.user.userId}, (err, docs) => {
        if (!err) {
          if (docs.length) {
            res.send({
              success: true,
              message: '获取成功',
              data: docs,
            })
          }
        } else {
          res.send({
            success: false,
            message: '服务器错误',
          })
        }
      })
      break;
  }
})

const multipart  = require('connect-multiparty');
const multipartMiddleware = multipart(undefined);
const {moveUploadedFile} = require('../commonFunc/fileOperation')
router.post('/upload', multipartMiddleware, (req, res) => {
  const {path: tempPath, originalFilename: fileName} = req.files.file;
  moveUploadedFile(tempPath, './public/temp/' + req.user.userId + fileName);
  res.send({
    success: true,
    message: '上传成功',
    name: req.user.userId + fileName,
  });
})

router.post('addModel', (req, res) => {

})
module.exports = router;