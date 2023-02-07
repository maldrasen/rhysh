
// [Bloodrage]
// [Fortitude]
// [Fire Breath]
// [Regeneration]
// [Curse of the Moon]
// [Lust Aura]

global.Species = (function() {
  const SpeciesDictionary = {};

  function register(code, options) {
    SpeciesDictionary[code] = build(code, options);
  }

  function build(code, options) {
    return {
      code: code,
      name: options.name,
      basePlayerAttributes: options.basePlayerAttributes,
    };
  }

  function lookup(code) {
    let species = SpeciesDictionary[code];
    if (species == null) { throw `Unknown Species (${code})` }
    return species;
  }

  function all() {
    return SpeciesDictionary;
  }

  return {
    register,
    lookup,
    all,
  };

})();
