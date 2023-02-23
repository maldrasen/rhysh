global.WeaponDictionary = (function() {
  const dictionary = {};

  function register(code, data) {
    dictionary[code] = { code, ...data };
  }

  function update(code, key, value) {
    dictionary[code][key] = value;
  }

  function lookup(code) {
    if (dictionary[code] == null) { throw `Unknown Weapon (${code})` }
    return dictionary[code];
  }

  return {
    register,
    update,
    lookup,
  };

})();
