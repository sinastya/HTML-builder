const fs = require('fs');
const path  =require('path');
const { stdin, stdout } = require('process');

// const rs = fs.createReadStream('source.txt');
const ws = fs.createWriteStream(
  path.join(path.dirname(__filename), 'text.txt'),
  'utf-8');

stdout.write('Hi! Enter something:\n');
stdin.on('data', chunk => {
  if (chunk.toString().trim() == 'exit') {
    process.exit();
  }
  ws.write(chunk);
});

process.on('exit', () => stdout.write('Bye!'));
process.on('SIGINT', () => process.exit());
