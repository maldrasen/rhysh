global.Weapon = (function() {
  const WeaponDictionary = {};

  function register(code, data) {
    WeaponDictionary[code] = { code, ...data };
  }

  function update(code, key, value) {
    WeaponDictionary[code][key] = value;
  }

  function lookup(code) {
    if (WeaponDictionary[code] == null) { throw `Unknown Weapon (${code})` }
    return WeaponDictionary[code];
  }

  function all() {
    return { ...WeaponDictionary };
  }

  return {
    register,
    update,
    lookup,
    all,
  };

})();
