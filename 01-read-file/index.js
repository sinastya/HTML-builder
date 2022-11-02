const path = require('path');
const fs = require('fs');

const rs = fs.createReadStream(
  path.join(path.dirname(__filename), 'text.txt'),
  'utf-8');
let info='';
rs.on('data', chunk => info += chunk);
rs.on('end', () => console.log('End', info.trim()));
