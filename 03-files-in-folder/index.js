const fs = require('fs');
const path  = require('path');

const { readdir } = require ('node:fs/promises');

(async () => {
    try {
    const files = await readdir(
      path.join(path.dirname(__filename), 'secret-folder'),
      { withFileTypes: true });
    for (const file of files)
    if (file.isFile()) {
      fs.stat(path.join(path.dirname(__filename), 'secret-folder', file.name), (_err, stats) => {
        const info = `${file.name.replace(/\.[^/.]+$/, "")} - ${path.extname(file.name).replace('.', '')} - ${stats.size/1000}kb`
        console.log(info);
      })
    }      
  } catch (err) {
    console.error(err);
  }
})();