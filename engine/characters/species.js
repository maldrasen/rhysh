
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
    return { code:code };
  }

  function lookup(code) {
    return SpeciesDictionary[code];
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
