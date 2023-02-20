global.AbilityTemplate = (function() {

  let library = {}

  function build(code, data) { library[code] = data; }

  function lookup(code) {
    if (library[code] == null) { throw `Unknown Ability [${code}]`; }
    return library[code];
  }

  return {
    build,
    lookup,
  }

})();