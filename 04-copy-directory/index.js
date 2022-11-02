const fs = require('fs');
const path  = require('path');

const { mkdir, copyFile, readdir, unlink } = require ('node:fs/promises');

async function copyDir () {
    try {
      const newFolder = path.join(path.dirname(__filename), 'files-copy');
      await mkdir(newFolder);
    } catch (err) {
      // console.error(err.message);
      const files = await readdir(
        path.join(path.dirname(__filename), 'files-copy'),
        { withFileTypes: true });
      for (const file of files) {
        const filePath = path.join(path.dirname(__filename), 'files-copy', file.name);
        await unlink(filePath, { recursive: true, force: true });
      }
    }
  
 try {
    const files = await readdir(
      path.join(path.dirname(__filename), 'files'),
      { withFileTypes: true });
    for (const file of files)
    try {
      const sourseFile = path.join(path.dirname(__filename), 'files', file.name);
      const destFile = path.join(path.dirname(__filename), 'files-copy', file.name);
      await copyFile(sourseFile, destFile);
    } catch {
      console.log('The file could not be copied');
    }
  } catch (err) {
    console.error(err);
  } 
}

copyDir();