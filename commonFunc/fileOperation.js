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



module.exports = {
  moveUploadedFile,
}