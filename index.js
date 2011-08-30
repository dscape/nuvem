module.exports = exports = nuvem = require('./lib/nuvem');
nuvem.version = JSON.parse(require('fs').readFileSync(__dirname + "/package.json"))
  .version;
nuvem.path     = __dirname;