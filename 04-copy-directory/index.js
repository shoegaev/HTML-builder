const path = require('path');
const fs = require('fs');
const originalDirectory = path.resolve('04-copy-directory', 'files');
const copyDirectory = path.resolve('04-copy-directory', 'files-copy');

function copyDir(originalDirPath, copyDirPath) {
  function recursiveCopy(originalDirPath, copyDirPath) {
    fs.mkdir(copyDirPath, (err) => {
      if (err) {
        throw err;
      }
      fs.readdir(originalDirPath, { withFileTypes: true }, (err, files) => {
        if (err) {
          throw err;
        }
        for (let file of files) {
          if (file.isDirectory()) {
            recursiveCopy(
              originalDirPath + path.sep + file.name,
              copyDirPath + path.sep + file.name,
            );
            continue;
          }
          fs.copyFile(
            originalDirPath + path.sep + file.name,
            copyDirPath + path.sep + file.name,
            (err) => {
              if (err) {
                throw err;
              }
            },
          );
        }
      });
    });

    return;
  }

  fs.rm(copyDirectory, { force: true, recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    recursiveCopy(originalDirPath, copyDirPath);
  });
}

copyDir(originalDirectory, copyDirectory);
