require.paths.unshift('./lib');

var nuvem = require('nuvem');
var db    = nuvem('http://user:pass@localhost:123/bla');
db.configure('http://user:pass@localhost:123/bla');