global.ArcanumDictionary = (function() {
  const dictionary = {};

  function register(code, data) {
    dictionary[code] = { code, ...data };
  }

  function lookup(code) {
    if (dictionary[code] == null) { throw `Unknown Arcanum (${code})` }
    return dictionary[code];
  }

  return {
    register,
    lookup,
  };

})();
