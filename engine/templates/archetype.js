global.Archetype = (function() {
  const ArchetypeDictionary = {};

  function register(code, data) {
    ArchetypeDictionary[code] = { code, ...data };
  }

  function lookup(code) {
    if (ArchetypeDictionary[code] == null) { throw `Unknown Archetype (${code})` }
    return ArchetypeDictionary[code];
  }

  function all() {
    return { ...ArchetypeDictionary };
  }

  return {
    register,
    lookup,
    all,
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