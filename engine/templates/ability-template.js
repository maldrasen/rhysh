global.AbilityTemplate = (function() {
  const AbilityDictionary = {};

  function register(code, data) {
    AbilityDictionary[code] = build(code, data);
  }

  function build(code, data) {
    return { code, ...data };
  }

  function lookup(code) {
    if (AbilityDictionary[code] == null) { throw `Unknown Ability (${code})` }
    return AbilityDictionary[code];
  }

  return {
    register,
    lookup,
  }

})();