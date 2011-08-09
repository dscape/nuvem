module.exports = 
  { host: "127.0.0.1"
  , port: "4380"
  , user: "admin"
  , pass: "admin"
  , ssl:  false
  , json:
    { store: "json/store"
    , kv:    "json/kvquery"
    , qs:    "json/query"
    }
  , xml:
    { store: "xml/store"
    , kv:    "xml/kvquery"
    , qs:    "xml/query"
    }
  };