const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const modelData = require('../MongoDB/collection/modelData');
const userData = require('../MongoDB/collection/user');
// 获取post请求的参数
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/getModelList', (req, res) => {
  switch (req.query.type) {
    case 'my':
      userData.findOne({
        _id: req.user.userId
      }).sort({date: -1}).exec((err, docs) => {
        if (!err) {
          res.send({
            success: true,
            message: '获取成功',
            data: docs.usableModel,
          })
        } else {
          res.send({
            success: false,
            message: '服务器错误',
          })
        }
      })
      break;
    case 'all':
      modelData.find({}).sort({date: -1}).exec((err, docs) => {
        if (!err) {
          res.send({
            success: true,
            message: '获取成功',
            data: docs,
          })
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
const {moveUploadedFile} = require('../commonFunc/fileOperation');
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
  userData.findOne({_id: req.user.userId}).exec((err, doc) => {
    if (!err) {
      const oneModel = new modelData({
        ...req.body,
        ownerId: req.user.userId,
        ownerName: doc.username,
        ownerNick: doc.nickname,
      })
      // 存入模型数据
      oneModel.save((err1, doc1) => {
        if (err1) {
          res.send({
            success: false,
            message: '存入模型失败'
          })
        } else {
          userData.updateOne({_id: req.user.userId}, {
            '$push': {
              usableModel: {...doc1}
            }
          }, (errPush, docPush) => {
            if (errPush) {
              res.send({
                success: false,
                message: '更新用户可使用模型失败'
              })
            } else {
              res.send({
                success: true,
                message: '新增成功'
              })
              console.log(docPush);
            }
          })

        }
      });
    }
  })
})

const {deleteFile} = require('../commonFunc/fileOperation');
router.post('/deleteModel', (req, res) => {
  modelData.findByIdAndDelete(req.body.id).then(doc => {
    if (doc) {
      Promise.all([deleteFile('./public/' + doc.modelFileName), deleteFile('./public/' + doc.modelImgName)]).then(function (values) {
        const status = values.findIndex(item => item !== null) === -1; // 判断是否所有文件都删除干净
        res.send({
          success: status,
          message: status ? '删除成功' : '服务器模型文件删除失败',
        })
      });
    } else {
      res.send({
        success: false,
        message: '删除失败',
      })
    }
  });
})

router.post('/updateModel', (req, res) => {
  modelData.updateMany({_id: req.body.id}, req.body, (err, row) => {
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

module.exports = router;