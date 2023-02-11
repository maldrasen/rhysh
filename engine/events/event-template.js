global.EventTemplate = (function() {

  let library = {}

  function build(code, data) {
    let template = { code:code };
    library[code] = template;
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