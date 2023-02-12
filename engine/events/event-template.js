global.EventTemplate = (function() {

  let library = {}

  // For now, I think we just store the event as whatever raw data is passed
  // into this. We might need to massage the data later, but there doesn't seem
  // to be any need now to do that.
  function build(code, data) { library[code] = data; }

  function lookup(code) {
    if (library[code] == null) { throw `Unknown Event [${code}]`; }
    return library[code];
  }

  return {
    build,
    lookup,
  }

})();