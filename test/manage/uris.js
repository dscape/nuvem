var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , uri    = require('../../lib/nuvem/uris')(cfg);

function credentials() {
  if (cfg.user && cfg.pass) {
    return cfg.user + ":" + cfg.pass + "@";
  }
  return "";
}

function infoUri() {
  return ("http://" + credentials() + cfg.host + ':' + cfg.port + "/" + cfg.manage.info);
}

vows.describe('ManageUris').addBatch(
  { "info": function () { assert.equal(uri.manage.info(), infoUri()); } }
).exportTo(module);