global.Weapon = (function() {
  const WeaponDictionary = {};

  function register(code, data) {
    WeaponDictionary[code] = build(code, data);
  }

  function update(code, key, value) {
    WeaponDictionary[code][key] = value;
  }

  function build(code, data) {
    return { code, ...data };
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
