
// [Gnosis of Carnage]
// [Gnosis of Strife]
// [Gnosis of the Claw]
// [Gnosis of the Horn]
// [Gnosis of the Spider]
// [Gnosis of the Umbral Knight]

global.Gnosis = (function() {
  const GnosisDictionary = {};

  function register(code, options) {
    GnosisDictionary[code] = build(code, options);
  }

  function build(code, options) {
    return { code:code };
  }

  function lookup(code) {
    let gnosis = GnosisDictionary[code];
    if (gnosis == null) { throw `Unknown Gnosis (${code})` }
    return gnosis;
  }

  function all() {
    return GnosisDictionary;
  }

  return {
    register,
    lookup,
    all,
  };

})();
