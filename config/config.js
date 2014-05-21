var path = require('path');
var rootPath = path.resolve(__dirname + '../..');

module.exports = {
  development: {
    root: rootPath,
    port: 3000
  },
  production: {
    root: rootPath,
    port: 3000
  }
};