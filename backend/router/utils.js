const fs = require('fs');
const path = require('path');
const { fileExtensions } = require('../config');

function wrapper(fn) {
  return async function (ctx) {
    try {
      const data = await fn(ctx);
      ctx.body = { success: true, data };
    } catch (e) {
      console.log(e);
      ctx.body = { success: false, message: e };
    }
  }
}

function getFilename(dir) {
  if (fs.existsSync(dir)) {
    if (fs.statSync(dir).isFile()) {
      return dir;
    } else {
      dir = path.join(dir, 'index');
    }
  }
  for (const ext of fileExtensions) {
    if (fs.existsSync(dir + ext)) return (dir + ext);
  }
  return '';
}

function toNumber(s) {
  try {
    const n = parseInt(s);
    if (Number.isNaN(n)) return 0;
    return n;
  } catch {
    return 0;
  }
}

module.exports = { wrapper, getFilename, toNumber };
