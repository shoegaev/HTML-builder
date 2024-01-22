const path = require('path');
const fs = require('fs');

fs.readdir(
  path.resolve('03-files-in-folder', 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) {
      throw err;
    }
    let result = '';
    for (let obj of files) {
      if (obj.isDirectory()) {
        continue;
      }

      const fullName = obj.name;
      const extension = path.extname(fullName).slice(1);
      const name = fullName.split('.' + extension)[0];

      fs.stat(
        path.resolve('03-files-in-folder', 'secret-folder', fullName),
        (err, stats) => {
          if (err) {
            throw err;
          }

          const size = stats.size;
          result = `${name}-${extension}-${size}b`;
          console.log(result);
        },
      );
    }
  },
);
