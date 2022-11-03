const fs = require('fs');
const path  = require('path');

const { mkdir, copyFile, readdir, unlink, rm } = require ('node:fs/promises');

async function copyDir () {
  const sourseDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  async function createDir(newFolder) {
    try {
      await mkdir(newFolder);
    } catch (err) {
      await rm(newFolder, { recursive: true, force: true });
      await createDir(newFolder)
    }
  }
  await createDir(destDir)
  
  copyFolder(sourseDir, destDir)
  
  async function copyFolder(orig, res) {
    try {
      const files = await readdir(orig, { withFileTypes: true });
      for (const file of files) {
        const sourseFile = path.join(orig, file.name);
        const destFile = path.join(res, file.name);
        if (file.isFile()) {
          await copyFile(sourseFile, destFile);
        } else {
          createDir(path.join(res, file.name));
          copyFolder(path.join(orig, file.name), path.join(res, file.name))
        }
      }
    } catch (err) {
      console.error('error on reading folder');
    }
  } 
}

copyDir();