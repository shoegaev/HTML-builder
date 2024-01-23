const path = require('path');
const fs = require('fs');
const { stdin } = process;
fs.writeFile(path.resolve('02-write-file', 'text.txt'), '', (err) => {
  if (err) {
    throw err;
  }
});

console.log('enter the data');

process.on('SIGINT', () => {
  console.log('\ngoodbye');
  process.exit();
});

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    console.log('\ngoodbye');
    process.exit();
  }

  fs.writeFile(
    path.resolve('02-write-file', 'text.txt'),
    data,
    { flag: 'a' },
    (err) => {
      if (err) {
        throw err;
      }
    },
  );
});
