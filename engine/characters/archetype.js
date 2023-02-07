
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
    return { code:code };
  }

  function lookup(code) {

  }

  return {
    register,
    lookup,
  };

})();
