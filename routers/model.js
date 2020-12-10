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

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart(undefined);
const {uploadFileIntoDB, downloadFileFromDB, moveUploadedFile} = require('../commonFunc/fileOperation');
const md5 = require('md5-node');
router.post('/upload', multipartMiddleware, (req, res) => {
  const {path: tempPath, originalFilename} = req.files.file;
  const suffix = /\.[^\.]+$/.exec(originalFilename);
  const fileName = md5(req.user.userId + new Date().getTime()) + suffix;
  moveUploadedFile(tempPath, './public/' + fileName);
  res.send({
    success: true,
    message: '上传成功',
    name: fileName,
  });
})

router.post('/addModel', (req, res) => {
  const oneModel = new modelData({
    ...req.body,
    ownerId: req.user.userId,
  })
  oneModel.save((err) => {
    if (err) {
      res.send({
        success: false,
        message: '新增失败'
      })
    } else {
      res.send({
        success: true,
        message: '新增成功'
      })
    }
  });
})

module.exports = router;