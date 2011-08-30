// defaults
module.exports =
  { host: "127.0.0.1"         // host where corona is running
  , port: "4380"              // port where corona is running
  , user: "admin"             // username to connect
  , pass: "admin"             // password to connect
  , ssl:  false               // https or not?
  , json:
    { store: "json/store"     // where is the json store
    , kv:    "json/kvquery"   // where is the json kvquery store
    , qs:    "json/query"     // where is the json query store
    }
  , xml:
    { store: "xml/store"      // where is the xml store
    , kv:    "xml/kvquery"    // where is the xml kvquery store
    , qs:    "xml/query"      // where is the xml query store
    }
  , manage:
    { info: "data/info" }     // info about the service
  };