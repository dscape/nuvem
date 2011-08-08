module.exports = exports = require('./lib/nuvem');
exports.version = JSON.parse(require('fs').readFileSync(__dirname + "/package.json"))
  .version;
exports.path     = __dirname;