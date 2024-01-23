const path = require('path');
const fs = require('fs');
const projectDist = path.resolve('06-build-page', 'project-dist');
const stylePath = path.resolve(projectDist, 'style.css');
const assetsPath = path.resolve(projectDist, 'assets');
const indexPath = path.resolve(projectDist, 'index.html');

function compileStyles() {
  fs.rm(stylePath, { force: true, recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    fs.readdir(
      path.resolve('06-build-page', 'styles'),
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
            fs.writeFile(stylePath, data, { flag: 'a' }, (err) => {
              if (err) {
                throw err;
              }
            });
          });
        }
      },
    );
  });
}

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

  fs.rm(copyDirPath, { force: true, recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    recursiveCopy(originalDirPath, copyDirPath);
  });
}

fs.rm(
  projectDist,
  {
    force: true,
    recursive: true,
  },
  (err) => {
    if (err) {
      throw err;
    }
    fs.mkdir(projectDist, (err) => {
      if (err) {
        throw err;
      }
      copyDir(path.resolve('06-build-page', 'assets'), assetsPath);
      compileStyles();
      createIndex();
    });
  },
);

// немного колбэк функций....
function createIndex() {
  fs.rm(indexPath, { force: true, recursive: true }, (err) => {
    if (err) {
      throw err;
    }

    // составление объекта с свойствами типа:
    //  <название компонента> : <HTML код компонента>
    fs.readdir(
      path.resolve('06-build-page', 'components'),
      { withFileTypes: true },
      (err, components) => {
        if (err) {
          throw err;
        }

        let configObject = {};
        let numberOfComponent = 0;

        function recursiveReadFile(numberOfComponent) {
          fs.readFile(
            path.resolve(
              '06-build-page',
              'components',
              components[numberOfComponent].name,
            ),
            (err, data) => {
              if (err) {
                throw err;
              }
              const propertyKey =
                components[numberOfComponent].name.split('.html')[0];
              configObject[propertyKey] = data.toString('utf8');
              if (!(numberOfComponent === components.length - 1)) {
                recursiveReadFile(numberOfComponent + 1);
              } else {
                fs.readFile(
                  path.resolve('06-build-page', 'template.html'),
                  (err, data) => {
                    if (err) {
                      throw err;
                    }
                    const templateHTML = data.toString('utf8');
                    const templateArr = templateHTML.split(/{{|}}/);
                    let resultHTML = '';
                    let i = 0;

                    while (i < templateArr.length) {
                      if (!Object.hasOwn(configObject, templateArr[i])) {
                        resultHTML += templateArr[i];
                        i += 1;
                        continue;
                      }
                      resultHTML += configObject[templateArr[i]];
                      i += 1;
                    }
                    // запись получившегося кода в файл
                    fs.writeFile(indexPath, resultHTML, (err) => {
                      if (err) {
                        throw err;
                      }
                    });
                  },
                );
              }
              return;
            },
          );
        }
        recursiveReadFile(numberOfComponent);
      },
    );
  });
}
