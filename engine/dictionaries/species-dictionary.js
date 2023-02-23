global.SpeciesDictionary = (function() {
  const dictionary = {};

  function register(code, data) {
    dictionary[code] = { code, ...data };
  }

  function lookup(code) {
    if (dictionary[code] == null) { throw `Unknown Species (${code})` }
    return dictionary[code];
  }

  return {
    register,
    lookup,
  };

})();

//
//   What Do?
//
// [Bloodrage]
// [Fortitude]
// [Fire Breath]
// [Regeneration]
// [Curse of the Moon]
// [Lust Aura]
