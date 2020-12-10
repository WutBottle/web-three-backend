const fs = require('fs');
const moveUploadedFile = (oldPath, newPath) => {
  fs.rename(oldPath, newPath, (err) => {
    if (err) throw err;
    fs.stat(newPath, (err, stats) => {
      if (err) throw err;
      console.log('stats: ' + JSON.stringify(stats));
    });
  })
}

const uploadFileIntoDB = (filePath, fileName, cb) => {
  const mongoose = require('mongoose');
  const {database} = require('../config/index');
  const fs = require('fs');
  mongoose.createConnection(database, { useNewUrlParser: true, useUnifiedTopology: true }).then(r => {
    const gridFSBucket = new mongoose.mongo.GridFSBucket(r.db);
    const writeStream = gridFSBucket.openUploadStream(fileName);
    fs.createReadStream(filePath).pipe(writeStream).on('error', function(error) {
      console.log(error);
      cb(false);
    }).on('finish', function() {
      console.log('done!');
      cb(true);
    });
  })
}

const downloadFileFromDB = (fileName) => {
  const mongoose = require('mongoose');
  const {database} = require('../config/index');
  const fs = require('fs');
  mongoose.createConnection(database, { useNewUrlParser: true, useUnifiedTopology: true }).then(r => {
    const bucket = new mongoose.mongo.GridFSBucket(r.db, {
      chunkSizeBytes: 1024,
    });
    const writeStream = fs.createWriteStream('./test.png');
    bucket.openDownloadStreamByName(fileName).pipe(writeStream).on('error', function(error) {
      console.log(error);
    }).
    on('finish', function() {
      console.log('done!');
    });
  })
}

module.exports = {
  moveUploadedFile,
  uploadFileIntoDB,
  downloadFileFromDB,
}