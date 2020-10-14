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

/**
 * Resolve the path to the template. If the path is a directory(e.g. /dashboard) we will add index.hbs to the end so
 * we can have cleaner URLS(http://localhost:3000/dashboard vs http://localhost:3000/dashboard.hbs)
 */
async function resolvePath(routePrefix, filePath) {
  // account for us being in /lib
  const templateDir = `../${TEMPLATE_DIR}`;
  filePath = filePath.replace(routePrefix, '');
  const fullDirectoryPath = path.join(__dirname, templateDir, filePath);

  if (await isDirectory(fullDirectoryPath)) {
    return filePath + '/index';
  }

  if (await fileExists(fullDirectoryPath)) {
    return filePath;
  }
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
