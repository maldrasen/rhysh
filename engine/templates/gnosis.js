global.Gnosis = (function() {
  const GnosisDictionary = {};

  function register(code, data) {
    GnosisDictionary[code] = build(code, data);
  }

  function build(code, data) {
    return { code, ...data };
  }

  function lookup(code) {
    if (GnosisDictionary[code] == null) { throw `Unknown Gnosis (${code})` }
    return GnosisDictionary[code];
  }

  function all() {
    return { ...GnosisDictionary };
  }

  return {
    register,
    lookup,
    all,
  };

})();
