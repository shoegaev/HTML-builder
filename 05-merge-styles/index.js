const path = require('path');
const fs = require('fs');
const bundlePath = path.resolve(
  '05-merge-styles',
  'project-dist',
  'bundle.css',
);

fs.rm(bundlePath, { force: true, recursive: true }, (err) => {
  if (err) {
    throw err;
  }
  fs.readdir(
    path.resolve('05-merge-styles', 'styles'),
    { withFileTypes: true },
    (err, files) => {
      if (err) {
        throw err;
      }
      for (let file of files) {
        if (path.extname(file.path + path.sep + file.name) !== '.css') {
          continue;
        }
        fs.readFile(file.path + path.sep + file.name, (err, data) => {
          if (err) {
            throw err;
          }
          fs.writeFile(bundlePath, data, { flag: 'a' }, (err) => {
            if (err) {
              throw err;
            }
          });
        });
      }
    },
  );
});
