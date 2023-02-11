global.EventTemplate = (function() {

  let library = {}

  function build(code, data) {
    library[code] = { code:code, data:data };
  }

  function lookup(code) {
    if (library[code] == null) { throw `Unknown Event [${code}]`; }
    return library[code];
  }

  return {
    build,
    lookup,
  }

})();