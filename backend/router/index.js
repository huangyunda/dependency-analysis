const { getAllProjects } = require('./getAllProjects');
const { scanProject } = require('./scanProject');

const routes = [
  { method: 'get', path: '/getAllProjects', fn: getAllProjects },
  { method: 'post', path: '/scanProject', fn: scanProject },
];

module.exports = routes;
