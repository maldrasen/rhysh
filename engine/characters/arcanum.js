global.Arcanum = (function() {
  const ArcanumDictionary = {};

  function register(code, options) {
    ArcanumDictionary[code] = build(code, options);
  }

  function build(code, options) {
    return { code:code };
  }

  function lookup(code) {
    return ArcanumDictionary[code];
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
