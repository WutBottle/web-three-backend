const mongoose = require('mongoose');
const { database } = require('../config/index');
const fs = require('fs');

const moveUploadedFile = (oldPath, newPath) => {
  const readStream = fs.createReadStream(oldPath);
  const writeStream = fs.createWriteStream(newPath);
  readStream.pipe(writeStream);
  readStream.on('end', function () {
    fs.unlinkSync(oldPath);
  });
  // fs.rename(oldPath, newPath, (err) => {
  //   if (err) throw err;
  //   fs.stat(newPath, (err, stats) => {
  //     if (err) throw err;
  //     console.log('stats: ' + JSON.stringify(stats));
  //   });
  // })
}

const uploadFileIntoDB = (filePath, fileName, cb) => {
  mongoose.createConnection(database, { useNewUrlParser: true, useUnifiedTopology: true }).then(r => {
    const gridFSBucket = new mongoose.mongo.GridFSBucket(r.db);
    const writeStream = gridFSBucket.openUploadStream(fileName);
    fs.createReadStream(filePath).pipe(writeStream).on('error', function (error) {
      console.log(error);
      cb(false);
    }).on('finish', function () {
      console.log('done!');
      cb(true);
    });
  })
}

const downloadFileFromDB = (fileName) => {
  mongoose.createConnection(database, { useNewUrlParser: true, useUnifiedTopology: true }).then(r => {
    const bucket = new mongoose.mongo.GridFSBucket(r.db, {
      chunkSizeBytes: 1024,
    });
    const writeStream = fs.createWriteStream('./test.png');
    bucket.openDownloadStreamByName(fileName).pipe(writeStream).on('error', function (error) {
      console.log(error);
    }).on('finish', function () {
      console.log('done!');
    });
  })
}

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, status) => {
      if (!err) {
        fs.unlink(filePath, resolve);
      } else {
        reject(err);
      }
    })
  }).catch(err => {
    return err;
  })
}

module.exports = {
  moveUploadedFile,
  uploadFileIntoDB,
  downloadFileFromDB,
  deleteFile,
}