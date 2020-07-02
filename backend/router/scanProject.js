const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const nodegit = require('nodegit');
const { fileExtensions, basePath, commonBranch, includeDirectory } = require('../config');
const { getFilename } = require('./utils');
// 配置自己gitlab的用户名密码
const user = require('../../user.json');

async function scanProject(ctx) {
  function readFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(filename => {
      const fullName = path.join(dir, filename);
      const fn = fs.statSync(fullName).isDirectory() ? readFiles : handleFile;
      fn(fullName);
    });
  }

  function handleFile(dir) {
    if (!fileExtensions.includes(path.extname(dir))) return;
    const shortPath = dir.replace(fullPath, '');
    if (!(shortPath in result)) result[shortPath] = [];
    const ast = ts.createSourceFile(dir, fs.readFileSync(dir).toString(), ts.ScriptTarget.Latest);
    ts.forEachChild(ast, function (node) {
      if (node.kind === ts.SyntaxKind.ImportDeclaration && node.moduleSpecifier.text.startsWith('.')) {
        const filename = getFilename(path.join(path.parse(dir).dir, node.moduleSpecifier.text));
        if (filename) {
          const tem = filename.replace(fullPath, '');
          if (!(tem in result)) result[tem] = [];
          if (!result[tem].includes(shortPath)) result[tem].push(shortPath);
        }
      };
    })
  }

  const { projectName, branchName } = ctx.request.body;
  const fullPath = basePath + projectName;
  const repo = await nodegit.Repository.open(fullPath);
  const remoteCommit = await repo.getReferenceCommit(commonBranch + branchName);
  try {
    await repo.checkoutBranch(branchName);
    // 比较本地commit和远程，是否需要pull
    const localCommit = await repo.getHeadCommit();
    if (remoteCommit.sha() !== localCommit.sha()) {
      await repo.fetchAll({
        callbacks: {
          credentials: function () {
            return nodegit.Cred.userpassPlaintextNew(user.username, user.password);
          },
          certificateCheck: function () {
            return 0;
          }
        }
      });
      await repo.mergeBranches(branchName, `origin/${branchName}`);
    }
  } catch (e) {
    console.log('error', e)
    // 没有分支则新建
    await repo.createBranch(branchName, remoteCommit, false);
    await repo.checkoutBranch(branchName);
  }
  const result = {};
  includeDirectory.forEach(x => readFiles(path.join(fullPath, x)));
  return result;
}

module.exports = { scanProject };
