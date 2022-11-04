const fs = require('fs');
const path  = require('path');

const { readdir } = require ('node:fs/promises');
// const { pipeline } = require('node:stream/promises');

async function bundleStyles () {
  const sourseDir = path.join(__dirname, 'styles');
  const bundleCSS = path.join(__dirname, 'project-dist', 'bundle.css');

  const ws = fs.createWriteStream(bundleCSS, { flags: 'w'});

  appendFiles(sourseDir)

  async function appendFiles(orig) {
    try {
      const files = await readdir(orig, { withFileTypes: true });
      for (const file of files) {        
        if (file.isFile() && path.extname(file.name)=='.css') {
          const sourseFile = path.join(orig, file.name);
          const rs = fs.createReadStream(sourseFile);
          rs.pipe(ws)
        }
      }
    } catch (err) {
      console.error(err);
    }
  } 
}

bundleStyles();