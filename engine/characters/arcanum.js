
// [Arcanum of Blasphemy]
// [Arcanum of Delight]
// [Arcanum of Domination]
// [Arcanum of Flame]
// [Arcanum of Force]
// [Arcanum of Suffering]
// [Arcanum of the Deep Wood]
// [Arcanum of the Moon]
// [Arcanum of the Rushing Waters]

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

  return {
    register,
    lookup,
  };

})();
