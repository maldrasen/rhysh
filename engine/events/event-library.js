global.EventLibrary = (function() {

  let library = {}

  function add(code, data) {
    library[code] = new Event(code, data);
  }

  function lookup(code) {
    if (library[code] == null) { throw `Unknown Event [${code}]`; }
    return library[code];
  }

  return {
    lookup,
  }

})();


