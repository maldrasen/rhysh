global.Arcanum = (function() {
  const ArcanumDictionary = {};

  function register(code, data) {
    ArcanumDictionary[code] = { code, ...data };
  }

  function lookup(code) {
    if (ArcanumDictionary[code] == null) { throw `Unknown Arcanum (${code})` }
    return ArcanumDictionary[code];
  }

  function all() {
    return { ...ArcanumDictionary };
  }

  return {
    register,
    lookup,
    all,
  };

})();
