
// [Fear Aura]
// [Sacrificial Rites]
// [Corruption Aura]
// [Greater Devotion Aura]
// [Devotion Aura]
// [Hideous Corruption Aura]

global.Archetype = (function() {
  const ArchetypeDictionary = {};

  function register(code, options) {
    ArchetypeDictionary[code] = build(code, options);
  }

  function build(code, options) {
    return {
      code:             code,
      name:             options.name,
      availableSexes:   options.availableSexes,
      availableSpecies: options.availableSpecies,
      attributeBonus:   options.attributeBonus,
    };
  }

  function lookup(code) {
    let archetype = ArchetypeDictionary[code];
    if (archetype == null) { throw `Unknown Archetype (${code})` }
    return archetype;
  }

  function all() {
    return ArchetypeDictionary;
  }

  return {
    register,
    lookup,
    all,
  };

})();
