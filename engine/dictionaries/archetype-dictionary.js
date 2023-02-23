global.ArchetypeDictionary = (function() {
  const dictionary = {};

  function register(code, data) {
    dictionary[code] = { code, ...data };
  }

  function lookup(code) {
    if (dictionary[code] == null) { throw `Unknown Archetype (${code})` }
    return dictionary[code];
  }

  return {
    register,
    lookup,
  };

})();

//   What Do?
//
// [Fear Aura]
// [Sacrificial Rites]
// [Corruption Aura]
// [Greater Devotion Aura]
// [Devotion Aura]
// [Hideous Corruption Aura]