const fs = require('fs');
const path  = require('path');

const { mkdir, copyFile, readdir, rm, readFile, writeFile } = require ('node:fs/promises');


async function createBundle () {
  const distDir = path.join(__dirname, 'project-dist');

  await createDir(distDir);
  async function createDir(newFolder) {
    try {
      await mkdir(newFolder);
    } catch (err) {
      await rm(newFolder, { recursive: true, force: true });
      await createDir(newFolder)
    }
  }

  const partsHTML = path.join(__dirname, 'components');
  const origsHTML = path.join(__dirname, 'template.html');
  const bundleHTML = path.join(__dirname, 'project-dist', 'index.html');
  let bundleContent =  await readFile(origsHTML, 'utf-8')

  await appendHTML(partsHTML)
  async function appendHTML(orig) {
    try {
      const files = await readdir(orig, { withFileTypes: true });
      for (const file of files) {        
        if (file.isFile() && path.extname(file.name)=='.html') {
          const sourseFile = path.join(orig, file.name);
          const fileContent =  await readFile(sourseFile, 'utf-8')
          const name = `{{${file.name.replace(/\.[^/.]+$/, '')}}}`
          if (bundleContent.includes(name)) {
            bundleContent = bundleContent.replace(name, fileContent);
          }
        }
      }
      await writeFile(bundleHTML, bundleContent)
    } catch (err) {
      console.error(err);
    }
  } 


  const sourseCSS = path.join(__dirname, 'styles');
  const bundleCSS = path.join(__dirname, 'project-dist', 'style.css');

  const ws = fs.createWriteStream(bundleCSS, { flags: 'w'});

  await appendCSS(sourseCSS)
  async function appendCSS(orig) {
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


  const sourseAssets = path.join(__dirname, 'assets');
  const destAssets = path.join(__dirname, 'project-dist', 'assets');
  await mkdir(destAssets);

  await copyAssets(sourseAssets, destAssets)
  async function copyAssets(orig, res) {
    try {
      const files = await readdir(orig, { withFileTypes: true });
      for (const file of files) {
        const sourseFile = path.join(orig, file.name);
        const destFile = path.join(res, file.name);
        if (file.isFile()) {
          await copyFile(sourseFile, destFile);
        } else {
          createDir(path.join(res, file.name));
          copyAssets(path.join(orig, file.name), path.join(res, file.name))
        }
      }
    } catch (err) {
      console.error('error on reading folder');
    }
  } 


}

createBundle()