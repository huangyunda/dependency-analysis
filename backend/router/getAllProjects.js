const nodegit = require('nodegit');
const { projects, basePath, commonBranch } = require('../config');
const { toNumber } = require('./utils');

// 获取项目和分支
async function getAllProjects() {
  const result = {};
  await Promise.all(projects.map(x => {
    return (async function () {
      const repo = await nodegit.Repository.open(basePath + x);
      const branches = await repo.getReferenceNames(3);
      result[x] = [...new Set(branches)].filter(x => x.startsWith(`${commonBranch}rel`))
        .map(x => x.replace(commonBranch, '')).sort((a, b) => {
          try {
            const arr = [a, b].map(x => x.split('rel/')[1].split('.'));
            for (let i = 0; i < arr[0].length; i++) {
              const s1 = toNumber(arr[0][i]);
              const s2 = toNumber(arr[1][i]);
              if (s1 === s2) continue;
              return s2 - s1;
            }
          } catch {
            return -1;
          }
        });
    })();
  }));
  return result;
}

module.exports = { getAllProjects };
