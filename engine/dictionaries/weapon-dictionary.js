global.WeaponDictionary = (function() {
  const dictionary = {};

  function register(code, data) {
    dictionary[code] = { code, ...data };
  }

  function update(code, key, value) {
    dictionary[code][key] = value;
  }

  function lookup(code) {
    if (dictionary[code] == null) { console.trace(); throw `Unknown Weapon (${code})` }
    return dictionary[code];
  }

  // Weapon search function. Options:
  //   hands:['1','2','M','1/M']
  //
  // The "1/M" options return one handed or main handed weapons, they're
  // normally mutually exclusive when searching, but can both be used in the
  // main hand.
  //
  // Currently there's no exclusive 'off hand' weapons. I don't think it makes
  // sense for there to be weapons you can't use main handed if needed, but
  // some accessories (notibly shields) are off hand only, but then they can't
  // be used as weapons.

  function findAll(options) {
    return ObjectHelper.select(dictionary, (code, weapon) => {
      let valid = true;

      if (options.hands) {
        if (options.hands == '1/M' && ['1','M'].indexOf(weapon.hands) < 0) { valid = false; }
        if (options.hands.length == 1 && options.hands != weapon.hands) { valid = false; }
      }

      return valid;
    });
  }

  return {
    register,
    update,
    lookup,
    findAll,
  };

})();
