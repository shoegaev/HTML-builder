const path = require('path');
const fs = require('fs');
const readableStream = fs.createReadStream(
  path.resolve('01-read-file', 'text.txt'),
  'utf-8',
);
let data = '';
readableStream.on('data', (chunk) => (data += chunk));
readableStream.on('end', () => console.log(data));

// fs.readFile(
//   path.resolve('01-read-file', 'text.txt'),
//   { encoding: 'utf-8' },
//   (err, data) => {
//     if (err) {
//       throw err;
//     } else {
//       console.log(data);
//     }
//   },
// );
