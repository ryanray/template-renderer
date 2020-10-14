const fs = require('fs');
const path = require('path');
const util = require('util');
const stat = util.promisify(fs.stat);
// FIXME: duplicated in app.js
const TEMPLATE_DIR = 'templates/';
const UNABLE_TO_FIND_TEMPLATE = 'UNABLE_TO_FIND_TEMPLATE';

module.exports = {
  UNABLE_TO_FIND_TEMPLATE,
  resolvePath
};

async function resolvePath(routePrefix, filePath) {
  // account for us being in /lib
  const templateDir = `../${TEMPLATE_DIR}`;
  filePath = filePath.replace(routePrefix, '');
  const fullDirectoryPath = path.join(__dirname, templateDir, filePath);
  let file = filePath.substr(fullDirectoryPath.lastIndexOf('/'));

  console.log('fullDirectoryPath', fullDirectoryPath);

  if (await isDirectory(fullDirectoryPath)) {
    return filePath + '/index';
  }

  if (await fileExists(fullDirectoryPath)) {
    return filePath;
  }
  // try {
  //   const result = await stat(fullDirectoryPath);
  //   if(result.isDirectory()) {
  //     // are we dealing with a directory? then tack on index.hbs
  //     return filePath + '/index';
  //   }
  // } catch(e) {
  //   const withExtension = fullDirectoryPath + '.hbs';
  //   const result = await stat(withExtension);
  //   return filePath;
  // }

  // fullFilePath = /user/ryan/blah/blah/template/about
  // else does the hbs exist?

  // else ??
  // FIXME
  throw new Error(UNABLE_TO_FIND_TEMPLATE);
}

async function isDirectory(fullDirectoryPath) {
  try {
    const result = await stat(fullDirectoryPath);
    if(result.isDirectory()) {
      return true;
    }
  } catch(e) {
    console.debug(`${fullDirectoryPath} doesn't appear to be a directory`);
  }
  return false;
}

async function fileExists(fullDirectoryPath) {
  try {
    const withExtension = fullDirectoryPath + '.hbs';
    await stat(withExtension);
    return true;
  } catch(e) {
    console.debug(`${fullDirectoryPath} doesn't appear to exist`);
  }
  return false;
}
