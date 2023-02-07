global.Arcanum = (function() {
  const ArcanumDictionary = {};

  function register(code, options) {
    ArcanumDictionary[code] = build(code, options);
  }

  function build(code, options) {
    return {
      code: code,
      name: options.name,
    };
  }

  function lookup(code) {
    let arcanum = ArcanumDictionary[code];
    if (arcanum == null) { throw `Unknown Arcanum (${code})` }
    return arcanum;
  }

  function all() {
    return ArcanumDictionary;
  }

  return {
    register,
    lookup,
    all,
  };

})();
