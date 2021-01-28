const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// 获取post请求的参数
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart(undefined);
const {moveUploadedFile} = require('../commonFunc/fileOperation');
router.post('/upload', multipartMiddleware, (req, res) => {
  const {path: tempPath, originalFilename} = req.files.file;
  const suffix = /\.[^\.]+$/.exec(originalFilename);
  const fileName = '考勤表' + suffix;
  moveUploadedFile(tempPath, './public/' + fileName);
  res.send({
    success: true,
    message: '上传成功',
    name: fileName,
  });
})

router.get('/download', (req, res) => {
  const xlsx = require('node-xlsx');
  const {resolve} = require('path');
  const fs = require('fs');
  let inputFileName = resolve('./public/考勤表.xls');
  let outputFileName = resolve('./public/test.xlsx');
  const sheets = xlsx.parse(inputFileName);
  let resData = {
    dateRange: '',
    workerInfo: [],
  }
  sheets.forEach(function (sheet) {
    resData.dateRange = sheet['data']['2']['24'];
    for (let i = 0; i < 4; i++) {
      sheet['data'].shift();
    }
    while (sheet['data'].length) {
      let cellFirst = sheet['data'][0][0];
      let typeStatus = (typeof cellFirst == 'string') && cellFirst.constructor === String
      if (typeStatus && sheet['data'][0][0].includes('工号')) {
        const workerParam = {
          number: sheet['data'][0][2],
          name: sheet['data'][0][10],
          apartment: sheet['data'][0][17],
          workTime: new Array(31),
        }
        resData.workerInfo.push(workerParam);
      } else if (sheet['data'][0][0] !== 1 && sheet['data'][0].length) {
        let resIndex = resData.workerInfo.length - 1
        sheet['data'][0].map((item, index) => {
          if (item === undefined) {
            resData.workerInfo[resIndex].workTime[index] = {
              start: '',
              end: '',
            };
          } else {
            let [start, end] = item.split(/[\n]/);
            if (resData.workerInfo[resIndex].workTime[index]?.end) {
              resData.workerInfo[resIndex].workTime[index].end = start;
            } else {
              resData.workerInfo[resIndex].workTime[index] = {
                start: start,
                end: end,
              };
            }
          }
        })
      }
      sheet['data'].shift();
    }
    let dateArray = new Array(31).fill(0);
    const makeWorkerInfo = (info) => {
      let res = [];
      for (let i = 0; i < info.length; i++) {
        res.push([info[i].number, info[i].name, info[i].apartment, ...info[i].workTime.map(item => {
          return item?.start
        })]);
        res.push(['', '', '', ...info[i].workTime.map(item => {
          return item?.end
        })]);
      }
      return res;
    }
    let xlsxObj = [
      {
        name: 'firstSheet',
        data: [
          [resData.dateRange, '', '', '工作时间'],
          ['工号', '姓名', '部门'].concat(dateArray.map((item, index) => {
            return (index + 1) + '号';
          })),
          ...makeWorkerInfo(resData.workerInfo),
        ],
      },
    ]
    if (fs.existsSync(outputFileName)) {
      fs.unlinkSync(outputFileName);
    }
    fs.writeFileSync(outputFileName, xlsx.build(xlsxObj), "binary");
  });

  let name = 'test.xlsx';
  let fullPath = resolve('./public/' + name);
  let size = fs.statSync(fullPath).size;
  let f = fs.createReadStream(fullPath);
  res.writeHead(200, {
    'Content-Type': 'application/force-download',
    'Content-Disposition': 'attachment; filename=' + name,
    'Content-Length': size
  });
  f.pipe(res);
});

module.exports = router;