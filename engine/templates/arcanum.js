global.Arcanum = (function() {
  const ArcanumDictionary = {};

  function register(code, data) {
    ArcanumDictionary[code] = build(code, data);
  }

  function build(code, data) {
    return { code, ...data };
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
