global.Species = (function() {
  const SpeciesDictionary = {};

  function register(code, data) {
    SpeciesDictionary[code] = build(code, data);
  }

  function build(code, data) {
    return { code, ...data };
  }

  function lookup(code) {
    if (SpeciesDictionary[code] == null) { throw `Unknown Species (${code})` }
    return SpeciesDictionary[code];
  }

  function all() {
    return { ...SpeciesDictionary };
  }

  return {
    register,
    lookup,
    all,
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
